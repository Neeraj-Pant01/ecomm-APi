const orderModel = require("../models/order.model");
const productModel = require("../models/products.model");
const { razorpayInstance } = require("../services/razorpay");
const { createShipment } = require("../services/shipRocket");
const createError = require("../utils/createError");


exports.createOrder = async (req, res, next) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) return next(createError(404, "Product not found"));

    const amount = product.price * req.body.quantity;

    const newOrder = new orderModel({
      userId: req.user.id,
      productId: product._id,
      productImage: product.coverImage,
      amount,
      ...req.body,
    });

    await newOrder.save();

    if (req.body.paymentMode === "Razorpay") {
      const razorpayOrder = await razorpayInstance.orders.create({
        amount: amount * 100,
        currency: "INR",
        receipt: `order_rcptid_${newOrder._id}`,
      });

      newOrder.razorpayOrderId = razorpayOrder.id;
      await newOrder.save();

      return res.status(200).json({
        order: newOrder,
        razorpayOrder,
      });
    }

    if (req.body.paymentMode === "COD" || newOrder.isPaid) {
      // Validate required fields
      if (!req.body.address || !req.body.area || !req.body.pincode || !req.body.state || !req.body.mobileNumber) {
        return next(createError(400, "Shipping information incomplete"));
      }

      const currentDate = new Date().toISOString().split('T')[0];

      const shiprocketPayload = {
        order_id: newOrder._id.toString(),
        order_date: currentDate,
        channel: "api", // MUST be included
        pickup_location: "Home", // Must match EXACTLY (case-sensitive)
        billing_customer_name: req.body.userName,
        billing_address: req.body.address,
        billing_city: req.body.area,
        billing_pincode: req.body.pincode,
        billing_last_name: req.body.lastName || "NA",
        billing_state: req.body.state,
        billing_email: req.body.email || `${newOrder._id}@favouser.com`,
        billing_phone: req.body.mobileNumber, // Must be 10+ digits
        billing_country: "India",
        shipping_is_billing: true, // Critical for COD orders
        order_items: [
          {
            name: product.productName,
            sku: product._id.toString(),
            units: req.body.quantity,
            selling_price: product.price,
          }
        ],
        payment_method: "COD",
        shipping_charges: 0,
        sub_total: amount,
        length: product?.length || 10,
        breadth: product?.breadth || 10,
        height: product?.height || 10,
        weight: product?.weight || 0.5,
      };

      const shipment = await createShipment(shiprocketPayload);

      newOrder.isShipped = true;
      newOrder.shiprocketOrderId = shipment.order_id || shipment.shipment_id;
      newOrder.shipmentData = shipment;
      await newOrder.save();

      return res.status(200).json({
        order: newOrder,
        shiprocket: shipment,
      });
    }

    res.status(200).json(newOrder);
  } catch (err) {
    next(err);
  }
};


// Separate function to handle shipment creation
async function createAndProcessShipment(order, product, body,user) {
  const currentDate = new Date().toISOString().split('T')[0];

  // console.log('body user is',user)
  const shiprocketPayload = {
    order_id: order._id.toString(),
    order_date: currentDate,
    channel: "api",
    pickup_location: "Home",
    billing_customer_name: user.username,
    billing_address: body.address,
    billing_city: body.area,
    billing_pincode: body.pincode,
    billing_last_name: body.lastName || "NA",
    billing_state: body.state,
    billing_email: user.email || `${order._id}@favouser.com`,
    billing_phone: body.mobileNumber,
    billing_country: "India",
    shipping_is_billing: true,
    order_items: [{
      name: product.productName,
      sku: product._id.toString(),
      units: body.quantity,
      selling_price: product.price,
    }],
    payment_method: order.paymentMode === "COD" ? "COD" : "Prepaid",
    shipping_charges: 0,
    sub_total: order.amount,
    length: product?.length || 10,
    breadth: product?.breadth || 10,
    height: product?.height || 10,
    weight: product?.weight || 0.5,
  };

  const shipment = await createShipment(shiprocketPayload);

  order.isShipped = true;
  order.shiprocketOrderId = shipment.order_id || shipment.shipment_id;
  order.shipmentData = shipment;
  await order.save();
}




exports.verifyPayment = async (req, res, next) => {
  try {
    const { order_id, payment_id,user} = req.body;

    // Verify payment with Razorpay
    const payment = await razorpayInstance.payments.fetch(payment_id);

    if (payment.status === 'captured') {
      const order = await orderModel.findById(order_id);

      if (!order) return res.status(404).json({ error: "Order not found" });

      // Update order status
      order.isPaid = true;
      order.status = 'confirmed';
      await order.save();

      // Create shipment
      const product = await productModel.findById(order.productId);
      await createAndProcessShipment(order, product, order,user);

      return res.status(200).json({ success: true, order });
    }

    res.status(400).json({ error: "Payment not captured" });
  } catch (err) {
    next(err);
  }
};


exports.updateOrder = async (req, res, next) => {
  if (req.user.isAdmin) {
    try {
      const order = await orderModel.findByIdAndUpdate(req.params.id, {
        $set: req.body
      }, {
        new: true
      })
      res.status(200).json(order)
    } catch (err) {
      next(err)
    }
  } else {
    return next(createError(404, "you are not authorized to take this action !"))
  }
}

exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await orderModel.find({ userId: req.user.id })
    res.status(200).json(orders)
  } catch (err) {
    next(err)
  }
}

exports.getAnOrder = async (req, res, next) => {
  try {
    const order = await orderModel.findById(req.params.id)
    res.status(200).json(order)
  } catch (err) {
    next(err)
  }
}

exports.getAllOrders = async (req, res, next) => {
  if (req.user.isAdmin) {
    try {
      const orders = await orderModel.find();
      res.status(200).json(orders)
    } catch (err) {
      next(err)
    }
  } else {
    return next(createError(404, "you are not allowed to take this action !"))
  }
}

exports.deleteOrder = async (req, res, next) => {
  const order = await orderModel.findById(req.params.id)
  if (!order) return next(createError(404, "order not found !"))
  if (req.user.isAdmin || order.userId === req.user.id) {
    try {
      const order = await orderModel.findByIdAndDelete(req.params.id);
      res.status(200).json({
        message: "order deleted successfylly !"
      })
      res.status(200).json(order)
    } catch (err) {
      next(err)
    }
  } else {
    return next(createError(404, "you cannot perform this action !"))
  }
}




//
// shiprocket order create if paid online