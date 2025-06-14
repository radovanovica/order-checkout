const express = require('express');
const { Kafka } = require('kafkajs');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3008;

const kafka = new Kafka({
  clientId: 'audit-service',
  brokers: ['localhost:9092'], // Replace with your actual Kafka broker(s)
});

const consumer = kafka.consumer({ groupId: 'audit-group' });

// Directory for audit logs
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Append audit message to log file
function auditLog(topic, data) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${topic}: ${JSON.stringify(data)}\n`;
  const logFile = path.join(logDir, `${topic}.log`);
  fs.appendFileSync(logFile, logMessage);
  console.log(`[AUDIT] Logged ${topic} ->`, data);
}

async function startKafka() {
  await consumer.connect();

  const topicsToAudit = [
    'order.created',
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
    }
  });
}

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Audit Service running on port ${PORT}`);
  startKafka();
});
