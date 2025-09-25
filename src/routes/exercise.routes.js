const express = require("express")

const router = express.Router()

router.get("/",(req,res)=> {
    res.status(200).json({
        message : "List of all exercises",
        data : []
    })
})

module.exports = router