const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true 
    },
    biddingProcessId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true },
    description: { 
        type: String, 
        required: true 
    },
});

const InvoiceModel = mongoose.model('Invoice', invoiceSchema);

module.exports = InvoiceModel;
