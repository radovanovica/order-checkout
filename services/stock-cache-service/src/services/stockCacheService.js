async function validateItemsAndCalculateDiscount(items, promoCodes) {
  const validItems = items.every(
    (item) => item.quantity > 0 && item.quantity < 100 && item.price > 0
  );
  const discount = promoCodes?.includes('PROMO10') ? 0.1 : 0;

  if (!validItems) {
    return { valid: false, message: 'Insufficient number of items in stock' };
  }

  const totalDiscount = items.reduce(
    (acc, item) => acc + item.price * item.quantity * discount,
    0
  );

  return { valid: true, discount: totalDiscount };
}

module.exports = { validateItemsAndCalculateDiscount };