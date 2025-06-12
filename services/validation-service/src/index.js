const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Validation Service');
});

app.listen(3001, () => {
  console.log('Validation Service running on port 3001');
});