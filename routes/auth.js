const { registerUser, loginUser } = require("../controllers/auth.controller");

const router = require("express").Router()

//register user
router.post('/register', registerUser)

//login User
router.post('/login', loginUser)

module.exports = router;
