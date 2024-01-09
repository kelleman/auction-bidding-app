const rabbitMQ = require('../messaging/rabbitMQ');
const biddingService = require('../services/biddingService');
const BiddingModel = require('../models/biddingModel');
const logger = require('../utils/logger');



exports.startBiddingProcess = async (req, res) => {
    const { roomId, initiator, productDescription, startTime, hours } = req.body;

    try {
        const result = await biddingService.startBiddingProcess(roomId, initiator, productDescription, startTime, hours);
        res.status(200).json({ message: result });
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
};

exports.submitBid = async (req, res) => {
    const { biddingProcessId, userId, bidAmount } = req.body;

    try {
        const result = await biddingService.submitBid(biddingProcessId, userId, bidAmount);
        if (result.message === 'Bid submitted successfully') {
            res.status(200).json(result);
        } else {
            res.status(400).json({ error: 'Failed to submit bid' });
        }
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
};




exports.updateBid = async (req, res, next) => {
    const { biddingProcessId, userId, newBidAmount } = req.body;

    try {
        const result = await biddingService.updateBid(biddingProcessId, userId, newBidAmount);
        res.status(200).json({ message: result });
    } catch (error) {
        logger.error(`Error updating bid: ${error.message}`);
        next(error);
    }
};

exports.closeBidding = async (req, res, next) => {
    const { biddingProcessId } = req.body;

    try {
        const result = await biddingService.closeBiddingProcess(biddingProcessId);
        res.status(200).json({ message: result });
    } catch (error) {
        logger.error(`Error closing bidding process: ${error.message}`);
        next(error);
    }
};