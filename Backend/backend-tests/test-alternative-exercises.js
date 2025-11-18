const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/v1';

async function testAlternativeExercises() {
    console.log('🔄 Testing AI Alternative Exercise Suggestions\n');

    // Register and login
    let token = null;
    try {
        const email = `test${Date.now()}@example.com`;
        const password = 'Test123!@#';
        const username = `testuser${Date.now()}`;

        console.log('📝 Authenticating...');
        await axios.post(`${BASE_URL}/auth/register`, { email, password, username });
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, { email, password });
        token = loginResponse.data.data.accessToken;
        console.log('✅ Authenticated\n');
    } catch (error) {
        console.error('❌ Auth failed:', error.message);
        return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    try {
        // Get an exercise from database directly
        console.log('📋 Fetching exercises from MongoDB...');
        const mongoose = require('mongoose');
        await mongoose.connect('mongodb://localhost:27017/fit-ai');

        const Exercise = mongoose.model('Exercise', new mongoose.Schema({}, { strict: false }));
        const exercises = await Exercise.find().limit(10).lean();

        console.log(`Found ${exercises.length} exercises\n`);

        if (exercises.length === 0) {
            console.log('⚠️  No exercises found. Please run seed script first.');
            await mongoose.disconnect();
            return;
        }

        // Pick an exercise (prefer compound movements)
        const targetExercise = exercises.find(ex =>
            ex.name.toLowerCase().includes('squat') ||
            ex.name.toLowerCase().includes('press') ||
            ex.name.toLowerCase().includes('deadlift')
        ) || exercises[0];

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🎯 TARGET EXERCISE');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`   ID: ${targetExercise._id}`);
        console.log(`   Name: ${targetExercise.name}`);
        console.log(`   Muscles: ${targetExercise.primaryMuscleGroups.join(', ')}`);
        console.log(`   Equipment: ${targetExercise.equipment.join(', ')}`);
        console.log(`   Difficulty: ${targetExercise.difficulty}\n`);

        const exerciseId = targetExercise._id.toString();

        // Test 1: Basic alternative suggestions
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Test 1: Basic Alternative Suggestions');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        try {
            const res1 = await axios.post(`${BASE_URL}/ai/exercise-suggest`, {
                exerciseId: exerciseId
            }, { headers });

            console.log(`✅ Found ${res1.data.data.alternatives.length} alternatives`);
            console.log(`   AI Enhanced: ${res1.data.data.metadata.aiEnhanced ? 'YES' : 'NO'}\n`);

            res1.data.data.alternatives.forEach((alt, i) => {
                console.log(`${i + 1}. ${alt.name}`);
                console.log(`   📊 Similarity: ${alt.similarityScore}%`);
                console.log(`   💡 Reason: ${alt.reason}`);
                if (alt.benefits) console.log(`   ✨ Benefits: ${alt.benefits}`);
                console.log(`   🏋️  Equipment: ${alt.equipment.join(', ')}`);
                console.log(`   ⭐ Difficulty: ${alt.difficulty}\n`);
            });
        } catch (error) {
            console.log('❌ Failed:', error.response?.data?.message || error.message);
        }

        // Test 2: Equipment-specific alternatives
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Test 2: Equipment-Specific Alternatives (Bodyweight only)');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        try {
            const res2 = await axios.post(`${BASE_URL}/ai/exercise-suggest`, {
                exerciseId: exerciseId,
                criteria: {
                    equipment: ['bodyweight'],
                    reason: 'Training at home without equipment'
                }
            }, { headers });

            console.log(`✅ Found ${res2.data.data.alternatives.length} bodyweight alternatives\n`);

            res2.data.data.alternatives.forEach((alt, i) => {
                console.log(`${i + 1}. ${alt.name}`);
                console.log(`   💡 ${alt.reason}\n`);
            });
        } catch (error) {
            console.log('❌ Failed:', error.response?.data?.message || error.message);
        }

        // Test 3: Difficulty-adjusted alternatives
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Test 3: Beginner-Friendly Alternatives');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        try {
            const res3 = await axios.post(`${BASE_URL}/ai/exercise-suggest`, {
                exerciseId: exerciseId,
                criteria: {
                    difficulty: 'beginner',
                    reason: 'New to strength training'
                }
            }, { headers });

            console.log(`✅ Found ${res3.data.data.alternatives.length} beginner alternatives\n`);

            res3.data.data.alternatives.forEach((alt, i) => {
                console.log(`${i + 1}. ${alt.name} (${alt.difficulty})`);
                console.log(`   ${alt.reason}\n`);
            });
        } catch (error) {
            console.log('❌ Failed:', error.response?.data?.message || error.message);
        }

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✨ Alternative Exercise Testing Complete!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        await mongoose.disconnect();

    } catch (error) {
        console.error('❌ Unexpected error:', error.message);
    }
}

testAlternativeExercises();
