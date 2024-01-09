const express = require("express")
const dotenv = require("dotenv").config()
const cors = require("cors")
const helmet = require("helmet")
const connection = require("./database/connection")
const authRoute = require("./routes/auth")
const userRoute = require("./routes/user.route")

const app = express()
app.use(cors())
app.use(helmet())
app.use(express.json())

app.use((error,req,res,next)=>{
    const errStatus = error.status || 500;
    const errMessage = error.message || "internal server error";

    return res.status(errStatus).send(errMessage)
})

app.use('/api/v1/auth', authRoute)
app.use('/api/v1/user', userRoute)

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    connection()
    console.log(`server is running at the port ${PORT}`)
})