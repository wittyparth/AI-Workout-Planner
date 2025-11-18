// Direct Gemini API test to see what's happening
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testGeminiDirect() {
    console.log('🧪 Testing Gemini API Directly...\n');

    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

    console.log('API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT SET');
    console.log('Model:', model);
    console.log('');

    if (!apiKey) {
        console.error('❌ GEMINI_API_KEY not set in .env file');
        return;
    }

    try {
        console.log('🚀 Initializing Gemini...');
        const genAI = new GoogleGenerativeAI(apiKey);
        const geminiModel = genAI.getGenerativeModel({ model });

        console.log('✅ Model initialized');
        console.log('');

        console.log('📝 Sending test prompt...');
        const startTime = Date.now();

        const prompt = `Create a simple workout. Return ONLY this JSON:
{
  "name": "Test Workout",
  "exercises": [
    {"name": "Push-ups", "sets": 3, "reps": 10}
  ]
}`;

        const result = await geminiModel.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 512,
            }
        });

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        console.log(`✅ Response received in ${duration}s`);
        console.log('');

        const response = result.response;
        const text = response.text();

        console.log('📄 Response:');
        console.log('─'.repeat(60));
        console.log(text);
        console.log('─'.repeat(60));
        console.log('');

        // Try to parse
        try {
            const match = text.match(/```json\n([\s\S]*?)\n```/) ||
                text.match(/```\n([\s\S]*?)\n```/) ||
                [null, text];
            const json = match[1] || text;
            const parsed = JSON.parse(json.trim());

            console.log('✅ JSON parsed successfully:');
            console.log(JSON.stringify(parsed, null, 2));
        } catch (parseError) {
            console.log('⚠️  Could not parse as JSON:', parseError.message);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('');
        console.error('Full error:');
        console.error(error);
    }
}

testGeminiDirect();
