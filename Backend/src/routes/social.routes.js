const express = require('express');
const router = express.Router();
const socialController = require('../controllers/social.controller');
const validate = require('../middleware/validate');
const { addCommentSchema, getActivityFeedSchema } = require('../validation/social.validation');

/**
 * @swagger
 * /api/v1/social/feed:
 *   get:
 *     summary: Get activity feed
 *     tags: [Social]
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
 *     responses:
 *       200:
 *         description: Activity feed from followed users
 */
router.get('/feed', validate(getActivityFeedSchema), socialController.getActivityFeed);

/**
 * @swagger
 * /api/v1/social/activities/{activityId}/like:
 *   post:
 *     summary: Like an activity
 *     tags: [Social]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Activity liked
 *   delete:
 *     summary: Unlike an activity
 *     tags: [Social]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Activity unliked
 */
router.post('/activities/:activityId/like', socialController.likeActivity);
router.delete('/activities/:activityId/like', socialController.unlikeActivity);

/**
 * @swagger
 * /api/v1/social/activities/{activityId}/comments:
 *   post:
 *     summary: Add comment to activity
 *     tags: [Social]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: activityId
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
 *               - comment
 *             properties:
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added
 */
router.post('/activities/:activityId/comments', validate(addCommentSchema), socialController.addComment);

/**
 * @swagger
 * /api/v1/social/activities/{activityId}/comments/{commentId}:
 *   delete:
 *     summary: Delete comment
 *     tags: [Social]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: activityId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted
 */
router.delete('/activities/:activityId/comments/:commentId', socialController.deleteComment);

/**
 * @swagger
 * /api/v1/social/users/{targetUserId}/follow:
 *   post:
 *     summary: Follow a user
 *     tags: [Social]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: targetUserId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User followed
 *   delete:
 *     summary: Unfollow a user
 *     tags: [Social]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: targetUserId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User unfollowed
 */
router.post('/users/:targetUserId/follow', socialController.followUser);
router.delete('/users/:targetUserId/follow', socialController.unfollowUser);

/**
 * @swagger
 * /api/v1/social/users/{targetUserId}/followers:
 *   get:
 *     summary: Get user's followers
 *     tags: [Social]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: targetUserId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of followers
 */
router.get('/users/:targetUserId/followers', socialController.getFollowers);

/**
 * @swagger
 * /api/v1/social/users/{targetUserId}/following:
 *   get:
 *     summary: Get users that this user follows
 *     tags: [Social]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: targetUserId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of followed users
 */
router.get('/users/:targetUserId/following', socialController.getFollowing);

module.exports = router;
