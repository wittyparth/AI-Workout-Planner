const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');

const API_URL = 'http://localhost:5000/api/v1';
const TEST_IMAGES_DIR = path.join(__dirname, 'test-images');

// Helper to read test image
function readTestImage(filename) {
    return fs.readFileSync(path.join(TEST_IMAGES_DIR, filename));
}

async function runTests() {
    console.log('\n🧪 Starting File Upload Tests...\n');

    let token;

    try {
        // Step 1: Register a test user
        console.log('📝 Step 1: Registering test user...');
        const testEmail = `filetest_${Date.now()}@example.com`;
        const registerRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'File Upload Tester',
            email: testEmail,
            password: 'Test123456!'
        });
        console.log('✅ User registered');

        // Step 2: Login
        console.log('\n🔐 Step 2: Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: testEmail,
            password: 'Test123456!'
        });
        token = loginRes.data.data.accessToken;
        console.log('✅ Login successful');

        // Test 1: Avatar Upload (PNG)
        console.log('\n📸 Test 1: Avatar Upload (PNG)...');
        try {
            const form = new FormData();
            form.append('avatar', readTestImage('test-avatar.png'), {
                filename: 'test-avatar.png',
                contentType: 'image/png'
            });

            const avatarRes = await axios.post(`${API_URL}/user/avatar`, form, {
                headers: {
                    ...form.getHeaders(),
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('✅ Avatar Upload Test: SUCCESS');
            console.log('   URL:', avatarRes.data.data.avatarUrl);
        } catch (err) {
            console.log('❌ Avatar Upload Test: FAILED');
            console.log('   Status:', err.response?.status);
            console.log('   Error:', err.response?.data?.message || err.message);
            if (err.response?.data) {
                console.log('   Details:', JSON.stringify(err.response.data, null, 2));
            }
        }

        // Test 2: Progress Photo Upload (JPEG)
        console.log('\n📷 Test 2: Progress Photo Upload (JPEG)...');
        try {
            const form = new FormData();
            form.append('photo', readTestImage('test-progress.jpg'), {
                filename: 'progress-photo.jpg',
                contentType: 'image/jpeg'
            });
            form.append('weight', '75');
            form.append('notes', 'Test progress photo');

            const photoRes = await axios.post(`${API_URL}/progress/photos`, form, {
                headers: {
                    ...form.getHeaders(),
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('✅ Progress Photo Upload Test: SUCCESS');
            console.log('   URL:', photoRes.data.data.photoUrl);
        } catch (err) {
            console.log('❌ Progress Photo Upload Test: FAILED');
            console.log('   Error:', err.response?.data?.message || err.message);
        }

        // Test 3: Invalid File Type
        console.log('\n🚫 Test 3: Invalid File Type (should fail)...');
        try {
            const form = new FormData();
            form.append('avatar', readTestImage('test.txt'), {
                filename: 'test.txt',
                contentType: 'text/plain'
            });

            await axios.post(`${API_URL}/user/avatar`, form, {
                headers: {
                    ...form.getHeaders(),
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('❌ Should have rejected non-image file');
        } catch (err) {
            console.log('✅ File Type Validation: WORKING');
            console.log('   Correctly rejected non-image file');
        }

        // Test 4: File Too Large
        console.log('\n📏 Test 4: File Too Large (should fail)...');
        try {
            const form = new FormData();
            form.append('avatar', readTestImage('large-file.bin'), {
                filename: 'large.jpg',
                contentType: 'image/jpeg'
            });

            await axios.post(`${API_URL}/user/avatar`, form, {
                headers: {
                    ...form.getHeaders(),
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('❌ Should have rejected large file');
        } catch (err) {
            console.log('✅ File Size Validation: WORKING');
            console.log('   Correctly rejected: File too large');
        }

        console.log('\n✨ File Upload Tests Complete!\n');

    } catch (error) {
        console.error('\n❌ Test failed:', error.response?.data || error.message);
    }
}

runTests();