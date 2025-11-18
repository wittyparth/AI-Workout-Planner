const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now() },
    lastUsed: { type: Date, default: Date.now() },
    isRevoked: { type: Boolean, default: false }
}, { timestamps: true })
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshTokenModel = mongoose.model("RefreshTokenModel", refreshTokenSchema)

const passwordResetTokenSchema = new mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId, required : true},
    token : {type : String, required : true},
    expiresAt : {type : Date,required : true},
    createdAt : {type : Date, default : new Date().toISOString()},
    used : {type : Boolean, default : false},
    ipAddress : {type : String},
}, {timestamps : true})
passwordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PasswordResetTokenModel = mongoose.model("PasswordResetToken", passwordResetTokenSchema)
module.exports = { RefreshTokenModel, PasswordResetTokenModel }