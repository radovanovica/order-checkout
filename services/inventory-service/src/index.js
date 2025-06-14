// inventory-service/src/index.js
const express = require('express');
const { emitKafkaEvent } = require('common-libs/kafka/producer');
const { createKafkaConsumer } = require('common-libs/kafka/consumer');

const app = express();
const PORT = process.env.PORT || 3005;

// Mock function to reserve stock
async function reserveStock(order) {
  const allInStock = true
  if (!allInStock) {
    await emitKafkaEvent('stock.failed', {
      order: order,
      reason: 'Insufficient stock'
    });
  } else {
    await emitKafkaEvent('stock.reserved', {
      order:order
    });
  }
}

// Start listening to order.created events
async function startKafkaConsumer() {
  await createKafkaConsumer({
    groupId: 'inventory-group',
    topic: 'order.created',
    handleMessage: async (order) => {
      console.log('Received order.created event:', order);
      console.log('Received order.created event:', order?.cart?.items?.[0]?.price);
      await reserveStock(order);
    }
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
