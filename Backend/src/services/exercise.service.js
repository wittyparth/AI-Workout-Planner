const logger = require('../utils/logger');
const Exercise = require('../models/exercise.models');

class ExerciseService {
    constructor() {
        this.exerciseCache = new Map();
        this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Load all exercises from database
     * @returns {Promise<Array>} Array of exercise objects
     */
    async loadExercises() {
        try {
            // Check cache first
            const cacheKey = 'all_exercises';
            const cached = this.exerciseCache.get(cacheKey);

            if (cached && (Date.now() - cached.timestamp) < this.cacheExpiry) {
                logger.debug('Returning cached exercises');
                return cached.data;
            }

            // Load from database
            const exercises = await Exercise.find({ isActive: true })
                .select('-__v')
                .lean();

            // Update cache
            this.exerciseCache.set(cacheKey, {
                data: exercises,
                timestamp: Date.now()
            });

            logger.info(`Loaded ${exercises.length} exercises from database`);
            return exercises;
        } catch (error) {
            logger.error('Failed to load exercises', error);
            throw new Error('Exercise data loading failed');
        }
    }

    /**
     * Get exercise by ID (MongoDB _id)
     * @param {string} exerciseId - MongoDB ObjectId
     * @returns {Promise<Object|null>} Exercise object or null
     */
    async getExerciseById(exerciseId) {
        try {
            const exercise = await Exercise.findById(exerciseId)
                .select('-__v')
                .lean();

            if (!exercise) {
                logger.warn(`Exercise not found: ${exerciseId}`);
                return null;
            }

            return exercise;
        } catch (error) {
            logger.error(`Failed to get exercise by ID: ${exerciseId}`, error);
            throw error;
        }
    }

    /**
     * Search exercises by various criteria using MongoDB
     * @param {Object} criteria - Search criteria
     * @returns {Promise<Object>} Matching exercises with pagination
     */
    async searchExercises(criteria = {}) {
        logger.debug('Search criteria:', criteria)

        try {
            // Build MongoDB query
            const query = { isActive: true };

            // Process and normalize criteria
            const normalizedCriteria = { ...criteria };

            // Convert comma-separated strings to arrays
            if (normalizedCriteria.equipment && typeof normalizedCriteria.equipment === 'string') {
                normalizedCriteria.equipment = normalizedCriteria.equipment.split(',').map(item => item.trim());
            }
            if (normalizedCriteria.muscleGroups && typeof normalizedCriteria.muscleGroups === 'string') {
                normalizedCriteria.muscleGroups = normalizedCriteria.muscleGroups.split(',').map(item => item.trim());
            }

            // Filter by muscle groups
            if (normalizedCriteria.muscleGroups && normalizedCriteria.muscleGroups.length > 0) {
                query.$or = [
                    { primaryMuscleGroups: { $in: normalizedCriteria.muscleGroups.map(m => m.toLowerCase()) } },
                    { secondaryMuscleGroups: { $in: normalizedCriteria.muscleGroups.map(m => m.toLowerCase()) } }
                ];
            }

            // Filter by equipment
            if (normalizedCriteria.equipment && normalizedCriteria.equipment.length > 0) {
                query.equipment = { $in: normalizedCriteria.equipment.map(e => e.toLowerCase()) };
            }

            // Filter by difficulty
            if (normalizedCriteria.difficulty) {
                query.difficulty = normalizedCriteria.difficulty.toLowerCase();
            }

            // Filter by exercise type
            if (normalizedCriteria.exerciseType) {
                query.exerciseType = normalizedCriteria.exerciseType.toLowerCase();
            }

            // Filter by category
            if (normalizedCriteria.category) {
                query.category = normalizedCriteria.category.toLowerCase();
            }

            // Text search in name and description
            if (normalizedCriteria.search) {
                const searchTerm = normalizedCriteria.search;
                query.$text = { $search: searchTerm };
            }

            // Apply pagination
            logger.debug(`page - ${normalizedCriteria.page}, limit - ${normalizedCriteria.limit}`);
            const page = parseInt(normalizedCriteria.page) || 1;
            const limit = parseInt(normalizedCriteria.limit) || 10;
            const skip = (page - 1) * limit;

            logger.debug(`skip - ${skip}, limit - ${limit}`);

            // Execute query with pagination
            const [exercises, total] = await Promise.all([
                Exercise.find(query)
                    .select('-__v')
                    .limit(limit)
                    .skip(skip)
                    .lean(),
                Exercise.countDocuments(query)
            ]);

            logger.info(`Search returned ${exercises.length} of ${total} exercises`);

            return {
                exercises,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                    hasNext: skip + limit < total,
                    hasPrev: page > 1
                }
            };
        } catch (error) {
            logger.error('Failed to search exercises', error);
            throw error;
        }
    }

    /**
     * Get exercise categories and muscle groups for filtering
     * @returns {Promise<Object>} Available filter options
     */
    async getExerciseFilters() {
        try {
            // Use MongoDB aggregation to get distinct values
            const [muscleGroups, equipment, difficulties, exerciseTypes, categories] = await Promise.all([
                Exercise.distinct('primaryMuscleGroups', { isActive: true }),
                Exercise.distinct('equipment', { isActive: true }),
                Exercise.distinct('difficulty', { isActive: true }),
                Exercise.distinct('exerciseType', { isActive: true }),
                Exercise.distinct('category', { isActive: true })
            ]);

            return {
                muscleGroups: muscleGroups.sort(),
                equipment: equipment.sort(),
                difficulties: difficulties.sort(),
                exerciseTypes: exerciseTypes.sort(),
                categories: categories.filter(c => c).sort() // Filter out null/undefined
            };
        } catch (error) {
            logger.error('Failed to get exercise filters', error);
            throw error;
        }
    }

    /**
     * Add new exercise to the database
     * @param {Object} exerciseData - New exercise data
     * @returns {Promise<Object>} Created exercise
     */
    async addExercise(exerciseData) {
        try {
            // Create slug from name if not provided
            if (!exerciseData.slug) {
                exerciseData.slug = exerciseData.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '');
            }

            const newExercise = await Exercise.create(exerciseData);

            // Clear cache
            this.exerciseCache.clear();

            logger.info(`Added new exercise: ${newExercise.name} (${newExercise._id})`);
            return newExercise.toObject();
        } catch (error) {
            logger.error('Failed to add exercise', error);
            throw error;
        }
    }

    /**
     * Update existing exercise
     * @param {string} exerciseId - MongoDB ObjectId
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object|null>} Updated exercise or null
     */
    async updateExercise(exerciseId, updateData) {
        try {
            const updatedExercise = await Exercise.findByIdAndUpdate(
                exerciseId,
                { ...updateData, updatedAt: new Date() },
                { new: true, runValidators: true }
            ).lean();

            if (!updatedExercise) {
                logger.warn(`Exercise not found for update: ${exerciseId}`);
                return null;
            }

            // Clear cache
            this.exerciseCache.clear();

            logger.info(`Updated exercise: ${exerciseId}`);
            return updatedExercise;
        } catch (error) {
            logger.error(`Failed to update exercise: ${exerciseId}`, error);
            throw error;
        }
    }

    /**
     * Delete exercise (soft delete by setting isActive to false)
     * @param {string} exerciseId - MongoDB ObjectId
     * @returns {Promise<boolean>} Success status
     */
    async deleteExercise(exerciseId) {
        try {
            const result = await Exercise.findByIdAndUpdate(
                exerciseId,
                { isActive: false, updatedAt: new Date() },
                { new: true }
            );

            if (!result) {
                logger.warn(`Exercise not found for deletion: ${exerciseId}`);
                return false;
            }

            // Clear cache
            this.exerciseCache.clear();

            logger.info(`Deleted (soft) exercise: ${exerciseId}`);
            return true;
        } catch (error) {
            logger.error(`Failed to delete exercise: ${exerciseId}`, error);
            throw error;
        }
    }

    /**
     * Get exercise statistics using MongoDB aggregation
     * @returns {Promise<Object>} Exercise library statistics
     */
    async getExerciseStats() {
        try {
            const [
                totalCount,
                byDifficulty,
                byEquipment,
                byMuscleGroup,
                byCategory
            ] = await Promise.all([
                Exercise.countDocuments({ isActive: true }),
                Exercise.aggregate([
                    { $match: { isActive: true } },
                    { $group: { _id: '$difficulty', count: { $sum: 1 } } }
                ]),
                Exercise.aggregate([
                    { $match: { isActive: true } },
                    { $unwind: '$equipment' },
                    { $group: { _id: '$equipment', count: { $sum: 1 } } }
                ]),
                Exercise.aggregate([
                    { $match: { isActive: true } },
                    { $unwind: '$primaryMuscleGroups' },
                    { $group: { _id: '$primaryMuscleGroups', count: { $sum: 1 } } }
                ]),
                Exercise.aggregate([
                    { $match: { isActive: true, category: { $ne: null } } },
                    { $group: { _id: '$category', count: { $sum: 1 } } }
                ])
            ]);

            return {
                totalExercises: totalCount,
                byDifficulty: Object.fromEntries(byDifficulty.map(d => [d._id, d.count])),
                byEquipment: Object.fromEntries(byEquipment.map(e => [e._id, e.count])),
                byMuscleGroup: Object.fromEntries(byMuscleGroup.map(m => [m._id, m.count])),
                byCategory: Object.fromEntries(byCategory.map(c => [c._id, c.count]))
            };
        } catch (error) {
            logger.error('Failed to get exercise statistics', error);
            throw error;
        }
    }
}

module.exports = new ExerciseService();