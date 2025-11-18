const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/v1';

async function testValidation() {
    console.log('🧪 Testing Request Validation...\n');

    // First, register and login to get a valid token
    let token = null;
    try {
        // Register a test user
        const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
            email: `test${Date.now()}@example.com`,
            password: 'Test123!@#',
            username: `testuser${Date.now()}`
        });
        token = registerResponse.data.data.token;
        console.log('✅ Got authentication token\n');
    } catch (error) {
        console.error('Failed to get token:', error.response?.data || error.message);
        return;
    }

    try {
        // 1. Test valid AI workout generation
        console.log('Test 1: Valid AI workout request');
        try {
            const response = await axios.post(`${BASE_URL}/ai/workout-generate`, {
                goal: 'strength',
                fitnessLevel: 'intermediate',
                equipment: ['barbell', 'dumbbells'],
                duration: 45
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('✅ Passed validation');
        } catch (error) {
            if (error.response?.status === 500) {
                console.log('✅ Passed validation (server error is OK for this test)');
            } else {
                console.log('❌ Unexpected error:', error.response?.status, error.response?.data);
            }
        }

        // 2. Test invalid AI workout (missing required fields)
        console.log('\nTest 2: Invalid AI workout request (missing equipment)');
        try {
            const response = await axios.post(`${BASE_URL}/ai/workout-generate`, {
                goal: 'strength',
                fitnessLevel: 'intermediate',
                duration: 45
                // Missing equipment array
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('❌ Should have failed validation');
        } catch (error) {
            if (error.response?.status === 400 && error.response?.data?.errors) {
                console.log('✅ Validation failed as expected:');
                console.log(JSON.stringify(error.response.data.errors, null, 2));
            } else {
                console.log('❌ Did not get validation error:', error.response?.data);
            }
        }

        // 3. Test invalid enum value
        console.log('\nTest 3: Invalid enum value (wrong goal)');
        try {
            const response = await axios.post(`${BASE_URL}/ai/workout-generate`, {
                goal: 'invalid_goal',
                fitnessLevel: 'intermediate',
                equipment: ['barbell'],
                duration: 45
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('❌ Should have failed validation');
        } catch (error) {
            if (error.response?.status === 400 && error.response?.data?.errors) {
                console.log('✅ Validation failed as expected:');
                console.log(JSON.stringify(error.response.data.errors, null, 2));
            } else {
                console.log('❌ Did not get validation error:', error.response?.data);
            }
        }

        // 4. Test invalid number range
        console.log('\nTest 4: Invalid duration (too short)');
        try {
            const response = await axios.post(`${BASE_URL}/ai/workout-generate`, {
                goal: 'strength',
                fitnessLevel: 'intermediate',
                equipment: ['barbell'],
                duration: 5 // Too short
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('❌ Should have failed validation');
        } catch (error) {
            if (error.response?.status === 400 && error.response?.data?.errors) {
                console.log('✅ Validation failed as expected:');
                console.log(JSON.stringify(error.response.data.errors, null, 2));
            } else {
                console.log('❌ Did not get validation error:', error.response?.data);
            }
        }

        // 5. Test workout creation validation
        console.log('\nTest 5: Invalid workout creation (empty exercises)');
        try {
            const response = await axios.post(`${BASE_URL}/workouts`, {
                sessionData: {
                    exercises: [] // Empty array
                }
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('❌ Should have failed validation');
        } catch (error) {
            if (error.response?.status === 400 && error.response?.data?.errors) {
                console.log('✅ Validation failed as expected:');
                console.log(JSON.stringify(error.response.data.errors, null, 2));
            } else {
                console.log('❌ Did not get validation error:', error.response?.data);
            }
        }

        console.log('\n✨ Validation tests completed!');

    } catch (error) {
        console.error('Test error:', error.message);
    }
}

// Run tests
testValidation();
