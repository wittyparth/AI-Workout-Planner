const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      index: true
    },
    password: {
      type: String,
    },
    emailVerified: { type: Boolean, default: false },
    emailVerifiedAt: { type: Date },
    emailVerificationToken: { type: String },
    emailVerificationExpiry: { type: Date },
    verificationReminderSent: { type: Boolean, default: false },
    verificationReminderSentAt: { type: Date },

    // OAuth Providers
    oauthProviders: [{
      provider: { type: String, enum: ['google', 'github', 'apple'] },
      providerId: String,
      providerEmail: String,
      accessToken: String,
      refreshToken: String,
      profilePicture: String,
      connectedAt: Date,
      lastUsed: Date
    }],

    // User Profile
    profile: {
      firstName: { type: String, trim: true },
      lastName: { type: String, trim: true },
      dateOfBirth: Date,
      gender: { type: String, enum: ['male', 'female', 'other', 'prefer_not_to_say'], default: 'prefer_not_to_say' },
      fitnessLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
      profilePicture: { type: String, default: '' },
      bio: { type: String, maxlength: 500 },
      location: String,
      timezone: { type: String, default: 'UTC' }
    },

    // User Preferences
    preferences: {
      units: { type: String, enum: ['metric', 'imperial'], default: 'metric' },
      defaultRestTime: { type: Number, default: 60 }, // seconds
      notifications: {
        workoutReminders: { type: Boolean, default: true },
        progressUpdates: { type: Boolean, default: true },
        socialActivity: { type: Boolean, default: true },
        aiRecommendations: { type: Boolean, default: true }
      },
      privacy: {
        profileVisibility: { type: String, enum: ['public', 'friends', 'private'], default: 'public' },
        workoutSharing: { type: Boolean, default: true },
        progressSharing: { type: Boolean, default: true }
      }
    },

    // Body Metrics
    metrics: {
      currentWeight: Number,
      targetWeight: Number,
      height: Number,
      bodyFatPercentage: Number,
      measurementUnit: { type: String, enum: ['kg', 'lbs'], default: 'kg' }
    },

    // Subscription
    subscription: {
      plan: { type: String, enum: ['free', 'premium', 'pro'], default: 'free' },
      status: { type: String, enum: ['active', 'cancelled', 'expired'], default: 'active' },
      startDate: Date,
      endDate: Date,
      stripeCustomerId: String
    },

    // Social Data
    socialData: {
      friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    },

    // Achievements
    achievements: [{
      type: { type: String },
      unlockedAt: { type: Date, default: Date.now },
      metadata: mongoose.Schema.Types.Mixed
    }],

    // Activity Tracking
    lastLoginAt: Date,
    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
