const express = require('express');

const {startBiddingProcess, submitBid, updateBid, closeBidding} = require('../controllers/biddingController');

let router = express.Router();


// Routes for bidding functionality
router.post('/start-bidding-process', startBiddingProcess);
router.post('/submit-bid', submitBid);
router.put('/update-bid', updateBid)
router.post('/close-bidding', closeBidding);
module.exports = router;
