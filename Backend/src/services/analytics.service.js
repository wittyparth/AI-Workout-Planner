const WorkoutSession = require('../models/workout.models');
const Progress = require('../models/progress.models');
const Goal = require('../models/goal.models');
const { ApiError } = require('../utils/errors');
const logger = require('../utils/logger');

/**
 * Get strength progression trends over time
 * @param {string} userId - User ID
 * @param {string} exerciseId - Exercise ID (optional)
 * @param {number} days - Number of days to look back (default 90)
 */
exports.getStrengthTrends = async (userId, exerciseId = null, days = 90) => {
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const matchStage = {
            userId,
            status: 'completed',
            completedAt: { $gte: startDate }
        };

        // Build aggregation pipeline
        const pipeline = [
            { $match: matchStage },
            { $unwind: '$sessionData.exercises' },
            { $unwind: '$sessionData.exercises.sets' },
            {
                $match: {
                    'sessionData.exercises.sets.completed': true,
                    'sessionData.exercises.sets.weight': { $exists: true, $gt: 0 }
                }
            }
        ];

        // Filter by exercise if provided
        if (exerciseId) {
            pipeline.push({
                $match: { 'sessionData.exercises.exerciseId': exerciseId }
            });
        }

        pipeline.push(
            {
                $group: {
                    _id: {
                        exerciseId: '$sessionData.exercises.exerciseId',
                        date: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } }
                    },
                    maxWeight: { $max: '$sessionData.exercises.sets.weight' },
                    avgWeight: { $avg: '$sessionData.exercises.sets.weight' },
                    totalReps: { $sum: '$sessionData.exercises.sets.reps' },
                    totalSets: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'exercises',
                    localField: '_id.exerciseId',
                    foreignField: '_id',
                    as: 'exercise'
                }
            },
            {
                $unwind: '$exercise'
            },
            {
                $project: {
                    date: '$_id.date',
                    exerciseId: '$_id.exerciseId',
                    exerciseName: '$exercise.name',
                    maxWeight: 1,
                    avgWeight: { $round: ['$avgWeight', 2] },
                    totalReps: 1,
                    totalSets: 1,
                    // Brzycki formula for estimated 1RM
                    estimatedOneRepMax: {
                        $round: [
                            {
                                $multiply: [
                                    '$maxWeight',
                                    { $divide: [36, { $subtract: [37, { $divide: ['$totalReps', '$totalSets'] }] }] }
                                ]
                            },
                            2
                        ]
                    }
                }
            },
            { $sort: { date: 1 } }
        );

        const trends = await WorkoutSession.aggregate(pipeline);

        return trends;
    } catch (error) {
        logger.error('Get strength trends error:', error);
        throw error;
    }
};

/**
 * Get volume analytics (total weight lifted over time)
 * @param {string} userId - User ID
 * @param {string} period - 'week' | 'month' | 'year'
 */
exports.getVolumeAnalytics = async (userId, period = 'month') => {
    try {
        const periodMap = {
            week: 7,
            month: 30,
            year: 365
        };

        const days = periodMap[period] || 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const pipeline = [
            {
                $match: {
                    userId,
                    status: 'completed',
                    completedAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } },
                    totalVolume: { $sum: '$metrics.totalVolume' },
                    totalCalories: { $sum: '$metrics.caloriesBurned' },
                    workoutCount: { $sum: 1 },
                    avgDuration: { $avg: '$metrics.duration' }
                }
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    date: '$_id',
                    totalVolume: { $round: ['$totalVolume', 2] },
                    totalCalories: { $round: ['$totalCalories', 0] },
                    workoutCount: 1,
                    avgDuration: { $round: ['$avgDuration', 0] }
                }
            }
        ];

        const volumeData = await WorkoutSession.aggregate(pipeline);

        // Calculate summary statistics
        const summary = {
            totalVolume: volumeData.reduce((sum, d) => sum + d.totalVolume, 0),
            totalCalories: volumeData.reduce((sum, d) => sum + d.totalCalories, 0),
            totalWorkouts: volumeData.reduce((sum, d) => sum + d.workoutCount, 0),
            avgVolumePerWorkout: 0,
            avgCaloriesPerWorkout: 0
        };

        if (summary.totalWorkouts > 0) {
            summary.avgVolumePerWorkout = Math.round(summary.totalVolume / summary.totalWorkouts);
            summary.avgCaloriesPerWorkout = Math.round(summary.totalCalories / summary.totalWorkouts);
        }

        return {
            period,
            data: volumeData,
            summary
        };
    } catch (error) {
        logger.error('Get volume analytics error:', error);
        throw error;
    }
};

/**
 * Get workout frequency by day of week
 * @param {string} userId - User ID
 * @param {number} weeks - Number of weeks to analyze (default 12)
 */
exports.getWorkoutFrequency = async (userId, weeks = 12) => {
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - (weeks * 7));

        const pipeline = [
            {
                $match: {
                    userId,
                    status: 'completed',
                    completedAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: { $dayOfWeek: '$completedAt' }, // 1=Sunday, 7=Saturday
                    count: { $sum: 1 },
                    avgDuration: { $avg: '$metrics.duration' },
                    avgVolume: { $avg: '$metrics.totalVolume' }
                }
            },
            {
                $project: {
                    dayOfWeek: '$_id',
                    count: 1,
                    avgDuration: { $round: ['$avgDuration', 0] },
                    avgVolume: { $round: ['$avgVolume', 2] }
                }
            },
            { $sort: { dayOfWeek: 1 } }
        ];

        const frequencyData = await WorkoutSession.aggregate(pipeline);

        // Map day numbers to names
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const formattedData = frequencyData.map(d => ({
            day: dayNames[d.dayOfWeek - 1],
            dayOfWeek: d.dayOfWeek,
            workoutCount: d.count,
            avgDuration: d.avgDuration,
            avgVolume: d.avgVolume
        }));

        return {
            weeks,
            data: formattedData,
            mostActiveDay: formattedData.reduce((max, d) => d.workoutCount > max.workoutCount ? d : max, formattedData[0])
        };
    } catch (error) {
        logger.error('Get workout frequency error:', error);
        throw error;
    }
};

/**
 * Get personal records history
 * @param {string} userId - User ID
 * @param {number} limit - Number of recent PRs to return
 */
exports.getPRHistory = async (userId, limit = 20) => {
    try {
        const pipeline = [
            {
                $match: {
                    userId,
                    status: 'completed',
                    'metrics.personalRecords': { $exists: true, $ne: [] }
                }
            },
            { $unwind: '$metrics.personalRecords' },
            {
                $lookup: {
                    from: 'exercises',
                    localField: 'metrics.personalRecords.exerciseId',
                    foreignField: '_id',
                    as: 'exercise'
                }
            },
            { $unwind: '$exercise' },
            {
                $project: {
                    date: '$completedAt',
                    exerciseId: '$metrics.personalRecords.exerciseId',
                    exerciseName: '$exercise.name',
                    previousRecord: '$metrics.personalRecords.previousRecord',
                    newRecord: '$metrics.personalRecords.newRecord',
                    improvement: {
                        $subtract: ['$metrics.personalRecords.newRecord', '$metrics.personalRecords.previousRecord']
                    },
                    improvementPercent: {
                        $round: [
                            {
                                $multiply: [
                                    {
                                        $divide: [
                                            { $subtract: ['$metrics.personalRecords.newRecord', '$metrics.personalRecords.previousRecord'] },
                                            '$metrics.personalRecords.previousRecord'
                                        ]
                                    },
                                    100
                                ]
                            },
                            2
                        ]
                    }
                }
            },
            { $sort: { date: -1 } },
            { $limit: limit }
        ];

        const prHistory = await WorkoutSession.aggregate(pipeline);

        return prHistory;
    } catch (error) {
        logger.error('Get PR history error:', error);
        throw error;
    }
};

/**
 * Get muscle group distribution
 * @param {string} userId - User ID
 * @param {number} days - Number of days to analyze
 */
exports.getMuscleGroupDistribution = async (userId, days = 30) => {
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const pipeline = [
            {
                $match: {
                    userId,
                    status: 'completed',
                    completedAt: { $gte: startDate }
                }
            },
            { $unwind: '$sessionData.exercises' },
            {
                $lookup: {
                    from: 'exercises',
                    localField: 'sessionData.exercises.exerciseId',
                    foreignField: '_id',
                    as: 'exercise'
                }
            },
            { $unwind: '$exercise' },
            { $unwind: '$exercise.primaryMuscleGroups' },
            {
                $group: {
                    _id: '$exercise.primaryMuscleGroups',
                    totalSets: { $sum: { $size: '$sessionData.exercises.sets' } },
                    totalExercises: { $sum: 1 },
                    totalVolume: {
                        $sum: {
                            $reduce: {
                                input: '$sessionData.exercises.sets',
                                initialValue: 0,
                                in: {
                                    $add: [
                                        '$$value',
                                        { $multiply: [{ $ifNull: ['$$this.weight', 0] }, { $ifNull: ['$$this.reps', 0] }] }
                                    ]
                                }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    muscleGroup: '$_id',
                    totalSets: 1,
                    totalExercises: 1,
                    totalVolume: { $round: ['$totalVolume', 2] }
                }
            },
            { $sort: { totalSets: -1 } }
        ];

        const distribution = await WorkoutSession.aggregate(pipeline);

        // Calculate percentages
        const totalSets = distribution.reduce((sum, d) => sum + d.totalSets, 0);
        const formattedData = distribution.map(d => ({
            ...d,
            percentage: totalSets > 0 ? Math.round((d.totalSets / totalSets) * 100) : 0
        }));

        return {
            days,
            data: formattedData,
            totalSets
        };
    } catch (error) {
        logger.error('Get muscle group distribution error:', error);
        throw error;
    }
};

/**
 * Get comprehensive dashboard statistics
 * @param {string} userId - User ID
 */
exports.getDashboardStats = async (userId) => {
    try {
        const [progress, recentWorkouts, activeGoals] = await Promise.all([
            Progress.findOne({ userId }),
            WorkoutSession.find({ userId, status: 'completed' })
                .sort({ completedAt: -1 })
                .limit(10)
                .populate('sessionData.exercises.exerciseId', 'name'),
            Goal.find({ userId, status: { $in: ['active', 'in_progress'] } })
        ]);

        // Calculate stats
        const stats = {
            totalWorkouts: progress?.analytics?.totalWorkouts || 0,
            totalVolume: progress?.analytics?.totalVolume || 0,
            totalCalories: progress?.analytics?.totalCalories || 0,
            currentStreak: progress?.streaks?.workout?.current || 0,
            longestStreak: progress?.streaks?.workout?.longest || 0,
            activeGoals: activeGoals.length,
            goalsCompleted: await Goal.countDocuments({ userId, status: 'completed' }),
            personalRecords: progress?.strengthProgress?.length || 0,
            recentActivity: recentWorkouts.map(w => ({
                id: w._id,
                date: w.completedAt,
                duration: w.metrics.duration,
                volume: w.metrics.totalVolume,
                calories: w.metrics.caloriesBurned,
                exercises: w.sessionData.exercises.length
            }))
        };

        return stats;
    } catch (error) {
        logger.error('Get dashboard stats error:', error);
        throw error;
    }
};

/**
 * Get exercise performance comparison
 * @param {string} userId - User ID
 * @param {Array} exerciseIds - Array of exercise IDs to compare
 */
exports.compareExercises = async (userId, exerciseIds) => {
    try {
        const pipeline = [
            {
                $match: {
                    userId,
                    status: 'completed',
                    'sessionData.exercises.exerciseId': { $in: exerciseIds }
                }
            },
            { $unwind: '$sessionData.exercises' },
            {
                $match: {
                    'sessionData.exercises.exerciseId': { $in: exerciseIds }
                }
            },
            {
                $group: {
                    _id: '$sessionData.exercises.exerciseId',
                    totalSessions: { $sum: 1 },
                    totalSets: { $sum: { $size: '$sessionData.exercises.sets' } },
                    avgSetsPerSession: { $avg: { $size: '$sessionData.exercises.sets' } },
                    totalVolume: {
                        $sum: {
                            $reduce: {
                                input: '$sessionData.exercises.sets',
                                initialValue: 0,
                                in: {
                                    $add: [
                                        '$$value',
                                        { $multiply: [{ $ifNull: ['$$this.weight', 0] }, { $ifNull: ['$$this.reps', 0] }] }
                                    ]
                                }
                            }
                        }
                    },
                    lastPerformed: { $max: '$completedAt' }
                }
            },
            {
                $lookup: {
                    from: 'exercises',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'exercise'
                }
            },
            { $unwind: '$exercise' },
            {
                $project: {
                    exerciseId: '$_id',
                    exerciseName: '$exercise.name',
                    totalSessions: 1,
                    totalSets: 1,
                    avgSetsPerSession: { $round: ['$avgSetsPerSession', 1] },
                    totalVolume: { $round: ['$totalVolume', 2] },
                    avgVolumePerSession: { $round: [{ $divide: ['$totalVolume', '$totalSessions'] }, 2] },
                    lastPerformed: 1
                }
            }
        ];

        const comparison = await WorkoutSession.aggregate(pipeline);

        return comparison;
    } catch (error) {
        logger.error('Compare exercises error:', error);
        throw error;
    }
};
