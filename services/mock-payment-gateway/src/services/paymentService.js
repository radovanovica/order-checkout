function processPaymentRequest(payload) {
  const { orderId, amount, currency, method, customer } = payload;

  if (!orderId || !amount || !currency || !method || !customer) {
    return { status: 'failed', reason: 'Invalid request payload' };
  }

  // Simulate payment authorization
  const isAuthorized = Math.random() > 0.2; // 80% chance of success

  if (isAuthorized) {
    return { status: 'authorized' };
  } else {
    return { status: 'failed', reason: 'Insufficient funds' };
  }
}

module.exports = { processPaymentRequest };