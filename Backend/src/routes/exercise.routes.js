const express = require('express');
const ExerciseController = require('../controllers/exercise.controller');

const router = express.Router();

/**
 * @swagger
 * /api/v1/exercises:
 *   get:
 *     summary: Get all exercises with filtering and pagination
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: muscleGroups
 *         schema:
 *           type: string
 *         description: Comma-separated muscle groups (e.g., chest,triceps)
 *       - in: query
 *         name: equipment
 *         schema:
 *           type: string
 *         description: Comma-separated equipment types
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in exercise name and description
 *     responses:
 *       200:
 *         description: List of exercises (265 total in database)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Exercise'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */
router.get('/', ExerciseController.getAllExercises);

/**
 * @swagger
 * /api/v1/exercises/{id}:
 *   get:
 *     summary: Get exercise by MongoDB ObjectId
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Exercise details
 *       404:
 *         description: Exercise not found
 */
router.get('/:id', ExerciseController.getExerciseById);

/**
 * @swagger
 * /api/v1/exercises:
 *   post:
 *     summary: Add new exercise to library (Admin only)
 *     tags: [Exercises]
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
 *               - description
 *               - primaryMuscleGroups
 *               - difficulty
 *             properties:
 *               name:
 *                 type: string
 *                 example: Dumbbell Chest Fly
 *               description:
 *                 type: string
 *               primaryMuscleGroups:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [chest]
 *               secondaryMuscleGroups:
 *                 type: array
 *                 items:
 *                   type: string
 *               difficulty:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *               equipment:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [dumbbell]
 *               instructions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Exercise created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', ExerciseController.addExercise);

/**
 * @swagger
 * /api/v1/exercises/{id}:
 *   put:
 *     summary: Update existing exercise (Admin only)
 *     tags: [Exercises]
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               difficulty:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *     responses:
 *       200:
 *         description: Exercise updated successfully
 *       404:
 *         description: Exercise not found
 *   delete:
 *     summary: Delete exercise (soft delete)
 *     tags: [Exercises]
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
 *         description: Exercise deleted successfully
 *       404:
 *         description: Exercise not found
 */
router.put('/:id', ExerciseController.updateExercise);

router.delete('/:id', ExerciseController.deleteExercise);

/**
 * @swagger
 * /api/v1/exercises/filters:
 *   get:
 *     summary: Get available filter options
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Available filter options
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
 *                     muscleGroups:
 *                       type: array
 *                       items:
 *                         type: string
 *                     equipment:
 *                       type: array
 *                       items:
 *                         type: string
 *                     difficulties:
 *                       type: array
 *                       items:
 *                         type: string
 */
router.get('/filters', ExerciseController.getExerciseFilters);

/**
 * @swagger
 * /api/v1/exercises/stats:
 *   get:
 *     summary: Get exercise library statistics
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Exercise statistics
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
 *                     total:
 *                       type: integer
 *                       example: 265
 *                     byMuscleGroup:
 *                       type: object
 *                     byDifficulty:
 *                       type: object
 *                     byEquipment:
 *                       type: object
 */
router.get('/stats', ExerciseController.getExerciseStats);


module.exports = router;