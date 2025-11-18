const workoutService = require('../services/workout.service');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * Workout Controller - Handle workout-related HTTP requests
 */

/**
 * Create a new workout
 * POST /workouts
 */
exports.createWorkout = async (req, res) => {
    try {
        const userId = req.user._id;
        const workoutData = req.body;

        const workout = await workoutService.createWorkout(userId, workoutData);

        return successResponse(res, {
            message: 'Workout created successfully',
            data: workout
        }, 201);

    } catch (error) {
        logger.error('Create workout error:', error);
        return errorResponse(res, error.message, error.statusCode || 500);
    }
};

/**
 * Get workout by ID
 * GET /workouts/:id
 */
exports.getWorkout = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const workout = await workoutService.getWorkoutById(id, userId);

        return successResponse(res, {
            message: 'Workout retrieved successfully',
            data: workout
        });

    } catch (error) {
        logger.error('Get workout error:', error);
        return errorResponse(res, error.message, error.statusCode || 500);
    }
};

/**
 * Get workout history
 * GET /workouts
 */
exports.getWorkoutHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        const options = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
            status: req.query.status,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            sortBy: req.query.sortBy || 'date',
            sortOrder: req.query.sortOrder || 'desc'
        };

        const result = await workoutService.getWorkoutHistory(userId, options);

        return successResponse(res, {
            message: 'Workout history retrieved successfully',
            data: result.workouts,
            pagination: result.pagination
        });

    } catch (error) {
        logger.error('Get workout history error:', error);
        return errorResponse(res, error.message, error.statusCode || 500);
    }
};

/**
 * Start a workout session
 * POST /workouts/:id/start
 */
exports.startWorkout = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const workout = await workoutService.startWorkout(id, userId);

        return successResponse(res, {
            message: 'Workout started successfully',
            data: workout
        });

    } catch (error) {
        logger.error('Start workout error:', error);
        return errorResponse(res, error.message, error.statusCode || 500);
    }
};

/**
 * Complete a set
 * POST /workouts/:id/set
 */
exports.completeSet = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const { exerciseIndex, setData } = req.body;

        const workout = await workoutService.completeSet(id, userId, exerciseIndex, setData);

        return successResponse(res, {
            message: 'Set completed successfully',
            data: workout
        });

    } catch (error) {
        logger.error('Complete set error:', error);
        return errorResponse(res, error.message, error.statusCode || 500);
    }
};

/**
 * Complete a workout
 * POST /workouts/:id/complete
 */
exports.completeWorkout = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const workout = await workoutService.completeWorkout(id, userId);

        return successResponse(res, {
            message: 'Workout completed successfully',
            data: workout
        });

    } catch (error) {
        logger.error('Complete workout error:', error);
        return errorResponse(res, error.message, error.statusCode || 500);
    }
};

/**
 * Update a workout
 * PUT /workouts/:id
 */
exports.updateWorkout = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const updateData = req.body;

        const workout = await workoutService.updateWorkout(id, userId, updateData);

        return successResponse(res, {
            message: 'Workout updated successfully',
            data: workout
        });

    } catch (error) {
        logger.error('Update workout error:', error);
        return errorResponse(res, error.message, error.statusCode || 500);
    }
};

/**
 * Delete a workout
 * DELETE /workouts/:id
 */
exports.deleteWorkout = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const result = await workoutService.deleteWorkout(id, userId);

        return successResponse(res, result);

    } catch (error) {
        logger.error('Delete workout error:', error);
        return errorResponse(res, error.message, error.statusCode || 500);
    }
};

/**
 * Get workout statistics
 * GET /workouts/stats
 */
exports.getWorkoutStats = async (req, res) => {
    try {
        const userId = req.user._id;

        const stats = await workoutService.getWorkoutStats(userId);

        return successResponse(res, {
            message: 'Workout statistics retrieved successfully',
            data: stats
        });

    } catch (error) {
        logger.error('Get workout stats error:', error);
        return errorResponse(res, error.message, error.statusCode || 500);
    }
};
