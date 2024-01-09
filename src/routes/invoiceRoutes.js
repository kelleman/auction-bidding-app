const express = require('express');
const invoiceController = require('../controllers/invoiceController');

const router = express.Router();

// Define routes for invoice functionality
router.post('/generateInvoice', invoiceController.generateInvoice);

module.exports = router;
