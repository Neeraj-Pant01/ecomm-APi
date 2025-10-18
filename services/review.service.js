const { default: mongoose } = require("mongoose");
const reviewModel = require("../models/review.model");

exports.createRevService = async (userId, data) => {
    const rev = new reviewModel({ userId: userId, ...data })
    const savedRev = await rev.save();
    return savedRev;
}

exports.getRevService = async (revId) => {
    const review = await reviewModel.findById(revId);
    return review;
}

exports.getReviews = async (productId) => {
    return await reviewModel.find({productId:productId});
}

exports.updateReview = async (revId, updatedData, userId) => {
    const query = {
        _id: revId,
        $or: [
            { userId: userId }
        ]
    }
    if (isAdmin) {
        query.$or.push({});
    }
    const review = await reviewModel.findOneAndUpdate(query, {
        $set: updatedData
    }, {
        new: true,
        runValidators: true
    })
    if (!review) throw new Error("unauthorized access !")
    return review;
}

exports.deleteReview = async (revId, userId, isAdmin) => {
    const query = {
        _id: revId,
        $or: [
            { userId: userId }
        ]
    }
    if (isAdmin) {
        query.$or.push({});
    }
    const review = await reviewModel.findOneAndDelete(query);
     if (!review) throw new Error("unauthorized access !")
    return {message:"review deleted successfully"}
}

exports.likeReview = async (revId, userId) => {
    const rev = await reviewModel.findByIdAndUpdate(revId, {
        $addToSet: { likes: userId }
    }, {
        new: true,
        runValidators: true
    })
    return rev;
}

exports.DislikeReview = async (revId, userId) => {
    const updatedRev = await reviewModel.findOneAndUpdate(
        {
            _id: revId,
            likes: new mongoose.Types.ObjectId(userId),
        },
        {
            $pull: { likes: new mongoose.Types.ObjectId(userId) },
        },
        {
            new: true,
            runValidators: true,
        }
    );

    if (!updatedRev) {
        throw new Error("You have not liked this review yet");
    }

    return updatedRev;
};



