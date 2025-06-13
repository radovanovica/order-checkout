const express = require('express');
const app = express();
const PORT = process.env.PORT || 3007;

app.use(express.json());

// Mock payment API
app.post('/api/pay', (req, res) => {
  const { orderId, amount, currency, method, customer } = req.body;

  if (!orderId || !amount || !currency || !method || !customer) {
    return res.status(400).json({ status: 'failed', reason: 'Invalid request payload' });
  }

  // Simulate payment authorization
  const isAuthorized = Math.random() > 0.2; // 80% chance of success

  if (isAuthorized) {
    res.status(200).json({ status: 'authorized' });
  } else {
    res.status(200).json({ status: 'failed', reason: 'Insufficient funds' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Mock Payment Gateway running on port ${PORT}`);
});