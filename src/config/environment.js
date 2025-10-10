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

    // External API 
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",

    // Frontend Configuration
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",

    //File upload configuration
    MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 5 * 1024 * 1024, // 5MB
    ALLOWED_FILE_TYPES: process.env.ALLOWED_FILE_TYPES || ["image/jpeg", "image/png", "image/gif"],

    EMAIl_HOST : process.env.EMAIl_HOST || "smtp.gmail.com",
    EMAIL_PORT : process.env.EMAIL_PORT || 587,
    EMAIL_USER : process.env.EMAIL_USER || "",
    EMAIL_PASS : process.env.EMAIL_PASS || "",

    //oauth
    GOOGLE_CLIENT_ID : process.env.GOOGLE_CLIENT_ID || "",
    GOOGLE_CLIENT_SECRET : process.env.GOOGLE_CLIENT_SECRET || "",
    GITHUB_CLIENT_ID : process.env.GITHUB_CLIENT_ID || "",
    GITHUB_CLIENT_SECRET : process.env.GITHUB_CLIENT_SECRET || ""   

}
const requriedEnvVars = ["JWT_SECRET"]

if (config.NODE_ENV === "production") {
    requriedEnvVars.push("MONGO_URI", "REDIS_URL")
}

requriedEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        console.error(`❌ ERROR: Required environment variable '${varName}' is not set!`)
        process.exit(1)
    }
})

module.exports = config