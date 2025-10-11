const express = require("express")

const router = express.Router()

router.get("/",(req,res)=>{
    res.status(200).json({
        success : true,
        message : "Check the headers sent by helmet middleware in headers section",
        hint : "Look for: Content-Security-Policy, X-Frame-Options, Strict-Transport-Security, etc."
    })
})

module.exports = router