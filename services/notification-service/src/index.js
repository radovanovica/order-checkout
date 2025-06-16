const express = require('express');
const { Kafka } = require('kafkajs');
const { handleNotification } = require('./services/notificationService');

const app = express();
const PORT = process.env.PORT || 3006;

// Kafka setup
const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: ['localhost:9092'], // Replace with your actual broker
});

const consumer = kafka.consumer({ groupId: 'notification-group' });

async function startKafka() {
  console.log('Starting Kafka consumer for notification service...');
  
  await consumer.connect();
  await consumer.subscribe({ topic: 'order.created', fromBeginning: false });
  await consumer.subscribe({ topic: 'stock.reserved', fromBeginning: false });
  await consumer.subscribe({ topic: 'stock.failed', fromBeginning: false });
  await consumer.subscribe({ topic: 'payment.authorized', fromBeginning: false });
  await consumer.subscribe({ topic: 'payment.failed', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const data = JSON.parse(message.value.toString());
      handleNotification(topic, data);
    },
  });
}

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
  startKafka();
});
