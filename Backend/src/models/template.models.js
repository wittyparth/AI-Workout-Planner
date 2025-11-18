const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        description: {
            type: String,
            trim: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        metadata: {
            difficulty: {
                type: String,
                enum: ['beginner', 'intermediate', 'advanced'],
                default: 'beginner',
                index: true
            },
            duration: Number, // estimated minutes
            goal: {
                type: String,
                enum: ['strength', 'muscle_building', 'fat_loss', 'endurance', 'athletic_performance', 'general_fitness'],
                index: true
            },
            primaryMuscles: [String],
            equipment: [String],
            tags: [String],
            estimatedCalories: Number
        },
        // Single workout template
        exercises: [{
            exerciseId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Exercise'
            },
            exerciseName: String, // denormalized
            order: Number,
            sets: Number,
            reps: {
                min: Number,
                max: Number,
                target: Number
            },
            weight: {
                type: {
                    type: String,
                    enum: ['bodyweight', 'percentage', 'fixed', 'rpe_based'],
                    default: 'fixed'
                },
                value: Number
            },
            restTime: { type: Number, default: 60 }, // seconds
            notes: String,
            alternatives: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Exercise'
            }]
        }],
        // Weekly plan (optional - for program templates)
        weeklyPlan: {
            totalWeeks: { type: Number, default: 1 },
            days: {
                monday: { type: mongoose.Schema.Types.Mixed },
                tuesday: { type: mongoose.Schema.Types.Mixed },
                wednesday: { type: mongoose.Schema.Types.Mixed },
                thursday: { type: mongoose.Schema.Types.Mixed },
                friday: { type: mongoose.Schema.Types.Mixed },
                saturday: { type: mongoose.Schema.Types.Mixed },
                sunday: { type: mongoose.Schema.Types.Mixed }
            }
        },
        stats: {
            usageCount: { type: Number, default: 0 },
            averageRating: { type: Number, default: 0 },
            totalRatings: { type: Number, default: 0 },
            completionRate: { type: Number, default: 0 },
            favoritesCount: { type: Number, default: 0 }
        },
        sharing: {
            isPublic: { type: Boolean, default: false, index: true },
            isPublished: { type: Boolean, default: false },
            isFeatured: { type: Boolean, default: false, index: true },
            featuredOrder: Number,
            category: {
                type: String,
                enum: ['beginner_friendly', 'intermediate', 'advanced', 'specialized', 'quick_workout', 'full_body'],
                index: true
            }
        },
        aiGenerated: {
            isAIGenerated: { type: Boolean, default: false },
            generationPrompt: String,
            generatedAt: Date,
            aiVersion: String,
            aiModel: String
        },
        version: { type: Number, default: 1 },
        isActive: { type: Boolean, default: true }
    },
    {
        timestamps: true
    }
);

// Indexes for performance
templateSchema.index({ createdBy: 1, isActive: 1 });
templateSchema.index({ 'sharing.isPublic': 1, 'sharing.isFeatured': 1 });
templateSchema.index({ 'metadata.difficulty': 1, 'metadata.goal': 1 });
templateSchema.index({ 'stats.usageCount': -1 });
templateSchema.index({ 'stats.favoritesCount': -1 });

// Method to increment usage
templateSchema.methods.incrementUsage = function () {
    this.stats.usageCount += 1;
    return this.save();
};

// Method to add to favorites
templateSchema.methods.addFavorite = function () {
    this.stats.favoritesCount += 1;
    return this.save();
};

// Method to remove from favorites
templateSchema.methods.removeFavorite = function () {
    this.stats.favoritesCount = Math.max(0, this.stats.favoritesCount - 1);
    return this.save();
};

// Method to update rating
templateSchema.methods.updateRating = function (newRating) {
    const totalScore = this.stats.averageRating * this.stats.totalRatings + newRating;
    this.stats.totalRatings += 1;
    this.stats.averageRating = totalScore / this.stats.totalRatings;
    return this.save();
};

const Template = mongoose.model('Template', templateSchema);

module.exports = Template;
