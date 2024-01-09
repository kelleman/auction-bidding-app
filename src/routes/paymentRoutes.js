const express = require('express');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

// Define routes for payment functionality
router.post('/processPayment', paymentController.processPayment);

module.exports = router;