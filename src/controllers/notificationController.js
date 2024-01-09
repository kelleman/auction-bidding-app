// notificationController.js

const express = require('express');
const router = express.Router();
const notificationService = require('../services/notificationService');

// Fetch all notifications
exports.notifications = async (req, res, next) => {
    try {
        const notifications = await notificationService.fetchAllNotifications();
        res.status(200).json({ notifications });
    } catch (error) {
        next(error);
    }
};

