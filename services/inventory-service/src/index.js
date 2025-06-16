// inventory-service/src/index.js
const express = require('express');
const { createKafkaConsumer } = require('common-libs/kafka/consumer');
const { reserveStock } = require('./services/inventoryService');

const app = express();
const PORT = process.env.PORT || 3005;

// Start listening to order.created events
async function startKafkaConsumer() {
  await createKafkaConsumer({
    groupId: 'inventory-group',
    topic: 'order.created',
    handleMessage: async (order) => {
      console.log('Received order.created event:', order);
      await reserveStock(order);
    },
  });
}

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Inventory service running on port ${PORT}`);
  startKafkaConsumer();
});
