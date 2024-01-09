const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        require: true,
        unique: true
    },
    roomName: {
        type: String,
        required: true,
    },
    maxParticipants: {
        type: Number,
        required: true,
    }
    
});

const RoomModel = mongoose.model('Room', roomSchema);

module.exports = RoomModel;
