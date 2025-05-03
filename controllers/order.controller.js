const orderModel = require("../models/order.model");
const productModel = require("../models/products.model");
const { razorpayInstance } = require("../services/razorpay");
const { createShipment } = require("../services/shipRocket");
const createError = require("../utils/createError");

// exports.createOrder = async (req,res,next) =>{
//     try{
//         const product = await productModel.findById(req.params.id)
//         const newOrder = new orderModel({
//             userId:req.user.id,
//             productId:product._id,
//             productImage:product.coverImage,
//             amount:product.price * req.body.quantity,
//             ...req.body
//         })
//         await newOrder.save()
//         res.status(200).json(newOrder)
//     }catch(err){
//         next(err)
//     }
// }

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

    // 👉 If Razorpay payment
    if (req.body.paymentMode === "Razorpay") {
      const razorpayOrder = await razorpayInstance.orders.create({
        amount: amount * 100, // amount in paisa
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

    // 👉 If COD - trigger Shiprocket immediately
    if (req.body.paymentMode === "COD") {
      const shiprocketPayload = {
        order_id: newOrder._id.toString(),
        order_date: new Date().toISOString().split("T")[0],
        billing_customer_name: req.user.name || "Customer",
        billing_address: req.body.address,
        billing_city: req.body.area,
        billing_pincode: req.body.pincode,
        billing_state: req.body.state,
        billing_email: req.user.email || "email@example.com",
        billing_phone: req.body.mobileNumber,
        order_items: [
          {
            name: product.title || "Product",
            sku: product._id,
            units: req.body.quantity,
            selling_price: product.price,
          },
        ],
        payment_method: "COD",
        shipping_charges: 0,
        sub_total: amount,
        length: 10,
        breadth: 10,
        height: 10,
        weight: 0.5,
      };

      const shipment = await createShipment(shiprocketPayload);

      newOrder.isShipped = true;
      newOrder.shiprocketOrderId = shipment.shipment_id || shipment.order_id;
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


exports.updateOrder = async (req,res,next) =>{
    if(req.user.isAdmin){
        try{
            const order = await orderModel.findByIdAndUpdate(req.params.id,{
                $set : req.body
            },{
                new: true
            })
        res.status(200).json(order)
        }catch(err){
            next(err)
        }
    }else{
        return next(createError(404, "you are not authorized to take this action !"))
    }
}

exports.getUserOrders = async (req,res,next) =>{
    try{
        const orders = await orderModel.find({userId: req.user.id})
        res.status(200).json(orders)
    }catch(err){
        next(err)
    }
}

exports.getAnOrder = async (req,res,next) =>{
    try{
        const order = await orderModel.findById(req.params.id)
        res.status(200).json(order)
    }catch(err){
        next(err)
    }
}

exports.getAllOrders = async (req,res,next) =>{
    if(req.user.isAdmin){
        try{
        const orders = await orderModel.find();
        res.status(200).json(orders)
        }catch(err){
            next(err)
        }
    }else{
        return next(createError(404, "you are not allowed to take this action !"))
    }
}

exports.deleteOrder = async (req,res,next) =>{
    const order = await orderModel.findById(req.params.id)
    if(!order) return next(createError(404, "order not found !"))
    if(req.user.isAdmin || order.userId === req.user.id){
        try{
            const order = await orderModel.findByIdAndDelete(req.params.id);
            res.status(200).json({
                message: "order deleted successfylly !"
            })
            res.status(200).json(order)
        }catch(err){
            next(err)
        }
    }else{
        return next(createError(404, "you cannot perform this action !"))
    }
}