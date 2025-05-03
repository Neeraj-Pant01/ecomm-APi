// controllers/payment.controller.js
const razorpay = require("../services/razorpay");

exports.createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};
