const express = require('express');
const { validateItemsAndCalculateDiscount } = require('./services/stockCacheService');
const { createKafkaConsumer } = require('common-libs/kafka/consumer');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Stock Cache Service');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Listen to stock change events
async function startKafkaConsumer() {
  console.log('Starting Kafka consumer for stock-cache service...');
  await createKafkaConsumer({
    groupId: 'stock-cache-group',
    topic: 'stock.updated',
    handleMessage: async (event) => {
      console.log('Received stock.updated event:', event);
      // Update stock cache logic here
    },
  });
}

// Endpoint to check items and discounts by promo code
app.post('/check-items', async (req, res) => {
  const { items, promoCodes } = req.body;
  try {
    const result = await validateItemsAndCalculateDiscount(items, promoCodes);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error checking items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3003, () => {
  console.log('Stock Cache Service running on port 3003');
});

// Start Kafka consumer
startKafkaConsumer();