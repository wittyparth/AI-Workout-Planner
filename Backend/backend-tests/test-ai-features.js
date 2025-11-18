const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/v1';

async function testAIFeatures() {
    console.log('🤖 Testing AI Features with Gemini API\n');

    // First, register and login to get a valid token
    let token = null;
    try {
        const email = `test${Date.now()}@example.com`;
        const password = 'Test123!@#';
        const username = `testuser${Date.now()}`;

        console.log('📝 Registering test user...');
        await axios.post(`${BASE_URL}/auth/register`, {
            email,
            password,
            username
        });

        console.log('🔐 Logging in...');
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
            email,
            password
        });
        token = loginResponse.data.data.accessToken;
        console.log('✅ Authentication successful\n');
    } catch (error) {
        console.error('❌ Failed to authenticate:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Full error:', error);
        }
        return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    try {
        // Test 1: Generate AI Workout
        console.log('Test 1: Generate AI Workout (Gemini API)');
        console.log('Requesting strength workout for intermediate with barbell...');
        console.log('⏳ This may take 5-20 seconds depending on Gemini API response time...');

        let progressInterval = null;
        try {
            const startTime = Date.now();
            progressInterval = setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                process.stdout.write(`\r⏳ Waiting for AI response... ${elapsed}s elapsed`);
            }, 1000);

            const response = await Promise.race([
                axios.post(`${BASE_URL}/ai/workout-generate`, {
                    goal: 'strength',
                    fitnessLevel: 'intermediate',
                    equipment: ['barbell', 'dumbbells', 'bench'],
                    duration: 45,
                    targetMuscleGroups: ['chest', 'triceps'],
                    preferences: 'Focus on compound movements'
                }, { headers, timeout: 30000 }),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Request timeout after 30s')), 30000)
                )
            ]);

            clearInterval(progressInterval);
            progressInterval = null;
            process.stdout.write('\r');

            const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
            console.log(`✅ AI Workout Generated Successfully! (${elapsed}s)`);
            console.log('   Workout Name:', response.data.data?.workout?.name || 'N/A');
            console.log('   Exercise Count:', response.data.data?.workout?.exercises?.length || 0);
            console.log('   Estimated Duration:', response.data.data?.workout?.estimatedDuration || 'N/A');
            if (response.data.data?.workout?.exercises?.length > 0) {
                console.log('   First Exercise:', response.data.data.workout.exercises[0].name);
            }
        } catch (error) {
            if (progressInterval) {
                clearInterval(progressInterval);
                progressInterval = null;
            }
            process.stdout.write('\r');
            console.log('❌ Failed:', error.response?.data?.message || error.message);
            if (error.code === 'ECONNREFUSED') {
                console.log('   💡 Server is not running. Start it with: npm run dev');
            } else if (error.code === 'ECONNRESET') {
                console.log('   💡 Connection reset - Check if Gemini API key is valid');
            } else if (error.message.includes('timeout')) {
                console.log('   💡 Request timed out - Gemini API may be slow or unresponsive');
            } else if (error.response?.status === 500) {
                console.log('   Server error details:', error.response?.data?.error || 'No details');
            }
        }

        // Test 2: Get Exercise Suggestions (Alternative)
        console.log('\nTest 2: Get Exercise Suggestions');
        console.log('Requesting alternatives for bench press...');

        // First, get an exercise ID from the database
        try {
            const exercisesResponse = await axios.get(`${BASE_URL}/exercises`, { headers });
            const benchPress = exercisesResponse.data.data.find(ex =>
                ex.name.toLowerCase().includes('press') || ex.name.toLowerCase().includes('bench')
            );

            if (benchPress) {
                const suggestionResponse = await axios.post(`${BASE_URL}/ai/exercise-suggest`, {
                    exerciseId: benchPress._id,
                    reason: 'equipment',
                    availableEquipment: ['dumbbells', 'bodyweight'],
                    targetMuscleGroups: ['chest', 'triceps']
                }, { headers });

                console.log('✅ AI Suggestions Generated!');
                console.log('   Suggestions Count:', suggestionResponse.data.data?.suggestions?.length || 0);
                if (suggestionResponse.data.data?.suggestions?.length > 0) {
                    console.log('   First Suggestion:', suggestionResponse.data.data.suggestions[0].name);
                    console.log('   Reason:', suggestionResponse.data.data.suggestions[0].reason);
                }
            } else {
                console.log('⚠️  Skipped - No suitable exercise found in database');
            }
        } catch (error) {
            console.log('❌ Failed:', error.response?.data?.message || error.message);
        }

        // Test 3: Analyze Progress (AI Insights)
        console.log('\nTest 3: Get AI Progress Insights');
        console.log('Requesting progress analysis...');
        try {
            const progressResponse = await axios.get(`${BASE_URL}/ai/progress-insights`, {
                headers,
                params: {
                    timeframe: 'month',
                    focusAreas: ['strength', 'consistency']
                }
            });

            console.log('✅ AI Progress Analysis Complete!');
            console.log('   Insights:', progressResponse.data.data?.insights || 'N/A');
            console.log('   Recommendations:', progressResponse.data.data?.recommendations?.length || 0);
        } catch (error) {
            console.log('❌ Failed:', error.response?.data?.message || error.message);
        }

        // Test 4: Check AI Status
        console.log('\nTest 4: Check AI Service Status');
        try {
            const statusResponse = await axios.get(`${BASE_URL}/ai/status`, { headers });
            console.log('✅ AI Service Status:');
            console.log('   Available:', statusResponse.data.data?.available);
            console.log('   Model:', statusResponse.data.data?.model);
            console.log('   Features:', statusResponse.data.data?.features?.join(', ') || 'N/A');
        } catch (error) {
            console.log('❌ Failed:', error.response?.data?.message || error.message);
        }

        console.log('\n✨ AI Feature Tests Completed!');

    } catch (error) {
        console.error('Test error:', error.message);
    }
}

testAIFeatures();
