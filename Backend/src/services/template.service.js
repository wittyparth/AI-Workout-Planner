const Template = require('../models/template.models');
const Exercise = require('../models/exercise.models');
const aiService = require('./ai.service');
const logger = require('../utils/logger');
const { AppError } = require('../utils/errors');

/**
 * Template Service - Business logic for workout templates
 */
class TemplateService {
    /**
     * Create a new template
     */
    async createTemplate(userId, templateData) {
        try {
            // Enrich exercises with database data
            const enrichedExercises = await this._enrichExercises(templateData.exercises || []);

            const template = new Template({
                name: templateData.name,
                description: templateData.description,
                createdBy: userId,
                metadata: templateData.metadata || {},
                exercises: enrichedExercises,
                weeklyPlan: templateData.weeklyPlan || {},
                sharing: {
                    isPublic: templateData.isPublic || false,
                    category: templateData.category
                },
                aiGenerated: templateData.aiGenerated || { isAIGenerated: false }
            });

            await template.save();

            logger.info(`Template created: ${template._id} by user: ${userId}`);
            return template;

        } catch (error) {
            logger.error('Error creating template:', error);
            throw new AppError(`Failed to create template: ${error.message}`, 500);
        }
    }

    /**
     * Generate template using AI
     */
    async generateAITemplate(userId, preferences) {
        try {
            logger.info(`Generating AI template for user: ${userId}`);

            // Generate workout using AI service
            const aiResult = await aiService.generateWorkout(userId, preferences);

            if (!aiResult.success) {
                throw new AppError('Failed to generate AI workout', 500);
            }

            // Create template from AI-generated workout
            const templateData = {
                name: aiResult.workout.name,
                description: aiResult.workout.description || aiResult.workout.coachNotes,
                metadata: {
                    difficulty: aiResult.workout.difficulty,
                    duration: aiResult.workout.estimatedDuration,
                    goal: preferences.workoutType || 'general_fitness',
                    primaryMuscles: aiResult.workout.targetMuscles || [],
                    equipment: preferences.equipment || [],
                    estimatedCalories: aiResult.workout.estimatedCalories
                },
                exercises: aiResult.workout.exercises,
                aiGenerated: {
                    isAIGenerated: true,
                    generationPrompt: JSON.stringify(preferences),
                    generatedAt: new Date(),
                    aiVersion: '1.0',
                    aiModel: aiResult.aiMetadata.model
                },
                sharing: {
                    isPublic: false
                }
            };

            const template = await this.createTemplate(userId, templateData);

            return {
                template,
                aiMetadata: aiResult.aiMetadata,
                warmup: aiResult.workout.warmup,
                cooldown: aiResult.workout.cooldown,
                coachNotes: aiResult.workout.coachNotes
            };

        } catch (error) {
            logger.error('Error generating AI template:', error);
            throw new AppError(`Failed to generate AI template: ${error.message}`, 500);
        }
    }

    /**
     * Get template by ID
     */
    async getTemplateById(templateId, userId = null) {
        const template = await Template.findById(templateId)
            .populate('createdBy', 'profile.firstName profile.lastName username')
            .populate('exercises.exerciseId', 'name difficulty primaryMuscleGroups equipment media');

        if (!template) {
            throw new AppError('Template not found', 404);
        }

        // Check access permissions
        if (!template.sharing.isPublic && userId && template.createdBy._id.toString() !== userId.toString()) {
            throw new AppError('You do not have permission to access this template', 403);
        }

        return template;
    }

    /**
     * Get templates with filters
     */
    async getTemplates(options = {}) {
        const {
            userId,
            page = 1,
            limit = 10,
            difficulty,
            goal,
            isPublic,
            isFeatured,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = options;

        const query = { isActive: true };

        // User's own templates OR public templates
        if (userId && !isPublic) {
            query.createdBy = userId;
        } else if (isPublic) {
            query['sharing.isPublic'] = true;
        }

        if (difficulty) query['metadata.difficulty'] = difficulty;
        if (goal) query['metadata.goal'] = goal;
        if (isFeatured) query['sharing.isFeatured'] = true;

        if (search) {
            query.$or = [
                { name: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
                { 'metadata.tags': new RegExp(search, 'i') }
            ];
        }

        const skip = (page - 1) * limit;
        const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

        const [templates, total] = await Promise.all([
            Template.find(query)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)
                .populate('createdBy', 'profile.firstName profile.lastName username')
                .lean(),
            Template.countDocuments(query)
        ]);

        return {
            templates,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit
            }
        };
    }

    /**
     * Get featured templates
     */
    async getFeaturedTemplates(limit = 10) {
        const templates = await Template.find({
            'sharing.isPublic': true,
            'sharing.isFeatured': true,
            isActive: true
        })
            .sort({ 'sharing.featuredOrder': 1, 'stats.usageCount': -1 })
            .limit(limit)
            .populate('createdBy', 'profile.firstName profile.lastName username');

        return templates;
    }

    /**
     * Update template
     */
    async updateTemplate(templateId, userId, updateData) {
        const template = await Template.findOne({ _id: templateId, createdBy: userId });

        if (!template) {
            throw new AppError('Template not found or you do not have permission to update it', 404);
        }

        // Update fields
        if (updateData.name) template.name = updateData.name;
        if (updateData.description) template.description = updateData.description;
        if (updateData.metadata) template.metadata = { ...template.metadata, ...updateData.metadata };
        if (updateData.exercises) template.exercises = await this._enrichExercises(updateData.exercises);
        if (updateData.isPublic !== undefined) template.sharing.isPublic = updateData.isPublic;

        template.version += 1;

        await template.save();

        logger.info(`Template updated: ${templateId}`);
        return template;
    }

    /**
     * Delete template
     */
    async deleteTemplate(templateId, userId) {
        const template = await Template.findOneAndDelete({ _id: templateId, createdBy: userId });

        if (!template) {
            throw new AppError('Template not found or you do not have permission to delete it', 404);
        }

        logger.info(`Template deleted: ${templateId}`);
        return { success: true, message: 'Template deleted successfully' };
    }

    /**
     * Duplicate template
     */
    async duplicateTemplate(templateId, userId) {
        const originalTemplate = await this.getTemplateById(templateId);

        const duplicateData = {
            name: `${originalTemplate.name} (Copy)`,
            description: originalTemplate.description,
            metadata: originalTemplate.metadata,
            exercises: originalTemplate.exercises.map(e => ({
                exerciseId: e.exerciseId,
                order: e.order,
                sets: e.sets,
                reps: e.reps,
                restTime: e.restTime,
                notes: e.notes
            })),
            sharing: { isPublic: false }
        };

        const duplicate = await this.createTemplate(userId, duplicateData);

        logger.info(`Template duplicated: ${templateId} -> ${duplicate._id}`);
        return duplicate;
    }

    /**
     * Add template to favorites (user model tracking)
     */
    async toggleFavorite(templateId, userId) {
        const template = await Template.findById(templateId);

        if (!template) {
            throw new AppError('Template not found', 404);
        }

        // This would typically update a user's favorites array
        // For now, just increment/decrement the template's favorite count
        await template.addFavorite();

        return { success: true, isFavorite: true };
    }

    /**
     * Rate a template
     */
    async rateTemplate(templateId, userId, rating) {
        if (rating < 1 || rating > 5) {
            throw new AppError('Rating must be between 1 and 5', 400);
        }

        const template = await Template.findById(templateId);

        if (!template) {
            throw new AppError('Template not found', 404);
        }

        await template.updateRating(rating);

        return { success: true, newRating: template.stats.averageRating };
    }

    /**
     * Enrich exercises with database data
     * @private
     */
    async _enrichExercises(exercises) {
        return Promise.all(exercises.map(async (exercise) => {
            if (exercise.exerciseId) {
                const dbExercise = await Exercise.findById(exercise.exerciseId);
                if (dbExercise) {
                    return {
                        ...exercise,
                        exerciseName: dbExercise.name
                    };
                }
            }
            return exercise;
        }));
    }
}

module.exports = new TemplateService();
