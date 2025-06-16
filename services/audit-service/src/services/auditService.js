const fs = require('fs');
const path = require('path');

// Directory for audit logs
const logDir = path.join(__dirname, '../logs');
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

module.exports = { auditLog };