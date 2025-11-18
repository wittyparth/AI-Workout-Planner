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
const path = require("path")

// Load .env from project root
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const config = require("./config/environment")
const logger = require("./utils/logger")
const connectToDatabase = require("./models/connectDatabase")
const { swaggerUi, swaggerSpec } = require("./config/swagger")


// routes
const oauthRoutes = require("./routes/oauth.routes")
const authRoutes = require("./routes/auth.routes")
const exerciseRoutes = require("./routes/exercise.routes")
const workoutRoutes = require("./routes/workout.routes")
const templateRoutes = require("./routes/template.routes")
const goalRoutes = require("./routes/goal.routes")
const aiRoutes = require("./routes/ai.routes")
const progressRoutes = require("./routes/progress.routes")
const analyticsRoutes = require("./routes/analytics.routes")
const userRoutes = require("./routes/user.routes")
const socialRoutes = require("./routes/social.routes")
const { requestContextMiddleware } = require("./middleware/error.middleware")
const { verifyToken, verifyEmailWithGrace, verifyEmail } = require("./middleware/auth.middleware")
const { rateLimiter } = require("./middleware/ratelimit.middleware")

const app = express()

try {
    connectToDatabase()

    //middlewares
    app.use(helmet())
    app.use(cors({
        origin: [
            config.FRONTEND_URL,
            "http://localhost:3000",
            "http://localhost:5173",
            /\.vercel\.app$/  // Allow all Vercel preview deployments
        ],
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

    // API Documentation
    app.use('/api/v1/docs', swaggerUi.serve);
    app.get('/api/v1/docs', swaggerUi.setup(swaggerSpec, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'FitAI API Documentation',
        customfavIcon: '/favicon.ico'
    }));

    // Swagger JSON endpoint
    app.get('/api/v1/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    // Authentication routes (public)
    app.use("/api/v1/auth", oauthRoutes)
    app.use("/api/v1/auth", authRoutes)

    // Protected routes (require authentication)
    app.use("/api/v1/exercises", verifyToken, verifyEmailWithGrace(), exerciseRoutes)
    app.use("/api/v1/workouts", verifyToken, verifyEmailWithGrace(), workoutRoutes)
    app.use("/api/v1/templates", templateRoutes) // Some routes public, some protected
    app.use("/api/v1/goals", verifyToken, verifyEmailWithGrace(), goalRoutes)
    app.use("/api/v1/ai", verifyToken, verifyEmailWithGrace(), aiRoutes)
    app.use("/api/v1/progress", verifyToken, verifyEmailWithGrace(), progressRoutes)
    app.use("/api/v1/analytics", verifyToken, verifyEmailWithGrace(), analyticsRoutes)
    app.use("/api/v1/user", verifyToken, verifyEmailWithGrace(), userRoutes)
    app.use("/api/v1/social", verifyToken, verifyEmailWithGrace(), socialRoutes)


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