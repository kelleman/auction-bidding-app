// roomRoutes.js
const express = require('express');
const roomController = require('../controllers/roomController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create-room', roomController.createRoom);
router.get('/room-details/:roomId',  roomController.getRoomDetails);
router.post('/join-room', roomController.joinRoom);
// router.post('/add-participant/:roomId', roomController.addParticipantToRoom);

module.exports = router;
