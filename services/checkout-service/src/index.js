const express = require('express');
const bodyParser = require('body-parser');
const { processCheckout } = require('./services/checkoutService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Checkout endpoint
app.post('/checkout', async (req, res) => {
  const cart = req.body;
  try {
    const result = await processCheckout(cart);
    res.status(result.status).json(result);
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Checkout failed' });
  }
});

app.listen(PORT, () => {
  console.log('Checkout Service running on port 3000');
});
