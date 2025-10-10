const zod = require("zod")
const userSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(8).regex(/[a-zA-Z0-9]/, "Password must contain at least one letter and one number").regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character").regex(/.{8,}/, "Password must be at least 8 characters long")
})

const forgotPasswordSchema = zod.object({
    email : zod.string().email()     
})

const resetPasswordSchema = zod.object({
    token : zod.string().min(1,"Token is required"),
    newPassword : zod.string().min(8).regex(/[a-zA-Z0-9]/, "Password must contain at least one letter and one number").regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character").regex(/.{8,}/, "Password must be at least 8 characters long")
})  

const refreshTokenSchema = zod.object({
    refreshToken : zod.string().min(1,"Token is required")
})

const emailVerificationSchema = zod.object({
    emailVerificationToken : zod.string().min(1,"Token is required")
})

module.exports = { userSchema, forgotPasswordSchema, resetPasswordSchema,refreshTokenSchema, emailVerificationSchema }