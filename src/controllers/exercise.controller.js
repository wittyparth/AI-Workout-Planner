const exerciseService = require('../services/exercise.service');
const ResponseUtil = require('../utils/response');
const logger = require('../utils/logger');

class ExerciseController {
    /**
     * Get all exercises with filtering and pagination
     * GET /api/v1/exercises
     */
    static async getAllExercises(req, res) {
        try {
            logger.debug('Getting all exercises with filters', req.query);

            const result = await exerciseService.searchExercises(req.query);

            return ResponseUtil.paginated(
                res,
                result.exercises,
                result.pagination.page,
                result.pagination.limit,
                result.pagination.total,
                'Exercises retrieved successfully'
            );
        } catch (error) {
            logger.error('Error getting exercises', error);
            return ResponseUtil.error(res, 'Failed to retrieve exercises', 500);
        }
    }

    /**
     * Get exercise by ID
     * GET /api/v1/exercises/:id
     */
    static async getExerciseById(req, res) {
        try {
            const { id } = req.params;
            logger.debug(`Getting exercise by ID: ${id}`);

            const exercise = await exerciseService.getExerciseById(id);

            if (!exercise) {
                return ResponseUtil.error(res, 'Exercise not found', 404);
            }

            return ResponseUtil.success(res, exercise, 'Exercise retrieved successfully');
        } catch (error) {
            logger.error('Error getting exercise by ID', error);
            return ResponseUtil.error(res, 'Failed to retrieve exercise', 500);
        }
    }

    /**
     * Search exercises with advanced criteria
     * POST /api/v1/exercises/search
     */
    static async searchExercises(req, res) {
        try {
            logger.debug('Advanced exercise search', req.body);

            const result = await exerciseService.searchExercises(req.body);

            return ResponseUtil.paginated(
                res,
                result.exercises,
                result.pagination.page,
                result.pagination.limit,
                result.pagination.total,
                'Exercise search completed successfully'
            );
        } catch (error) {
            logger.error('Error searching exercises', error);
            return ResponseUtil.error(res, 'Exercise search failed', 500);
        }
    }

    /**
     * Get available filter options
     * GET /api/v1/exercises/filters
     */
    static async getExerciseFilters(req, res) {
        try {
            logger.debug('Getting exercise filter options');

            const filters = await exerciseService.getExerciseFilters();

            return ResponseUtil.success(res, filters, 'Filter options retrieved successfully');
        } catch (error) {
            logger.error('Error getting exercise filters', error);
            return ResponseUtil.error(res, 'Failed to retrieve filter options', 500);
        }
    }

    /**
     * Get exercise library statistics
     * GET /api/v1/exercises/stats
     */
    static async getExerciseStats(req, res) {
        try {
            logger.debug('Getting exercise statistics');

            const stats = await exerciseService.getExerciseStats();

            return ResponseUtil.success(res, stats, 'Exercise statistics retrieved successfully');
        } catch (error) {
            logger.error('Error getting exercise statistics', error);
            return ResponseUtil.error(res, 'Failed to retrieve exercise statistics', 500);
        }
    }

    /**
     * Add new exercise (Admin only - placeholder for now)
     * POST /api/v1/exercises
     */
    static async addExercise(req, res) {
        try {
            logger.debug('Adding new exercise', req.body);

            // TODO: Add validation middleware
            // TODO: Add admin authentication

            const newExercise = await exerciseService.addExercise(req.body);

            return ResponseUtil.success(res, newExercise, 'Exercise added successfully', 201);
        } catch (error) {
            logger.error('Error adding exercise', error);
            return ResponseUtil.error(res, 'Failed to add exercise', 500);
        }
    }

    /**
     * Update existing exercise (Admin only - placeholder for now)
     * PUT /api/v1/exercises/:id
     */
    static async updateExercise(req, res) {
        try {
            const { id } = req.params;
            logger.debug(`Updating exercise: ${id}`, req.body);

            // TODO: Add validation middleware
            // TODO: Add admin authentication

            const updatedExercise = await exerciseService.updateExercise(id, req.body);

            if (!updatedExercise) {
                return ResponseUtil.error(res, 'Exercise not found', 404);
            }

            return ResponseUtil.success(res, updatedExercise, 'Exercise updated successfully');
        } catch (error) {
            logger.error('Error updating exercise', error);
            return ResponseUtil.error(res, 'Failed to update exercise', 500);
        }
    }

    /**
     * Delete exercise (Admin only - placeholder for now)
     * DELETE /api/v1/exercises/:id
     */
    static async deleteExercise(req, res) {
        try {
            const { id } = req.params;
            logger.debug(`Deleting exercise: ${id}`);

            // TODO: Add admin authentication

            const deleted = await exerciseService.deleteExercise(id);

            if (!deleted) {
                return ResponseUtil.error(res, 'Exercise not found', 404);
            }

            return ResponseUtil.success(res, null, 'Exercise deleted successfully');
        } catch (error) {
            logger.error('Error deleting exercise', error);
            return ResponseUtil.error(res, 'Failed to delete exercise', 500);
        }
    }
}

module.exports = ExerciseController;