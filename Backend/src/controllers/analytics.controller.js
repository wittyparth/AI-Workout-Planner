const analyticsService = require('../services/analytics.service');
const { ApiError } = require('../utils/errors');
const logger = require('../utils/logger');

/**
 * Get strength progression trends
 * GET /api/v1/analytics/strength-trends
 */
exports.getStrengthTrends = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { exerciseId, days = 90 } = req.query;

        const trends = await analyticsService.getStrengthTrends(
            userId,
            exerciseId,
            parseInt(days)
        );

        res.json({
            success: true,
            data: trends
        });
    } catch (error) {
        logger.error('Get strength trends controller error:', error);
        next(error);
    }
};

/**
 * Get volume analytics
 * GET /api/v1/analytics/volume
 */
exports.getVolumeAnalytics = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { period = 'month' } = req.query;

        if (!['week', 'month', 'year'].includes(period)) {
            throw new ApiError('Invalid period. Must be week, month, or year', 400);
        }

        const analytics = await analyticsService.getVolumeAnalytics(userId, period);

        res.json({
            success: true,
            data: analytics
        });
    } catch (error) {
        logger.error('Get volume analytics controller error:', error);
        next(error);
    }
};

/**
 * Get workout frequency
 * GET /api/v1/analytics/frequency
 */
exports.getWorkoutFrequency = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { weeks = 12 } = req.query;

        const frequency = await analyticsService.getWorkoutFrequency(
            userId,
            parseInt(weeks)
        );

        res.json({
            success: true,
            data: frequency
        });
    } catch (error) {
        logger.error('Get workout frequency controller error:', error);
        next(error);
    }
};

/**
 * Get PR history
 * GET /api/v1/analytics/pr-history
 */
exports.getPRHistory = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { limit = 20 } = req.query;

        const prHistory = await analyticsService.getPRHistory(
            userId,
            parseInt(limit)
        );

        res.json({
            success: true,
            data: prHistory
        });
    } catch (error) {
        logger.error('Get PR history controller error:', error);
        next(error);
    }
};

/**
 * Get muscle group distribution
 * GET /api/v1/analytics/muscle-distribution
 */
exports.getMuscleGroupDistribution = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { days = 30 } = req.query;

        const distribution = await analyticsService.getMuscleGroupDistribution(
            userId,
            parseInt(days)
        );

        res.json({
            success: true,
            data: distribution
        });
    } catch (error) {
        logger.error('Get muscle distribution controller error:', error);
        next(error);
    }
};

/**
 * Get dashboard statistics
 * GET /api/v1/analytics/dashboard
 */
exports.getDashboardStats = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const stats = await analyticsService.getDashboardStats(userId);

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        logger.error('Get dashboard stats controller error:', error);
        next(error);
    }
};

/**
 * Compare exercises
 * POST /api/v1/analytics/compare
 */
exports.compareExercises = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { exerciseIds } = req.body;

        if (!exerciseIds || !Array.isArray(exerciseIds) || exerciseIds.length < 2) {
            throw new ApiError('Please provide at least 2 exercise IDs to compare', 400);
        }

        const comparison = await analyticsService.compareExercises(userId, exerciseIds);

        res.json({
            success: true,
            data: comparison
        });
    } catch (error) {
        logger.error('Compare exercises controller error:', error);
        next(error);
    }
};
