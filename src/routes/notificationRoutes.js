const express = require('express');
const notificationController = require('../controllers/notificationController');
const { verifyToken } = require('../middlewares/authMiddleware');


const router = express.Router();

// Define routes for notification functionality

router.get('/notifications', notificationController.notifications);

module.exports = router;
