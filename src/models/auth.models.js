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
module.exports = RefreshTokenModel