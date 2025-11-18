const express = require('express');
const router = express.Router();
const templateController = require('../controllers/template.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate');
const {
    createTemplateSchema,
    generateAITemplateSchema,
    rateTemplateSchema,
    getTemplatesSchema
} = require('../validation/template.validation');

/**
 * @swagger
 * /api/v1/templates/featured:
 *   get:
 *     summary: Get featured workout templates (public)
 *     tags: [Templates]
 *     responses:
 *       200:
 *         description: List of featured templates
 */
router.get('/featured', templateController.getFeaturedTemplates);

/**
 * @swagger
 * /api/v1/templates:
 *   post:
 *     summary: Create a new workout template
 *     tags: [Templates]
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
 *                 example: Push Day
 *               description:
 *                 type: string
 *               exercises:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     exercise:
 *                       type: string
 *                     sets:
 *                       type: integer
 *                     reps:
 *                       type: integer
 *                     restTime:
 *                       type: integer
 *               difficulty:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *               category:
 *                 type: string
 *                 example: strength
 *               isPublic:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Template created
 *   get:
 *     summary: Get templates with filters
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *       - in: query
 *         name: myTemplates
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of templates
 */
router.post('/', verifyToken, validate(createTemplateSchema), templateController.createTemplate);

router.get('/', verifyToken, validate(getTemplatesSchema), templateController.getTemplates);

/**
 * @swagger
 * /api/v1/templates/{id}:
 *   get:
 *     summary: Get specific template details
 *     tags: [Templates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Template details
 *   put:
 *     summary: Update template
 *     tags: [Templates]
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
 *               description:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Template updated
 *   delete:
 *     summary: Delete template
 *     tags: [Templates]
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
 *         description: Template deleted
 */
router.get('/:id', templateController.getTemplate);

router.put('/:id', verifyToken, templateController.updateTemplate);

router.delete('/:id', verifyToken, templateController.deleteTemplate);

/**
 * @swagger
 * /api/v1/templates/{id}/duplicate:
 *   post:
 *     summary: Duplicate an existing template
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Template duplicated
 */
router.post('/:id/duplicate', verifyToken, templateController.duplicateTemplate);

/**
 * @swagger
 * /api/v1/templates/{id}/favorite:
 *   post:
 *     summary: Toggle template favorite status
 *     tags: [Templates]
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
 *         description: Favorite status toggled
 */
router.post('/:id/favorite', verifyToken, templateController.toggleFavorite);

/**
 * @swagger
 * /api/v1/templates/{id}/rate:
 *   post:
 *     summary: Rate a template
 *     tags: [Templates]
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
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               review:
 *                 type: string
 *     responses:
 *       200:
 *         description: Template rated
 */
router.post('/:id/rate', verifyToken, validate(rateTemplateSchema), templateController.rateTemplate);

module.exports = router;
