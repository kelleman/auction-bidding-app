// roomService.js
const RoomModel = require('../models/roomModel');
const logger = require('../utils/logger');

// Function to create a new room
const createRoom = async (roomName, maxParticipants) => {
    try {
        const newRoom = new RoomModel({
            roomName: roomName,
            maxParticipants: maxParticipants,
            
        });

        await newRoom.save();

        logger.info(`Room created: ${roomName}`);
        return newRoom;
    } catch (error) {
        logger.error(`Error creating room: ${error.message}`);
        throw error;
    }
};

// Function to get details of a specific room
const getRoomDetails = async (requestData) => {
    try {
        const { roomId } = requestData;
        const room = await RoomModel.findById(roomId);

        if (!room) {
            const error = new Error('Room not found');
            error.status = 404;
            throw error;
        }
        return room;
    } catch (error) {
        logger.error(`Error getting room details: ${error.message}`);
        throw error;
    }
};


// function to join a room
const joinRoom = async (roomId, userId) => {
    try {
        logger.info(`Attempting to join room with ID: ${roomId}`);
        const room = await RoomModel.findById(roomId);

        if (!room) {
            const error = new Error('Room not found');
            error.status = 404;
            throw error;
        }

        logger.info(`Found room: ${JSON.stringify(room)}`);

        // Ensure 'participants' array is initialized
        room.participants = room.participants || [];

        // Check if the user is already a participant in the room
        if (room.participants.includes(userId)) {
            const error = new Error('User is already a participant in the room');
            error.status = 400;
            throw error;
        }

        if (room.participants.length < room.maxParticipants) {
            room.participants.push(userId);
            await room.save();

            logger.info(`User ${userId} joined room ${roomId}`);
        } else {
            const error = new Error('Room is already full');
            error.status = 400;
            throw error;
        }
    } catch (error) {
        logger.error(`Error joining room: ${error.message}`);
        throw error;
    }
};


module.exports = {
    createRoom,
    getRoomDetails,
    joinRoom
   
};

