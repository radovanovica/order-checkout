const axios = require('axios');
const { emitKafkaEvent } = require('common-libs/kafka/producer');

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
          email: order?.customer?.email || 'test@example.com',
        },
      });

      if (response.data.status === 'authorized') {
        await emitKafkaEvent('payment.authorized', { orderId: order.id });
        return;
      } else {
        await emitKafkaEvent('payment.failed', {
          orderId: order.id,
          reason: response.data.reason || 'Unknown error',
        });
        return;
      }
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error.message || error.code || "Payment provider is not reachable");
      if (attempt === maxRetries - 1 || !error.isAxiosError || !error.code) {
        await emitKafkaEvent('payment.failed', {
          orderId: order.id,
          reason: 'External provider error',
        });
        return;
      }

      attempt++;
    }
  }
}

module.exports = { processPayment };