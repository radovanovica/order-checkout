// validation-service/src/index.js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3002;

app.use(bodyParser.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Validation endpoint - validate business rules for the cart
app.post('/validate', async (req, res) => {
  const requestBody = req.body;
  try {
    // Call stock-cache service to validate items
    const response = await axios.post('http://localhost:3003/check-items', {
      items: requestBody?.cart?.items ?? [],
      promoCodes: requestBody?.cart?.promoCodes ?? []
    });

    if (!response.data.valid) {
      return res.status(200).json({ valid: false, message: response.data.message });
    }

    return res.status(200).json({ valid: true, discount: response.data.discount });
  } catch (error) {
    console.error('Error validating items:', error);
    res.status(500).json({ error: 'Validation service failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Validation service running on port ${PORT}`);
});
