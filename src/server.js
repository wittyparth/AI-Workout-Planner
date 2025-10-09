// Global error handlers - catch ALL errors including module loading errors
process.on('uncaughtException', (error) => {
    console.error('❌ UNCAUGHT EXCEPTION - Server crashed during startup!');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ UNHANDLED REJECTION - Async error during startup!');
    console.error('Reason:', reason);
    process.exit(1);
});

const express = require("express")
const helmet = require("helmet")
const dotenv = require("dotenv")
const cors = require("cors")
const compression = require("compression")
const morgan = require("morgan")
dotenv.config()

const config = require("./config/environment")
const logger = require("./utils/logger")
const connectToDatabase = require("./models/connectDatabase")


// routes
const oauthRoutes = require("./routes/oauth.routes")
const authRoutes = require("./routes/auth.routes")
const exerciseRoutes = require("./routes/exercise.routes")
const {requestContextMiddleware} = require("./middleware/error.middleware")
const {verifyToken,verifyEmailWithGrace, verifyEmail} = require("./middleware/auth.middleware")
const { rateLimiter } = require("./middleware/ratelimit.middleware")

const app = express()

try {
connectToDatabase()

//middlewares
app.use(helmet())
app.use(cors({
    origin: [config.FRONTEND_URL,"http://localhost:5173"],
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    credentials: true
}))
app.use(compression())

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

app.options("/:path", cors())

if (config.NODE_ENV === "development") {
    app.use(morgan("dev"))
}
else {
    app.use(morgan("combined"))
}

app.use(requestContextMiddleware)

app.use(rateLimiter(15, 1000))


app.get("/", (req, res) => {
    res.send("Home Page")
})

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Backend health 100%",
        timestamp: new Date().toISOString(),
        environment: config.NODE_ENV,
        version: "1.0.0"
    })
})
app.use("/api/v1/auth",oauthRoutes)
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/exercises", verifyToken,verifyEmailWithGrace, exerciseRoutes)


app.use("/:path", (req, res) => {
    res.status(404).json({
        message: "404 route not found",
        success: false,
        path: req.originalUrl
    })
})

// app.use(errorHandler)



const server = app.listen(config.PORT, () => {
    logger.info(`🚀 FitAI Backend Server running on port ${config.PORT}`);
    logger.info(`📱 Environment: ${config.NODE_ENV}`);
    logger.info(`🌐 Health check: http://localhost:${config.PORT}/health`);
})

process.on("SIGTERM", async () => {
    logger.info("SIGTERM received shutting down gracefully")
    await mongoose.connection.close()
    server.close(() => {
        logger.info("Process Terminated")
    })
})

module.exports = app
} catch (error) {
    logger.error("Error occurred while starting the server", error);
}