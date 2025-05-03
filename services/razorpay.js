const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
const createRazorpayOrder = async (amount) => {
  const options = {
    amount: amount * 100, // Amount in paise
    currency: "INR",
    payment_capture: 1,   // Auto-capture payment
  };

  const order = await razorpayInstance.orders.create(options);
  return order;
};

module.exports = {
  razorpayInstance,
  createRazorpayOrder,
};
