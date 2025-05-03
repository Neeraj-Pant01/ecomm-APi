const { getUserProfile, updateProfile, getAllusers } = require("../controllers/user.controller");
const verifyToken = require("../middleware/verifyToken");

const router = require("express").Router();

// router.get('/:id',verifyToken, getUserProfile)
// router.put('/:id',verifyToken,updateProfile)

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile management
 */

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 mobile:
 *                   type: string
 *                 city:
 *                   type: string
 *                 pincode:
 *                   type: string
 *                 profile:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/:id',verifyToken, getUserProfile)

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               mobile:
 *                 type: string
 *               city:
 *                 type: string
 *               pincode:
 *                 type: string
 *               profile:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.put('/:id',verifyToken,updateProfile)

/**
 * @swagger
 * /user/admin/all:
 *   get:
 *     summary: Get all products (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All users retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/admin/all', verifyToken,getAllusers)


module.exports = router;