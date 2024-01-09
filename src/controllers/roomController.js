const RoomModel = require('../models/roomModel');
const roomService = require('../services/roomService');

exports.createRoom = async (req, res, next) => {
    try {
        const { roomName, maxParticipants } = req.body;
        const newRoom = await roomService.createRoom(roomName, maxParticipants);
        res.status(201).json({ message: 'Room created successfully', room: newRoom });
    } catch (error) {
        next(error);
    }
};


exports.getRoomDetails = async (req, res, next) => {
    try {
        const { roomId } = req.params;
        const roomDetails = await roomService.getRoomDetails(roomId);
        res.status(200).json({ room: roomDetails });
    } catch (error) {
        next(error);
    }
};

exports.joinRoom = async (req, res, next) => {
    try {
        const { roomId, userId } = req.body; // or req.params depending on your route configuration
        await roomService.joinRoom(roomId, userId);
        res.status(200).json({ message: 'You have joined the room successfully' });
    } catch (error) {
        next(error);
    }
};


// exports.addParticipantToRoom = async (req, res, next) => {
//     try {
//         const { roomId } = req.params;
//         const { userId } = req.body;
//         await roomService.addParticipantToRoom(roomId, userId);
//         res.status(200).json({ message: 'Participant added to the room successfully' });
//     } catch (error) {
//         next(error);
//     }
// };
