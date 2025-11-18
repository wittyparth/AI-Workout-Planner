const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/v1';

async function testAllAI() {
    console.log('🤖 Testing ALL AI Endpoints\n');

    // Register and login
    let token = null;
    try {
        const email = `test${Date.now()}@example.com`;
        const password = 'Test123!@#';
        const username = `testuser${Date.now()}`;

        console.log('📝 Registering and logging in...');
        await axios.post(`${BASE_URL}/auth/register`, { email, password, username });
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, { email, password });
        token = loginResponse.data.data.accessToken;
        console.log('✅ Authenticated\n');
    } catch (error) {
        console.error('❌ Auth failed:', error.message);
        return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    // Test 1: AI Status
    console.log('Test 1: AI Service Status');
    try {
        const res = await axios.get(`${BASE_URL}/ai/status`, { headers });
        console.log('✅ Status:', res.data.data.available ? 'AVAILABLE' : 'UNAVAILABLE');
        console.log('   Model:', res.data.data.model);
    } catch (error) {
        console.log('❌ Failed:', error.response?.data?.message || error.message);
    }

    // Test 2: Generate Workout (already working)
    console.log('\nTest 2: Generate AI Workout');
    try {
        const res = await axios.post(`${BASE_URL}/ai/workout-generate`, {
            goal: 'strength',
            fitnessLevel: 'intermediate',
            equipment: ['barbell', 'dumbbells'],
            duration: 45
        }, { headers });
        console.log('✅ Workout generated:', res.data.data.name);
        console.log('   Exercises:', res.data.data.exercises?.length || 0);
    } catch (error) {
        console.log('❌ Failed:', error.response?.data?.message || error.message);
    }

    // Test 3: Progress Insights
    console.log('\nTest 3: Progress Insights');
    try {
        const res = await axios.get(`${BASE_URL}/ai/progress-insights`, {
            headers,
            params: { timeframe: 'month' }
        });
        console.log('✅ Insights received');
        console.log('   Progress:', res.data.data.insights?.overallProgress);
    } catch (error) {
        console.log('❌ Failed:', error.response?.data?.message || error.message);
    }

    // Test 4: Exercise Suggestions
    console.log('\nTest 4: Exercise Suggestions');
    try {
        // Get an exercise first
        const exercises = await axios.get(`${BASE_URL}/exercises`, { headers });
        const exerciseId = exercises.data.data[0]?._id;

        if (exerciseId) {
            const res = await axios.post(`${BASE_URL}/ai/exercise-suggest`, {
                exerciseId,
                criteria: { equipment: ['dumbbells'] }
            }, { headers });
            console.log('✅ Suggestions received:', res.data.data.alternatives?.length || 0);
        } else {
            console.log('⚠️  No exercises in database to test');
        }
    } catch (error) {
        console.log('❌ Failed:', error.response?.data?.message || error.message);
    }

    console.log('\n✨ All AI tests completed!');
}

testAllAI();
