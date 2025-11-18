const Activity = require('../models/activity.models');
const User = require('../models/user.models');
const { ApiError } = require('../utils/errors');
const logger = require('../utils/logger');

/**
 * Get activity feed
 * GET /api/v1/social/feed
 */
exports.getActivityFeed = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 20, filter = 'all' } = req.query;

        const user = await User.findById(userId).select('socialData.following socialData.friends');

        if (!user) {
            throw new ApiError('User not found', 404);
        }

        // Build query based on filter
        let query = {};

        if (filter === 'friends') {
            query.userId = { $in: user.socialData.friends };
        } else if (filter === 'following') {
            query.userId = { $in: user.socialData.following };
        } else if (filter === 'mine') {
            query.userId = userId;
        } else {
            // All - include own posts, friends, and following
            query.userId = {
                $in: [userId, ...user.socialData.friends, ...user.socialData.following]
            };
        }

        // Only show public or friend-visible posts
        query.$or = [
            { visibility: 'public' },
            {
                $and: [
                    { visibility: 'friends' },
                    { userId: { $in: user.socialData.friends } }
                ]
            },
            { userId } // Always show own posts
        ];

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [activities, total] = await Promise.all([
            Activity.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .populate('userId', 'profile.firstName profile.lastName profile.avatar username')
                .populate('workoutId', 'metrics.totalVolume metrics.duration')
                .populate('engagement.likes', 'profile.firstName profile.lastName username')
                .lean(),
            Activity.countDocuments(query)
        ]);

        res.json({
            success: true,
            data: {
                activities,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        logger.error('Get activity feed error:', error);
        next(error);
    }
};

/**
 * Like an activity
 * POST /api/v1/social/activities/:activityId/like
 */
exports.likeActivity = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { activityId } = req.params;

        const activity = await Activity.findById(activityId);

        if (!activity) {
            throw new ApiError('Activity not found', 404);
        }

        // Check if already liked
        const alreadyLiked = activity.engagement.likes.some(
            like => like.toString() === userId
        );

        if (alreadyLiked) {
            throw new ApiError('Already liked this activity', 400);
        }

        activity.engagement.likes.push(userId);
        activity.engagement.likeCount = activity.engagement.likes.length;

        await activity.save();

        res.json({
            success: true,
            data: { likeCount: activity.engagement.likeCount },
            message: 'Activity liked successfully'
        });
    } catch (error) {
        logger.error('Like activity error:', error);
        next(error);
    }
};

/**
 * Unlike an activity
 * DELETE /api/v1/social/activities/:activityId/like
 */
exports.unlikeActivity = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { activityId } = req.params;

        const activity = await Activity.findById(activityId);

        if (!activity) {
            throw new ApiError('Activity not found', 404);
        }

        activity.engagement.likes = activity.engagement.likes.filter(
            like => like.toString() !== userId
        );
        activity.engagement.likeCount = activity.engagement.likes.length;

        await activity.save();

        res.json({
            success: true,
            data: { likeCount: activity.engagement.likeCount },
            message: 'Activity unliked successfully'
        });
    } catch (error) {
        logger.error('Unlike activity error:', error);
        next(error);
    }
};

/**
 * Add comment to activity
 * POST /api/v1/social/activities/:activityId/comments
 */
exports.addComment = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { activityId } = req.params;
        const { text } = req.body;

        if (!text || text.trim().length === 0) {
            throw new ApiError('Comment text is required', 400);
        }

        const activity = await Activity.findById(activityId);

        if (!activity) {
            throw new ApiError('Activity not found', 404);
        }

        activity.engagement.comments.push({
            userId,
            text: text.trim(),
            createdAt: new Date()
        });

        activity.engagement.commentCount = activity.engagement.comments.length;

        await activity.save();

        // Populate the new comment
        await activity.populate('engagement.comments.userId', 'profile.firstName profile.lastName profile.avatar username');

        const newComment = activity.engagement.comments[activity.engagement.comments.length - 1];

        res.status(201).json({
            success: true,
            data: newComment,
            message: 'Comment added successfully'
        });
    } catch (error) {
        logger.error('Add comment error:', error);
        next(error);
    }
};

/**
 * Delete comment
 * DELETE /api/v1/social/activities/:activityId/comments/:commentId
 */
exports.deleteComment = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { activityId, commentId } = req.params;

        const activity = await Activity.findById(activityId);

        if (!activity) {
            throw new ApiError('Activity not found', 404);
        }

        const comment = activity.engagement.comments.id(commentId);

        if (!comment) {
            throw new ApiError('Comment not found', 404);
        }

        // Only comment owner or activity owner can delete
        if (comment.userId.toString() !== userId && activity.userId.toString() !== userId) {
            throw new ApiError('Not authorized to delete this comment', 403);
        }

        activity.engagement.comments.pull(commentId);
        activity.engagement.commentCount = activity.engagement.comments.length;

        await activity.save();

        res.json({
            success: true,
            message: 'Comment deleted successfully'
        });
    } catch (error) {
        logger.error('Delete comment error:', error);
        next(error);
    }
};

/**
 * Follow a user
 * POST /api/v1/social/users/:targetUserId/follow
 */
exports.followUser = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { targetUserId } = req.params;

        if (userId === targetUserId) {
            throw new ApiError('Cannot follow yourself', 400);
        }

        const [currentUser, targetUser] = await Promise.all([
            User.findById(userId),
            User.findById(targetUserId)
        ]);

        if (!targetUser) {
            throw new ApiError('User not found', 404);
        }

        // Check if already following
        const alreadyFollowing = currentUser.socialData.following.some(
            id => id.toString() === targetUserId
        );

        if (alreadyFollowing) {
            throw new ApiError('Already following this user', 400);
        }

        // Add to following list
        currentUser.socialData.following.push(targetUserId);
        targetUser.socialData.followers.push(userId);

        await Promise.all([currentUser.save(), targetUser.save()]);

        res.json({
            success: true,
            message: 'User followed successfully'
        });
    } catch (error) {
        logger.error('Follow user error:', error);
        next(error);
    }
};

/**
 * Unfollow a user
 * DELETE /api/v1/social/users/:targetUserId/follow
 */
exports.unfollowUser = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { targetUserId } = req.params;

        const [currentUser, targetUser] = await Promise.all([
            User.findById(userId),
            User.findById(targetUserId)
        ]);

        if (!targetUser) {
            throw new ApiError('User not found', 404);
        }

        // Remove from following/followers lists
        currentUser.socialData.following = currentUser.socialData.following.filter(
            id => id.toString() !== targetUserId
        );
        targetUser.socialData.followers = targetUser.socialData.followers.filter(
            id => id.toString() !== userId
        );

        await Promise.all([currentUser.save(), targetUser.save()]);

        res.json({
            success: true,
            message: 'User unfollowed successfully'
        });
    } catch (error) {
        logger.error('Unfollow user error:', error);
        next(error);
    }
};

/**
 * Get user's followers
 * GET /api/v1/social/users/:targetUserId/followers
 */
exports.getFollowers = async (req, res, next) => {
    try {
        const { targetUserId } = req.params;

        const user = await User.findById(targetUserId)
            .select('socialData.followers')
            .populate('socialData.followers', 'profile.firstName profile.lastName profile.avatar username');

        if (!user) {
            throw new ApiError('User not found', 404);
        }

        res.json({
            success: true,
            data: user.socialData.followers
        });
    } catch (error) {
        logger.error('Get followers error:', error);
        next(error);
    }
};

/**
 * Get user's following
 * GET /api/v1/social/users/:targetUserId/following
 */
exports.getFollowing = async (req, res, next) => {
    try {
        const { targetUserId } = req.params;

        const user = await User.findById(targetUserId)
            .select('socialData.following')
            .populate('socialData.following', 'profile.firstName profile.lastName profile.avatar username');

        if (!user) {
            throw new ApiError('User not found', 404);
        }

        res.json({
            success: true,
            data: user.socialData.following
        });
    } catch (error) {
        logger.error('Get following error:', error);
        next(error);
    }
};
