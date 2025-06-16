const { emitKafkaEvent } = require('common-libs/kafka/producer');

async function reserveStock(order) {
  const allInStock = true;
  if (!allInStock) {
    await emitKafkaEvent('stock.failed', {
      order: order,
      reason: 'Insufficient stock',
    });
  } else {
    await emitKafkaEvent('stock.reserved', {
      order: order,
    });
  }
}

module.exports = { reserveStock };