/**
 * Integration Tests - Authentication Flow
 * Tests the complete authentication user journey
 */

const axios = require('axios');
const { expect } = require('chai');

const BASE_URL = 'http://localhost:5000/api/v1';
let authToken = null;
let refreshToken = null;
let userId = null;

// Test user data
const testUser = {
    email: `test-auth-${Date.now()}@example.com`,
    password: 'SecurePass123!@#'
};

describe('Authentication Flow Integration Tests', () => {
    
    describe('User Registration', () => {
        it('should register a new user successfully', async () => {
            const response = await axios.post(`${BASE_URL}/auth/register`, testUser);
            
            expect(response.status).to.equal(201);
            expect(response.data).to.have.property('success', true);
            expect(response.data.data).to.have.property('email', testUser.email);
            
            userId = response.data.data._id;
            
            // Login to get tokens
            const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
                email: testUser.email,
                password: testUser.password
            });
            authToken = loginResponse.data.data.accessToken;
            refreshToken = loginResponse.data.data.refreshToken;
        });

        it('should reject duplicate email registration', async () => {
            try {
                await axios.post(`${BASE_URL}/auth/register`, testUser);
                throw new Error('Should have thrown error');
            } catch (error) {
                expect(error.response.status).to.equal(400);
                expect(error.response.data.success).to.equal(false);
            }
        });

        it('should reject registration with invalid email', async () => {
            try {
                await axios.post(`${BASE_URL}/auth/register`, {
                    ...testUser,
                    email: 'invalid-email'
                });
                throw new Error('Should have thrown error');
            } catch (error) {
                expect(error.response.status).to.be.oneOf([400, 500]);
            }
        });

        it('should reject registration with weak password', async () => {
            try {
                await axios.post(`${BASE_URL}/auth/register`, {
                    ...testUser,
                    email: `test-weak-${Date.now()}@example.com`,
                    password: '123'
                });
                throw new Error('Should have thrown error');
            } catch (error) {
                expect(error.response.status).to.be.oneOf([400, 500]);
            }
        });
    });

    describe('User Login', () => {
        it('should login with correct credentials', async () => {
            const response = await axios.post(`${BASE_URL}/auth/login`, {
                email: testUser.email,
                password: testUser.password
            });

            expect(response.status).to.equal(203);
            expect(response.data).to.have.property('success', true);
            expect(response.data.data).to.have.property('accessToken');
            expect(response.data.data).to.have.property('refreshToken');
            expect(response.data.data).to.have.property('id');
            
            authToken = response.data.data.accessToken;
            refreshToken = response.data.data.refreshToken;
        });

        it('should reject login with wrong password', async () => {
            try {
                await axios.post(`${BASE_URL}/auth/login`, {
                    email: testUser.email,
                    password: 'WrongPassword123!'
                });
                throw new Error('Should have thrown error');
            } catch (error) {
                expect(error.response.status).to.equal(403);
            }
        });

        it('should reject login with non-existent email', async () => {
            try {
                await axios.post(`${BASE_URL}/auth/login`, {
                    email: 'nonexistent@example.com',
                    password: testUser.password
                });
                throw new Error('Should have thrown error');
            } catch (error) {
                expect(error.response.status).to.be.oneOf([403, 500]);
            }
        });
    });

    describe('Protected Routes', () => {
        it('should access protected route with valid token', async () => {
            const response = await axios.get(`${BASE_URL}/exercises`, {
                headers: { Authorization: `Bearer ${authToken}` },
                params: { limit: 5 }
            });

            expect(response.status).to.equal(200);
            expect(response.data).to.have.property('success', true);
        });

        it('should reject access without token', async () => {
            try {
                await axios.get(`${BASE_URL}/exercises`);
                throw new Error('Should have thrown error');
            } catch (error) {
                expect(error.response.status).to.equal(401);
            }
        });

        it('should reject access with invalid token', async () => {
            try {
                await axios.get(`${BASE_URL}/exercises`, {
                    headers: { Authorization: 'Bearer invalid-token-12345' }
                });
                throw new Error('Should have thrown error');
            } catch (error) {
                expect(error.response.status).to.equal(401);
            }
        });
    });

    describe('Token Refresh', () => {
        it('should refresh access token with valid refresh token', async () => {
            const response = await axios.post(`${BASE_URL}/auth/refresh`, {
                refreshToken: refreshToken
            });

            expect(response.status).to.equal(200);
            expect(response.data).to.have.property('success', true);
            expect(response.data.data).to.have.property('acessToken'); // Note: typo in API
        });
    });

    describe('Logout', () => {
        it('should logout successfully', async () => {
            const response = await axios.post(`${BASE_URL}/auth/logout`, {
                refreshToken: refreshToken
            });

            expect(response.status).to.equal(200);
            expect(response.data.success).to.equal(true);
        });
    });
});
