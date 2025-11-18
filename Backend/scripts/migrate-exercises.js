require('dotenv').config();
const mongoose = require('mongoose');
const Exercise = require('../src/models/exercise.models');
const exercisesData = require('../src/data/exercises/sample-exercises.json');
const config = require('../src/config/environment');
const logger = require('../src/utils/logger');

/**
 * Migration script to import exercises from JSON to MongoDB
 * Run with: node scripts/migrate-exercises.js
 */

async function migrateExercises() {
    try {
        // Connect to MongoDB
        logger.info('Connecting to MongoDB...');
        await mongoose.connect(config.MONGODB_URI);
        logger.info('✅ Connected to MongoDB');

        // Check if exercises already exist
        const existingCount = await Exercise.countDocuments();

        if (existingCount > 0) {
            logger.warn(`⚠️  Found ${existingCount} existing exercises in database`);

            // Always delete to ensure clean migration with correct indexes
            logger.info('Deleting existing exercises and dropping all indexes...');
            await Exercise.collection.dropIndexes(); // Drop all indexes first
            await Exercise.collection.drop();
            logger.info('✅ Existing exercises and indexes deleted');
        } else {
            // Even if no documents, drop indexes to start fresh
            try {
                await Exercise.collection.dropIndexes();
                logger.info('✅ Dropped existing indexes');
            } catch (err) {
                // Ignore error if collection doesn't exist yet
                logger.info('No existing indexes to drop');
            }
        }

        // Transform and import exercises
        logger.info(`Starting migration of ${exercisesData.length} exercises...`);

        const exercises = exercisesData.map(exercise => {
            // Map category to movement pattern
            const categoryToMovement = {
                'push': 'push',
                'pull': 'pull',
                'legs': 'squat',
                'core': 'isometric',
                'full_body': 'rotation'
            };

            return {
                name: exercise.name,
                alternativeNames: exercise.alternativeNames || [],
                description: exercise.description,
                instructions: exercise.instructions || [],
                setupInstructions: exercise.setupInstructions || [],
                primaryMuscleGroups: exercise.primaryMuscleGroups || [],
                secondaryMuscleGroups: exercise.secondaryMuscleGroups || [],
                equipment: exercise.equipment || [],
                difficulty: exercise.difficulty || 'beginner',
                exerciseType: exercise.exerciseType || 'strength',
                mechanics: exercise.mechanics || 'compound',
                movementPattern: categoryToMovement[exercise.category] || 'push',
                tags: [
                    ...exercise.tags || [],
                    ...(exercise.primaryMuscleGroups || []),
                    ...(exercise.equipment || []),
                    exercise.category,
                    exercise.difficulty
                ].filter(Boolean),
                media: {
                    images: exercise.media?.images || [],
                    videos: exercise.media?.videos || [],
                    gifs: exercise.media?.gifs || []
                },
                metrics: {
                    averageRating: 0,
                    totalRatings: 0,
                    popularityScore: 0,
                    usageCount: 0
                },
                variations: (exercise.variations || []).map(v => ({
                    name: v.name,
                    description: v.description,
                    difficulty: v.difficulty === 'easier' ? 'beginner' : v.difficulty === 'harder' ? 'advanced' : 'intermediate',
                    instructions: v.instructions || []
                })),
                safety: {
                    warnings: exercise.warnings || [],
                    commonMistakes: exercise.commonMistakes || [],
                    tips: exercise.tips || []
                },
                calories: {
                    perMinute: exercise.calories?.perMinute || calculateCaloriesPerMinute(exercise.exerciseType, exercise.difficulty),
                    perRep: exercise.calories?.perRep || 0.5,
                    baseRate: 5
                },
                defaultSets: exercise.defaultSets || getDefaultSets(exercise.exerciseType),
                defaultReps: exercise.defaultReps || getDefaultReps(exercise.exerciseType, exercise.difficulty),
                defaultRestTime: exercise.defaultRestTime || getDefaultRestTime(exercise.exerciseType, exercise.difficulty),
                isActive: exercise.isActive !== false,
                createdBy: null // System-created exercises
            };
        });

        // Bulk insert exercises
        logger.info('Inserting exercises into database...');
        logger.info(`Prepared ${exercises.length} exercises for insertion`);

        // Log first exercise for debugging
        if (exercises.length > 0) {
            logger.info('Sample exercise:', JSON.stringify(exercises[0], null, 2));
        }

        try {
            const inserted = await Exercise.insertMany(exercises, { ordered: false });
            logger.info(`✅ Successfully migrated ${inserted.length} exercises`);
        } catch (error) {
            if (error.writeErrors) {
                logger.error(`Insertion errors: ${error.writeErrors.length} failed`);
                error.writeErrors.forEach(err => {
                    logger.error(`Error on exercise: ${JSON.stringify(err.err)}`);
                });
            } else {
                logger.error('Insertion error:', error.message);
                throw error;
            }
        }

        // Create indexes (with autoIndex:false to avoid parallel array issues)
        logger.info('Creating indexes...');
        await Exercise.syncIndexes(); // Use syncIndexes instead of createIndexes
        logger.info('✅ Indexes created');

        // Display statistics
        const stats = await getExerciseStatistics();
        logger.info('\n📊 Migration Statistics:');
        logger.info(`Total Exercises: ${stats.total}`);
        logger.info(`By Difficulty:`);
        logger.info(`  - Beginner: ${stats.byDifficulty.beginner || 0}`);
        logger.info(`  - Intermediate: ${stats.byDifficulty.intermediate || 0}`);
        logger.info(`  - Advanced: ${stats.byDifficulty.advanced || 0}`);
        logger.info(`By Equipment:`);
        Object.entries(stats.byEquipment).slice(0, 5).forEach(([eq, count]) => {
            logger.info(`  - ${eq}: ${count}`);
        });

        logger.info('\n✅ Migration completed successfully!');
        process.exit(0);

    } catch (error) {
        logger.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

/**
 * Helper function to calculate calories per minute based on exercise type and difficulty
 */
function calculateCaloriesPerMinute(category, level) {
    const baseCalories = {
        strength: 6,
        cardio: 8,
        flexibility: 3,
        plyometric: 10,
        powerlifting: 7,
        olympic_weightlifting: 9
    };

    const difficultyMultiplier = {
        beginner: 0.8,
        intermediate: 1.0,
        advanced: 1.2
    };

    const base = baseCalories[category] || 5;
    const multiplier = difficultyMultiplier[level] || 1.0;

    return Math.round(base * multiplier * 10) / 10;
}

/**
 * Helper function to get default sets based on exercise category
 */
function getDefaultSets(category) {
    const defaultSets = {
        strength: 3,
        cardio: 1,
        flexibility: 2,
        plyometric: 3,
        powerlifting: 5,
        olympic_weightlifting: 4
    };

    return defaultSets[category] || 3;
}

/**
 * Helper function to get default reps based on category and difficulty
 */
function getDefaultReps(category, level) {
    if (category === 'cardio') {
        return { min: 1, max: 1, target: 1 }; // Duration-based
    }

    if (category === 'flexibility') {
        return { min: 15, max: 30, target: 20 }; // Seconds
    }

    const repRanges = {
        beginner: { min: 8, max: 12, target: 10 },
        intermediate: { min: 10, max: 15, target: 12 },
        advanced: { min: 12, max: 15, target: 12 }
    };

    return repRanges[level] || { min: 8, max: 12, target: 10 };
}

/**
 * Helper function to get default rest time based on category and difficulty
 */
function getDefaultRestTime(category, level) {
    const restTimes = {
        cardio: 30,
        flexibility: 15,
        strength: level === 'advanced' ? 90 : 60,
        powerlifting: 180,
        olympic_weightlifting: 120,
        plyometric: 60
    };

    return restTimes[category] || 60;
}

/**
 * Get exercise statistics for reporting
 */
async function getExerciseStatistics() {
    const total = await Exercise.countDocuments();

    const byDifficulty = await Exercise.aggregate([
        { $group: { _id: '$difficulty', count: { $sum: 1 } } }
    ]);

    const byEquipment = await Exercise.aggregate([
        { $unwind: '$equipment' },
        { $group: { _id: '$equipment', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);

    return {
        total,
        byDifficulty: byDifficulty.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {}),
        byEquipment: byEquipment.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {})
    };
}

// Run migration
if (require.main === module) {
    migrateExercises();
}

module.exports = migrateExercises;
