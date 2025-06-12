const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Stock Cache Service');
});

app.listen(3003, () => {
  console.log('Stock Cache Service running on port 3003');
});