const axios = require('axios');

async function testDirect() {
    console.log('🧪 Testing server AI endpoint directly\n');

    try {
        // Register
        console.log('1. Registering user...');
        const email = `test${Date.now()}@test.com`;
        await axios.post('http://localhost:5000/api/v1/auth/register', {
            email,
            password: 'Test123!',
            username: `user${Date.now()}`
        });
        console.log('✅ Registered\n');

        // Login
        console.log('2. Logging in...');
        const loginRes = await axios.post('http://localhost:5000/api/v1/auth/login', {
            email,
            password: 'Test123!'
        });
        const token = loginRes.data.data.accessToken;
        console.log('✅ Logged in\n');

        // Check AI status
        console.log('3. Checking AI status...');
        const statusRes = await axios.get('http://localhost:5000/api/v1/ai/status', {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000
        });
        console.log('✅ AI Status:', statusRes.data.data);
        console.log('');

        // Test AI workout with detailed monitoring
        console.log('4. Testing AI workout generation...');
        console.log('   Request payload:', JSON.stringify({
            goal: 'strength',
            fitnessLevel: 'intermediate',
            equipment: ['barbell'],
            duration: 30
        }, null, 2));

        const startTime = Date.now();
        let dotCount = 0;
        const interval = setInterval(() => {
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
            process.stdout.write(`\r   ⏳ Waiting... ${elapsed}s ${'.'.repeat(dotCount % 4)}   `);
            dotCount++;
        }, 250);

        try {
            const workoutRes = await axios.post(
                'http://localhost:5000/api/v1/ai/workout-generate',
                {
                    goal: 'strength',
                    fitnessLevel: 'intermediate',
                    equipment: ['barbell'],
                    duration: 30,
                    targetMuscleGroups: ['chest']
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 25000
                }
            );

            clearInterval(interval);
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
            process.stdout.write('\r');
            console.log(`   ✅ Success! (${elapsed}s)`);
            console.log('   Full response:', JSON.stringify(workoutRes.data, null, 2));
            console.log('   Workout:', workoutRes.data.data?.workout?.name || workoutRes.data.data?.name);
            console.log('   Exercises:', workoutRes.data.data?.workout?.exercises?.length || workoutRes.data.data?.exercises?.length || 0);

        } catch (error) {
            clearInterval(interval);
            process.stdout.write('\r');

            if (error.code === 'ECONNABORTED') {
                console.log('   ❌ Request timeout (25s)');
                console.log('   💡 Server is taking too long or hanging');
            } else if (error.response) {
                console.log('   ❌ Server error:', error.response.status);
                console.log('   Message:', error.response.data);
            } else {
                console.log('   ❌ Error:', error.message);
            }
        }

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

testDirect();
