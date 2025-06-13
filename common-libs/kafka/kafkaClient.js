const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || 'common-client',
  brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092']
});

module.exports = kafka;