const axios = require('axios');

async function validateCartItems(cart) {
  try {
    const response = await axios.post('http://localhost:3003/check-items', {
      items: cart?.items ?? [],
      promoCodes: cart?.promoCodes ?? [],
    });

    if (!response.data.valid) {
      return { valid: false, message: response.data.message };
    }

    return { valid: true, discount: response.data.discount };
  } catch (error) {
    console.error('Error validating items:', error);
    throw new Error('Validation service failed');
  }
}

module.exports = { validateCartItems };