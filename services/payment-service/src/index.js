// payment-service/src/index.js
const express = require('express');
const axios = require('axios');
const { emitKafkaEvent } = require('common-libs/kafka/producer');
const { createKafkaConsumer } = require('common-libs/kafka/consumer');

const app = express();
const PORT = process.env.PORT || 3004;

// Mock payment processing function
async function processPayment(paymentData) {
  const order = paymentData?.order?.cart;
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      // Simulate calling an external payment API
      const response = await axios.post('http://localhost:3007/api/pay', {
        orderId: order.id,
        amount: order?.cart?.totalAmount,
        currency: 'EUR',
        method: 'credit_card',
        customer: {
          name: order?.customer?.name || 'Test User',
          email: order?.customer?.email || 'test@example.com'
        }
      });

      if (response.data.status === 'authorized') {
        await emitKafkaEvent('payment.authorized', { orderId: order.id });
        return;
      } else {
        await emitKafkaEvent('payment.failed', {
          orderId: order.id,
          reason: response.data.reason || 'Unknown error'
        });
        return;
      }
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error.message);

      if (attempt === maxRetries - 1 || !error.isAxiosError || !error.code) {
        await emitKafkaEvent('payment.failed', {
          orderId: order.id,
          reason: 'External provider error'
        });
        return;
      }

      attempt++;
    }
  }
}

// Start listening to stock.reserved events
async function startKafkaConsumer() {
  await createKafkaConsumer({
    groupId: 'payment-group',
    topic: 'stock.reserved',
    handleMessage: async (event) => {
      console.log('Received stock.reserved event:', event);
      await processPayment(event);
    }
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
