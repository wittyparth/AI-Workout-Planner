const { z } = require('zod');

/**
 * AI validation schemas
 */

// Generate workout schema
const generateWorkoutSchema = z.object({
    body: z.object({
        goal: z.enum(['strength', 'hypertrophy', 'endurance', 'weight_loss', 'general_fitness']),
        fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced']),
        equipment: z.array(z.string()).min(1, 'At least one equipment type is required'),
        duration: z.number().int().min(10).max(180),
        targetMuscleGroups: z.array(z.string()).optional(),
        excludeExercises: z.array(z.string()).optional(),
        preferences: z.string().optional()
    })
});

// Suggest exercises schema
const suggestExercisesSchema = z.object({
    body: z.object({
        exerciseId: z.string().min(1, 'Exercise ID is required'),
        criteria: z.object({
            reason: z.string().optional(),
            equipment: z.array(z.string()).optional(),
            difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
            targetMuscleGroups: z.array(z.string()).optional()
        }).optional()
    })
});

// Analyze progress schema
const analyzeProgressSchema = z.object({
    body: z.object({
        timeframe: z.enum(['week', 'month', 'quarter', 'year']).default('month'),
        focusAreas: z.array(z.enum(['strength', 'volume', 'frequency', 'consistency', 'bodyMetrics'])).optional()
    })
});

// Optimize goals schema
const optimizeGoalsSchema = z.object({
    body: z.object({
        goalIds: z.array(z.string()).optional(),
        priority: z.enum(['aggressive', 'moderate', 'conservative']).default('moderate')
    })
});

// AI chat schema
const aiChatSchema = z.object({
    body: z.object({
        message: z.string().min(1).max(1000),
        context: z.enum(['workout', 'nutrition', 'recovery', 'general']).optional()
    })
});

module.exports = {
    generateWorkoutSchema,
    suggestExercisesSchema,
    analyzeProgressSchema,
    optimizeGoalsSchema,
    aiChatSchema
};
