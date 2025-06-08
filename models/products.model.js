const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    productDesc: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    maxPrice: {
        type: Number
    },
    offer: {
        type: String
    },
    coverImage: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        required: false
    },
    categories: {
        type: Array,
        required: true
    },
    subcategories: {
        type: [{
            name: {
                type: String
            },
            types: {
                type: [String]
            }
        }]
    },
    totalStars: {
        type: Number,
        default: 0
    },
    starNumber: {
        type: Number,
        default: 0
    },
    inStocks: {
        type: Number,
        default: 1
    },
    sales: {
        type: Number,
        default: 0
    },
    defaultColor: {
        type: String,
        required: true
    },
    avilableColors: {
        type: [String],
    },
    length: { type: Number, default: 10 },  // in cm
    breadth: { type: Number, default: 10 }, // in cm
    height: { type: Number, default: 10 },  // in cm
    weight: { type: Number, default: 0.5 }  // in kg
}, {
    timestamps: true
})

module.exports = mongoose.model("products", productSchema)