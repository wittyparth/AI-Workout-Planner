const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');

/**
 * @swagger
 * /api/v1/analytics/dashboard:
 *   get:
 *     summary: Get dashboard statistics overview
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats including workouts, volume, PRs, streaks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalWorkouts:
 *                   type: integer
 *                 totalVolume:
 *                   type: number
 *                 currentStreak:
 *                   type: integer
 *                 recentPRs:
 *                   type: array
 */
router.get('/dashboard', analyticsController.getDashboardStats);

/**
 * @swagger
 * /api/v1/analytics/strength-trends:
 *   get:
 *     summary: Get strength trends over time
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: exerciseId
 *         schema:
 *           type: string
 *       - in: query
 *         name: timeRange
 *         schema:
 *           type: string
 *           enum: [week, month, quarter, year]
 *     responses:
 *       200:
 *         description: Strength trends data
 */
router.get('/strength-trends', analyticsController.getStrengthTrends);

/**
 * @swagger
 * /api/v1/analytics/pr-history:
 *   get:
 *     summary: Get personal record history
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chronological PR history
 */
router.get('/pr-history', analyticsController.getPRHistory);

/**
 * @swagger
 * /api/v1/analytics/volume:
 *   get:
 *     summary: Get volume analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: timeRange
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Training volume analytics by muscle group and time period
 */
router.get('/volume', analyticsController.getVolumeAnalytics);

/**
 * @swagger
 * /api/v1/analytics/frequency:
 *   get:
 *     summary: Get workout frequency analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Workout frequency patterns and trends
 */
router.get('/frequency', analyticsController.getWorkoutFrequency);

/**
 * @swagger
 * /api/v1/analytics/muscle-distribution:
 *   get:
 *     summary: Get muscle group distribution
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Breakdown of training volume by muscle group
 */
router.get('/muscle-distribution', analyticsController.getMuscleGroupDistribution);

/**
 * @swagger
 * /api/v1/analytics/compare:
 *   post:
 *     summary: Compare exercises performance
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - exerciseIds
 *             properties:
 *               exerciseIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]
 *     responses:
 *       200:
 *         description: Exercise comparison data
 */
router.post('/compare', analyticsController.compareExercises);

module.exports = router;
