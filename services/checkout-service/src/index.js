const express = require('express');
const bodyParser = require('body-parser');
const { emitKafkaEvent } = require('common-libs/kafka/producer');
const validateCart = require('./services/ValidationClient');
const schema = require('./services/schema');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});
async function validateJsonInput(input) {
  try {
    await schema.validate(input);
    return {
      valid: true,
      message: 'Input is valid'
    };
  } catch (err) {
    return {
      valid: false,
      message: err.message
    };
  }
}
// Checkout endpoint
app.post('/checkout', async (req, res) => {
  const cart = req.body;
  cart.id = Date.now(); // Generate a unique ID for the cart
  try {
    // Validate request data - yup schema validation
    const requestValidationResult = await validateJsonInput(cart);
    // Validate cart items and promo codes
    const validationResult = await validateCart(cart);
    if (!validationResult.valid || !requestValidationResult?.valid) {
      return res.status(400).json({ error: validationResult.message });
    }

    // Emit event to reserve stock
    await emitKafkaEvent('order.created', { cart });

    res.status(202).json({ message: 'Stock reservation started' });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Checkout failed' });
  }
});

app.listen(PORT, () => {
  console.log('Checkout Service running on port 3000');
});
