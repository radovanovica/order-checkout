const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Payment Service');
});

app.listen(3004, () => {
  console.log('Payment Service running on port 3004');
});