const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goal.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate');
const {
    createGoalSchema,
    updateGoalProgressSchema,
    addMilestoneSchema,
    updateGoalSchema
} = require('../validation/goal.validation');

/**
 * @swagger
 * /api/v1/goals/stats:
 *   get:
 *     summary: Get goal statistics for current user
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Goal statistics
 */
router.get('/stats', verifyToken, goalController.getGoalStats);

/**
 * @swagger
 * /api/v1/goals:
 *   post:
 *     summary: Create a new fitness goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - target
 *               - deadline
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [weight_loss, muscle_gain, strength, endurance, flexibility, habit]
 *                 example: muscle_gain
 *               target:
 *                 type: number
 *                 example: 75
 *               unit:
 *                 type: string
 *                 example: kg
 *               deadline:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Goal created
 *   get:
 *     summary: Get all user goals
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, completed, abandoned]
 *     responses:
 *       200:
 *         description: List of goals
 */
router.post('/', verifyToken, validate(createGoalSchema), goalController.createGoal);

router.get('/', verifyToken, goalController.getGoals);

/**
 * @swagger
 * /api/v1/goals/{id}:
 *   get:
 *     summary: Get specific goal details
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Goal details
 *   put:
 *     summary: Update goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               target:
 *                 type: number
 *               deadline:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Goal updated
 *   delete:
 *     summary: Delete goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Goal deleted
 */
router.get('/:id', verifyToken, goalController.getGoal);

router.put('/:id', verifyToken, validate(updateGoalSchema), goalController.updateGoal);

router.delete('/:id', verifyToken, goalController.deleteGoal);

/**
 * @swagger
 * /api/v1/goals/{id}/progress:
 *   post:
 *     summary: Update goal progress
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentValue
 *             properties:
 *               currentValue:
 *                 type: number
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Progress updated
 */
router.post('/:id/progress', verifyToken, validate(updateGoalProgressSchema), goalController.updateProgress);

/**
 * @swagger
 * /api/v1/goals/{id}/milestone:
 *   post:
 *     summary: Add milestone to goal
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - targetValue
 *             properties:
 *               name:
 *                 type: string
 *               targetValue:
 *                 type: number
 *               targetDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Milestone added
 */
router.post('/:id/milestone', verifyToken, validate(addMilestoneSchema), goalController.addMilestone);

/**
 * @swagger
 * /api/v1/goals/{id}/insights:
 *   get:
 *     summary: Get AI-powered goal insights
 *     tags: [Goals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Goal insights and recommendations
 */
router.get('/:id/insights', verifyToken, goalController.getGoalInsights);

module.exports = router;
