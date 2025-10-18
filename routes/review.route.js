const { createRevController, getReviewsCont, deleteReviewCont } = require("../controllers/review.controller");
const verifyToken = require("../middleware/verifyToken");

const router = require("express").Router();

router.post('/:productId', verifyToken, createRevController)
router.get('/:productId', verifyToken, getReviewsCont)
router.delete('/:id', verifyToken, deleteReviewCont)

module.exports = router;