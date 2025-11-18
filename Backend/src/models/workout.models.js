const mongoose = require('mongoose');

const workoutSessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        templateId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Template'
        },
        sessionData: {
            name: {
                type: String,
                required: true,
                trim: true
            },
            date: {
                type: Date,
                required: true,
                default: Date.now,
                index: true
            },
            startTime: Date,
            endTime: Date,
            duration: Number, // actual duration in seconds
            status: {
                type: String,
                enum: ['planned', 'in_progress', 'completed', 'cancelled'],
                default: 'planned',
                index: true
            },
            exercises: [{
                exerciseId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Exercise',
                    required: true
                },
                exerciseName: String, // denormalized for performance
                order: Number,
                sets: [{
                    setNumber: Number,
                    weight: Number,
                    reps: Number,
                    restTime: Number, // actual rest time taken in seconds
                    completedAt: Date,
                    personalRecord: { type: Boolean, default: false },
                    rpe: { type: Number, min: 1, max: 10 }, // Rate of Perceived Exertion
                    notes: String
                }],
                totalVolume: { type: Number, default: 0 }, // weight * reps * sets
                personalRecords: [{
                    type: {
                        type: String,
                        enum: ['max_weight', 'max_reps', 'max_volume', 'one_rep_max']
                    },
                    value: Number,
                    previousRecord: Number,
                    improvementPercentage: Number,
                    achievedAt: { type: Date, default: Date.now }
                }]
            }],
            metrics: {
                totalVolume: { type: Number, default: 0 },
                averageRPE: Number,
                caloriesBurned: { type: Number, default: 0 },
                totalRestTime: { type: Number, default: 0 },
                personalRecordsSet: { type: Number, default: 0 }
            },
            location: {
                type: String,
                enum: ['home', 'gym', 'outdoor', 'other'],
                default: 'gym'
            },
            mood: {
                before: String,
                after: String,
                energy: { type: Number, min: 1, max: 10 }
            },
            notes: String
        },
        sharing: {
            isShared: { type: Boolean, default: false },
            sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
            visibility: {
                type: String,
                enum: ['private', 'friends', 'public'],
                default: 'private'
            },
            socialMetrics: {
                likes: { type: Number, default: 0 },
                comments: { type: Number, default: 0 },
                shares: { type: Number, default: 0 }
            }
        }
    },
    {
        timestamps: true
    }
);

// Indexes for performance
workoutSessionSchema.index({ userId: 1, 'sessionData.date': -1 });
workoutSessionSchema.index({ 'sessionData.status': 1, userId: 1 });
workoutSessionSchema.index({ 'sharing.visibility': 1, 'sessionData.date': -1 });

// Pre-save hook to calculate metrics
workoutSessionSchema.pre('save', function (next) {
    if (this.isModified('sessionData.exercises')) {
        let totalVolume = 0;
        let totalRPE = 0;
        let rpeCount = 0;
        let totalCalories = 0;
        let totalRest = 0;
        let prCount = 0;

        this.sessionData.exercises.forEach(exercise => {
            let exerciseVolume = 0;

            exercise.sets.forEach(set => {
                if (set.weight && set.reps) {
                    exerciseVolume += set.weight * set.reps;
                }
                if (set.rpe) {
                    totalRPE += set.rpe;
                    rpeCount++;
                }
                if (set.restTime) {
                    totalRest += set.restTime;
                }
                if (set.personalRecord) {
                    prCount++;
                }
            });

            exercise.totalVolume = exerciseVolume;
            totalVolume += exerciseVolume;

            // Simple calorie estimation: 0.1 calorie per kg of volume
            totalCalories += exerciseVolume * 0.1;
        });

        this.sessionData.metrics.totalVolume = totalVolume;
        this.sessionData.metrics.averageRPE = rpeCount > 0 ? totalRPE / rpeCount : null;
        this.sessionData.metrics.caloriesBurned = Math.round(totalCalories);
        this.sessionData.metrics.totalRestTime = totalRest;
        this.sessionData.metrics.personalRecordsSet = prCount;
    }

    // Calculate duration if completed
    if (this.sessionData.status === 'completed' && this.sessionData.startTime && this.sessionData.endTime) {
        this.sessionData.duration = Math.floor((this.sessionData.endTime - this.sessionData.startTime) / 1000);
    }

    next();
});

// Method to start workout
workoutSessionSchema.methods.startWorkout = function () {
    this.sessionData.status = 'in_progress';
    this.sessionData.startTime = new Date();
    return this.save();
};

// Method to complete workout
workoutSessionSchema.methods.completeWorkout = function () {
    this.sessionData.status = 'completed';
    this.sessionData.endTime = new Date();
    return this.save();
};

// Method to detect personal records
workoutSessionSchema.methods.detectPersonalRecords = async function (previousWorkouts) {
    const Exercise = mongoose.model('Exercise');

    for (const exercise of this.sessionData.exercises) {
        const exerciseId = exercise.exerciseId;

        // Find max weight, max reps, max volume from previous workouts
        const previousBests = {
            maxWeight: 0,
            maxReps: 0,
            maxVolume: 0
        };

        previousWorkouts.forEach(workout => {
            const prevExercise = workout.sessionData.exercises.find(
                e => e.exerciseId.toString() === exerciseId.toString()
            );

            if (prevExercise) {
                prevExercise.sets.forEach(set => {
                    if (set.weight > previousBests.maxWeight) previousBests.maxWeight = set.weight;
                    if (set.reps > previousBests.maxReps) previousBests.maxReps = set.reps;
                });
                if (prevExercise.totalVolume > previousBests.maxVolume) {
                    previousBests.maxVolume = prevExercise.totalVolume;
                }
            }
        });

        // Check current workout for PRs
        exercise.sets.forEach(set => {
            if (set.weight && set.weight > previousBests.maxWeight) {
                set.personalRecord = true;
                exercise.personalRecords.push({
                    type: 'max_weight',
                    value: set.weight,
                    previousRecord: previousBests.maxWeight,
                    improvementPercentage: previousBests.maxWeight > 0
                        ? ((set.weight - previousBests.maxWeight) / previousBests.maxWeight * 100).toFixed(2)
                        : 100
                });
            }

            if (set.reps && set.reps > previousBests.maxReps) {
                set.personalRecord = true;
                exercise.personalRecords.push({
                    type: 'max_reps',
                    value: set.reps,
                    previousRecord: previousBests.maxReps,
                    improvementPercentage: previousBests.maxReps > 0
                        ? ((set.reps - previousBests.maxReps) / previousBests.maxReps * 100).toFixed(2)
                        : 100
                });
            }
        });

        if (exercise.totalVolume > previousBests.maxVolume) {
            exercise.personalRecords.push({
                type: 'max_volume',
                value: exercise.totalVolume,
                previousRecord: previousBests.maxVolume,
                improvementPercentage: previousBests.maxVolume > 0
                    ? ((exercise.totalVolume - previousBests.maxVolume) / previousBests.maxVolume * 100).toFixed(2)
                    : 100
            });
        }

        // Calculate one-rep max using Brzycki formula
        const maxSet = exercise.sets.reduce((max, set) => {
            if (set.weight && set.reps && set.reps <= 10) {
                const oneRepMax = set.weight * (36 / (37 - set.reps));
                return oneRepMax > max.oneRepMax ? { oneRepMax, set } : max;
            }
            return max;
        }, { oneRepMax: 0, set: null });

        if (maxSet.oneRepMax > 0) {
            exercise.personalRecords.push({
                type: 'one_rep_max',
                value: Math.round(maxSet.oneRepMax),
                previousRecord: 0, // Would need to calculate from previous workouts
                improvementPercentage: 0
            });
        }
    }

    return this.save();
};

const WorkoutSession = mongoose.model('WorkoutSession', workoutSessionSchema);

module.exports = WorkoutSession;
