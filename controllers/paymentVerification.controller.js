const crypto = require("crypto");
const orderModel = require("../models/order.model");
const { createShipment } = require("../services/shipRocket");

exports.verifyRazorpayPayment = async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    return res.status(400).json({ message: "Invalid signature" });
  }

  try {
    const order = await orderModel.findByIdAndUpdate(
      orderId,
      {
        isPaid: true,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
      { new: true }
    );

    // ✅ Auto-create shipment after successful payment
    const shiprocketPayload = {
      order_id: order._id.toString(),
      order_date: new Date().toISOString().split("T")[0],
      billing_customer_name: req.user.name,
      billing_address: order.address,
      billing_city: order.area,
      billing_pincode: order.pincode,
      billing_state: order.state,
      billing_email: req.user.email,
      billing_phone: order.mobileNumber,
      order_items: [
        {
          name: "Product", // optionally fetch title
          sku: order.productId,
          units: order.quantity,
          selling_price: order.amount,
        },
      ],
      payment_method: "Prepaid",
      shipping_charges: 0,
      sub_total: order.amount,
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5,
    };

    const shipment = await createShipment(shiprocketPayload);

    order.isShipped = true;
    order.shiprocketOrderId = shipment.shipment_id || shipment.order_id;
    await order.save();

    res.status(200).json({ message: "Payment verified & shipment created", order });
  } catch (err) {
    next(err);
  }
};
