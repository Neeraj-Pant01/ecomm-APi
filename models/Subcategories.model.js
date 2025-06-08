const mongoose = require("mongoose");

const subcatSchema = new mongoose.Schema({
    productId:{
        typpe:string,
        required:true
    },
    categories:{
        type:[String],
        required
    },
},{
    timestamps:true
})

module.exports = mongoose.model('subCategories', subcatSchema)