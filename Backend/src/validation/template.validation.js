const { z } = require('zod');

/**
 * Template validation schemas
 */

// Create template schema
const createTemplateSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Template name is required').max(100),
        description: z.string().optional(),
        exercises: z.array(z.object({
            exerciseId: z.string(),
            sets: z.number().int().min(1).max(20),
            reps: z.object({
                min: z.number().int().min(1),
                max: z.number().int().min(1),
                target: z.number().int().min(1)
            }).optional(),
            duration: z.number().min(0).optional(),
            restTime: z.number().min(0).default(60),
            notes: z.string().optional()
        })).min(1, 'At least one exercise is required'),
        difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
        goal: z.enum(['strength', 'hypertrophy', 'endurance', 'weight_loss', 'general_fitness']).optional(),
        equipment: z.array(z.string()).optional(),
        estimatedDuration: z.number().min(0).optional(),
        isPublic: z.boolean().default(false),
        weeklyPlan: z.object({
            monday: z.boolean().default(false),
            tuesday: z.boolean().default(false),
            wednesday: z.boolean().default(false),
            thursday: z.boolean().default(false),
            friday: z.boolean().default(false),
            saturday: z.boolean().default(false),
            sunday: z.boolean().default(false)
        }).optional()
    })
});

// Generate AI template schema
const generateAITemplateSchema = z.object({
    body: z.object({
        goal: z.enum(['strength', 'hypertrophy', 'endurance', 'weight_loss', 'general_fitness']),
        fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced']),
        equipment: z.array(z.string()).min(1, 'At least one equipment type is required'),
        duration: z.number().int().min(10).max(180),
        daysPerWeek: z.number().int().min(1).max(7).optional(),
        targetMuscleGroups: z.array(z.string()).optional(),
        workoutType: z.enum(['full_body', 'upper_lower', 'push_pull_legs', 'bro_split']).optional()
    })
});

// Rate template schema
const rateTemplateSchema = z.object({
    body: z.object({
        rating: z.number().min(1).max(5)
    })
});

// Query params for templates
const getTemplatesSchema = z.object({
    query: z.object({
        page: z.string().regex(/^\d+$/).transform(Number).optional(),
        limit: z.string().regex(/^\d+$/).transform(Number).optional(),
        difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
        goal: z.enum(['strength', 'hypertrophy', 'endurance', 'weight_loss', 'general_fitness']).optional(),
        isPublic: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
        search: z.string().optional()
    })
});

module.exports = {
    createTemplateSchema,
    generateAITemplateSchema,
    rateTemplateSchema,
    getTemplatesSchema
};
