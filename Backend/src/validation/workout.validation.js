const { z } = require('zod');

/**
 * Workout validation schemas
 */

// Create workout schema
const createWorkoutSchema = z.object({
    body: z.object({
        templateId: z.string().optional(),
        sessionData: z.object({
            exercises: z.array(z.object({
                exerciseId: z.string(),
                sets: z.array(z.object({
                    weight: z.number().min(0).optional(),
                    reps: z.number().int().min(0).optional(),
                    duration: z.number().min(0).optional(),
                    distance: z.number().min(0).optional(),
                    restTime: z.number().min(0).optional(),
                    notes: z.string().optional(),
                    completed: z.boolean().default(false)
                })).min(1, 'At least one set is required')
            })).min(1, 'At least one exercise is required')
        }),
        notes: z.string().optional()
    })
});

// Complete set schema
const completeSetSchema = z.object({
    body: z.object({
        exerciseIndex: z.number().int().min(0),
        setIndex: z.number().int().min(0),
        weight: z.number().min(0).optional(),
        reps: z.number().int().min(0).optional(),
        duration: z.number().min(0).optional(),
        distance: z.number().min(0).optional(),
        notes: z.string().optional()
    })
});

// Query params for workout history
const getWorkoutHistorySchema = z.object({
    query: z.object({
        page: z.string().regex(/^\d+$/).transform(Number).optional(),
        limit: z.string().regex(/^\d+$/).transform(Number).optional(),
        status: z.enum(['planned', 'in_progress', 'completed', 'cancelled']).optional(),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional()
    })
});

module.exports = {
    createWorkoutSchema,
    completeSetSchema,
    getWorkoutHistorySchema
};
