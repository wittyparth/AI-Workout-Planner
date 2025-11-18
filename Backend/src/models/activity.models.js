const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        activityType: {
            type: String,
            enum: [
                'workout_completed',
                'goal_achieved',
                'personal_record',
                'template_shared',
                'milestone_reached',
                'streak_achievement',
                'profile_updated',
                'friend_added'
            ],
            required: true,
            index: true
        },
        targetType: {
            type: String,
            enum: ['workout', 'template', 'goal', 'user', 'achievement'],
            required: true
        },
        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'targetType'
        },
        content: {
            title: {
                type: String,
                required: true
            },
            description: String,
            metadata: mongoose.Schema.Types.Mixed, // Flexible data for activity-specific info
            media: [String] // URLs to images/videos
        },
        engagement: {
            likes: [{
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                },
                likedAt: {
                    type: Date,
                    default: Date.now
                }
            }],
            comments: [{
                _id: {
                    type: mongoose.Schema.Types.ObjectId,
                    default: () => new mongoose.Types.ObjectId()
                },
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true
                },
                content: {
                    type: String,
                    required: true,
                    trim: true
                },
                createdAt: {
                    type: Date,
                    default: Date.now
                },
                likes: [{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                }]
            }],
            shares: [{
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                },
                sharedAt: {
                    type: Date,
                    default: Date.now
                },
                platform: {
                    type: String,
                    enum: ['internal', 'facebook', 'twitter', 'instagram'],
                    default: 'internal'
                }
            }]
        },
        visibility: {
            type: String,
            enum: ['public', 'friends', 'private'],
            default: 'friends',
            index: true
        },
        isPromoted: {
            type: Boolean,
            default: false,
            index: true
        },
        isPinned: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

// Indexes for performance
activitySchema.index({ userId: 1, createdAt: -1 });
activitySchema.index({ activityType: 1, createdAt: -1 });
activitySchema.index({ visibility: 1, createdAt: -1 });
activitySchema.index({ isPromoted: 1, createdAt: -1 });

// Virtual for like count
activitySchema.virtual('likeCount').get(function () {
    return this.engagement.likes.length;
});

// Virtual for comment count
activitySchema.virtual('commentCount').get(function () {
    return this.engagement.comments.length;
});

// Virtual for share count
activitySchema.virtual('shareCount').get(function () {
    return this.engagement.shares.length;
});

// Method to add like
activitySchema.methods.addLike = function (userId) {
    const alreadyLiked = this.engagement.likes.some(
        like => like.userId.toString() === userId.toString()
    );

    if (!alreadyLiked) {
        this.engagement.likes.push({ userId, likedAt: new Date() });
    }

    return this.save();
};

// Method to remove like
activitySchema.methods.removeLike = function (userId) {
    this.engagement.likes = this.engagement.likes.filter(
        like => like.userId.toString() !== userId.toString()
    );

    return this.save();
};

// Method to add comment
activitySchema.methods.addComment = function (userId, content) {
    this.engagement.comments.push({
        userId,
        content,
        createdAt: new Date()
    });

    return this.save();
};

// Method to remove comment
activitySchema.methods.removeComment = function (commentId) {
    this.engagement.comments = this.engagement.comments.filter(
        comment => comment._id.toString() !== commentId.toString()
    );

    return this.save();
};

// Method to like a comment
activitySchema.methods.likeComment = function (commentId, userId) {
    const comment = this.engagement.comments.id(commentId);

    if (comment && !comment.likes.includes(userId)) {
        comment.likes.push(userId);
    }

    return this.save();
};

// Method to add share
activitySchema.methods.addShare = function (userId, platform = 'internal') {
    this.engagement.shares.push({
        userId,
        sharedAt: new Date(),
        platform
    });

    return this.save();
};

// Method to check if user has liked
activitySchema.methods.hasUserLiked = function (userId) {
    return this.engagement.likes.some(
        like => like.userId.toString() === userId.toString()
    );
};

// Static method to create workout completion activity
activitySchema.statics.createWorkoutActivity = async function (userId, workout) {
    const title = `Completed ${workout.sessionData.name}`;
    const description = `${workout.sessionData.exercises.length} exercises, ${Math.round(workout.sessionData.duration / 60)} minutes`;

    const metadata = {
        workoutId: workout._id,
        duration: workout.sessionData.duration,
        volume: workout.sessionData.metrics.totalVolume,
        caloriesBurned: workout.sessionData.metrics.caloriesBurned,
        personalRecords: workout.sessionData.metrics.personalRecordsSet
    };

    return this.create({
        userId,
        activityType: 'workout_completed',
        targetType: 'workout',
        targetId: workout._id,
        content: { title, description, metadata },
        visibility: workout.sharing.visibility || 'friends'
    });
};

// Static method to create goal achievement activity
activitySchema.statics.createGoalActivity = async function (userId, goal) {
    const title = `Achieved goal: ${goal.title}`;
    const description = `Reached ${goal.targetValue} ${goal.unit}`;

    const metadata = {
        goalId: goal._id,
        goalType: goal.type,
        targetValue: goal.targetValue,
        completedIn: Math.ceil((new Date() - goal.startDate) / (1000 * 60 * 60 * 24)) // days
    };

    return this.create({
        userId,
        activityType: 'goal_achieved',
        targetType: 'goal',
        targetId: goal._id,
        content: { title, description, metadata },
        visibility: 'friends'
    });
};

// Static method to create PR activity
activitySchema.statics.createPRActivity = async function (userId, workout, exercise, prType, value) {
    const title = `New Personal Record!`;
    const description = `${prType.replace('_', ' ')} on ${exercise.exerciseName}: ${value}`;

    const metadata = {
        workoutId: workout._id,
        exerciseId: exercise.exerciseId,
        exerciseName: exercise.exerciseName,
        prType,
        value
    };

    return this.create({
        userId,
        activityType: 'personal_record',
        targetType: 'workout',
        targetId: workout._id,
        content: { title, description, metadata },
        visibility: 'friends'
    });
};

// Ensure virtuals are included in JSON
activitySchema.set('toJSON', { virtuals: true });
activitySchema.set('toObject', { virtuals: true });

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
