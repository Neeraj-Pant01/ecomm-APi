const productModel = require("../models/products.model");
const wishlistModel = require("../models/Wishlist");
const createError = require("../utils/createError");

exports.addOrUpdateWishlist = async (req, res, next) => {
    try {
        // Check if wishlist exists for the user
        const wishlist = await wishlistModel.findOne({ userId: req.user.id });

        if (wishlist) {
            // Wishlist exists - add the product
            const updatedWishlist = await wishlistModel.findByIdAndUpdate(
                wishlist._id,
                { $push: { products: req.body } },
                { new: true }
            );
            return res.status(200).json(updatedWishlist);
        } else {
            // Wishlist doesn't exist - create new one with the product
            const newWishlist = new wishlistModel({
                userId: req.user.id,
                products: [{ ...req.body, productId: req.body.productId }]
            });
            await newWishlist.save();
            return res.status(200).json(newWishlist);
        }
    } catch (err) {
        next(err);
    }
};

exports.addProductToWishlist = async (req, res, next) => {
    const wishlist = await wishlistModel.findOne({ userId: req.user.id })
    if (!wishlist) return next(createError(404, "wishlist not found"))
    try {
        const updatedWishlist = await wishlistModel.findByIdAndUpdate(wishlist._id, {
            $push: {
                products: req.body
            }
        }, {
            new: true
        })
        res.status(200).json(updatedWishlist)
    } catch (err) {
        next(err)
    }
}

exports.removeProductFromWishlist = async (req, res, next) => {
    try {
        const wishlist = await wishlistModel.findOneAndUpdate({
            userId: req.user.id,
        },
            {
                $pull: {
                    products: {
                        productId: req.params.productId
                    }
                }
            }, {
            new: true
        }
        )
        res.status(200).json(wishlist)
    } catch (err) {
        next(err)
    }
}

exports.getwishlistByUserId = async (req, res, next) => {
    try {
        const wishlist = await wishlistModel.findOne({ userId: req.user.id })
        if (!wishlist) return next(createError(404, "wishlist not found !"))
        res.status(200).json(wishlist)
    } catch (err) {
        next(err)
    }
}

exports.getCartByCartId = async (req, res, next) => {
    if (req.user.isAdmin) {
        try {
            const wishlist = await wishlistModel.findById(req.params.id)
            if (!wishlist) return next(createError(404, "cart not found !"))
            res.status(200).json(wishlist)
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
            const wishlist = await wishlistModel.find()
            res.status(200).json(wishlist)
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
        const wishlist = await wishlistModel.findById(req.params.id)
        if (req.user.isAdmin || req.user.id === wishlist.userId) {
            await wishlistModel.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "wishlist deleted successfully !" })
        } else {
            return next(createError(401, "unauthorized action!"))
        }
    } catch (err) {
        next(err)
    }
}