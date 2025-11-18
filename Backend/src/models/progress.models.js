const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
            index: true
        },
        bodyMetrics: [{
            date: {
                type: Date,
                required: true,
                default: Date.now
            },
            weight: Number,
            bodyFatPercentage: Number,
            measurements: {
                chest: Number,
                waist: Number,
                hips: Number,
                bicepLeft: Number,
                bicepRight: Number,
                thighLeft: Number,
                thighRight: Number,
                calfLeft: Number,
                calfRight: Number,
                shoulders: Number,
                neck: Number
            },
            photos: {
                front: String, // S3 URL
                side: String,
                back: String
            },
            mood: String,
            energy: { type: Number, min: 1, max: 10 },
            notes: String
        }],
        strengthProgress: [{
            exerciseId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Exercise',
                required: true
            },
            exerciseName: String, // denormalized
            date: {
                type: Date,
                default: Date.now
            },
            personalRecord: {
                weight: Number,
                reps: Number,
                oneRepMax: Number,
                volume: Number
            },
            trend: {
                direction: {
                    type: String,
                    enum: ['improving', 'maintaining', 'declining', 'new']
                },
                changePercentage: Number,
                consistencyScore: Number // 0-100
            }
        }],
        streaks: {
            currentWorkoutStreak: { type: Number, default: 0 },
            longestWorkoutStreak: { type: Number, default: 0 },
            currentGoalStreak: { type: Number, default: 0 },
            lastWorkoutDate: Date,
            weeklyTargets: {
                workoutsPerWeek: { type: Number, default: 3 },
                currentWeekCount: { type: Number, default: 0 },
                weekStartDate: Date
            }
        },
        analytics: {
            totalWorkouts: { type: Number, default: 0 },
            totalVolume: { type: Number, default: 0 },
            averageWorkoutDuration: { type: Number, default: 0 },
            totalCaloriesBurned: { type: Number, default: 0 },
            favoriteExercises: [{
                exerciseId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Exercise'
                },
                count: Number
            }],
            strongestLifts: [{
                exerciseId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Exercise'
                },
                exerciseName: String,
                maxWeight: Number,
                maxReps: Number,
                oneRepMax: Number,
                achievedAt: Date
            }],
            weeklyStats: [{
                weekStartDate: Date,
                weekNumber: Number,
                year: Number,
                workoutCount: Number,
                totalVolume: Number,
                averageDuration: Number,
                caloriesBurned: Number,
                muscleGroupsTargeted: [String]
            }]
        }
    },
    {
        timestamps: true
    }
);

// Indexes
progressSchema.index({ userId: 1 });
progressSchema.index({ 'bodyMetrics.date': -1 });
progressSchema.index({ 'strengthProgress.exerciseId': 1, 'strengthProgress.date': -1 });

// Method to add body metrics
progressSchema.methods.addBodyMetrics = function (metricsData) {
    this.bodyMetrics.push(metricsData);
    // Keep only last 100 entries
    if (this.bodyMetrics.length > 100) {
        this.bodyMetrics = this.bodyMetrics.slice(-100);
    }
    return this.save();
};

// Method to update workout streak
progressSchema.methods.updateWorkoutStreak = function (workoutDate) {
    const lastWorkout = this.streaks.lastWorkoutDate;
    const currentDate = new Date(workoutDate);

    if (!lastWorkout) {
        this.streaks.currentWorkoutStreak = 1;
        this.streaks.longestWorkoutStreak = 1;
    } else {
        const daysDiff = Math.floor((currentDate - lastWorkout) / (1000 * 60 * 60 * 24));

        if (daysDiff === 1) {
            // Consecutive day
            this.streaks.currentWorkoutStreak += 1;
            if (this.streaks.currentWorkoutStreak > this.streaks.longestWorkoutStreak) {
                this.streaks.longestWorkoutStreak = this.streaks.currentWorkoutStreak;
            }
        } else if (daysDiff > 1) {
            // Streak broken
            this.streaks.currentWorkoutStreak = 1;
        }
        // Same day workouts don't change streak
    }

    this.streaks.lastWorkoutDate = currentDate;
    return this.save();
};

// Method to update weekly stats
progressSchema.methods.updateWeeklyStats = function (workout) {
    const workoutDate = new Date(workout.sessionData.date);
    const weekStart = new Date(workoutDate);
    weekStart.setDate(workoutDate.getDate() - workoutDate.getDay()); // Start of week (Sunday)
    weekStart.setHours(0, 0, 0, 0);

    const weekNumber = Math.ceil((workoutDate - new Date(workoutDate.getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));

    // Find or create weekly stat
    let weekStat = this.analytics.weeklyStats.find(
        stat => stat.weekStartDate.getTime() === weekStart.getTime()
    );

    if (!weekStat) {
        weekStat = {
            weekStartDate: weekStart,
            weekNumber,
            year: workoutDate.getFullYear(),
            workoutCount: 0,
            totalVolume: 0,
            averageDuration: 0,
            caloriesBurned: 0,
            muscleGroupsTargeted: []
        };
        this.analytics.weeklyStats.push(weekStat);
    }

    weekStat.workoutCount += 1;
    weekStat.totalVolume += workout.sessionData.metrics.totalVolume || 0;
    weekStat.caloriesBurned += workout.sessionData.metrics.caloriesBurned || 0;

    // Calculate average duration
    const totalDuration = weekStat.averageDuration * (weekStat.workoutCount - 1) + (workout.sessionData.duration || 0);
    weekStat.averageDuration = totalDuration / weekStat.workoutCount;

    // Keep only last 52 weeks
    if (this.analytics.weeklyStats.length > 52) {
        this.analytics.weeklyStats.sort((a, b) => b.weekStartDate - a.weekStartDate);
        this.analytics.weeklyStats = this.analytics.weeklyStats.slice(0, 52);
    }

    return this.save();
};

// Method to update overall analytics
progressSchema.methods.updateAnalytics = function (workout) {
    this.analytics.totalWorkouts += 1;
    this.analytics.totalVolume += workout.sessionData.metrics.totalVolume || 0;
    this.analytics.totalCaloriesBurned += workout.sessionData.metrics.caloriesBurned || 0;

    // Calculate average duration
    const totalDuration = this.analytics.averageWorkoutDuration * (this.analytics.totalWorkouts - 1) + (workout.sessionData.duration || 0);
    this.analytics.averageWorkoutDuration = totalDuration / this.analytics.totalWorkouts;

    // Update favorite exercises
    workout.sessionData.exercises.forEach(exercise => {
        const favorite = this.analytics.favoriteExercises.find(
            fav => fav.exerciseId.toString() === exercise.exerciseId.toString()
        );

        if (favorite) {
            favorite.count += 1;
        } else {
            this.analytics.favoriteExercises.push({
                exerciseId: exercise.exerciseId,
                count: 1
            });
        }
    });

    // Sort and keep top 10 favorites
    this.analytics.favoriteExercises.sort((a, b) => b.count - a.count);
    if (this.analytics.favoriteExercises.length > 10) {
        this.analytics.favoriteExercises = this.analytics.favoriteExercises.slice(0, 10);
    }

    return this.save();
};

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;
