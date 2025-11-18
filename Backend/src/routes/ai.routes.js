const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate');
const {
    generateWorkoutSchema,
    suggestExercisesSchema,
    analyzeProgressSchema,
    optimizeGoalsSchema
} = require('../validation/ai.validation');

/**
 * AI Routes
 * Base path: /api/v1/ai
 * All routes require authentication
 */

/**
 * @swagger
 * /api/v1/ai/status:
 *   get:
 *     summary: Check AI service status
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: AI service status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     available:
 *                       type: boolean
 *                       example: true
 *                     model:
 *                       type: string
 *                       example: gemini-2.0-flash
 *                     features:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ['workout_generation', 'exercise_suggestions', 'progress_analysis']
 */
router.get('/status', verifyToken, aiController.getAIStatus);

/**
 * @swagger
 * /api/v1/ai/workout-generate:
 *   post:
 *     summary: Generate AI-powered workout plan
 *     description: Uses Gemini 2.0 Flash to create personalized workout based on user preferences
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               goal:
 *                 type: string
 *                 enum: [muscle_gain, weight_loss, strength, endurance, flexibility]
 *                 example: muscle_gain
 *               duration:
 *                 type: number
 *                 description: Workout duration in minutes
 *                 example: 60
 *               difficulty:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *                 example: intermediate
 *               equipment:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ['barbell', 'dumbbells', 'bench']
 *               targetMuscles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ['chest', 'triceps', 'shoulders']
 *     responses:
 *       201:
 *         description: Workout generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     workout:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         exercises:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               exercise:
 *                                 type: string
 *                               sets:
 *                                 type: number
 *                               reps:
 *                                 type: number
 *                               restTime:
 *                                 type: number
 *                     aiMetadata:
 *                       type: object
 *                       properties:
 *                         model:
 *                           type: string
 *                         generatedAt:
 *                           type: string
 *                         confidence:
 *                           type: number
 *       503:
 *         description: AI service unavailable
 */
router.post('/workout-generate', verifyToken, validate(generateWorkoutSchema), aiController.generateWorkout);

/**
 * @swagger
 * /api/v1/ai/exercise-suggest:
 *   post:
 *     summary: Get AI-powered alternative exercise suggestions
 *     description: Suggests alternative exercises based on equipment, difficulty, or injury constraints
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - exerciseId
 *             properties:
 *               exerciseId:
 *                 type: string
 *                 description: MongoDB ObjectId of the exercise
 *                 example: 507f1f77bcf86cd799439011
 *               criteria:
 *                 type: object
 *                 properties:
 *                   equipment:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ['bodyweight']
 *                   difficulty:
 *                     type: string
 *                     enum: [beginner, intermediate, advanced]
 *                     example: beginner
 *                   reason:
 *                     type: string
 *                     example: No gym equipment available
 *     responses:
 *       200:
 *         description: Alternative exercises suggested
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     alternatives:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           similarityScore:
 *                             type: number
 *                             example: 85
 *                           reason:
 *                             type: string
 *                             example: Similar movement pattern with bodyweight
 *                           benefits:
 *                             type: string
 *                             example: Can be performed anywhere without equipment
 *                           aiGenerated:
 *                             type: boolean
 */
router.post('/exercise-suggest', verifyToken, validate(suggestExercisesSchema), aiController.suggestExercises);

/**
 * @swagger
 * /api/v1/ai/progress-insights:
 *   get:
 *     summary: Get AI-powered progress analysis
 *     description: Analyzes workout history and provides insights and recommendations
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Progress analysis completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     insights:
 *                       type: array
 *                       items:
 *                         type: string
 *                     recommendations:
 *                       type: array
 *                       items:
 *                         type: string
 */
router.get('/progress-insights', verifyToken, validate(analyzeProgressSchema), aiController.analyzeProgress);

/**
 * @swagger
 * /api/v1/ai/goal-optimize:
 *   post:
 *     summary: Get AI recommendations for goal optimization
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - goalId
 *             properties:
 *               goalId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Goal optimization suggestions
 */
router.post('/goal-optimize', verifyToken, validate(optimizeGoalsSchema), aiController.optimizeGoal);

module.exports = router;
