const Progress = require('../models/progress.models');
const { uploadProgressPhoto } = require('../config/s3.config');
const { ApiError } = require('../utils/errors');
const logger = require('../utils/logger');

/**
 * Get user's progress data
 * GET /api/v1/progress
 */
exports.getProgress = async (req, res, next) => {
    try {
        const userId = req.user.id;

        let progress = await Progress.findOne({ userId });

        // Create progress document if it doesn't exist
        if (!progress) {
            progress = await Progress.create({ userId });
        }

        res.json({
            success: true,
            data: progress
        });
    } catch (error) {
        logger.error('Get progress error:', error);
        next(error);
    }
};

/**
 * Add body metrics entry
 * POST /api/v1/progress/metrics
 */
exports.addBodyMetrics = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { weight, bodyFat, measurements, notes } = req.body;

        let progress = await Progress.findOne({ userId });

        if (!progress) {
            progress = await Progress.create({ userId });
        }

        // Add new metric entry
        progress.bodyMetrics.push({
            weight,
            bodyFat,
            measurements: {
                chest: measurements?.chest,
                waist: measurements?.waist,
                hips: measurements?.hips,
                biceps: measurements?.biceps,
                thighs: measurements?.thighs
            },
            notes,
            recordedAt: new Date()
        });

        await progress.save();

        res.status(201).json({
            success: true,
            data: progress.bodyMetrics[progress.bodyMetrics.length - 1]
        });
    } catch (error) {
        logger.error('Add body metrics error:', error);
        next(error);
    }
};

/**
 * Upload progress photo
 * POST /api/v1/progress/photos
 */
exports.uploadPhoto = async (req, res, next) => {
    try {
        const userId = req.user.id || req.user._id;
        const { notes, visibility = 'private' } = req.body;

        logger.info(`Upload progress photo - userId: ${userId}, user object keys: ${Object.keys(req.user).join(', ')}`);

        if (!req.file) {
            throw new ApiError('No photo uploaded', 400);
        }

        // Upload to S3
        const photoUrl = await uploadProgressPhoto(req.file, userId);

        let progress = await Progress.findOne({ userId });

        if (!progress) {
            progress = await Progress.create({ userId });
        }

        // Add photo URL to body metrics
        const latestMetric = progress.bodyMetrics[progress.bodyMetrics.length - 1];
        if (latestMetric) {
            latestMetric.photos.push(photoUrl);
        } else {
            // Create new metric entry with photo
            progress.bodyMetrics.push({
                photos: [photoUrl],
                notes,
                recordedAt: new Date()
            });
        }

        await progress.save();

        res.status(201).json({
            success: true,
            data: { photoUrl }
        });
    } catch (error) {
        logger.error('Upload photo error:', error);
        next(error);
    }
};

/**
 * Get strength progression for specific exercise
 * GET /api/v1/progress/strength/:exerciseId
 */
exports.getStrengthProgression = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { exerciseId } = req.params;

        const progress = await Progress.findOne({ userId });

        if (!progress) {
            return res.json({
                success: true,
                data: []
            });
        }

        // Filter strength progress for specific exercise
        const exerciseProgress = progress.strengthProgress.filter(
            sp => sp.exerciseId.toString() === exerciseId
        );

        res.json({
            success: true,
            data: exerciseProgress
        });
    } catch (error) {
        logger.error('Get strength progression error:', error);
        next(error);
    }
};

/**
 * Get all strength PRs
 * GET /api/v1/progress/prs
 */
exports.getPersonalRecords = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const progress = await Progress.findOne({ userId })
            .populate('strengthProgress.exerciseId', 'name primaryMuscleGroups');

        if (!progress) {
            return res.json({
                success: true,
                data: []
            });
        }

        // Get current PRs for each exercise
        const prMap = new Map();
        progress.strengthProgress.forEach(sp => {
            const exerciseId = sp.exerciseId._id.toString();
            if (!prMap.has(exerciseId) || sp.oneRepMax > prMap.get(exerciseId).oneRepMax) {
                prMap.set(exerciseId, {
                    exerciseId: sp.exerciseId._id,
                    exerciseName: sp.exerciseId.name,
                    muscleGroups: sp.exerciseId.primaryMuscleGroups,
                    oneRepMax: sp.oneRepMax,
                    weight: sp.weight,
                    reps: sp.reps,
                    recordedAt: sp.recordedAt
                });
            }
        });

        const prs = Array.from(prMap.values()).sort((a, b) => b.oneRepMax - a.oneRepMax);

        res.json({
            success: true,
            data: prs
        });
    } catch (error) {
        logger.error('Get personal records error:', error);
        next(error);
    }
};

/**
 * Get workout streaks
 * GET /api/v1/progress/streaks
 */
exports.getStreaks = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const progress = await Progress.findOne({ userId });

        if (!progress) {
            return res.json({
                success: true,
                data: {
                    workout: { current: 0, longest: 0, lastWorkoutDate: null },
                    goal: { current: 0, longest: 0, lastGoalDate: null }
                }
            });
        }

        res.json({
            success: true,
            data: progress.streaks
        });
    } catch (error) {
        logger.error('Get streaks error:', error);
        next(error);
    }
};

/**
 * Get analytics dashboard data
 * GET /api/v1/progress/analytics
 */
exports.getAnalytics = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const progress = await Progress.findOne({ userId });

        if (!progress) {
            return res.json({
                success: true,
                data: {
                    totalWorkouts: 0,
                    totalVolume: 0,
                    totalCalories: 0,
                    favoriteExercises: [],
                    weeklyStats: []
                }
            });
        }

        res.json({
            success: true,
            data: progress.analytics
        });
    } catch (error) {
        logger.error('Get analytics error:', error);
        next(error);
    }
};

/**
 * Delete body metric entry
 * DELETE /api/v1/progress/metrics/:metricId
 */
exports.deleteBodyMetric = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { metricId } = req.params;

        const progress = await Progress.findOne({ userId });

        if (!progress) {
            throw new ApiError('Progress data not found', 404);
        }

        // Remove metric
        progress.bodyMetrics = progress.bodyMetrics.filter(
            m => m._id.toString() !== metricId
        );

        await progress.save();

        res.json({
            success: true,
            message: 'Body metric deleted successfully'
        });
    } catch (error) {
        logger.error('Delete body metric error:', error);
        next(error);
    }
};
