const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Checkout Service');
});

app.listen(3000, () => {
  console.log('Checkout Service running on port 3000');
});