const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const NotificationModel = mongoose.model('Notification', notificationSchema);

module.exports = NotificationModel;
