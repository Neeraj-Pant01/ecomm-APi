// const { createOrder, updateOrder, getAllOrders, getUserOrders, getAnOrder, deleteOrder } = require("../controllers/order.controller");
// const verifyToken = require("../middleware/verifyToken");

// const router = require("express").Router();

// router.post("/order/:id",verifyToken,createOrder)
// router.put('/:id',verifyToken, updateOrder)
// router.get('/',verifyToken,getAllOrders)
// router.get('/myOrders',verifyToken,getUserOrders)
// router.get('/:id',verifyToken,getAnOrder)
// router.delete('/:id',verifyToken,deleteOrder)

// module.exports = router; 


const { createOrder, updateOrder, getAllOrders, getUserOrders, getAnOrder, deleteOrder, verifyPayment } = require("../controllers/order.controller");
const { verifyRazorpayPayment } = require("../controllers/paymentVerification.controller");
const verifyToken = require("../middleware/verifyToken");

const router = require("express").Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - userId
 *         - productId
 *         - amount
 *         - area
 *         - state
 *         - address
 *         - pincode
 *         - landmark
 *         - mobileNumber
 *         - size
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         productId:
 *           type: string
 *         productImage:
 *           type: string
 *         quantity:
 *           type: number
 *         amount:
 *           type: number
 *         area:
 *           type: string
 *         state:
 *           type: string
 *         address:
 *           type: string
 *         pincode:
 *           type: string
 *         landmark:
 *           type: string
 *         mobileNumber:
 *           type: string
 *         size:
 *           type: string
 *         color:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, completed, delivered]
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 */

/**
 * @swagger
 * /api/orders/order/{productId}:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *               area:
 *                 type: string
 *               state:
 *                 type: string
 *               address:
 *                 type: string
 *               pincode:
 *                 type: string
 *               landmark:
 *                 type: string
 *               mobileNumber:
 *                 type: string
 *               size:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */
router.post("/order/:id",verifyToken,createOrder)

router.post('/verify-payment', verifyToken, verifyPayment)


/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Update an order (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, completed, delivered]
 *     responses:
 *       200:
 *         description: Order updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */
router.put('/:id',verifyToken, updateOrder)


/**
 * @swagger
 * /api/orders/:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
router.get('/',verifyToken,getAllOrders)


/**
 * @swagger
 * /api/orders/myOrders:
 *   get:
 *     summary: Get all orders of the logged-in user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
router.get('/myOrders',verifyToken,getUserOrders)


/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get a specific order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */
router.get('/:id',verifyToken,getAnOrder)


/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete an order (Admin or Owner)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 * 
 *                 message:
 *                   type: string
 */
router.delete('/:id',verifyToken,deleteOrder)

router.post("/verify-payment", verifyRazorpayPayment);

module.exports = router; 