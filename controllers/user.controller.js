const userModel = require("../models/usermodel.model")
const createError = require("../utils/createError");
const CryptoJS = require("crypto-js");

//get user's profile
exports.getUserProfile = async (req,res,next) =>{
    try{
        const user = await userModel.findById(req.params.id);
        if(!user) return next(createError(403, "user not found !"))
        if(req.user.id === req.params.id || req.user.isAdmin){
            res.status(200).json(user);
        }else{
            return next(createError(403,"you can view only your profile"))
        }
    }catch(err){
        next(err)
    }
}

exports.updateProfile = async (req,res,next) =>{
    try{
        const user = await userModel.findById(req.params.id)
        if(!user) return next(createError(403, "user not found !"))
        if(req.user.id === req.params.id){
            if(req.body.password){
                req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASSENC).toString()
            }
            const updateUser = await userModel.findByIdAndUpdate(req.params.id,{
                $set: req.body
            },{
                new: true
            })
            res.status(200).json(updateUser)
        }else{
            return next(createError(403,"you can view only your profile"))
        }
    }catch(err){
        next(err)
    }
}

exports.getAllusers = async (req,res,next) =>{
    try{
        if(req.user.isAdmin){
            const users = await userModel.find();
            res.status(200).json(users)
        }else{
            return next(createError(403,"only admin can access al users"))
        }
    }catch(err){
        next(err)
    }
}