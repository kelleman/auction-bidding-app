// services/invoiceService.js
const rabbitMQ = require('../messaging/rabbitMQ');
const InvoiceModel = require('../models/invoiceModel');
const logger = require('../utils/logger');

const generateInvoice = async (highestBidder, winningBid, itemDetails) => {
    try {
        // Logic to generate an invoice for the highest bidder

        const invoiceData = {
            highestBidder,
            winningBid,
            itemDetails,
            eventType: 'invoiceGenerated',
            /* Additional data as needed */
        };

        rabbitMQ.sendMessage('invoiceEventsQueue', JSON.stringify(invoiceData));

        return 'Invoice generated successfully';
    } catch (error) {
        logger.error(`Error generating invoice: ${error.message}`);
        throw error;
    }
};

module.exports = { generateInvoice };
