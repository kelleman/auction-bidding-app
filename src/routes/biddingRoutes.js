const express = require('express');
const { verifyToken } = require('../middlewares/authMiddleware');
const biddingController = require('../controllers/biddingController');

const router = express.Router();

// Routes for bidding functionality
router.post('/start-bidding-process', biddingController.startBiddingProcess);
router.post('/submit-bid', biddingController.submitBid);
router.put('/update-bid', biddingController.updateBid)
router.post('/close-bidding', biddingController.closeBidding);
module.exports = router;
