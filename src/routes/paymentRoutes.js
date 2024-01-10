const express = require('express');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

// Define routes for payment functionality
router.post('/initiate-payment', paymentController.initiatePayment);
router.get('/verify/:reference', paymentController.verifyPayment);
module.exports = router;