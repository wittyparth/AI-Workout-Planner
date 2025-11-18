/**
 * Integration Tests - Progress Tracking Flow
 * Tests progress metrics, analytics, and goal tracking
 */

const axios = require('axios');
const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const BASE_URL = 'http://localhost:5000/api/v1';
let authToken = null;
let userId = null;
let goalId = null;

// Test user data
const testUser = {
    email: `test-progress-${Date.now()}@example.com`,
    password: 'SecurePass123!@#'
};

describe('Progress Tracking Flow Integration Tests', () => {
    
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

    describe('Body Metrics Tracking', () => {
        it('should add body metrics', async () => {
            const metrics = {
                weight: 80,
                bodyFat: 18.5,
                measurements: {
                    chest: 100,
                    waist: 85,
                    biceps: 35
                }
            };

            const response = await axios.post(
                `${BASE_URL}/progress/metrics`,
                metrics,
                { headers: { Authorization: `Bearer ${authToken}` } }
            );

            expect(response.status).to.equal(201);
            expect(response.data.success).to.equal(true);
        });

        it('should retrieve progress data', async () => {
            const response = await axios.get(`${BASE_URL}/progress`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            expect(response.status).to.equal(200);
            expect(response.data.success).to.equal(true);
        });
    });

    describe('Progress Photos', () => {
        it('should upload progress photo', async () => {
            const testImagePath = path.join(__dirname, '../../test-images/test-progress.jpg');
            
            if (!fs.existsSync(testImagePath)) {
                console.log('⚠️  Skipping photo upload test - test image not found');
                return;
            }

            const formData = new FormData();
            formData.append('photo', fs.createReadStream(testImagePath));
            formData.append('angle', 'front');
            formData.append('notes', 'Progress test');

            const response = await axios.post(
                `${BASE_URL}/progress/photos`,
                formData,
                {
                    headers: {
                        ...formData.getHeaders(),
                        Authorization: `Bearer ${authToken}`
                    }
                }
            );

            expect(response.status).to.be.oneOf([200, 201]);
            expect(response.data.success).to.equal(true);
        });
    });

    describe('Personal Records', () => {
        it('should retrieve personal records', async () => {
            const response = await axios.get(`${BASE_URL}/progress/prs`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            expect(response.status).to.equal(200);
            expect(response.data.success).to.equal(true);
        });
    });

    describe('Progress Analytics', () => {
        it('should get progress analytics', async () => {
            const response = await axios.get(`${BASE_URL}/progress/analytics`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            expect(response.status).to.equal(200);
            expect(response.data.success).to.equal(true);
        });

        it('should get workout streaks', async () => {
            const response = await axios.get(`${BASE_URL}/progress/streaks`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            expect(response.status).to.equal(200);
            expect(response.data.success).to.equal(true);
        });

        it('should get AI progress insights', async () => {
            const response = await axios.get(`${BASE_URL}/ai/progress-insights`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            expect(response.status).to.equal(200);
            expect(response.data.success).to.equal(true);
        });
    });

    describe('Goal Management', () => {
        it('should create a fitness goal', async () => {
            const goal = {
                type: 'weight',
                targetValue: 75,
                currentValue: 80,
                deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
                description: 'Lose 5kg in 2 months'
            };

            const response = await axios.post(
                `${BASE_URL}/goals`,
                goal,
                { headers: { Authorization: `Bearer ${authToken}` } }
            );

            expect(response.status).to.equal(201);
            expect(response.data.success).to.equal(true);
            expect(response.data.data.goal).to.have.property('type', 'weight');
            
            goalId = response.data.data.goal._id;
        });

        it('should retrieve all goals', async () => {
            const response = await axios.get(`${BASE_URL}/goals`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            expect(response.status).to.equal(200);
            expect(response.data.success).to.equal(true);
            expect(response.data.data.goals).to.be.an('array');
        });

        it('should get specific goal by ID', async () => {
            const response = await axios.get(`${BASE_URL}/goals/${goalId}`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            expect(response.status).to.equal(200);
            expect(response.data.success).to.equal(true);
        });

        it('should update goal progress', async () => {
            const progressUpdate = {
                currentValue: 78,
                notes: 'Making good progress!'
            };

            const response = await axios.post(
                `${BASE_URL}/goals/${goalId}/progress`,
                progressUpdate,
                { headers: { Authorization: `Bearer ${authToken}` } }
            );

            expect(response.status).to.equal(200);
            expect(response.data.success).to.equal(true);
        });

        it('should get goal insights', async () => {
            const response = await axios.get(`${BASE_URL}/goals/${goalId}/insights`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            expect(response.status).to.equal(200);
            expect(response.data.success).to.equal(true);
        });

        it('should get goal stats', async () => {
            const response = await axios.get(`${BASE_URL}/goals/stats`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            expect(response.status).to.equal(200);
            expect(response.data.success).to.equal(true);
        });

        it('should delete goal', async () => {
            const response = await axios.delete(`${BASE_URL}/goals/${goalId}`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            expect(response.status).to.equal(200);
            expect(response.data.success).to.equal(true);
        });
    });

    describe('Analytics Dashboard', () => {
        it('should get dashboard stats', async () => {
            const response = await axios.get(`${BASE_URL}/analytics/dashboard`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            expect(response.status).to.equal(200);
            expect(response.data.success).to.equal(true);
        });

        it('should get strength trends', async () => {
            const response = await axios.get(`${BASE_URL}/analytics/strength-trends`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            expect(response.status).to.equal(200);
            expect(response.data.success).to.equal(true);
        });

        it('should get workout frequency', async () => {
            const response = await axios.get(`${BASE_URL}/analytics/frequency`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            expect(response.status).to.equal(200);
            expect(response.data.success).to.equal(true);
        });
    });
});
