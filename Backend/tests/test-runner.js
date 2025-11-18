/**
 * Integration Test Runner
 * Runs all integration tests and generates a report
 */

const Mocha = require('mocha');
const path = require('path');
const fs = require('fs');

// Create Mocha instance
const mocha = new Mocha({
    timeout: 10000,
    reporter: 'spec',
    slow: 2000
});

// Test files to run
const testFiles = [
    './integrated/auth.test.js',
    './integrated/workout.test.js',
    './integrated/progress.test.js'
];

// Add test files to Mocha
testFiles.forEach(file => {
    const testPath = path.join(__dirname, file);
    if (fs.existsSync(testPath)) {
        mocha.addFile(testPath);
        console.log(`✓ Added test: ${file}`);
    } else {
        console.log(`✗ Test file not found: ${file}`);
    }
});

console.log('\n🧪 Running Integration Tests...\n');
console.log('='.repeat(60));
console.log('Make sure the server is running on http://localhost:5000');
console.log('='.repeat(60));
console.log('');

// Run tests
mocha.run(failures => {
    console.log('\n' + '='.repeat(60));
    
    if (failures) {
        console.error(`\n❌ ${failures} test(s) failed\n`);
        process.exitCode = 1;
    } else {
        console.log('\n✅ All integration tests passed!\n');
    }
    
    console.log('='.repeat(60));
});
