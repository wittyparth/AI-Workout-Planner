const express = require('express');
const router = express.Router();
const multer = require('multer');
const progressController = require('../controllers/progress.controller');
const validate = require('../middleware/validate');
const { addBodyMetricsSchema, uploadPhotoSchema } = require('../validation/progress.validation');

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept images only
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
    }
});

/**
 * @swagger
 * /api/v1/progress:
 *   get:
 *     summary: Get user progress data
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Progress data including metrics, photos, and streaks
 */
router.get('/', progressController.getProgress);

/**
 * @swagger
 * /api/v1/progress/metrics:
 *   post:
 *     summary: Add body metrics entry
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - weight
 *             properties:
 *               weight:
 *                 type: number
 *                 example: 75.5
 *               bodyFat:
 *                 type: number
 *               muscleMass:
 *                 type: number
 *               measurements:
 *                 type: object
 *                 properties:
 *                   chest:
 *                     type: number
 *                   waist:
 *                     type: number
 *                   arms:
 *                     type: number
 *                   legs:
 *                     type: number
 *     responses:
 *       201:
 *         description: Metrics added
 */
router.post('/metrics', validate(addBodyMetricsSchema), progressController.addBodyMetrics);

/**
 * @swagger
 * /api/v1/progress/metrics/{metricId}:
 *   delete:
 *     summary: Delete body metric entry
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: metricId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Metric deleted
 */
router.delete('/metrics/:metricId', progressController.deleteBodyMetric);

/**
 * @swagger
 * /api/v1/progress/photos:
 *   post:
 *     summary: Upload progress photo
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - photo
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *               category:
 *                 type: string
 *                 enum: [front, back, side]
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Photo uploaded (processed with Sharp, stored in S3)
 */
router.post('/photos', upload.single('photo'), validate(uploadPhotoSchema), progressController.uploadPhoto);

/**
 * @swagger
 * /api/v1/progress/strength/{exerciseId}:
 *   get:
 *     summary: Get strength progression for specific exercise
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: exerciseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Strength progression data
 */
router.get('/strength/:exerciseId', progressController.getStrengthProgression);

/**
 * @swagger
 * /api/v1/progress/prs:
 *   get:
 *     summary: Get personal records (PRs)
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of personal records across all exercises
 */
router.get('/prs', progressController.getPersonalRecords);

/**
 * @swagger
 * /api/v1/progress/streaks:
 *   get:
 *     summary: Get workout streaks
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current and longest workout streaks
 */
router.get('/streaks', progressController.getStreaks);

/**
 * @swagger
 * /api/v1/progress/analytics:
 *   get:
 *     summary: Get progress analytics
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Comprehensive progress analytics
 */
router.get('/analytics', progressController.getAnalytics);

module.exports = router;
