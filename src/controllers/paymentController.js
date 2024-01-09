// controllers/paymentController.js
const PaymentService = require('../services/paymentService');
const logger = require('../utils/logger');

exports.processPayment = async (req, res, next) => {
    try {
        const { invoiceDetails } = req.body;

        // Call the payment service to process payment
        const result = await PaymentService.processPayment(invoiceDetails);

        logger.info('Payment processed successfully');
        res.status(200).json({ message: result });
    } catch (error) {
        logger.error(`Error processing payment: ${error.message}`);
        next(error);
    }
};
