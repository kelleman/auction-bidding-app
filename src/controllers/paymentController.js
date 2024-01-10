const paymentService = require('../services/paymentService');
const logger = require('../utils/logger');

const initiatePayment = async (req, res, next) => {
    try {
        const invoiceDetails = req.body; 
        const paymentResult = await paymentService.initiatePayment(invoiceDetails);

        // Check if the payment initiation was successful
        if (paymentResult.authorizationUrl) {
            // If successful, send the authorization URL to the client
            res.json({
                status: 'success',
                message: 'Payment initiation successful',
                authorizationUrl: paymentResult.authorizationUrl,
            });
        } else {
            
            res.status(500).json({
                status: 'failure',
                message: 'Failed to initiate payment',
            });
        }
    } catch (error) {
        console.error(`Error initiating payment: ${error.message}`);
        next(error); 
    }
};

// fuction to verify payment
const verifyPayment = async (req, res, next) => {
    try {
        const reference = req.params.reference;

        // Verify payment with Paystack
        const paymentVerifyResponse = await paystack.transaction.verify(reference);

        // Check if payment is successful
        if (paymentVerifyResponse.data.status === 'success') {
            // Update your database 
            const updatedPayment = await PaymentModel.findOneAndUpdate(
                { reference },
                { status: 'success' },
                { new: true }
            );

            // Fetch the associated invoice information
            const invoice = await InvoiceModel.findOne({ reference: updatedPayment.invoiceReference });

            
            if (invoice) {
                // Update your database 
                await InvoiceModel.findOneAndUpdate(
                    { _id: invoice._id },
                    { status: 'paid' },
                    { new: true }
                );
            }

            res.json({ status: 'success', data: updatedPayment });
        } else {
            res.json({ status: 'failure', data: paymentVerifyResponse.data });
        }
    } catch (error) {
        console.error(`Error verifying payment: ${error.message}`);
        next(error); 
    }
};

module.exports = { initiatePayment, verifyPayment };
