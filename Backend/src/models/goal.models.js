const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        type: {
            type: String,
            enum: ['weight_loss', 'weight_gain', 'strength', 'endurance', 'muscle_building', 'body_recomposition', 'custom'],
            required: true,
            index: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        targetValue: {
            type: Number,
            required: true
        },
        currentValue: {
            type: Number,
            default: 0
        },
        unit: {
            type: String,
            required: true, // e.g., 'kg', 'lbs', 'reps', 'minutes', 'workouts'
            trim: true
        },
        targetDate: {
            type: Date,
            required: true,
            index: true
        },
        startDate: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['active', 'completed', 'paused', 'failed', 'abandoned'],
            default: 'active',
            index: true
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium'
        },
        milestones: [{
            value: Number,
            percentage: Number, // % of target
            achievedAt: Date,
            notes: String,
            isCompleted: { type: Boolean, default: false }
        }],
        relatedExercises: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Exercise'
        }],
        progress: [{
            date: {
                type: Date,
                default: Date.now
            },
            value: Number,
            notes: String,
            source: {
                type: String,
                enum: ['manual', 'workout', 'body_metrics', 'system'],
                default: 'manual'
            }
        }],
        aiRecommendations: [{
            recommendedAt: Date,
            recommendation: String,
            adjustedTarget: Number,
            reasoning: String,
            isAccepted: Boolean
        }]
    },
    {
        timestamps: true
    }
);

// Indexes
goalSchema.index({ userId: 1, status: 1 });
goalSchema.index({ userId: 1, targetDate: 1 });
goalSchema.index({ status: 1, targetDate: 1 });

// Virtual for progress percentage
goalSchema.virtual('progressPercentage').get(function () {
    if (this.targetValue === 0) return 0;
    return Math.min(100, (this.currentValue / this.targetValue) * 100);
});

// Virtual for days remaining
goalSchema.virtual('daysRemaining').get(function () {
    const now = new Date();
    const target = new Date(this.targetDate);
    const diff = target - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

// Virtual for is overdue
goalSchema.virtual('isOverdue').get(function () {
    return new Date() > this.targetDate && this.status === 'active';
});

// Pre-save hook to update milestones and status
goalSchema.pre('save', function (next) {
    // Update milestone completion
    this.milestones.forEach(milestone => {
        if (!milestone.isCompleted && this.currentValue >= milestone.value) {
            milestone.isCompleted = true;
            milestone.achievedAt = new Date();
        }
    });

    // Auto-complete goal if target reached
    if (this.currentValue >= this.targetValue && this.status === 'active') {
        this.status = 'completed';
    }

    // Auto-fail goal if past target date and not completed
    if (this.isOverdue && this.status === 'active') {
        this.status = 'failed';
    }

    next();
});

// Method to update progress
goalSchema.methods.updateProgress = function (newValue, notes = '', source = 'manual') {
    this.currentValue = newValue;
    this.progress.push({
        date: new Date(),
        value: newValue,
        notes,
        source
    });

    // Keep only last 100 progress entries
    if (this.progress.length > 100) {
        this.progress = this.progress.slice(-100);
    }

    return this.save();
};

// Method to add milestone
goalSchema.methods.addMilestone = function (value, percentage = null) {
    const milestonePercentage = percentage || (value / this.targetValue * 100);

    this.milestones.push({
        value,
        percentage: milestonePercentage,
        isCompleted: this.currentValue >= value
    });

    // Sort milestones by value
    this.milestones.sort((a, b) => a.value - b.value);

    return this.save();
};

// Method to calculate progress velocity (units per day)
goalSchema.methods.getProgressVelocity = function () {
    if (this.progress.length < 2) return 0;

    const recentProgress = this.progress.slice(-10); // Last 10 entries
    const firstEntry = recentProgress[0];
    const lastEntry = recentProgress[recentProgress.length - 1];

    const valueDiff = lastEntry.value - firstEntry.value;
    const timeDiff = (lastEntry.date - firstEntry.date) / (1000 * 60 * 60 * 24); // days

    return timeDiff > 0 ? valueDiff / timeDiff : 0;
};

// Method to predict completion date
goalSchema.methods.predictCompletionDate = function () {
    const velocity = this.getProgressVelocity();

    if (velocity <= 0) return null;

    const remainingValue = this.targetValue - this.currentValue;
    const daysNeeded = remainingValue / velocity;

    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + Math.ceil(daysNeeded));

    return completionDate;
};

// Ensure virtuals are included in JSON
goalSchema.set('toJSON', { virtuals: true });
goalSchema.set('toObject', { virtuals: true });

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;
