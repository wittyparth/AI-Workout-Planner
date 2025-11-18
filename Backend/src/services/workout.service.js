const WorkoutSession = require('../models/workout.models');
const Exercise = require('../models/exercise.models');
const Template = require('../models/template.models');
const Progress = require('../models/progress.models');
const Activity = require('../models/activity.models');
const logger = require('../utils/logger');
const { AppError } = require('../utils/errors');

/**
 * Workout Service - Business logic for workout operations
 */
class WorkoutService {
    /**
     * Create a new workout session
     */
    async createWorkout(userId, workoutData) {
        try {
            // Validate and enrich exercise data
            const enrichedExercises = await this._enrichExercises(workoutData.exercises);

            const workout = new WorkoutSession({
                userId,
                templateId: workoutData.templateId || null,
                sessionData: {
                    name: workoutData.name,
                    date: workoutData.date || new Date(),
                    status: workoutData.status || 'planned',
                    exercises: enrichedExercises,
                    location: workoutData.location || 'gym',
                    mood: workoutData.mood || {},
                    notes: workoutData.notes
                },
                sharing: {
                    visibility: workoutData.visibility || 'private'
                }
            });

            await workout.save();

            logger.info(`Workout created: ${workout._id} for user: ${userId}`);
            return workout;

        } catch (error) {
            logger.error('Error creating workout:', error);
            throw new AppError(`Failed to create workout: ${error.message}`, 500);
        }
    }

    /**
     * Get workout by ID
     */
    async getWorkoutById(workoutId, userId) {
        const workout = await WorkoutSession.findOne({ _id: workoutId, userId })
            .populate('sessionData.exercises.exerciseId', 'name difficulty primaryMuscleGroups equipment media');

        if (!workout) {
            throw new AppError('Workout not found', 404);
        }

        return workout;
    }

    /**
     * Get user's workout history with pagination
     */
    async getWorkoutHistory(userId, options = {}) {
        const {
            page = 1,
            limit = 10,
            status,
            startDate,
            endDate,
            sortBy = 'date',
            sortOrder = 'desc'
        } = options;

        const query = { userId };

        if (status) {
            query['sessionData.status'] = status;
        }

        if (startDate || endDate) {
            query['sessionData.date'] = {};
            if (startDate) query['sessionData.date'].$gte = new Date(startDate);
            if (endDate) query['sessionData.date'].$lte = new Date(endDate);
        }

        const skip = (page - 1) * limit;
        const sortField = sortBy === 'date' ? 'sessionData.date' : `sessionData.${sortBy}`;
        const sortOptions = { [sortField]: sortOrder === 'desc' ? -1 : 1 };

        const [workouts, total] = await Promise.all([
            WorkoutSession.find(query)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .populate('sessionData.exercises.exerciseId', 'name primaryMuscleGroups')
                .lean(),
            WorkoutSession.countDocuments(query)
        ]);

        return {
            workouts,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit
            }
        };
    }

    /**
     * Start a workout session
     */
    async startWorkout(workoutId, userId) {
        const workout = await this.getWorkoutById(workoutId, userId);

        if (workout.sessionData.status === 'in_progress') {
            throw new AppError('Workout is already in progress', 400);
        }

        workout.sessionData.status = 'in_progress';
        workout.sessionData.startTime = new Date();

        await workout.save();

        logger.info(`Workout started: ${workoutId}`);
        return workout;
    }

    /**
     * Complete a set in a workout
     */
    async completeSet(workoutId, userId, exerciseIndex, setData) {
        const workout = await this.getWorkoutById(workoutId, userId);

        if (workout.sessionData.status !== 'in_progress') {
            throw new AppError('Workout must be in progress to complete sets', 400);
        }

        const exercise = workout.sessionData.exercises[exerciseIndex];
        if (!exercise) {
            throw new AppError('Exercise not found at specified index', 404);
        }

        // Add completed set
        exercise.sets.push({
            setNumber: exercise.sets.length + 1,
            weight: setData.weight,
            reps: setData.reps,
            restTime: setData.restTime,
            completedAt: new Date(),
            rpe: setData.rpe,
            notes: setData.notes
        });

        await workout.save();

        logger.info(`Set completed for workout: ${workoutId}, exercise: ${exerciseIndex}`);
        return workout;
    }

    /**
     * Complete a workout session
     */
    async completeWorkout(workoutId, userId) {
        const workout = await this.getWorkoutById(workoutId, userId);

        if (workout.sessionData.status === 'completed') {
            throw new AppError('Workout is already completed', 400);
        }

        workout.sessionData.status = 'completed';
        workout.sessionData.endTime = new Date();

        // Detect personal records
        const previousWorkouts = await WorkoutSession.find({
            userId,
            _id: { $ne: workoutId },
            'sessionData.status': 'completed'
        }).sort({ 'sessionData.date': -1 });

        await workout.detectPersonalRecords(previousWorkouts);
        await workout.save();

        // Update user progress
        await this._updateUserProgress(userId, workout);

        // Create social activity if workout is shared
        if (workout.sharing.isShared && workout.sharing.visibility !== 'private') {
            await Activity.createWorkoutActivity(userId, workout);
        }

        // Create PR activities for personal records
        if (workout.sessionData.metrics.personalRecordsSet > 0) {
            await this._createPRActivities(userId, workout);
        }

        // Increment exercise usage counts
        await this._updateExerciseMetrics(workout);

        logger.info(`Workout completed: ${workoutId}`);
        return workout;
    }

    /**
     * Update a workout
     */
    async updateWorkout(workoutId, userId, updateData) {
        const workout = await this.getWorkoutById(workoutId, userId);

        // Update allowed fields
        if (updateData.name) workout.sessionData.name = updateData.name;
        if (updateData.notes) workout.sessionData.notes = updateData.notes;
        if (updateData.mood) workout.sessionData.mood = { ...workout.sessionData.mood, ...updateData.mood };
        if (updateData.location) workout.sessionData.location = updateData.location;
        if (updateData.visibility) workout.sharing.visibility = updateData.visibility;

        await workout.save();

        logger.info(`Workout updated: ${workoutId}`);
        return workout;
    }

    /**
     * Delete a workout
     */
    async deleteWorkout(workoutId, userId) {
        const workout = await WorkoutSession.findOneAndDelete({ _id: workoutId, userId });

        if (!workout) {
            throw new AppError('Workout not found', 404);
        }

        // Delete associated activities
        await Activity.deleteMany({
            targetType: 'workout',
            targetId: workoutId
        });

        logger.info(`Workout deleted: ${workoutId}`);
        return { success: true, message: 'Workout deleted successfully' };
    }

    /**
     * Get workout statistics for a user
     */
    async getWorkoutStats(userId) {
        const stats = await WorkoutSession.aggregate([
            { $match: { userId: userId, 'sessionData.status': 'completed' } },
            {
                $group: {
                    _id: null,
                    totalWorkouts: { $sum: 1 },
                    totalVolume: { $sum: '$sessionData.metrics.totalVolume' },
                    totalCalories: { $sum: '$sessionData.metrics.caloriesBurned' },
                    totalDuration: { $sum: '$sessionData.duration' },
                    avgDuration: { $avg: '$sessionData.duration' },
                    avgVolume: { $avg: '$sessionData.metrics.totalVolume' },
                    totalPRs: { $sum: '$sessionData.metrics.personalRecordsSet' }
                }
            }
        ]);

        return stats[0] || {
            totalWorkouts: 0,
            totalVolume: 0,
            totalCalories: 0,
            totalDuration: 0,
            avgDuration: 0,
            avgVolume: 0,
            totalPRs: 0
        };
    }

    /**
     * Enrich exercises with database data
     * @private
     */
    async _enrichExercises(exercises) {
        return Promise.all(exercises.map(async (exercise) => {
            if (exercise.exerciseId) {
                const dbExercise = await Exercise.findById(exercise.exerciseId);
                if (dbExercise) {
                    return {
                        ...exercise,
                        exerciseName: dbExercise.name,
                        sets: exercise.sets || []
                    };
                }
            }
            return {
                ...exercise,
                sets: exercise.sets || []
            };
        }));
    }

    /**
     * Update user progress after workout completion
     * @private
     */
    async _updateUserProgress(userId, workout) {
        try {
            let progress = await Progress.findOne({ userId });

            if (!progress) {
                progress = new Progress({ userId });
            }

            // Update workout streak
            await progress.updateWorkoutStreak(workout.sessionData.date);

            // Update analytics
            await progress.updateAnalytics(workout);

            // Update weekly stats
            await progress.updateWeeklyStats(workout);

            // Update strength progress for exercises with PRs
            workout.sessionData.exercises.forEach(exercise => {
                if (exercise.personalRecords && exercise.personalRecords.length > 0) {
                    const pr = exercise.personalRecords[0];
                    progress.strengthProgress.push({
                        exerciseId: exercise.exerciseId,
                        exerciseName: exercise.exerciseName,
                        date: new Date(),
                        personalRecord: {
                            weight: pr.type === 'max_weight' ? pr.value : 0,
                            reps: pr.type === 'max_reps' ? pr.value : 0,
                            oneRepMax: pr.type === 'one_rep_max' ? pr.value : 0,
                            volume: pr.type === 'max_volume' ? pr.value : 0
                        },
                        trend: {
                            direction: 'improving',
                            changePercentage: pr.improvementPercentage || 0,
                            consistencyScore: 80
                        }
                    });
                }
            });

            await progress.save();

        } catch (error) {
            logger.error('Error updating user progress:', error);
            // Don't throw - this shouldn't block workout completion
        }
    }

    /**
     * Create activity entries for personal records
     * @private
     */
    async _createPRActivities(userId, workout) {
        try {
            workout.sessionData.exercises.forEach(async (exercise) => {
                if (exercise.personalRecords && exercise.personalRecords.length > 0) {
                    const pr = exercise.personalRecords[0];
                    await Activity.createPRActivity(userId, workout, exercise, pr.type, pr.value);
                }
            });
        } catch (error) {
            logger.error('Error creating PR activities:', error);
        }
    }

    /**
     * Update exercise usage metrics
     * @private
     */
    async _updateExerciseMetrics(workout) {
        try {
            const exerciseIds = workout.sessionData.exercises
                .map(e => e.exerciseId)
                .filter(Boolean);

            await Promise.all(exerciseIds.map(async (exerciseId) => {
                const exercise = await Exercise.findById(exerciseId);
                if (exercise) {
                    await exercise.incrementUsage();
                }
            }));
        } catch (error) {
            logger.error('Error updating exercise metrics:', error);
        }
    }
}

module.exports = new WorkoutService();
