// const mongoose = require("mongoose")

// const orderSchema = new mongoose.Schema({
//     userId:{
//         type:String,
//         required:true
//     },
//     productId:{
//         type:String,
//         required:true
//     },
//     productImage:{
//         type:String,
//         required:true
//     },
//     quantity:{
//         type:Number,
//         default:1
//     },
//     amount:{
//         type:Number,
//         required:true
//     },
//     area:{
//         type:String,
//         required:true
//     },
//     state:{
//         type:String,
//         required:true
//     },
//     address:{
//         type:String,
//         required:true
//     },
//     pincode:{
//         type:String,
//         required:true
//     },
//     landmark:{
//         type:String,
//         required:true
//     },
//     mobileNumber:{
//         type:String,
//         required:true
//     },
//     size:{
//         type:String,
//         required:true
//     },
//     color:{
//         type:String
//     },
//     status:{
//         type:String,
//         enum : ["pending", "completed", "delivered"],
//         default: "pending"
//     },
//  },{
//     timestamps:true
// })

// module.exports = mongoose.model('orders',orderSchema)


const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  productImage: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  amount: {
    type: Number,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default:"none",
    required: true,
  },
  color: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "delivered", 'confirmed'],
    default: "pending",
  },
  // 💰 Payment Related
  paymentMode: {
    type: String,
    enum: ["COD", "Razorpay"],
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  razorpayOrderId: {
    type: String,
  },
  razorpayPaymentId: {
    type: String,
  },
  razorpaySignature: {
    type: String,
  },

  // 🚚 Shipping Related
  isShipped: {
    type: Boolean,
    default: false,
  },
  shiprocketOrderId: {
    type: String,
  },
  isCancelled:{
    type:Boolean,
    default: false
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model("orders", orderSchema);
