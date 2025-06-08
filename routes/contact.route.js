
const { postContactInfo, getCOntacts, deletedContacts } = require("../controllers/contacts.controller");
const verifyToken = require("../middleware/verifyToken");
const router = require("express").Router();

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Contact form management
 */

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Submit a contact form
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - message
 *               - subject
 *               - phone_Number
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               message:
 *                 type: string
 *               subject:
 *                 type: string
 *               phone_Number:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact info submitted
 *       404:
 *         description: Contact already sent
 */
router.post("/", postContactInfo);

/**
 * @swagger
 * /contact:
 *   get:
 *     summary: Get all contact submissions (admin only)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all contact submissions
 *       403:
 *         description: Unauthorized access
 */
router.get("/", verifyToken, getCOntacts);

/**
 * @swagger
 * /contact/{id}:
 *   delete:
 *     summary: Delete a contact submission by ID (admin only)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID to delete
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *       403:
 *         description: Unauthorized access
 */
router.delete("/:id", verifyToken, deletedContacts);

module.exports = router;
