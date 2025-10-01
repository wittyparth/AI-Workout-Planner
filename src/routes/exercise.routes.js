const express = require('express');
const ExerciseController = require('../controllers/exercise.controller');

const router = express.Router();

/**
 * @route   GET /api/v1/exercises
 * @desc    Get all exercises with filtering and pagination
 * @access  Public
 * @params  Query parameters:
 *          - page: Page number (default: 1)
 *          - limit: Items per page (default: 20)
 *          - muscleGroups: Array of muscle groups to filter by
 *          - equipment: Array of equipment to filter by
 *          - difficulty: Difficulty level (beginner|intermediate|advanced|expert)
 *          - exerciseType: Type of exercise (strength|cardio|flexibility|balance|plyometric)
 *          - search: Text search in name/description
 *          - category: Exercise category (push|pull|legs|upper_body|lower_body|full_body|core|cardio|flexibility|warmup|cooldown)
 */
router.get('/', ExerciseController.getAllExercises);

/**
 * @route   POST /api/v1/exercises/search
 * @desc    Advanced exercise search with complex criteria
 * @access  Public
 * @body    Search criteria object
 */
router.post('/search', ExerciseController.searchExercises);

/**
 * @route   GET /api/v1/exercises/:id
 * @desc    Get exercise by ID
 * @access  Public
 * @params  id: Exercise ID (format: EX123456)
 */
router.get('/:id', ExerciseController.getExerciseById);

/**
 * @route   POST /api/v1/exercises
 * @desc    Add new exercise (Admin only)
 * @access  Private/Admin
 * @body    Exercise object following exercise schema
 */
router.post('/', ExerciseController.addExercise);

/**
 * @route   PUT /api/v1/exercises/:id
 * @desc    Update existing exercise (Admin only)
 * @access  Private/Admin
 * @params  id: Exercise ID
 * @body    Updated exercise data
 */
router.put('/:id', ExerciseController.updateExercise);

/**
 * @route   DELETE /api/v1/exercises/:id
 * @desc    Delete exercise (Admin only)
 * @access  Private/Admin
 * @params  id: Exercise ID
 */
router.delete('/:id', ExerciseController.deleteExercise);

/**
 * @route   GET /api/v1/exercises/filters
 * @desc    Get available filter options for exercises
 * @access  Public
 */
router.get('/filters', ExerciseController.getExerciseFilters);

/**
 * @route   GET /api/v1/exercises/stats
 * @desc    Get exercise library statistics
 * @access  Public
 */
router.get('/stats', ExerciseController.getExerciseStats);


module.exports = router;