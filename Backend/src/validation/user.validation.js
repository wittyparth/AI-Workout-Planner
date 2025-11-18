const { z } = require('zod');

/**
 * User/Profile validation schemas
 */

// Update profile schema
const updateProfileSchema = z.object({
    body: z.object({
        firstName: z.string().min(1).max(50).optional(),
        lastName: z.string().min(1).max(50).optional(),
        gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
        dateOfBirth: z.string().datetime().optional(),
        fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
        goals: z.array(z.string()).optional(),
        bio: z.string().max(500).optional()
    })
});

// Update preferences schema
const updatePreferencesSchema = z.object({
    body: z.object({
        units: z.enum(['metric', 'imperial']).optional(),
        notifications: z.object({
            email: z.boolean().optional(),
            push: z.boolean().optional(),
            workoutReminders: z.boolean().optional(),
            goalReminders: z.boolean().optional(),
            socialUpdates: z.boolean().optional()
        }).optional(),
        privacy: z.object({
            profileVisibility: z.enum(['public', 'friends', 'private']).optional(),
            workoutVisibility: z.enum(['public', 'friends', 'private']).optional(),
            showProgress: z.boolean().optional()
        }).optional(),
        theme: z.enum(['light', 'dark', 'auto']).optional()
    })
});

// Update body metrics schema
const updateMetricsSchema = z.object({
    body: z.object({
        weight: z.number().min(0).max(500).optional(),
        height: z.number().min(0).max(300).optional(),
        bodyFat: z.number().min(0).max(100).optional(),
        targetWeight: z.number().min(0).max(500).optional()
    })
});

// Delete account schema
const deleteAccountSchema = z.object({
    body: z.object({
        confirmPassword: z.string().min(1, 'Password confirmation is required')
    })
});

module.exports = {
    updateProfileSchema,
    updatePreferencesSchema,
    updateMetricsSchema,
    deleteAccountSchema
};
