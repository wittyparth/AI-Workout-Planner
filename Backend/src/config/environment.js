const config = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT || 5000,
    API_VERSION: process.env.API_VERSION || "v1",

    // Database configuration
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/fitai-dev",
    MONOGODB_TEST_URI: process.env.MONOGODB_TEST_URI || "mongodb://localhost:27017/fitai-test",

    // Redis configuration 
    REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",

    // JWT Secret Configuration
    JWT_SECRET: process.env.JWT_SECRET || "this is confidential information stay away",
    JWT_EXPIRE: process.env.JWT_EXPIRE || "1d",
    JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || "7d",

    // AI Configuration
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
    GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-1.5-flash",
    AI_TEMPERATURE: parseFloat(process.env.AI_TEMPERATURE) || 0.7,
    AI_MAX_TOKENS: parseInt(process.env.AI_MAX_TOKENS) || 2048,

    // AWS S3 Configuration
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "",
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
    AWS_REGION: process.env.AWS_REGION || "us-east-1",
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET || "fitai-media",
    S3_BASE_URL: process.env.S3_BASE_URL || "",

    // Frontend Configuration
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",

    // File upload configuration
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: process.env.ALLOWED_IMAGE_TYPES?.split(',') || ["image/jpeg", "image/png", "image/jpg", "image/webp"],

    EMAIl_HOST: process.env.EMAIl_HOST || "smtp.gmail.com",
    EMAIL_PORT: process.env.EMAIL_PORT || 587,
    EMAIL_USER: process.env.EMAIL_USER || "",
    EMAIL_PASS: process.env.EMAIL_PASS || "",

    //oauth
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || "",
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || ""

}
const requriedEnvVars = []

if (config.NODE_ENV === "production") {
    requriedEnvVars.push("JWT_SECRET", "MONGODB_URI", "REDIS_URL")
}

requriedEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        console.error(`❌ ERROR: Required environment variable '${varName}' is not set!`)
        process.exit(1)
    }
})

module.exports = config