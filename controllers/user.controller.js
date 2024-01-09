const userModel = require("../models/usermodel.model")

//get all users
exports.getAllUsers = async (req,res,next) =>{
    try{
        const users = await userModel.find();
        res.status(200).json(users)
    }catch(err){
        next(err)
    }
}