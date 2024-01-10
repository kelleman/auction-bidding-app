// services/invoiceService.js
const rabbitMQ = require('../messaging/rabbitMQ');
const InvoiceModel = require('../models/invoiceModel');
const logger = require('../utils/logger');

const generateInvoice = async (highestBidder, winningBid, itemDetails) => {
    try {
        // Logic to generate an invoice for the highest bidder

        // Assuming you have an InvoiceModel.create method to store the generated invoice
        const createdInvoice = await InvoiceModel.create({
            highestBidder,
            winningBid,
            itemDetails,
            /* Additional fields as needed */
        });

        const invoiceData = {
            invoiceId: createdInvoice._id, // Assuming _id is the unique identifier for the invoice
            eventType: 'invoiceGenerated',
            /* Additional data as needed */
        };

        rabbitMQ.sendMessage('invoiceEventsQueue', JSON.stringify(invoiceData));

        // Return the created invoice or its identifier for further use
        return createdInvoice;
    } catch (error) {
        logger.error(`Error generating invoice: ${error.message}`);
        throw error;
    }
};

module.exports = { generateInvoice };
