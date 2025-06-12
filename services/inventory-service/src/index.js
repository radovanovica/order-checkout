const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Inventory Service');
});

app.listen(3002, () => {
  console.log('Inventory Service running on port 3002');
});