// controllers/invoiceController.js
const InvoiceService = require('../services/invoiceService');
const logger = require('../utils/logger');

exports.generateInvoice = async (req, res, next) => {
    try {
        const { highestBidder, winningBid, itemDetails } = req.body;

        // Call the invoice service to generate an invoice
        const result = await InvoiceService.generateInvoice(highestBidder, winningBid, itemDetails);

        logger.info('Invoice generated successfully');
        res.status(200).json({ message: result });
    } catch (error) {
        logger.error(`Error generating invoice: ${error.message}`);
        next(error);
    }
};
