const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/v1';

async function testValidation() {
    console.log('🧪 Testing Request Validation (No Auth Required)\n');

    // We'll test validation errors occur BEFORE auth errors (401)
    // If validation works, we get 400. If it doesn't, we get 401.

    try {
        // Test 1: Missing required field (equipment)
        console.log('Test 1: Missing required field (equipment array)');
        try {
            await axios.post(`${BASE_URL}/ai/workout-generate`, {
                goal: 'strength',
                fitnessLevel: 'intermediate',
                duration: 45
                // Missing equipment
            });
            console.log('❌ Should have failed');
        } catch (error) {
            if (error.response?.status === 400) {
                console.log('✅ Validation error (400):', error.response.data.message);
                if (error.response.data.errors) {
                    console.log('   Fields:', error.response.data.errors.map(e => e.field).join(', '));
                }
            } else if (error.response?.status === 401) {
                console.log('❌ Auth error (401) - validation not running first');
            } else {
                console.log('❌ Unexpected status:', error.response?.status);
            }
        }

        // Test 2: Invalid enum value
        console.log('\nTest 2: Invalid enum value (goal)');
        try {
            await axios.post(`${BASE_URL}/ai/workout-generate`, {
                goal: 'invalid_goal',
                fitnessLevel: 'intermediate',
                equipment: ['barbell'],
                duration: 45
            });
            console.log('❌ Should have failed');
        } catch (error) {
            if (error.response?.status === 400) {
                console.log('✅ Validation error (400):', error.response.data.message);
                if (error.response.data.errors) {
                    console.log('   Error:', error.response.data.errors[0]?.message);
                }
            } else if (error.response?.status === 401) {
                console.log('❌ Auth error (401) - validation not running first');
            }
        }

        // Test 3: Invalid number range
        console.log('\nTest 3: Invalid number range (duration < 10)');
        try {
            await axios.post(`${BASE_URL}/ai/workout-generate`, {
                goal: 'strength',
                fitnessLevel: 'intermediate',
                equipment: ['barbell'],
                duration: 5
            });
            console.log('❌ Should have failed');
        } catch (error) {
            if (error.response?.status === 400) {
                console.log('✅ Validation error (400):', error.response.data.message);
            } else if (error.response?.status === 401) {
                console.log('❌ Auth error (401) - validation not running first');
            }
        }

        // Test 4: Empty array validation
        console.log('\nTest 4: Empty exercises array');
        try {
            await axios.post(`${BASE_URL}/workouts`, {
                sessionData: {
                    exercises: []
                }
            });
            console.log('❌ Should have failed');
        } catch (error) {
            if (error.response?.status === 400) {
                console.log('✅ Validation error (400):', error.response.data.message);
                if (error.response.data.errors) {
                    console.log('   Error:', error.response.data.errors[0]?.message);
                }
            } else if (error.response?.status === 401) {
                console.log('❌ Auth error (401) - validation not running first');
            }
        }

        // Test 5: Valid request (should pass validation, fail auth)
        console.log('\nTest 5: Valid request structure (should pass validation)');
        try {
            await axios.post(`${BASE_URL}/ai/workout-generate`, {
                goal: 'strength',
                fitnessLevel: 'intermediate',
                equipment: ['barbell', 'dumbbells'],
                duration: 45
            });
            console.log('❌ Unexpected success');
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Passed validation, failed auth (expected)');
            } else if (error.response?.status === 400) {
                console.log('❌ Validation error on valid request:', error.response.data);
            }
        }

        console.log('\n✨ Validation tests completed!');

    } catch (error) {
        console.error('Test error:', error.message);
    }
}

testValidation();
