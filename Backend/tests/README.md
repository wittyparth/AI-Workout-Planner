# Integration Tests

## Overview
Comprehensive integration tests for the FitAI backend covering all critical user flows.

## Test Suites

### 1. Authentication Flow (`auth.test.js`)
Tests the complete authentication journey:
- ✅ User registration with validation
- ✅ Login with credential verification
- ✅ Protected route access
- ✅ Password reset flow
- ✅ Profile management
- ✅ Logout

**Coverage:** 11 test cases

### 2. Workout Generation Flow (`workout.test.js`)
Tests AI-powered workout management:
- ✅ AI workout plan generation
- ✅ Workout plan retrieval
- ✅ Workout session management
- ✅ Exercise logging
- ✅ Session completion
- ✅ Workout history
- ✅ Exercise search
- ✅ AI alternative exercises
- ✅ Plan customization

**Coverage:** 12 test cases

### 3. Progress Tracking Flow (`progress.test.js`)
Tests progress monitoring and analytics:
- ✅ Body metrics tracking
- ✅ Progress photo uploads
- ✅ Workout statistics
- ✅ Personal records (PRs)
- ✅ Progress analytics
- ✅ Goal tracking
- ✅ Trend analysis

**Coverage:** 18 test cases

## Running Tests

### Prerequisites
1. Server must be running on `http://localhost:5000`
2. MongoDB must be connected
3. AWS S3 credentials configured (for photo upload tests)

### Commands

```bash
# Run all integration tests
pnpm test:integration

# Run with Mocha directly
pnpm test

# Run in watch mode (auto-rerun on changes)
pnpm test:watch

# Run specific test suite
npx mocha tests/integrated/auth.test.js
npx mocha tests/integrated/workout.test.js
npx mocha tests/integrated/progress.test.js
```

### Quick Start

1. **Start the server:**
```bash
cd src
nodemon server.js
```

2. **In a new terminal, run tests:**
```bash
pnpm test:integration
```

## Test Data

Tests create temporary users with unique emails:
- `test-auth-[timestamp]@example.com`
- `test-workout-[timestamp]@example.com`
- `test-progress-[timestamp]@example.com`

All test data is isolated and doesn't interfere with production data.

## Expected Results

**Total Test Cases:** 41
- Authentication: 11 tests
- Workout: 12 tests  
- Progress: 18 tests

**Success Criteria:** All tests should pass with green checkmarks ✅

## Troubleshooting

### Server Not Running
```
Error: connect ECONNREFUSED 127.0.0.1:5000
```
**Solution:** Start the server with `cd src && nodemon server.js`

### MongoDB Connection Error
```
Error: MongoNetworkError
```
**Solution:** Ensure MongoDB is running on `mongodb://localhost:27017/fit-ai`

### S3 Upload Failures
```
Error: Missing credentials in config
```
**Solution:** Check `.env` file has AWS credentials set

### Test Timeout
```
Error: Timeout of 10000ms exceeded
```
**Solution:** Increase timeout in test file or check AI service response time

## Notes

- Tests run sequentially to avoid conflicts
- Each test suite uses a fresh user account
- Photo upload tests skip if test images don't exist
- AI generation tests may take 2-5 seconds due to Gemini API calls
- All tests clean up after themselves (no manual cleanup needed)

## Continuous Integration

These tests are designed to run in CI/CD pipelines:
- No interactive prompts
- Clear pass/fail reporting
- Exit codes for build status
- Detailed error messages for debugging
