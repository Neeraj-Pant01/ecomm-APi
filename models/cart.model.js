const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    products:[
        {
            quantity:{
                type:Number,
                default:1
            },
            size:{
                type:String
            },
            color:{
                type:String
            }
        }
    ]
},{
    timestamps:true
})

module.exports = mongoose.model("cart", cartSchema)