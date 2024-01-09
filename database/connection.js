const mongoose = require("mongoose");

const connection = async (req,res,next) =>{
    try{
        await mongoose.connect(`${process.env.DB}`)
        console.log("database is connected successfully !")
    }catch(err){
        console.log(err.message)
    }
}

module.exports = connection;