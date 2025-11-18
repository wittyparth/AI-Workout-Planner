/**
 * Quick test to verify Swagger documentation is accessible
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testSwaggerDocs() {
    try {
        console.log('🧪 Testing Swagger Documentation\n');

        // Test 1: Swagger JSON endpoint
        console.log('1. Testing /api/v1/docs.json...');
        const jsonRes = await axios.get(`${BASE_URL}/api/v1/docs.json`);
        console.log(`   ✅ Swagger JSON available`);
        console.log(`   📊 Paths documented: ${Object.keys(jsonRes.data.paths).length}`);
        console.log(`   🏷️  Tags: ${jsonRes.data.tags.map(t => t.name).join(', ')}\n`);

        // Test 2: Sample documented paths
        const paths = Object.keys(jsonRes.data.paths);
        console.log('2. Sample documented endpoints:');
        paths.slice(0, 10).forEach(path => {
            const methods = Object.keys(jsonRes.data.paths[path]).join(', ').toUpperCase();
            console.log(`   ${methods.padEnd(20)} ${path}`);
        });

        console.log(`\n📖 Full documentation available at: ${BASE_URL}/api/v1/docs`);
        console.log('✅ Swagger documentation test complete!\n');

    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.error('❌ Server not running. Start server with: cd src && nodemon server.js');
        } else {
            console.error('❌ Error:', error.message);
        }
    }
}

testSwaggerDocs();
