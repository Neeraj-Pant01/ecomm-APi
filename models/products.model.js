const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    productDesc:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    coverImage:{
        type:String,
        required:true
    },
    images:{
        type:[String],
        required:false
    },
    categories:{
        type:Array,
        required:true
    },
    totalStars:{
        type:Number,
        default: 0
    },
    starNumber:{
        type:Number,
        default: 0
    },
    inStocks:{
        type:Number,
        default: 1
    },
    sales:{
        type:Number,
        default:0
    },
    defaultColor:{
        type:String,
        required:true
    },
        avilableColors:{
            type:[String],
        }
},{
    timestamps:true
})

module.exports = mongoose.model("products", productSchema)