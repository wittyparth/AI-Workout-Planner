const mongoose = require('mongoose');
const exerciseService = require('./src/services/exercise.service');

async function testExerciseService() {
    try {
        await mongoose.connect('mongodb://localhost:27017/fit-ai');
        console.log('📊 Testing Exercise Service Migration\n');

        // Test 1: Search exercises
        const result = await exerciseService.searchExercises({ limit: 5 });
        console.log(`✅ Total exercises in database: ${result.pagination.total}`);
        console.log(`   Returned: ${result.exercises.length} exercises\n`);

        // Test 2: Sample exercises
        console.log('📋 Sample Exercises:');
        result.exercises.slice(0, 3).forEach((ex, i) => {
            console.log(`   ${i + 1}. ${ex.name}`);
            console.log(`      ID: ${ex._id}`);
            console.log(`      Difficulty: ${ex.difficulty}`);
            console.log(`      Equipment: ${ex.equipment.join(', ')}\n`);
        });

        // Test 3: Get by ID
        if (result.exercises.length > 0) {
            const firstExercise = await exerciseService.getExerciseById(result.exercises[0]._id);
            console.log(`✅ Get by ID test: ${firstExercise ? 'SUCCESS' : 'FAILED'}\n`);
        }

        // Test 4: Get filters
        const filters = await exerciseService.getExerciseFilters();
        console.log('🔍 Available Filters:');
        console.log(`   Muscle Groups: ${filters.muscleGroups.length}`);
        console.log(`   Equipment Types: ${filters.equipment.length}`);
        console.log(`   Difficulties: ${filters.difficulties.join(', ')}\n`);

        // Test 5: Get stats
        const stats = await exerciseService.getExerciseStats();
        console.log('📈 Exercise Statistics:');
        console.log(`   Total: ${stats.totalExercises}`);
        console.log(`   By Difficulty:`, stats.byDifficulty);
        console.log(`   Top Equipment:`, Object.entries(stats.byEquipment).slice(0, 3));

        console.log('\n✅ Exercise Service Migration Complete!');
        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error(error.stack);
        await mongoose.disconnect();
        process.exit(1);
    }
}

testExerciseService();
