const { getAllUsers } = require("../controllers/user.controller");
const verifyToken = require("../middleware/verifyToken");

const router = require("express").Router();

router.get('/',verifyToken, getAllUsers)

module.exports = router;