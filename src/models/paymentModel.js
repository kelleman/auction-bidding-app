// paymentModel.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending',
    },
    transactionDate: {
        type: Date,
        default: Date.now,
    },
});

const PaymentModel = mongoose.model('Payment', paymentSchema);

module.exports = PaymentModel;
