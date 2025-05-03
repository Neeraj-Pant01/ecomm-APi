const productModel = require("../models/products.model");
const cartModel = require("../models/cart.model");
const createError = require("../utils/createError");

exports.createCart = async (req, res, next) => {
    const cart = await cartModel.findOne({userId:req.user.id})

    if(cart) return next(createError(404, "cart already exists !"))

    try{
        const newCart = new cartModel({
            userId: req.user.id,
            products:  [{...req.body,productId:req.body.productId ,}]
        });
        await newCart.save()
        res.status(200).json(newCart)
    }catch(err){
        next(err)
    }
}

exports.addProduct = async (req, res, next) => {
    const cart = await cartModel.findOne({ userId: req.user.id })
    if (!cart) return next(createError(404, "cart not found"))
    try {
        const Updatedcart = await cartModel.findByIdAndUpdate(cart._id, {
            $push: {
                products: req.body
            }
        }, {
            new: true
        })
        res.status(200).json(Updatedcart)
    } catch (err) {
        next(err)
    }
}

exports.removeProduct = async (req, res, next) => {
    try {
        const cart = await cartModel.findOneAndUpdate({
            userId: req.user.id,
        },
        {
            $pull:{
                products: {
                    productId: req.params.productId
                }
            }
        },{
            new: true
        }
        )
        res.status(200).json(cart)
    } catch (err) {
        next(err)
    }
}

exports.getCartByUserId = async (req, res, next) => {
    try {
        const cart = await cartModel.findOne({ userId: req.user.id })
        if (!cart) return next(createError(404, "cart not found !"))
        res.status(200).json(cart)
    } catch (err) {
        next(err)
    }
}

exports.getCartByCartId = async (req, res, next) => {
    if (req.user.isAdmin) {
        try {
            const cart = await cartModel.findById(req.params.id)
            if (!cart) return next(createError(404, "cart not found !"))
            res.status(200).json(cart)
        } catch (err) {
            next(err)
        }
    } else {
        return next(createError(401, "unauthorized action!"))
    }
}

exports.getAllCarts = async (req, res, next) => {
    if (req.user.isAdmin) {
        try {
            const carts = await cartModel.find()
            res.status(200).json(cart)
        } catch (err) {
            next(err)
        }
    } else {
        return next(createError(401, "unauthorized action!"))
    }
}

//delete the cart
exports.deleteCart = async (req, res, next) => {
    try {
        const cart = await cartModel.findById(req.params.id)
        if (req.user.isAdmin || req.user.id === cart.userId) {
            await cartModel.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "cart deleted successfully !" })
        } else {
            return next(createError(401, "unauthorized action!"))
        }
    } catch (err) {
        next(err)
    }
}