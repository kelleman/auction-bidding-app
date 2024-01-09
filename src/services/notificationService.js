const rabbitMQ = require('../messaging/rabbitMQ');
const NotificationModel = require('../models/notificationModel');
const logger = require('../utils/logger');

// Connect to RabbitMQ and then start consuming the queue
rabbitMQ.connect()
  .then(() => {
    rabbitMQ.consumeQueue('notificationEventsQueue', (message) => {
      const notificationData = JSON.parse(message);
      handleNotification(notificationData);
    });
  })
  .catch((error) => {
    logger.error(`Error connecting to RabbitMQ: ${error.message}`);
  });

const handleNotification = (notificationData) => {
  // Store notificationData in the database
  const newNotification = new NotificationModel({ data: notificationData });
  newNotification.save();

  // Log the notification
  logger.info(`Received notification: ${JSON.stringify(notificationData)}`);
};

const fetchAllNotifications = async () => {
  // Retrieve all notifications from the database
  const notifications = await NotificationModel.find();
  return notifications;
};

module.exports = {
  handleNotification,
  fetchAllNotifications,
};
