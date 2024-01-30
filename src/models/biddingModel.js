const mongoose = require('mongoose');

//  model for initiating bidding process
const biddingProcessSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
    initiator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    productDescription: {
        type: String,
        required: true,
    },
    // bankNae: {
    //     type: String,
    // },
    // accountNumber: {
    //     type: Number
    // },
    startTime: {
        type: Date,
        
    },
    hours: {
        type: String,
        
    },
});

const BiddingProcessModel = mongoose.model('BiddingProcess', biddingProcessSchema);


// model for submitting bids
const bidSchema = new mongoose.Schema({
    biddingProcessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BiddingProcess',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    bidAmount: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const BidModel = mongoose.model('Bid', bidSchema);

module.exports = { BiddingProcessModel, BidModel };
