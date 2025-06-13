const kafka = require('./kafkaClient');

async function createKafkaConsumer({ groupId, topic, handleMessage }) {
  const consumer = kafka.consumer({ groupId });

  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const payload = JSON.parse(message.value.toString());
        await handleMessage(payload);
      } catch (err) {
        console.error(`[${topic}] Message handling failed:`, err);
      }
    },
  });

  return consumer;
}

module.exports = { createKafkaConsumer };