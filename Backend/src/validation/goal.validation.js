const { z } = require('zod');

/**
 * Goal validation schemas
 */

// Create goal schema
const createGoalSchema = z.object({
    body: z.object({
        type: z.enum(['weight_loss', 'muscle_gain', 'strength', 'endurance', 'flexibility', 'custom']),
        title: z.string().min(1, 'Goal title is required').max(100),
        description: z.string().optional(),
        targetValue: z.number().min(0),
        currentValue: z.number().min(0).optional(),
        unit: z.string().min(1, 'Unit is required'),
        deadline: z.string().datetime().optional(),
        relatedExercises: z.array(z.string()).optional(),
        milestones: z.array(z.object({
            percentage: z.number().min(0).max(100),
            title: z.string(),
            reward: z.string().optional()
        })).optional()
    })
});

// Update goal progress schema
const updateGoalProgressSchema = z.object({
    body: z.object({
        currentValue: z.number().min(0),
        notes: z.string().optional()
    })
});

// Add milestone schema
const addMilestoneSchema = z.object({
    body: z.object({
        percentage: z.number().min(0).max(100),
        title: z.string().min(1),
        reward: z.string().optional()
    })
});

// Update goal schema
const updateGoalSchema = z.object({
    body: z.object({
        title: z.string().min(1).max(100).optional(),
        description: z.string().optional(),
        targetValue: z.number().min(0).optional(),
        deadline: z.string().datetime().optional(),
        status: z.enum(['active', 'in_progress', 'completed', 'abandoned']).optional()
    })
});

module.exports = {
    createGoalSchema,
    updateGoalProgressSchema,
    addMilestoneSchema,
    updateGoalSchema
};
