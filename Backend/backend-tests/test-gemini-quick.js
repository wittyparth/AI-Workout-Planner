const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function quickTest() {
    console.log('Quick Gemini API Test\n');

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.log('No GEMINI_API_KEY found in environment');
        return;
    }

    console.log('✅ API Key found:', apiKey.substring(0, 10) + '...');
    console.log('⏳ Testing connection to Gemini API...\n');

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const startTime = Date.now();

        // Progress indicator
        const interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            process.stdout.write(`\r⏳ Waiting for response... ${elapsed}s`);
        }, 1000);

        const result = await Promise.race([
            model.generateContent({
                contents: [{ role: 'user', parts: [{ text: 'Say "Hello!" in one word' }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 10 }
            }),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Timeout after 15s')), 15000)
            )
        ]);

        clearInterval(interval);
        process.stdout.write('\r');

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        const text = result.response.text();

        console.log(`✅ SUCCESS! Response received in ${elapsed}s`);
        console.log('📝 Response:', text);
        console.log('\n💡 Gemini API is working correctly!');

    } catch (error) {
        console.log('\n❌ FAILED:', error.message);

        if (error.code === 'ECONNRESET') {
            console.log('\n🔍 Diagnosis: Connection reset by remote server');
            console.log('   Possible causes:');
            console.log('   1. Invalid API key');
            console.log('   2. API key quota exceeded');
            console.log('   3. Network/firewall blocking the request');
            console.log('   4. Regional restrictions');
            console.log('\n💡 Try:');
            console.log('   - Verify API key at: https://aistudio.google.com/apikey');
            console.log('   - Check if you have quota remaining');
            console.log('   - Try from a different network');
        } else if (error.message.includes('Timeout')) {
            console.log('\n🔍 Diagnosis: Request timed out');
            console.log('   - Gemini API is slow or unresponsive');
            console.log('   - Check your internet connection');
        } else if (error.message.includes('API key')) {
            console.log('\n🔍 Diagnosis: API key issue');
            console.log('   - Get a new key from: https://aistudio.google.com/apikey');
        } else {
            console.log('\n🔍 Full error:', error);
        }
    }
}

quickTest();
