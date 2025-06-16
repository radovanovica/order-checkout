// validation-service/src/index.js
const express = require('express');
const bodyParser = require('body-parser');
const { validateCartItems } = require('./services/validationService');

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
  console.log('Validating cart items:', requestBody.cart);
  try {
    const result = await validateCartItems(requestBody.cart);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error validating items:', error);
    res.status(500).json({ error: 'Validation service failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Validation service running on port ${PORT}`);
});
