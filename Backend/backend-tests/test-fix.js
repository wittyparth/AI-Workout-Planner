// Quick test to verify the fix
const exerciseService = require('./src/services/exercise.service');

async function testSearchExercises() {
    try {
        console.log('Testing exercise search with equipment filter...');

        // Simulate the query that was causing the error
        const criteria = {
            equipment: 'bodyweight,barbell'
        };

        const result = await exerciseService.searchExercises(criteria);
        console.log('Success! Found', result.exercises.length, 'exercises');
        console.log('Sample exercise:', result.exercises[0]?.name);

    } catch (error) {
        console.error('Test failed:', error.message);
        console.error(error.stack);
    }
}

testSearchExercises();