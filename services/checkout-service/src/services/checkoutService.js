const { emitKafkaEvent } = require('common-libs/kafka/producer');
const validateCart = require('./ValidationClient');
const schema = require('./schema');

async function validateJsonInput(input) {
  try {
    await schema.validate(input);
    return {
      valid: true,
      message: 'Input is valid',
    };
  } catch (err) {
    return {
      valid: false,
      message: err.message,
    };
  }
}

async function processCheckout(cart) {
  console.log('Processing checkout for cart:', cart);

  cart.id = Date.now(); // Generate a unique ID for the cart

  // Validate request data - yup schema validation
  const requestValidationResult = await validateJsonInput(cart);

  // Validate cart items and promo codes
  const validationResult = await validateCart(cart);

  if (!validationResult.valid || !requestValidationResult?.valid) {
    await emitKafkaEvent('order.failed', {
      orderId: cart.id,
      reason: validationResult.message || requestValidationResult.message || 'Validation failed',
    });
    return { status: 400, error: validationResult.message || requestValidationResult.message || 'Validation failed' };
  }

  // Emit event to reserve stock
  await emitKafkaEvent('order.created', { cart });

  return { status: 202, message: 'Stock reservation started' };
}

module.exports = { processCheckout };