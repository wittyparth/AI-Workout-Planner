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
      required: true,
    },
    emailVerified: {type :Boolean,default : false}, 
    emailVerifiedAt: {type : Date},
    emailVerificationToken: {type : String,require:true},
    emailVerificationExpiry: {type : Date,required : true},
    verificationReminderSent: {type : Boolean,default :false}, // Track reminders
    verificationReminderSentAt: {type : Date},
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
