const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    emailVerified: { type: Boolean, default: false },
    oauthProviders: [{
    provider: { type: String, enum: ['google', 'github', 'apple'] },
    providerId: String, // User's ID in that provider
    providerEmail: String, // Email from provider
    accessToken: String, // Encrypted
    refreshToken: String, // Encrypted
    profilePicture: String,
    connectedAt: Date,
    lastUsed: Date
  }],
    emailVerified: {type :Boolean,default : false}, 
    emailVerifiedAt: {type : Date},
    emailVerificationToken: {type : String},
    emailVerificationExpiry: {type : Date},
    verificationReminderSent: {type : Boolean,default :false}, // Track reminders
    verificationReminderSentAt: {type : Date},
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
