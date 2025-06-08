const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    products:[
        {
            productName:{
                type:String,
                required:true
            },
            productId:{
                type:String,
                required:true
            },
            coverImage:{
                type:String,
            },
            price:{
                type:Number
            },
            productDesc:{
                type:String
            }
        }
    ]
},{
    timestamps:true
})

module.exports = mongoose.model('wishlist', wishlistSchema)