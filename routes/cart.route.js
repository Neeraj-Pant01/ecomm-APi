// const { createCart, addProduct, removeProduct, getCartByUserId, getCartByCartId, deleteCart, getAllCarts } = require("../controllers/cart.controller");
// const verifyToken = require("../middleware/verifyToken");

// const router = require("express").Router();

// //createCart
// router.post('/',verifyToken,createCart)

// //add products to the cart
// router.put('/add-product/',verifyToken,addProduct)

// //remove products from the cart
// router.put('/remove/:productId',verifyToken,removeProduct)

// //delete the cart
// router.delete('/:id',verifyToken, deleteCart)

// //get the cart by userId
// router.get('/',verifyToken,getCartByUserId)

// //get the cart by cartId
// router.get('/:id',verifyToken, getCartByCartId)

// //get all the carts
// router.get('/',verifyToken, getAllCarts)

// module.exports = router;





const {
    createCart,
    addProduct,
    removeProduct,
    getCartByUserId,
    getCartByCartId,
    deleteCart,
    getAllCarts
  } = require("../controllers/cart.controller");
  
  const verifyToken = require("../middleware/verifyToken");
  const router = require("express").Router();
  
  /**
   * @swagger
   * tags:
   *   name: Cart
   *   description: Shopping cart management
   */
  
  /**
   * @swagger
   * /cart:
   *   post:
   *     summary: Create a new cart for the logged-in user
   *     tags: [Cart]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - productId
   *               - quantity
   *             properties:
   *               productId:
   *                 type: string
   *               quantity:
   *                 type: number
   *               size:
   *                 type: string
   *               color:
   *                 type: string
   *     responses:
   *       200:
   *         description: Cart created
   *       404:
   *         description: Cart already exists
   */
  router.post('/', verifyToken, createCart);
  
  /**
   * @swagger
   * /cart/add-product:
   *   put:
   *     summary: Add a product to the user's cart
   *     tags: [Cart]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - productId
   *             properties:
   *               productId:
   *                 type: string
   *               quantity:
   *                 type: number
   *               size:
   *                 type: string
   *               color:
   *                 type: string
   *     responses:
   *       200:
   *         description: Product added to cart
   *       404:
   *         description: Cart not found
   */
  router.put('/add-product', verifyToken, addProduct);
  
  /**
   * @swagger
   * /cart/remove/{productId}:
   *   put:
   *     summary: Remove a product from the user's cart
   *     tags: [Cart]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: productId
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the product to remove
   *     responses:
   *       200:
   *         description: Product removed from cart
   */
  router.put('/remove/:productId', verifyToken, removeProduct);
  
  /**
   * @swagger
   * /cart:
   *   get:
   *     summary: Get the logged-in user's cart
   *     tags: [Cart]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Cart fetched
   *       404:
   *         description: Cart not found
   */
  router.get('/', verifyToken, getCartByUserId);
  
  /**
   * @swagger
   * /cart/{id}:
   *   get:
   *     summary: Get a cart by cart ID (admin only)
   *     tags: [Cart]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Cart ID
   *     responses:
   *       200:
   *         description: Cart fetched by ID
   *       401:
   *         description: Unauthorized
   */
  router.get('/:id', verifyToken, getCartByCartId);
  
  /**
   * @swagger
   * /cart/{id}:
   *   delete:
   *     summary: Delete a cart by ID (owner or admin)
   *     tags: [Cart]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Cart ID
   *     responses:
   *       200:
   *         description: Cart deleted
   *       401:
   *         description: Unauthorized
   */
  router.delete('/:id', verifyToken, deleteCart);
  
  /**
   * @swagger
   * /cart/all:
   *   get:
   *     summary: Get all carts (admin only)
   *     tags: [Cart]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: All carts fetched
   *       401:
   *         description: Unauthorized
   */
  router.get('/all', verifyToken, getAllCarts);
  
  module.exports = router;
  