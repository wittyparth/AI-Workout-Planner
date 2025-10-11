const { z } = require('zod');
const { generateOpenApiDocument } = require('zod-to-openapi');
const swaggerUi = require('swagger-ui-express');
const authSchemas = require('../validation/userSchema');

const openApiDoc = generateOpenApiDocument({
  openApiVersion: '3.0.0',
  info: {
    title: 'JWT Auth API',
    version: '1.0.0',
    description: 'Automatically generated OpenAPI docs using Zod schemas',
  },
  schemas: {
    registerSchema: authSchemas.registerSchema,
    loginSchema: authSchemas.loginSchema,
    refreshSchema: authSchemas.refreshSchema,
    logoutSchema: authSchemas.logoutSchema,
  },
  // Map paths
  paths: {
    '/api/v1/auth/register': { post: { requestBody: { content: { 'application/json': { schema: authSchemas.registerSchema.openapi() } } }, responses: { 200: { description: 'Success' } } } },
    '/api/v1/auth/login': { post: { requestBody: { content: { 'application/json': { schema: authSchemas.loginSchema.openapi() } } }, responses: { 200: { description: 'Success' } } } },
    '/api/v1/auth/refresh': { post: { requestBody: { content: { 'application/json': { schema: authSchemas.refreshSchema.openapi() } } }, responses: { 200: { description: 'Success' } } } },
    '/api/v1/auth/logout': { post: { requestBody: { content: { 'application/json': { schema: authSchemas.logoutSchema.openapi() } } }, responses: { 200: { description: 'Success' } } } },
  },
});

module.exports = { swaggerUi, openApiDoc };
