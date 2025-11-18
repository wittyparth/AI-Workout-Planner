const { z } = require('zod');

/**
 * Progress validation schemas
 */

// Add body metrics schema
const addBodyMetricsSchema = z.object({
    body: z.object({
        weight: z.number().min(0).max(500).optional(),
        bodyFat: z.number().min(0).max(100).optional(),
        measurements: z.object({
            chest: z.number().min(0).optional(),
            waist: z.number().min(0).optional(),
            hips: z.number().min(0).optional(),
            biceps: z.number().min(0).optional(),
            thighs: z.number().min(0).optional()
        }).optional(),
        notes: z.string().max(500).optional()
    })
});

// Upload photo schema (multipart, validated by multer)
const uploadPhotoSchema = z.object({
    body: z.object({
        notes: z.string().max(500).optional(),
        visibility: z.enum(['public', 'friends', 'private']).default('private')
    })
});

module.exports = {
    addBodyMetricsSchema,
    uploadPhotoSchema
};
