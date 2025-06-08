const contactModel = require("../models/ContactModel"); 
const createError = require("../utils/createError");


exports.postContactInfo = async (req,res,next) =>{
    const isAlready = await contactModel.findOne({ email: req.body.email });
    if(isAlready){
        return next(createError(404, 'already sent !'))
    }
    try{
        const newContact = new contactModel(req.body);
        await newContact.save();
        res.status(200).json(newContact)
    }catch(err){
        next(err)
    }
}


exports.getCOntacts = async (req,res,next) =>{
    if(req.user.admin){
    try{
        const contacts = await contactModel.find()
        res.status(200).json({message:"hello babe"})
    }catch(err){
        next(err)
    }
}else{
    return next(createError(403, "unauthorized access !"))
}
}



exports.deletedContacts = async (req,res,next) =>{
    if(req.user.admin){
    try{
        const contact = await contactModel.findByIdAndDelete(req.params.id)
        res.status(200).json({message:"deleted successfully !"})
    }catch(err){
        next(err)
    }
}else{
    return next(createError(403, "unauthorized access !"))
}
}