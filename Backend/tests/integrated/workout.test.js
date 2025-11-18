/**
 * Integration Tests - Workout & Exercise Flow
 * Tests AI workout generation, exercise search, and workout tracking
 */

const axios = require('axios');
const { expect } = require('chai');

const BASE_URL = 'http://localhost:5000/api/v1';
let authToken = null;
let userId = null;
let workoutId = null;

// Test user data
const testUser = {
    email: `test-workout-${Date.now()}@example.com`,
    password: 'SecurePass123!@#'
};

describe('Workout & Exercise Flow Integration Tests', () => {
    
    before(async () => {
        // Register test user
        const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
        userId = registerResponse.data.data._id;
        
        // Login to get tokens
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
            email: testUser.email,
            password: testUser.password
        });
        authToken = loginResponse.data.data.accessToken;
    });

    describe('Exercise Library', () => {
        it('should search all exercises', async () => {
            const response = await axios.get(`${BASE_URL}/exercises`, {
                params: { limit: 10 },
                headers: { Authorization: `Bearer ${authToken}` }
            });

            expect(response.status).to.equal(200);
            expect(response.data.success).to.equal(true);
            expect(response.data.data.exercises).to.be.an('array');
            expect(response.data.data.exercises.length).to.be.greaterThan(0);
        });

        it('should filter exercises by muscle group', async () => {
            const response = await axios.get(`${BASE_URL}/exercises`, {
                params: { muscleGroup: 'chest', limit: 5 },
                headers: { Authorization: `Bearer ${authToken}` }
            });

            expect(response.status).to.equal(200);
            expect(response.data.data.exercises).to.be.an('array');
        });

        it('should filter exercises by equipment', async () => {
            const response = await axios.get(`${BASE_URL}/exercises`, {
                params: { equipment: 'barbell', limit: 5 },
                headers: { Authorization: `Bearer ${authToken}` }
            });

            expect(response.status).to.equal(200);
            expect(response.data.data.exercises).to.be.an('array');
        });
    });

    describe('AI Workout Generation', () => {
        it('should generate AI workout plan', async () => {
            const preferences = {
                fitnessGoals: ['muscle_gain', 'strength'],
                fitnessLevel: 'intermediate',
                workoutFrequency: 4,
                sessionDuration: 60,
                availableEquipment: ['barbell', 'dumbbell', 'cable'],
                focusAreas: ['chest', 'back', 'legs']
            };

            const response = await axios.post(
                `${BASE_URL}/ai/workout-generate`,
                preferences,
                { headers: { Authorization: `Bearer ${authToken}` } }
            );

            expect(response.status).to.equal(200);
            expect(response.data.success).to.equal(true);
            expect(response.data.data).to.have.property('workout');
        });

        it('should get AI exercise suggestions', async () => {
            const request = {
                muscleGroups: ['chest', 'triceps'],
                equipment: ['dumbbell'],
                fitnessLevel: 'intermediate',
                count: 3
            };

            const response = await axios.post(
                `${BASE_URL}/ai/exercise-suggest`,
                request,
                { headers: { Authorization: `Bearer ${authToken}` } }
            );

            expect(response.status).to.equal(200);
            expect(response.data.success).to.equal(true);
        });
    });

    describe('Workout Management', () => {
        it('should create a workout', async () => {
            const workout = {
                name: 'Test Push Day',
                exercises: [
                    {
                        exerciseId: '507f1f77bcf86cd799439011',
                        sets: 3,
                        reps: 10,
                        weight: 50
                    }
                ],
                scheduledDate: new Date().toISOString()
            };

            const response = await axios.post(
                `${BASE_URL}/workouts`,
                workout,
                { headers: { Authorization: `Bearer ${authToken}` } }
            );

            expect(response.status).to.equal(201);
            expect(response.data.success).to.equal(true);
            expect(response.data.data.workout).to.have.property('name', 'Test Push Day');
            
            workoutId = response.data.data.workout._id;
        });

        it('should retrieve workout history', async () => {
            const response = await axios.get(`${BASE_URL}/workouts`, {
                params: { limit: 10 },
                headers: { Authorization: `Bearer ${authToken}` }
            });

            expect(response.status).to.equal(200);
            expect(response.data.data.workouts).to.be.an('array');
        });

        it('should get specific workout by ID', async () => {
            const response = await axios.get(`${BASE_URL}/workouts/${workoutId}`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            expect(response.status).to.equal(200);
            expect(response.data.data.workout).to.have.property('_id', workoutId);
        });

        it('should start a workout', async () => {
            const response = await axios.post(
                `${BASE_URL}/workouts/${workoutId}/start`,
                {},
                { headers: { Authorization: `Bearer ${authToken}` } }
            );

            expect(response.status).to.equal(200);
            expect(response.data.success).to.equal(true);
        });

        it('should complete a set', async () => {
            const setData = {
                exerciseIndex: 0,
                setIndex: 0,
                reps: 10,
                weight: 50,
                completed: true
            };

            const response = await axios.post(
                `${BASE_URL}/workouts/${workoutId}/set`,
                setData,
                { headers: { Authorization: `Bearer ${authToken}` } }
            );

            expect(response.status).to.equal(200);
            expect(response.data.success).to.equal(true);
        });

        it('should complete workout', async () => {
            const completionData = {
                duration: 60,
                notes: 'Great workout!'
            };

            const response = await axios.post(
                `${BASE_URL}/workouts/${workoutId}/complete`,
                completionData,
                { headers: { Authorization: `Bearer ${authToken}` } }
            );

            expect(response.status).to.equal(200);
            expect(response.data.success).to.equal(true);
        });

        it('should get workout stats', async () => {
            const response = await axios.get(`${BASE_URL}/workouts/stats`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            expect(response.status).to.equal(200);
            expect(response.data.success).to.equal(true);
        });
    });

    describe('Workout Cleanup', () => {
        it('should delete workout', async () => {
            const response = await axios.delete(`${BASE_URL}/workouts/${workoutId}`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            expect(response.status).to.equal(200);
            expect(response.data.success).to.equal(true);
        });
    });
});
