// validation-service/src/index.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3002;

app.use(bodyParser.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Validation endpoint - validate business rules for the cart
app.post('/validate', (req, res) => {
  const cart = req.body;
  // Mock validation logic
  const allItemsValid= cart.items?.every(item => item.price > 0 && item.quantity <= 5);

  if (!allItemsValid) {
    return res.status(200).json({ valid: false, message: 'Invalid items in cart' });
  }

  // Mock successful validation
  return res.status(200).json({ valid: true });
});

app.listen(PORT, () => {
  console.log(`Validation service running on port ${PORT}`);
});
