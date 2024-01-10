require('dotenv').config()
const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);
const rabbitMQ = require('../messaging/rabbitMQ');
const {BidModel} = require('../models/biddingModel')
const UserModel = require('../models/userModel')
const PaymentModel = require('../models/paymentModel');
const InvoiceModel = require('../models/invoiceModel');
const logger = require('../utils/logger');
 // Make sure to import InvoiceModel

 const initiatePayment = async (invoiceDetails) => {
    try {
        // Assuming invoiceDetails include userId, biddingProcessId, and amount
        const { userId, biddingProcessId, amount, invoiceId } = invoiceDetails;

        // Log the received invoiceDetails
        console.log('Received invoiceDetails:', invoiceDetails);

        // Fetch user's email from the user collection
        const user = await UserModel.findById(userId);
        const userEmail = user ? user.email : 'user@example.com'; // Default email if user not found

        // Log the fetched user email and amount
        console.log('User Email:', userEmail);
        console.log('Payment Amount:', amount);

        // Initialize payment with Paystack
        const paymentInitializeResponse = await paystack.transaction.initialize({
            email: userEmail,
            amount: invoiceDetails.amount * 100, // Paystack amount is in kobo (multiply by 100)
        });

        // Log the Paystack response
        console.log('Paystack Response:', paymentInitializeResponse);

        // Check if payment initialization was successful
        if (!paymentInitializeResponse || !paymentInitializeResponse.data || !paymentInitializeResponse.data.authorization_url) {
            throw new Error('Failed to initialize payment. Response: ' + JSON.stringify(paymentInitializeResponse));
        }

        // ... rest of the code
    } catch (error) {
        console.error(`Error processing payment: ${error.message}`);
        throw error;
    }
};



module.exports = { initiatePayment };
