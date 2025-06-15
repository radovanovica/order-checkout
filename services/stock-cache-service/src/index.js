const express = require('express');
const app = express();
const { createKafkaConsumer } = require('common-libs/kafka/consumer');

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
  await createKafkaConsumer({
    groupId: 'stock-cache-group',
    topic: 'stock.updated',
    handleMessage: async (event) => {
      console.log('Received stock.updated event:', event);
      // Update stock cache logic here
    }
  });
}

// Endpoint to check items and discounts by promo code
app.post('/check-items', async (req, res) => {
  const { items, promoCodes } = req.body;
  try {
    // Mock logic to validate items and calculate discounts
    const validItems = items.every(item => item.quantity > 0 && item.quantity < 100 && item.price > 0);
    const discount = promoCodes?.includes('PROMO10') ? 0.1 : 0;

    if (!validItems) {
      return res.status(200).json({ valid: false, message: 'Insufficient number of items in stock' });
    }

    const totalDiscount = items.reduce((acc, item) => acc + item.price * item.quantity * discount, 0);
    res.status(200).json({ valid: true, discount: totalDiscount });
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