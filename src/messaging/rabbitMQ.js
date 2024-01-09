const amqp = require('amqplib');
const logger = require('../utils/logger');

class RabbitMQ {
    constructor() {
      this.connection = null;
      this.channel = null;
      this.isConnected = false;
    }
  
    async connect() {
      try {
        // Check if already connected
        if (this.isConnected) {
          return;
        }
  
        // Connect to RabbitMQ server
        this.connection = await amqp.connect('amqp://localhost');
        this.channel = await this.connection.createChannel();
  
        logger.info('Connected to RabbitMQ');
        this.isConnected = true;
      } catch (error) {
        logger.error(`Error connecting to RabbitMQ: ${error.message}`);
        throw error;
      }
    }
  

    async createQueue(queueName) {
        try {
            // Declare a queue
            await this.channel.assertQueue(queueName);

            logger.info(`Queue '${queueName}' created`);
        } catch (error) {
            logger.error(`Error creating queue '${queueName}': ${error.message}`);
        }
    }

    async sendMessage(queueName, message) {
        try {
            // Send a message to the queue
            await this.channel.sendToQueue(queueName, Buffer.from(message));

            logger.info(`Message sent to queue '${queueName}': ${message}`);
        } catch (error) {
            logger.error(`Error sending message to queue '${queueName}': ${error.message}`);
        }
    }

    async consumeQueue(queueName, callback) {
        try {
            // Consume messages from the queue
            await this.channel.consume(queueName, (message) => {
                if (message !== null) {
                    callback(message.content.toString());
                    this.channel.ack(message);
                }
            });

            logger.info(`Consuming messages from queue '${queueName}'`);
        } catch (error) {
            logger.error(`Error consuming queue '${queueName}': ${error.message}`);
        }
    }
}

module.exports = new RabbitMQ();
