const kafka = require('./kafkaClient');
const producer = kafka.producer();

async function emitKafkaEvent(topic, payload) {
  await producer.connect();
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(payload) }],
  });
  await producer.disconnect();
}

module.exports = { emitKafkaEvent };