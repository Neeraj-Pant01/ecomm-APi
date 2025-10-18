const mongoose = require('mongoose');

const revSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    username: {
        type: String,
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'products'
    },
    starnumber: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    revText: {
        type: String,
        required: true
    },
    others:{
        type:mongoose.Schema.Types.Mixed,
        default:{}
    }
},{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

module.exports = mongoose.model('reviews', revSchema);