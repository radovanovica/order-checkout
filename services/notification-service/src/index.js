const express = require('express');
const { Kafka } = require('kafkajs');

const app = express();
const PORT = process.env.PORT || 3006;

// Kafka setup
const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: ['localhost:9092'], // Replace with your actual broker
});

const consumer = kafka.consumer({ groupId: 'notification-group' });

async function startKafka() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'order.created', fromBeginning: false });
  await consumer.subscribe({ topic: 'stock.reserved', fromBeginning: false });
  await consumer.subscribe({ topic: 'stock.failed', fromBeginning: false });
  await consumer.subscribe({ topic: 'payment.authorized', fromBeginning: false });
  await consumer.subscribe({ topic: 'payment.failed', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const data = JSON.parse(message.value.toString());
      console.log(`Received event [${topic}] ->`, data);

      // Simulated notification behavior
      switch (topic) {
        case 'order.created':
          mockSendEmail(`Order ${data.orderId || 'X'} created successfully.`);
          break;
        case 'stock.reserved':
          mockSendEmail(`Stock reserved for Order ${data.orderId}.`);
          break;
        case 'stock.failed':
          mockSendEmail(`Stock reservation failed: ${data.reason}`);
          break;
        case 'payment.authorized':
          mockSendEmail(`Payment authorized for Order ${data.orderId}.`);
          break;
        case 'payment.failed':
          mockSendEmail(`Payment failed: ${data.reason}`);
          break;
        default:
          console.log('Unknown event type:', topic);
      }
    }
  });
}

function mockSendEmail(message) {
  console.log(`Sending mock email notification: "${message}"`);
}

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
  startKafka();
});
