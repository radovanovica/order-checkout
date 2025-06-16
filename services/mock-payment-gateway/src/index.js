const express = require('express');
const { processPaymentRequest } = require('./services/paymentService');
const app = express();
const PORT = process.env.PORT || 3007;

app.use(express.json());

// Mock payment API
app.post('/api/pay', (req, res) => {
  const result = processPaymentRequest(req.body);

  if (result.status === 'failed') {
    return res.status(400).json(result);
  }

  res.status(200).json(result);
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Mock Payment Gateway running on port ${PORT}`);
});