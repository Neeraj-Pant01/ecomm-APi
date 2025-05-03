const productModel = require("../models/products.model");
const createError = require("../utils/createError");

exports.uploadProduct = async (req,res,next) =>{
    try{
        if(req.user.isAdmin){
        const newproduct = new productModel(req.body);
        const savedProduct = await newproduct.save();
        res.status(200).json(savedProduct)
        }
        else{
            return next(createError(404, "only admin can upload products !"))
        }
    }catch(err){
        next(err)
    }
}

exports.getProduct = async (req,res,next) =>{
    try{
        const product = await productModel.findById(req.params.id)
        if(!product) return next(createError(404, "product not found !"))
        res.status(200).json(product)
    }catch(err){
        next(err)
    }
}

exports.getAllProducts = async (req,res,next) =>{
    if(req.user.isAdmin){
        const products = await productModel.find();
        res.status(200).json(products)
    }else{
        return next(createError(404, "only admin can access all products"))
    }
}

exports.updateProduct = async (req,res,next) =>{
    if(req.user.isAdmin){
        const product = await productModel.findByIdAndUpdate(req.params.id,{
            $set : req.body
        },{
            new : true
        })
        res.status(200).json(product)
    }else{
        return next(createError(404, "only admin can add the products !"))
    }
}

exports.getProducts = async (req,res,next) =>{
    let q = req.query;
    let show = q.show;
    const filters = {
        ...(q.category && {categories : {$in: [q.category]}}),
        ...((q.min || q.max)&& {
            price : {
                ...(q.min && {$gt: q.min}),
                ...(q.max && {$lt: q.max})
            }
        }),
        ...(q.search && {productName : {$regex : q.search, $options: "i"}})
    }
    try{
        const products = show ? await productModel.find().limit(6) :  await productModel.find(filters).sort({[q.sort]: -1})
        res.status(200).json(products)
    }catch(err){
        next(err)
    }
}

exports.deleteProduct = async (req,res,next) =>{
    if(req.user.isAdmin){
        try{
            const product = await productModel.findByIdAndDelete(req.params.id)
        }catch(err){
            next(err)
        }
        res.status(200).json({
            message: "product deleted successfully !"
        })
    }else{
        next(createError(404, "user is not authorized !"))
    }
}

