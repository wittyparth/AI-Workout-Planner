const zod = require("zod")
const userSchema = zod.object({
    email: zod.email(),
    password: zod.string().min(8).regex(/[a-zA-Z0-9]/, "Password must contain at least one letter and one number").regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character").regex(/.{8,}/, "Password must be at least 8 characters long")
})

module.exports = userSchema