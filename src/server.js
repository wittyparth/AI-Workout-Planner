const express = require("express")
const { default: helmet } = require("helmet")
const dotenv = require("dotenv")
const cors = require("cors")
const compression = require("compression")
const morgan = require("morgan")
dotenv.config()

const config = require("./config/environment")
const logger = require("./utils/logger")
connectToDatabase = require("./models/connectDatabase")


// routes
const authRoutes = require("./routes/auth.routes")
const exerciseRoutes = require("./routes/exercise.routes")
const errorHandler = require("./middleware/error.middleware")
const verifyToken = require("./middleware/auth.middleware")

const app = express()



connectToDatabase()


//middlewares
app.use(helmet())
app.use(cors({
    origin: config.FRONTEND_URL,
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
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/exercises", verifyToken, exerciseRoutes)


app.use("/:path", (req, res) => {
    res.status(404).json({
        message: "404 route not found",
        success: false,
        path: req.originalUrl
    })
})

app.use(errorHandler)



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