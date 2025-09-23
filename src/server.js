const express = require("express")
const { default: helmet } = require("helmet")
const dotenv = require("dotenv")
const { json, success } = require("zod")
const cors = require("cors")
const compression = require("compression")
const morgan = require("morgan")
dotenv.config()


const app = express()


//middlewares
app.use(helmet())
app.use(cors({
    origin : process.env.FRONTEND_URL,
    allowedHeaders : ["Content-Type","Authorization"],
    methods : ["GET","PUT","POST","DELETE","OPTIONS"],
    credentials : true
}))
app.use(compression())

app.use(express.json({limit:"10mb"}))
app.use(express.urlencoded({extended:true,limit:"10mb"}))

if(process.env.NODE_ENV==="development"){
    app.use(morgan("dev"))
}
else{
    app.use(morgan("combined"))
}


app.get("/",(req,res)=>{
    res.send("Home Page")
})

app.get("/health",(req,res)=>{
    res.status(200).json({
        status : "OK",
        message: "Backend health 100%",
        timestamp : new Date().toISOString(),
        environment : process.env.NODE_ENV,
        version : "1.0.0"
    })
})

app.get("*",(req,res)=>{
    res.status(404).json({
        message : "404 route not found",
        success : false,
        path : req.originalUrl
    })
})



app.listen(process.env.PORT,()=>{
    console.log("Server is running on port",process.env.PORT)
})