const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        instructions: [{
            type: String
        }],
        primaryMuscleGroups: [{
            type: String
            // Removed index to avoid parallel array indexing error with equipment
        }],
        secondaryMuscleGroups: [{
            type: String
        }],
        equipment: [{
            type: String
            // Removed index to avoid parallel array indexing error with primaryMuscleGroups
        }],
        difficulty: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced'],
            default: 'beginner',
            index: true
        },
        exerciseType: {
            type: String,
            enum: ['strength', 'cardio', 'flexibility', 'balance', 'plyometric', 'powerlifting', 'olympic_weightlifting'],
            default: 'strength'
        },
        movementPattern: {
            type: String,
            enum: ['push', 'pull', 'squat', 'hinge', 'carry', 'lunge', 'rotation', 'isometric'],
        },
        tags: [{
            type: String
            // Removed index to avoid parallel array indexing error
        }],
        media: {
            images: [String],
            videos: [String],
            gifs: [String]
        },
        metrics: {
            averageRating: { type: Number, default: 0, min: 0, max: 5 },
            totalRatings: { type: Number, default: 0 },
            popularityScore: { type: Number, default: 0 },
            usageCount: { type: Number, default: 0 }
        },
        variations: [{
            name: String,
            description: String,
            difficulty: {
                type: String,
                enum: ['beginner', 'intermediate', 'advanced']
            },
            instructions: [String]
        }],
        safety: {
            warnings: [String],
            commonMistakes: [String],
            tips: [String]
        },
        calories: {
            perMinute: Number,
            baseRate: Number
        },
        defaultSets: {
            type: Number,
            default: 3
        },
        defaultReps: {
            min: Number,
            max: Number,
            target: Number
        },
        defaultRestTime: {
            type: Number,
            default: 60 // seconds
        },
        isActive: {
            type: Boolean,
            default: true
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true
    }
);

// Indexes for performance
// Text index for search functionality (excluding array fields to avoid parallel array indexing)
exerciseSchema.index({ name: 'text', description: 'text' });
exerciseSchema.index({ difficulty: 1, exerciseType: 1 });
exerciseSchema.index({ 'metrics.popularityScore': -1 });
exerciseSchema.index({ 'metrics.usageCount': -1 });

// Pre-save hook to generate slug
exerciseSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    next();
});

// Method to increment usage count
exerciseSchema.methods.incrementUsage = function () {
    this.metrics.usageCount += 1;
    this.metrics.popularityScore = this.metrics.usageCount * 0.7 + this.metrics.averageRating * 0.3;
    return this.save();
};

// Method to update rating
exerciseSchema.methods.updateRating = function (newRating) {
    const totalScore = this.metrics.averageRating * this.metrics.totalRatings + newRating;
    this.metrics.totalRatings += 1;
    this.metrics.averageRating = totalScore / this.metrics.totalRatings;
    this.metrics.popularityScore = this.metrics.usageCount * 0.7 + this.metrics.averageRating * 0.3;
    return this.save();
};

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;
