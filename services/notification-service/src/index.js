const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Notification Service');
});

app.listen(3005, () => {
  console.log('Notification Service running on port 3005');
});