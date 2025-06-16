const { auditLog } = require("./auditService");

console.log('Starting Kafka consumer for audit service...');

async function startKafka(consumer) {
  const topicsToAudit = [
    'order.created',
    'order.failed',
    'stock.reserved',
    'stock.failed',
    'payment.authorized',
    'payment.failed',
  ];

  for (const topic of topicsToAudit) {
    await consumer.subscribe({ topic, fromBeginning: false });
  }

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const data = JSON.parse(message.value.toString());
      auditLog(topic, data);
    },
  });
}

module.exports = { startKafka };