const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:false
    },
    mobile:{
        type:String,
        required:false
    },
    fromGoogle:{
        type:Boolean,
        default:false
    },
    profile:{
        type:String,
        required:false
    },
    city:{
        type:String,
        required:true
    },
    pincode:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default: false,
        immutable: true
    }
},{
    timestamps:true
})

module.exports = mongoose.model("user", userSchema)