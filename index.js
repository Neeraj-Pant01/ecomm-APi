const express = require("express")
const dotenv = require("dotenv").config()
const cors = require("cors")
const helmet = require("helmet")
const connection = require("./database/connection")
const authRoute = require("./routes/auth")
const userRoute = require("./routes/user.route")
const productRoute = require("./routes/products.route")
const orderRoute = require("./routes/order.route")
const cartRoute = require("./routes/cart.route")
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger/swagger');

const app = express()
app.use(cors())
app.use(helmet())
app.use(express.json())

app.use((error,req,res,next)=>{
    const errStatus = error.status || 500;
    const errMessage = error.message || "internal server error";

    return res.status(errStatus).send(errMessage)
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/v1/auth', authRoute)
app.use('/api/v1/user', userRoute)
app.use('/api/v1/products', productRoute)
app.use('/api/v1/orders',orderRoute)
app.use('/api/v1/cart',cartRoute)

const PORT = process.env.PORT || 9000;

app.listen(PORT,()=>{
    connection()
    console.log(`server is running at the port ${PORT}`)
})