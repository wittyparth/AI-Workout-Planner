const mongoose = require('mongoose');

async function checkExercises() {
    await mongoose.connect('mongodb://localhost:27017/fit-ai');

    const Exercise = mongoose.model('Exercise', new mongoose.Schema({}, { strict: false }));

    const count = await Exercise.countDocuments();
    console.log(`Total exercises in DB: ${count}`);

    const sample = await Exercise.findOne().lean();
    console.log('\nSample exercise (first one):');
    console.log(JSON.stringify(sample, null, 2));

    const squat = await Exercise.findOne({ name: /squat/i }).lean();
    console.log('\nSquat exercise:');
    console.log(JSON.stringify(squat, null, 2));

    await mongoose.disconnect();
}

checkExercises().catch(console.error);
