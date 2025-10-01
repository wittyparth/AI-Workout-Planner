/**
 * Exercise Service
 * Business logic for exercise data management
 */

const path = require('path');
const FileSystemUtil = require('../utils/fileSystem');
const logger = require('../utils/logger');

class ExerciseService {
    constructor() {
        this.exerciseDataPath = path.join(__dirname, '../data/exercises/sample-exercises.json');
        this.exerciseSchemaPath = path.join(__dirname, '../data/exercises/exercise-schema.js');
        this.exerciseCache = new Map();
        this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Load all exercises from file
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

            // Load from file
            const exercises = await FileSystemUtil.readJsonFile(this.exerciseDataPath);

            // Update cache
            this.exerciseCache.set(cacheKey, {
                data: exercises,
                timestamp: Date.now()
            });

            logger.info(`Loaded ${exercises.length} exercises from file`);
            return exercises;
        } catch (error) {
            logger.error('Failed to load exercises', error);
            throw new Error('Exercise data loading failed');
        }
    }

    /**
     * Get exercise by ID
     * @param {string} exerciseId - Exercise ID to find
     * @returns {Promise<Object|null>} Exercise object or null
     */
    async getExerciseById(exerciseId) {
        try {
            const exercises = await this.loadExercises();
            const exercise = exercises.find(ex => ex.id === exerciseId);

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
     * Search exercises by various criteria
     * @param {Object} criteria - Search criteria
     * @returns {Promise<Array>} Matching exercises
     */
    async searchExercises(criteria = {}) {
        logger.debug('Search criteria:', criteria)

        try {
            const exercises = await this.loadExercises();
            let filteredExercises = [...exercises];

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
                filteredExercises = filteredExercises.filter(exercise => {
                    const allMuscleGroups = [
                        ...exercise.primaryMuscleGroups,
                        ...exercise.secondaryMuscleGroups
                    ];
                    return normalizedCriteria.muscleGroups.some(muscle =>
                        allMuscleGroups.includes(muscle.toLowerCase())
                    );
                });
            }

            // Filter by equipment
            if (normalizedCriteria.equipment && normalizedCriteria.equipment.length > 0) {
                filteredExercises = filteredExercises.filter(exercise => {
                    return normalizedCriteria.equipment.some(equip =>
                        exercise.equipment.includes(equip.toLowerCase())
                    );
                });
            }

            // Filter by difficulty
            if (normalizedCriteria.difficulty) {
                filteredExercises = filteredExercises.filter(exercise =>
                    exercise.difficulty === normalizedCriteria.difficulty.toLowerCase()
                );
            }

            // Filter by exercise type
            if (normalizedCriteria.exerciseType) {
                filteredExercises = filteredExercises.filter(exercise =>
                    exercise.exerciseType === normalizedCriteria.exerciseType.toLowerCase()
                );
            }

            // Text search in name and description
            if (normalizedCriteria.search) {
                const searchTerm = normalizedCriteria.search.toLowerCase();
                filteredExercises = filteredExercises.filter(exercise => {
                    return exercise.name.toLowerCase().includes(searchTerm) ||
                        exercise.description.toLowerCase().includes(searchTerm) ||
                        exercise.alternativeNames.some(name =>
                            name.toLowerCase().includes(searchTerm)
                        );
                });
            }

            // Filter by category
            if (normalizedCriteria.category) {
                filteredExercises = filteredExercises.filter(exercise =>
                    exercise.category === normalizedCriteria.category.toLowerCase()
                );
            }

            // Apply pagination
            const page = parseInt(normalizedCriteria.page) || 1;
            const limit = parseInt(normalizedCriteria.limit) || 20;
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;

            const paginatedExercises = filteredExercises.slice(startIndex, endIndex);

            logger.info(`Search returned ${paginatedExercises.length} of ${filteredExercises.length} exercises`);

            return {
                exercises: paginatedExercises,
                pagination: {
                    page,
                    limit,
                    total: filteredExercises.length,
                    totalPages: Math.ceil(filteredExercises.length / limit),
                    hasNext: endIndex < filteredExercises.length,
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
            const exercises = await this.loadExercises();

            const filters = {
                muscleGroups: new Set(),
                equipment: new Set(),
                difficulties: new Set(),
                exerciseTypes: new Set(),
                categories: new Set()
            };

            exercises.forEach(exercise => {
                // Collect muscle groups
                exercise.primaryMuscleGroups.forEach(muscle =>
                    filters.muscleGroups.add(muscle)
                );
                exercise.secondaryMuscleGroups.forEach(muscle =>
                    filters.muscleGroups.add(muscle)
                );

                // Collect equipment
                exercise.equipment.forEach(equip =>
                    filters.equipment.add(equip)
                );

                // Collect other filters
                filters.difficulties.add(exercise.difficulty);
                filters.exerciseTypes.add(exercise.exerciseType);
                if (exercise.category) {
                    filters.categories.add(exercise.category);
                }
            });

            // Convert Sets to sorted Arrays
            return {
                muscleGroups: Array.from(filters.muscleGroups).sort(),
                equipment: Array.from(filters.equipment).sort(),
                difficulties: Array.from(filters.difficulties).sort(),
                exerciseTypes: Array.from(filters.exerciseTypes).sort(),
                categories: Array.from(filters.categories).sort()
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
            const exercises = await this.loadExercises();

            // Generate new ID
            const maxId = Math.max(...exercises.map(ex =>
                parseInt(ex.id.replace('EX', ''))
            ));
            const newId = `EX${String(maxId + 1).padStart(6, '0')}`;

            // Create new exercise object
            const newExercise = {
                ...exerciseData,
                id: newId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                version: '1.0.0'
            };

            // Add to array
            exercises.push(newExercise);

            // Save to file
            await FileSystemUtil.writeJsonFile(this.exerciseDataPath, exercises);

            // Clear cache
            this.exerciseCache.clear();

            logger.info(`Added new exercise: ${newExercise.name} (${newId})`);
            return newExercise;
        } catch (error) {
            logger.error('Failed to add exercise', error);
            throw error;
        }
    }

    /**
     * Update existing exercise
     * @param {string} exerciseId - Exercise ID to update
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object|null>} Updated exercise or null
     */
    async updateExercise(exerciseId, updateData) {
        try {
            const exercises = await this.loadExercises();
            const exerciseIndex = exercises.findIndex(ex => ex.id === exerciseId);

            if (exerciseIndex === -1) {
                logger.warn(`Exercise not found for update: ${exerciseId}`);
                return null;
            }

            // Update exercise
            exercises[exerciseIndex] = {
                ...exercises[exerciseIndex],
                ...updateData,
                updatedAt: new Date().toISOString()
            };

            // Save to file
            await FileSystemUtil.writeJsonFile(this.exerciseDataPath, exercises);

            // Clear cache
            this.exerciseCache.clear();

            logger.info(`Updated exercise: ${exerciseId}`);
            return exercises[exerciseIndex];
        } catch (error) {
            logger.error(`Failed to update exercise: ${exerciseId}`, error);
            throw error;
        }
    }

    /**
     * Delete exercise
     * @param {string} exerciseId - Exercise ID to delete
     * @returns {Promise<boolean>} Success status
     */
    async deleteExercise(exerciseId) {
        try {
            const exercises = await this.loadExercises();
            const exerciseIndex = exercises.findIndex(ex => ex.id === exerciseId);

            if (exerciseIndex === -1) {
                logger.warn(`Exercise not found for deletion: ${exerciseId}`);
                return false;
            }

            // Remove from array
            exercises.splice(exerciseIndex, 1);

            // Save to file
            await FileSystemUtil.writeJsonFile(this.exerciseDataPath, exercises);

            // Clear cache
            this.exerciseCache.clear();

            logger.info(`Deleted exercise: ${exerciseId}`);
            return true;
        } catch (error) {
            logger.error(`Failed to delete exercise: ${exerciseId}`, error);
            throw error;
        }
    }

    /**
     * Get exercise statistics
     * @returns {Promise<Object>} Exercise library statistics
     */
    async getExerciseStats() {
        try {
            const exercises = await this.loadExercises();

            const stats = {
                totalExercises: exercises.length,
                byDifficulty: {},
                byEquipment: {},
                byMuscleGroup: {},
                byCategory: {}
            };

            exercises.forEach(exercise => {
                // Count by difficulty
                stats.byDifficulty[exercise.difficulty] =
                    (stats.byDifficulty[exercise.difficulty] || 0) + 1;

                // Count by equipment
                exercise.equipment.forEach(equip => {
                    stats.byEquipment[equip] = (stats.byEquipment[equip] || 0) + 1;
                });

                // Count by muscle group
                exercise.primaryMuscleGroups.forEach(muscle => {
                    stats.byMuscleGroup[muscle] = (stats.byMuscleGroup[muscle] || 0) + 1;
                });

                // Count by category
                if (exercise.category) {
                    stats.byCategory[exercise.category] =
                        (stats.byCategory[exercise.category] || 0) + 1;
                }
            });

            return stats;
        } catch (error) {
            logger.error('Failed to get exercise statistics', error);
            throw error;
        }
    }
}

module.exports = new ExerciseService();