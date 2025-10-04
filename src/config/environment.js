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

}
const requriedEnvVars = ["JWT_SECRET"]

if (config.NODE_ENV === "production") {
    requriedEnvVars.push("MONGO_URI", "REDIS_URL")
}

requriedEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        console.log("Required Environment variable is not present", varName)
        process.exitCode = 1
    }
})

module.exports = config