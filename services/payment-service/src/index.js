// payment-service/src/index.js
const express = require('express');
const { createKafkaConsumer } = require('common-libs/kafka/consumer');
const { processPayment } = require('./services/paymentService');

const app = express();
const PORT = process.env.PORT || 3004;

// Start listening to stock.reserved events
async function startKafkaConsumer() {
  console.log('Starting Kafka consumer for payment service...');
  await createKafkaConsumer({
    groupId: 'payment-group',
    topic: 'stock.reserved',
    handleMessage: async (event) => {
      console.log('Received stock.reserved event:', event);
      await processPayment(event);
    },
  });
}

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Payment service running on port ${PORT}`);
  startKafkaConsumer();
});
