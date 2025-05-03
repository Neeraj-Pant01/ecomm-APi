// const { uploadProduct, getProduct, getAllProducts, getProducts, updateProduct, deleteProduct } = require("../controllers/products.controller");
// const verifyToken = require("../middleware/verifyToken");

// const router = require("express").Router();

// router.post('/', verifyToken, uploadProduct)
// router.get('/:id',getProduct)
// router.get('/admin/list',verifyToken, getAllProducts)
// router.get('/',getProducts)
// router.put('/:id',verifyToken, updateProduct)
// router.delete('/:id',verifyToken,deleteProduct)

// module.exports = router;


const { uploadProduct, getProduct, getAllProducts, getProducts, updateProduct, deleteProduct } = require("../controllers/products.controller");
const verifyToken = require("../middleware/verifyToken");

const router = require("express").Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management and browsing
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Upload a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productName, productDesc, price, coverImage, categories, defaultColor]
 *             properties:
 *               productName:
 *                 type: string
 *               productDesc:
 *                 type: string
 *               price:
 *                 type: number
 *               coverImage:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *               defaultColor:
 *                 type: string
 *               avilableColors:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Product created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', verifyToken, uploadProduct)


/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       404:
 *         description: Product not found
 */
router.get('/:id', getProduct)


/**
 * @swagger
 * /products/admin/list:
 *   get:
 *     summary: Get all products (admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All products retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/admin/list', verifyToken, getAllProducts)


/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get filtered or limited list of products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: min
 *         schema:
 *           type: number
 *         description: Minimum price
 *       - in: query
 *         name: max
 *         schema:
 *           type: number
 *         description: Maximum price
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort key
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search product name
 *       - in: query
 *         name: show
 *         schema:
 *           type: boolean
 *         description: Limit to 6 items if true
 *     responses:
 *       200:
 *         description: Products retrieved
 */
router.get('/', getProducts)


/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *               productDesc:
 *                 type: string
 *               price:
 *                 type: number
 *               coverImage:
 *                 type: string
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *               defaultColor:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated
 *       401:
 *         description: Unauthorized
 */
router.put('/:id', verifyToken, updateProduct)


/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', verifyToken, deleteProduct)




module.exports = router;
