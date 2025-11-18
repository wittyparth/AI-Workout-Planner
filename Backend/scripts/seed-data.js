/**
 * Exercise Data Seeder
 * Script to populate exercise database with sample data
 */

const path = require('path');
const FileSystemUtil = require('../src/utils/fileSystem');
const logger = require('../src/utils/logger');

const additionalExercises = [
    {
        "id": "EX000004",
        "name": "Plank",
        "alternativeNames": ["Standard Plank", "Front Plank"],
        "description": "An isometric core exercise that strengthens the entire core, shoulders, and glutes while improving stability.",
        "primaryMuscleGroups": ["abs", "shoulders"],
        "secondaryMuscleGroups": ["glutes", "back"],
        "equipment": ["bodyweight"],
        "difficulty": "beginner",
        "exerciseType": "strength",
        "mechanics": "isolation",
        "instructions": [
            "Start in push-up position with forearms on the ground",
            "Keep your body in straight line from head to heels",
            "Engage your core and hold the position",
            "Breathe normally while maintaining the position",
            "Hold for the prescribed duration"
        ],
        "defaultSets": 3,
        "defaultReps": { "min": 30, "max": 60 },
        "defaultRestTime": 60,
        "tags": ["core", "isometric", "beginner-friendly"],
        "category": "core",
        "calories": { "perMinute": 5, "perRep": 0.1 },
        "isActive": true,
        "createdAt": "2025-09-22T00:00:00Z",
        "updatedAt": "2025-09-22T00:00:00Z",
        "version": "1.0.0"
    },
    {
        "id": "EX000005",
        "name": "Burpee",
        "alternativeNames": ["Squat Thrust", "Full Body Burpee"],
        "description": "A full-body exercise that combines a squat, plank, push-up, and jump for maximum calorie burn and conditioning.",
        "primaryMuscleGroups": ["quadriceps", "chest", "shoulders"],
        "secondaryMuscleGroups": ["triceps", "abs", "calves", "glutes"],
        "equipment": ["bodyweight"],
        "difficulty": "intermediate",
        "exerciseType": "strength",
        "mechanics": "compound",
        "instructions": [
            "Start standing with feet shoulder-width apart",
            "Squat down and place hands on the floor",
            "Jump feet back into plank position",
            "Perform a push-up (optional)",
            "Jump feet back to squat position",
            "Explode up with arms overhead"
        ],
        "defaultSets": 3,
        "defaultReps": { "min": 5, "max": 15 },
        "defaultRestTime": 90,
        "tags": ["full-body", "cardio", "high-intensity"],
        "category": "full_body",
        "calories": { "perMinute": 12, "perRep": 1.5 },
        "isActive": true,
        "createdAt": "2025-09-22T00:00:00Z",
        "updatedAt": "2025-09-22T00:00:00Z",
        "version": "1.0.0"
    }
];

async function seedExercises() {
    try {
        logger.info('Starting exercise data seeding...');

        const exerciseDataPath = path.join(__dirname, '../src/data/exercises/sample-exercises.json');

        // Read existing exercises
        const existingExercises = await FileSystemUtil.readJsonFile(exerciseDataPath);
        // Combine with additional exercises
        const allExercises = [...existingExercises, ...additionalExercises];

        // Write back to file
        await FileSystemUtil.writeJsonFile(exerciseDataPath, allExercises);

        logger.info(`Successfully seeded ${allExercises.length} exercises`);

        // Display statistics
        const stats = {
            total: allExercises.length,
            byDifficulty: {},
            byType: {}
        };

        allExercises.forEach(exercise => {
            stats.byDifficulty[exercise.difficulty] = (stats.byDifficulty[exercise.difficulty] || 0) + 1;
            stats.byType[exercise.exerciseType] = (stats.byType[exercise.exerciseType] || 0) + 1;
        });

        console.log('\n=== Exercise Library Statistics ===');
        console.log(`Total Exercises: ${stats.total}`);
        console.log('\nBy Difficulty:');
        Object.entries(stats.byDifficulty).forEach(([difficulty, count]) => {
            console.log(`  ${difficulty}: ${count}`);
        });
        console.log('\nBy Type:');
        Object.entries(stats.byType).forEach(([type, count]) => {
            console.log(`  ${type}: ${count}`);
        });

    } catch (error) {
        logger.error('Failed to seed exercise data', error);
        process.exit(1);
    }
}

// Run seeding if script is executed directly
if (require.main === module) {
    seedExercises();
}

module.exports = seedExercises;