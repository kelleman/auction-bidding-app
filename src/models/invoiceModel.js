const mongoose = require('mongoose');


// const BiddingProcessModel = require('./models/BiddingProcess');
// const BidModel = require('./models/Bid');

const invoiceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Assuming a User model for the bidder
    },
    biddingProcessId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'BiddingProcess',
    },
    bidAmount: {
        type: Number,
        required: true,
    },
    productDescription: {
        type: String,
        required: true,
    },
    accountNumber: {
        type: String,
        required: true,
    },
    bankName: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const InvoiceModel = mongoose.model('Invoice', invoiceSchema);

module.exports = InvoiceModel;
