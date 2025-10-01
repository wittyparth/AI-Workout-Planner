/**
 * Request Parser Utility
 * Advanced request parsing and validation
 */

const logger = require('./logger');

class RequestParser {
    /**
     * Parse and validate pagination parameters
     */
    static parsePagination(query) {
        const page = Math.max(1, parseInt(query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
        const offset = (page - 1) * limit;

        return { page, limit, offset };
    }

    /**
     * Parse sorting parameters
     */
    static parseSorting(query) {
        const sortBy = query.sortBy || 'name';
        const sortOrder = query.sortOrder === 'desc' ? -1 : 1;

        // Validate sortBy field
        const allowedSortFields = [
            'name', 'difficulty', 'primaryMuscleGroups',
            'createdAt', 'updatedAt'
        ];

        const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'name';

        return {
            sortBy: validSortBy,
            sortOrder,
            sortString: `${validSortBy}:${sortOrder === 1 ? 'asc' : 'desc'}`
        };
    }

    /**
     * Parse array parameters from query string
     */
    static parseArrayParam(param) {
        if (!param) return [];
        if (Array.isArray(param)) return param;
        if (typeof param === 'string') {
            return param.split(',').map(item => item.trim()).filter(Boolean);
        }
        return [];
    }

    /**
     * Parse search filters for exercises
     */
    static parseExerciseFilters(query) {
        return {
            search: query.search?.trim() || '',
            muscleGroups: this.parseArrayParam(query.muscleGroups),
            equipment: this.parseArrayParam(query.equipment),
            difficulty: query.difficulty || '',
            exerciseType: query.exerciseType || '',
            category: query.category || '',
            tags: this.parseArrayParam(query.tags),
            isActive: query.isActive !== undefined ? query.isActive === 'true' : undefined
        };
    }

    /**
     * Validate and sanitize request body
     */
    static sanitizeBody(body, allowedFields = []) {
        if (!body || typeof body !== 'object') return {};

        const sanitized = {};

        allowedFields.forEach(field => {
            if (body.hasOwnProperty(field)) {
                sanitized[field] = body[field];
            }
        });

        return sanitized;
    }

    /**
     * Extract client information from request
     */
    static getClientInfo(req) {
        return {
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent'),
            origin: req.get('Origin'),
            referer: req.get('Referer'),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Parse and validate ID parameter
     */
    static parseId(param, prefix = '') {
        if (!param || typeof param !== 'string') {
            return { valid: false, error: 'ID parameter is required' };
        }

        // For exercise IDs (format: EX123456)
        if (prefix === 'EX') {
            const pattern = /^EX\d{6}$/;
            if (!pattern.test(param)) {
                return {
                    valid: false,
                    error: 'Invalid exercise ID format. Expected: EX123456'
                };
            }
        }

        return { valid: true, id: param };
    }
}

module.exports = RequestParser;