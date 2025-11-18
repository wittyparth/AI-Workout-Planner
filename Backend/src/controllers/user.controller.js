const User = require('../models/user.models');
const { uploadProfilePicture } = require('../config/s3.config');
const { ApiError } = require('../utils/errors');
const logger = require('../utils/logger');

/**
 * Get user profile
 * GET /api/v1/user/profile
 */
exports.getProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select('-password -refreshTokens');

        if (!user) {
            throw new ApiError('User not found', 404);
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        logger.error('Get profile error:', error);
        next(error);
    }
};

/**
 * Update user profile
 * PUT /api/v1/user/profile
 */
exports.updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { firstName, lastName, gender, dateOfBirth, fitnessLevel, goals, bio } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError('User not found', 404);
        }

        // Update profile fields
        if (firstName !== undefined) user.profile.firstName = firstName;
        if (lastName !== undefined) user.profile.lastName = lastName;
        if (gender !== undefined) user.profile.gender = gender;
        if (dateOfBirth !== undefined) user.profile.dateOfBirth = dateOfBirth;
        if (fitnessLevel !== undefined) user.profile.fitnessLevel = fitnessLevel;
        if (goals !== undefined) user.profile.goals = goals;
        if (bio !== undefined) user.profile.bio = bio;

        await user.save();

        res.json({
            success: true,
            data: user.profile,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        logger.error('Update profile error:', error);
        next(error);
    }
};

/**
 * Upload profile picture
 * POST /api/v1/user/avatar
 */
exports.uploadAvatar = async (req, res, next) => {
    try {
        const userId = req.user.id || req.user._id;

        logger.info(`Upload avatar - userId: ${userId}, user object keys: ${Object.keys(req.user).join(', ')}`);

        if (!req.file) {
            throw new ApiError('No image uploaded', 400);
        }

        // Upload to S3
        const avatarUrl = await uploadProfilePicture(req.file, userId);

        // Update user
        const user = await User.findByIdAndUpdate(
            userId,
            { 'profile.avatar': avatarUrl },
            { new: true }
        ).select('-password -refreshTokens');

        res.json({
            success: true,
            data: { avatarUrl },
            message: 'Avatar uploaded successfully'
        });
    } catch (error) {
        logger.error('Upload avatar error:', error);
        next(error);
    }
};

/**
 * Update user preferences
 * PUT /api/v1/user/preferences
 */
exports.updatePreferences = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { units, notifications, privacy, theme } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError('User not found', 404);
        }

        // Update preferences
        if (units !== undefined) user.preferences.units = units;
        if (notifications !== undefined) {
            user.preferences.notifications = {
                ...user.preferences.notifications,
                ...notifications
            };
        }
        if (privacy !== undefined) {
            user.preferences.privacy = {
                ...user.preferences.privacy,
                ...privacy
            };
        }
        if (theme !== undefined) user.preferences.theme = theme;

        await user.save();

        res.json({
            success: true,
            data: user.preferences,
            message: 'Preferences updated successfully'
        });
    } catch (error) {
        logger.error('Update preferences error:', error);
        next(error);
    }
};

/**
 * Update body metrics
 * PUT /api/v1/user/metrics
 */
exports.updateMetrics = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { weight, height, bodyFat, targetWeight } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError('User not found', 404);
        }

        // Update metrics
        if (weight !== undefined) user.metrics.weight = weight;
        if (height !== undefined) user.metrics.height = height;
        if (bodyFat !== undefined) user.metrics.bodyFat = bodyFat;
        if (targetWeight !== undefined) user.metrics.targetWeight = targetWeight;

        // Calculate BMI if height and weight are available
        if (user.metrics.height && user.metrics.weight) {
            const heightInMeters = user.metrics.height / 100;
            user.metrics.bmi = parseFloat(
                (user.metrics.weight / (heightInMeters * heightInMeters)).toFixed(2)
            );
        }

        await user.save();

        res.json({
            success: true,
            data: user.metrics,
            message: 'Metrics updated successfully'
        });
    } catch (error) {
        logger.error('Update metrics error:', error);
        next(error);
    }
};

/**
 * Get user statistics
 * GET /api/v1/user/stats
 */
exports.getUserStats = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select('socialData achievements');

        if (!user) {
            throw new ApiError('User not found', 404);
        }

        const stats = {
            followers: user.socialData.followers.length,
            following: user.socialData.following.length,
            friends: user.socialData.friends.length,
            achievements: user.achievements.length,
            level: calculateUserLevel(user.achievements.length)
        };

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        logger.error('Get user stats error:', error);
        next(error);
    }
};

/**
 * Delete user account
 * DELETE /api/v1/user/account
 */
exports.deleteAccount = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { confirmPassword } = req.body;

        if (!confirmPassword) {
            throw new ApiError('Password confirmation required', 400);
        }

        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError('User not found', 404);
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(confirmPassword);

        if (!isPasswordValid) {
            throw new ApiError('Invalid password', 401);
        }

        // Soft delete - mark as inactive
        user.isActive = false;
        user.deletedAt = new Date();
        await user.save();

        // TODO: Add cleanup job to delete related data (workouts, goals, etc.)

        res.json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        logger.error('Delete account error:', error);
        next(error);
    }
};

/**
 * Helper function to calculate user level based on achievements
 */
function calculateUserLevel(achievementCount) {
    if (achievementCount >= 50) return 'Expert';
    if (achievementCount >= 30) return 'Advanced';
    if (achievementCount >= 15) return 'Intermediate';
    if (achievementCount >= 5) return 'Beginner';
    return 'Novice';
}
