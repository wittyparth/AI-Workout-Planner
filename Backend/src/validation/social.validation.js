const { z } = require('zod');

/**
 * Social validation schemas
 */

// Add comment schema
const addCommentSchema = z.object({
    body: z.object({
        text: z.string().min(1).max(500)
    })
});

// Get activity feed schema
const getActivityFeedSchema = z.object({
    query: z.object({
        page: z.string().regex(/^\d+$/).transform(Number).optional(),
        limit: z.string().regex(/^\d+$/).transform(Number).optional(),
        filter: z.enum(['all', 'friends', 'following', 'mine']).default('all')
    })
});

module.exports = {
    addCommentSchema,
    getActivityFeedSchema
};
