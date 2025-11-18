const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workout.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate');
const {
    createWorkoutSchema,
    completeSetSchema,
    getWorkoutHistorySchema
} = require('../validation/workout.validation');

/**
 * @swagger
 * /api/v1/workouts/stats:
 *   get:
 *     summary: Get workout statistics for current user
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Workout statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalWorkouts:
 *                   type: integer
 *                 completedWorkouts:
 *                   type: integer
 *                 totalExercises:
 *                   type: integer
 *                 totalSets:
 *                   type: integer
 */
router.get('/stats', verifyToken, workoutController.getWorkoutStats);

/**
 * @swagger
 * /api/v1/workouts:
 *   post:
 *     summary: Create a new workout session
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - exercises
 *             properties:
 *               name:
 *                 type: string
 *                 example: Upper Body Strength
 *               exercises:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     exercise:
 *                       type: string
 *                       description: Exercise ID
 *                     plannedSets:
 *                       type: integer
 *                     plannedReps:
 *                       type: integer
 *                     plannedWeight:
 *                       type: number
 *               templateId:
 *                 type: string
 *                 description: Optional template ID
 *     responses:
 *       201:
 *         description: Workout created
 *       400:
 *         description: Validation error
 *   get:
 *     summary: Get workout history with filters
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [planned, in_progress, completed, cancelled]
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Workout history
 */
router.post('/', validate(createWorkoutSchema), verifyToken, workoutController.createWorkout);

router.get('/', validate(getWorkoutHistorySchema), verifyToken, workoutController.getWorkoutHistory);

/**
 * @swagger
 * /api/v1/workouts/{id}:
 *   get:
 *     summary: Get specific workout details
 *     tags: [Workouts]
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
 *         description: Workout details
 *       404:
 *         description: Workout not found
 *   put:
 *     summary: Update workout details
 *     tags: [Workouts]
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
 *               name:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Workout updated
 *   delete:
 *     summary: Delete workout
 *     tags: [Workouts]
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
 *         description: Workout deleted
 */
router.get('/:id', verifyToken, workoutController.getWorkout);

router.put('/:id', verifyToken, workoutController.updateWorkout);

router.delete('/:id', verifyToken, workoutController.deleteWorkout);

/**
 * @swagger
 * /api/v1/workouts/{id}/start:
 *   post:
 *     summary: Start a workout session
 *     tags: [Workouts]
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
 *         description: Workout started
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
 *                     status:
 *                       type: string
 *                       example: in_progress
 *                     startTime:
 *                       type: string
 *                       format: date-time
 */
router.post('/:id/start', verifyToken, workoutController.startWorkout);

/**
 * @swagger
 * /api/v1/workouts/{id}/set:
 *   post:
 *     summary: Complete a set in workout
 *     tags: [Workouts]
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
 *               - exerciseId
 *               - setNumber
 *               - reps
 *               - weight
 *             properties:
 *               exerciseId:
 *                 type: string
 *               setNumber:
 *                 type: integer
 *               reps:
 *                 type: integer
 *               weight:
 *                 type: number
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Set completed
 */
router.post('/:id/set', validate(completeSetSchema), verifyToken, workoutController.completeSet);

/**
 * @swagger
 * /api/v1/workouts/{id}/complete:
 *   post:
 *     summary: Complete entire workout session
 *     tags: [Workouts]
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
 *               notes:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: Workout completed
 */
router.post('/:id/complete', verifyToken, workoutController.completeWorkout);

module.exports = router;
