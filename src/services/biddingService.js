
const rabbitMQ = require('../messaging/rabbitMQ');
const { BiddingProcessModel, BidModel } = require('../models/biddingModel');
const InvoiceModel = require('../models/invoiceModel');
const logger = require('../utils/logger');

// logic for opening or initiating a auction for bidding
const startBiddingProcess = async (roomId, initiator, productDescription, hours) => {
    try {
        // Check if there is an active bid already
        const activeBid = await BiddingProcessModel.findOne({ roomId, status: 'active' });

        if (activeBid) {
            const error = new Error('There is already an active bid in the room');
            error.status = 400;
            throw error;
        }

        // Initialize a new bidding process with current time as startTime
        const startTime = new Date();
        const newBiddingProcess = new BiddingProcessModel({
            roomId,
            initiator,
            productDescription,
            startTime,
            hours,
        });

        // Save the new bidding process to the database
        await newBiddingProcess.save();

        // Notify all users in the room about the new bidding process
        const notificationData = {
            roomId,
            eventType: 'biddingStarted',
            productDescription,
            startTime,
            hours,
        };

        rabbitMQ.sendMessage('biddingEventsQueue', JSON.stringify(notificationData));

        return {
            message:'Bidding process started successfully',
            auction_Data: {notificationData}
        };
    } catch (error) {
        logger.error(`Error starting bidding process: ${error.message}`);
        throw error;
    }
};

// logic for placing a bid
const submitBid = async (biddingProcessId, userId, bidAmount) => {
    try {
        // Check if the bidding process is active
        const biddingProcess = await BiddingProcessModel.findOne({ _id: biddingProcessId, status: 'active' });

        if (!biddingProcess) {
            const error = new Error('The bidding process is not active or does not exist');
            error.status = 400;
            throw error;
        }

        // Create and save a new bid
        const newBid = new BidModel({
            biddingProcessId,
            userId,
            bidAmount,
        });

        await newBid.save();

        // Notify all users in the room about the new bid
        const notificationData = {
            roomId: biddingProcess.roomId,
            eventType: 'bidSubmitted',
            userId,
            bidAmount,
        };

        rabbitMQ.sendMessage('biddingEventsQueue', JSON.stringify(notificationData));

        // Check for the new highest bid
        const highestBid = await BidModel
            .find({ biddingProcessId, bidAmount: { $gt: 0 } })
            .sort('-bidAmount')
            .limit(1)
            .select('userId bidAmount -_id');

        // Notify all users in the room about the new highest bid
        if (highestBid.length > 0) {
            const highestBidNotificationData = {
                roomId: biddingProcess.roomId,
                eventType: 'highestBidUpdated',
                highestBidAmount: highestBid[0].bidAmount,
                highestBidder: highestBid[0].userId,
            };

            rabbitMQ.sendMessage('biddingEventsQueue', JSON.stringify(highestBidNotificationData));
        }

        return {
            message: 'Bid submitted successfully',
            submittedBid: { notificationData },
            highestBidData: highestBid.length > 0 ? {
                highestBidAmount: highestBid[0].bidAmount,
                highestBidder: highestBid[0].userId,
            } : {},
        };
    } catch (error) {
        logger.error(`Error submitting bid: ${error.message}`);
        throw error;
    }
};

//  updating the bid
const updateBid = async (biddingProcessId, userId, newBidAmount) => {
    try {
        // Check if the bidding process is active
        const biddingProcess = await BiddingProcessModel.findById(biddingProcessId);

        if (!biddingProcess || biddingProcess.status !== 'active') {
            const error = new Error('Bidding process is not active');
            error.status = 400;
            throw error;
        }

        // Check if the user has already placed a bid
        const existingBid = await BidModel.findOne({ biddingProcessId, userId });

        if (!existingBid) {
            const error = new Error('User has not placed a bid in this bidding process');
            error.status = 400;
            throw error;
        }

        // Notify all users in the room about the bid update
        const notificationData = {
            roomId: biddingProcess.roomId,
            eventType: 'bidUpdated',
            userId,
            newBidAmount,
        };

        rabbitMQ.sendMessage('biddingEventsQueue', JSON.stringify(notificationData));

        // Update the bid amount
        existingBid.bidAmount = newBidAmount;
        await existingBid.save();

        // Check for the current highest bid
        const highestBid = await BidModel
            .find({ biddingProcessId, bidAmount: { $gt: 0 } })
            .sort('-bidAmount')
            .limit(1)
            .select('userId bidAmount -_id');

        // Send real-time update for the highest bid
        if (highestBid.length > 0) {
            const highestBidUpdate = {
                roomId: biddingProcess.roomId,
                eventType: 'highestBidUpdated',
                highestBidAmount: highestBid[0].bidAmount,
                highestBidder: highestBid[0].userId,
            };

            rabbitMQ.sendMessage('biddingEventsQueue', JSON.stringify(highestBidUpdate));
        }

        return {
            message: 'Bid submitted successfully',
            submittedBid: { notificationData },
            highestBidData: highestBid.length > 0 ? {
                highestBidAmount: highestBid[0].bidAmount,
                highestBidder: highestBid[0].userId,
            } : {},
        };
    } catch (error) {
        logger.error(`Error updating bid: ${error.message}`);
        throw error;
    }
};


// close bidding with notification
const closeBiddingProcess = async (biddingProcessId) => {
    try {
        // Find the bidding process by ID
        const biddingProcess = await BiddingProcessModel.findById(biddingProcessId);

        if (!biddingProcess) {
            const error = new Error('Bidding process not found');
            error.status = 404;
            throw error;
        }

        // Check if the bidding process is already closed
        if (biddingProcess.status === 'inactive') {
            const error = new Error('Bidding process is already closed');
            error.status = 400;
            throw error;
        }

        
        // Find the highest bidder(s)
        const highestBids = await BidModel
            .find({ biddingProcessId, bidAmount: { $gt: 0 } })
            .sort('-bidAmount')
            .limit(1)
            .select('userId bidAmount -_id');

        console.log('Highest Bids:', highestBids);

        // Notify all users in the room about the bidding process closure
        const notificationData = {
            roomId: biddingProcess.roomId,
            eventType: 'biddingClosed',
            biddingProcessId,
            highestBidder: highestBids.length > 0 ? highestBids[0].userId : null,
            productDescription: biddingProcess.productDescription,
        };

        // Send notification to biddingEventsQueue
        rabbitMQ.sendMessage('biddingEventsQueue', JSON.stringify(notificationData));

        // Send invoice to the highest bidder (if exists)
        if (highestBids.length > 0) {
            const highestBidderId = highestBids[0].userId;

            // Create an invoice with relevant information
            const invoiceData = {
                userId: highestBidderId,
                biddingProcessId,
                amount: highestBids[0].bidAmount,
                description: `Invoice for winning bid in ${biddingProcess.productDescription}`,
            };

            console.log('Invoice Data:', invoiceData);

            // Save the invoice to InvoiceModel (or your invoice collection)
            const invoice = await InvoiceModel.create(invoiceData);

            console.log('Invoice Created:', invoice);

            // Send invoice notification to the highest bidder
            const invoiceNotification = {
                eventType: 'invoiceSent',
                invoiceId: invoice._id,
                amount: invoice.amount,
                description: invoice.description,
            };

            console.log('Invoice Notification:', invoiceNotification);

            rabbitMQ.sendMessage('notificationQueue', JSON.stringify({
                userId: highestBidderId,
                notification: invoiceNotification,
            }));
        }

        // Update the bidding process status to 'closed'
        biddingProcess.status = 'inactive';
        await biddingProcess.save();


        return {
            message: 'Bidding process closed successfully',
            highestBidData: highestBids.length > 0 ? {
                highestBidAmount: highestBids[0].bidAmount,
                highestBidder: highestBids[0].userId,
            } : {},
        };
    } catch (error) {
        console.error(`Error closing bidding process: ${error.message}`);
        throw error;
    }
};

module.exports = {
    startBiddingProcess,
    submitBid,
    closeBiddingProcess,
    updateBid
}
