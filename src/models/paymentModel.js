const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
    required: true 
},
    biddingProcessId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true 
    },
    invoiceReference: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Invoice', 
        required: true 
},
    paymentReference: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['pending', 'success', 'failure'], 
    default: 'pending' 
},
    amount: { 
        type: Number, 
        required: true 
    },
    reference: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

const PaymentModel = mongoose.model('Payment', paymentSchema);

module.exports = PaymentModel;
