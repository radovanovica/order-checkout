const axios = require('axios');

async function validateCart(cart) {
  try {
    const response = await axios.post('http://localhost:3002/validate', cart);
    return response.data;
  } catch (err) {
    console.error('Validation failed:', err.message);
    return { valid: false, message: err.message };
  }
}

module.exports = validateCart;