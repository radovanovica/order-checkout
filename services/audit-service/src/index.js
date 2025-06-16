const express = require('express');
const { Kafka } = require('kafkajs');
const { startKafka } = require('./services/kafkaService');

const app = express();
const PORT = process.env.PORT || 3008;

const kafka = new Kafka({
  clientId: 'audit-service',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'audit-group' });

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Audit Service running on port ${PORT}`);
  startKafka(consumer);
});
