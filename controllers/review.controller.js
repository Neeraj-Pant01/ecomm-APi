const productsModel = require("../models/products.model")
const { createRevService, getReviews, deleteReview } = require("../services/review.service")
const createError = require("../utils/createError")

exports.createRevController = async (req, res, next) => {
    try {
        const product = await productsModel.findById(req.params.productId)
        if (!product) return next(createError(404, "product not found !"))
        const data = req.body;
        const newRev = await createRevService(req.user.id, data);
        if (!newRev) return next(createError('error creating review', 404))
        res.status(200).json(newRev)
    } catch (err) {
        next(err)
    }
}


exports.getReviewsCont = async(req,res,next) =>{
    try{
        const response = await getReviews(req.params.productId);
        res.status(200).json(response);
    }catch(err){
        next(err)
    }
}

exports.deleteReviewCont = async(req,res,next) =>{
    try{
        const response = await deleteReview(req.params.id, req.user.id, req.user.isAdmin)
        res.status(200).json(response);
    }catch(err){
        next(err)
    }
}
