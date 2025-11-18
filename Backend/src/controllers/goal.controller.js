const goalService = require('../services/goal.service');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * Goal Controller - Handle goal-related HTTP requests
 */

/**
 * Create a new goal
 * POST /goals
 */
exports.createGoal = async (req, res) => {
    try {
        const userId = req.user._id;
        const goalData = req.body;

        const goal = await goalService.createGoal(userId, goalData);

        return successResponse(res, {
            message: 'Goal created successfully',
            data: goal
        }, 201);

    } catch (error) {
        logger.error('Create goal error:', error);
        return errorResponse(res, error.message, error.statusCode || 500);
    }
};

/**
 * Get goal by ID
 * GET /goals/:id
 */
exports.getGoal = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const goal = await goalService.getGoalById(id, userId);

        return successResponse(res, {
            message: 'Goal retrieved successfully',
            data: goal
        });

    } catch (error) {
        logger.error('Get goal error:', error);
        return errorResponse(res, error.message, error.statusCode || 500);
    }
};

/**
 * Get all user goals
 * GET /goals
 */
exports.getGoals = async (req, res) => {
    try {
        const userId = req.user._id;
        const options = {
            status: req.query.status,
            type: req.query.type,
            sortBy: req.query.sortBy || 'createdAt',
            sortOrder: req.query.sortOrder || 'desc'
        };

        const goals = await goalService.getUserGoals(userId, options);

        return successResponse(res, {
            message: 'Goals retrieved successfully',
            data: goals
        });

    } catch (error) {
        logger.error('Get goals error:', error);
        return errorResponse(res, error.message, error.statusCode || 500);
    }
};

/**
 * Update goal progress
 * POST /goals/:id/progress
 */
exports.updateProgress = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const { value, notes, source } = req.body;

        if (value === undefined) {
            return errorResponse(res, 'Progress value is required', 400);
        }

        const goal = await goalService.updateGoalProgress(id, userId, value, notes, source);

        return successResponse(res, {
            message: 'Goal progress updated successfully',
            data: goal
        });

    } catch (error) {
        logger.error('Update goal progress error:', error);
        return errorResponse(res, error.message, error.statusCode || 500);
    }
};

/**
 * Update goal
 * PUT /goals/:id
 */
exports.updateGoal = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const updateData = req.body;

        const goal = await goalService.updateGoal(id, userId, updateData);

        return successResponse(res, {
            message: 'Goal updated successfully',
            data: goal
        });

    } catch (error) {
        logger.error('Update goal error:', error);
        return errorResponse(res, error.message, error.statusCode || 500);
    }
};

/**
 * Delete goal
 * DELETE /goals/:id
 */
exports.deleteGoal = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const result = await goalService.deleteGoal(id, userId);

        return successResponse(res, result);

    } catch (error) {
        logger.error('Delete goal error:', error);
        return errorResponse(res, error.message, error.statusCode || 500);
    }
};

/**
 * Add milestone to goal
 * POST /goals/:id/milestone
 */
exports.addMilestone = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const milestoneData = req.body;

        if (!milestoneData.value) {
            return errorResponse(res, 'Milestone value is required', 400);
        }

        const goal = await goalService.addMilestone(id, userId, milestoneData);

        return successResponse(res, {
            message: 'Milestone added successfully',
            data: goal
        });

    } catch (error) {
        logger.error('Add milestone error:', error);
        return errorResponse(res, error.message, error.statusCode || 500);
    }
};

/**
 * Get goal statistics
 * GET /goals/stats
 */
exports.getGoalStats = async (req, res) => {
    try {
        const userId = req.user._id;

        const stats = await goalService.getGoalStats(userId);

        return successResponse(res, {
            message: 'Goal statistics retrieved successfully',
            data: stats
        });

    } catch (error) {
        logger.error('Get goal stats error:', error);
        return errorResponse(res, error.message, error.statusCode || 500);
    }
};

/**
 * Get goal insights
 * GET /goals/:id/insights
 */
exports.getGoalInsights = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const insights = await goalService.getGoalInsights(id, userId);

        return successResponse(res, {
            message: 'Goal insights retrieved successfully',
            data: insights
        });

    } catch (error) {
        logger.error('Get goal insights error:', error);
        return errorResponse(res, error.message, error.statusCode || 500);
    }
};
