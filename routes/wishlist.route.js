
  const { createWishlist, addProductToWishlist, removeProductFromWishlist, getwishlistByUserId, addOrUpdateWishlist } = require("../controllers/wishlist.controller");
const verifyToken = require("../middleware/verifyToken");
  const router = require("express").Router();
  
  /**
   * @swagger
   * tags:
   *   name: wishlist
   *   description: Shopping wishlist management
   */
  
  /**
   * @swagger
   * /wishlist:
   *   post:
   *     summary: Create a new wishlist for the logged-in user
   *     tags: [wishlist]
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
   *               - productImage
   *             properties:
   *               productId:
   *                 type: string
   *               productImage:
   *                 type: string
   *               productName:
   *                 type: string
   *               price:
   *                 type: number
   *               desc:
   *                 type: string
   *     responses:
   *       200:
   *         description: wishlist created
   *       404:
   *         description: wishlist already exists
   */
  router.post('/', verifyToken, addOrUpdateWishlist);
  
  /**
   * @swagger
   * /wishlist/add-product:
   *   put:
   *     summary: Add a product to the user's wishlist
   *     tags: [wishlist]
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
   *               price:
   *                 type: number
   *               productImage:
   *                 type: string
   *               productName:
   *                 type: string
   *               desc:
   *                 type: string
   *     responses:
   *       200:
   *         description: Product added to cart
   *       404:
   *         description: Cart not found
   */
  router.put('/add-product', verifyToken, addProductToWishlist);
  
  /**
   * @swagger
   * /wishlist/remove/{productId}:
   *   put:
   *     summary: Remove a product from the user's wishlist
   *     tags: [wishlist]
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
   *         description: Product removed from wishlist
   */
  router.put('/remove/:productId', verifyToken, removeProductFromWishlist);
  
  /**
   * @swagger
   * /wishlist:
   *   get:
   *     summary: Get the logged-in user's wishlist
   *     tags: [wishlist]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: wishlist fetched
   *       404:
   *         description: wishlist not found
   */
  router.get('/', verifyToken, getwishlistByUserId);
  
  /**
   * @swagger
   * /wishlist/{id}:
   *   get:
   *     summary: Get a wishlist by wishlist ID (admin only)
   *     tags: [wishlist]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: wishlist ID
   *     responses:
   *       200:
   *         description: wishlist fetched by ID
   *       401:
   *         description: Unauthorized
   */
  router.get('/:id', verifyToken, getwishlistByUserId);
  

  
  module.exports = router;
  