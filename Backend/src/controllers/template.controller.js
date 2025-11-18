const templateService = require('../services/template.service');
const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * Template Controller - Handle workout template requests
 */

/**
 * Create a new template
 * POST /templates
 */
exports.createTemplate = async (req, res) => {
    try {
        const userId = req.user._id;
        const templateData = req.body;

        const template = await templateService.createTemplate(userId, templateData);

        return successResponse(res, {
            message: 'Template created successfully',
            data: template
        }, 201);

    } catch (error) {
        logger.error('Create template error:', error);
        return errorResponse(res, error.message, error.statusCode || 500);
    }
};

/**
 * Get template by ID
 * GET /templates/:id
 */
exports.getTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?._id;

        const template = await templateService.getTemplateById(id, userId);

        return successResponse(res, {
            message: 'Template retrieved successfully',
            data: template
        });

    } catch (error) {
        logger.error('Get template error:', error);
        return errorResponse(res, error.message, error.statusCode || 500);
    }
};

/**
 * Get templates with filters
 * GET /templates
 */
exports.getTemplates = async (req, res) => {
    try {
        const options = {
            userId: req.query.my === 'true' ? req.user._id : null,
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
            difficulty: req.query.difficulty,
            goal: req.query.goal,
            isPublic: req.query.public === 'true',
            isFeatured: req.query.featured === 'true',
            search: req.query.search,
            sortBy: req.query.sortBy || 'createdAt',
            sortOrder: req.query.sortOrder || 'desc'
        };

        const result = await templateService.getTemplates(options);

        return successResponse(res, {
            message: 'Templates retrieved successfully',
            data: result.templates,
            pagination: result.pagination
        });

    } catch (error) {
        logger.error('Get templates error:', error);
        return errorResponse(res, error.message, error.statusCode || 500);
    }
};

/**
 * Get featured templates
 * GET /templates/featured
 */
exports.getFeaturedTemplates = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const templates = await templateService.getFeaturedTemplates(limit);

        return successResponse(res, {
            message: 'Featured templates retrieved successfully',
            data: templates
        });

    } catch (error) {
        logger.error('Get featured templates error:', error);
        return errorResponse(res, error.message, error.statusCode || 500);
    }
};

/**
 * Update template
 * PUT /templates/:id
 */
exports.updateTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const updateData = req.body;

        const template = await templateService.updateTemplate(id, userId, updateData);

        return successResponse(res, {
            message: 'Template updated successfully',
            data: template
        });

    } catch (error) {
        logger.error('Update template error:', error);
        return errorResponse(res, error.message, error.statusCode || 500);
    }
};

/**
 * Delete template
 * DELETE /templates/:id
 */
exports.deleteTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const result = await templateService.deleteTemplate(id, userId);

        return successResponse(res, result);

    } catch (error) {
        logger.error('Delete template error:', error);
        return errorResponse(res, error.message, error.statusCode || 500);
    }
};

/**
 * Duplicate template
 * POST /templates/:id/duplicate
 */
exports.duplicateTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const template = await templateService.duplicateTemplate(id, userId);

        return successResponse(res, {
            message: 'Template duplicated successfully',
            data: template
        }, 201);

    } catch (error) {
        logger.error('Duplicate template error:', error);
        return errorResponse(res, error.message, error.statusCode || 500);
    }
};

/**
 * Toggle favorite
 * POST /templates/:id/favorite
 */
exports.toggleFavorite = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const result = await templateService.toggleFavorite(id, userId);

        return successResponse(res, {
            message: 'Favorite updated successfully',
            data: result
        });

    } catch (error) {
        logger.error('Toggle favorite error:', error);
        return errorResponse(res, error.message, error.statusCode || 500);
    }
};

/**
 * Rate template
 * POST /templates/:id/rate
 */
exports.rateTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const { rating } = req.body;

        if (!rating) {
            return errorResponse(res, 'Rating is required', 400);
        }

        const result = await templateService.rateTemplate(id, userId, rating);

        return successResponse(res, {
            message: 'Template rated successfully',
            data: result
        });

    } catch (error) {
        logger.error('Rate template error:', error);
        return errorResponse(res, error.message, error.statusCode || 500);
    }
};
