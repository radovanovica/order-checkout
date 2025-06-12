const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Audit Service');
});

app.listen(3006, () => {
  console.log('Audit Service running on port 3006');
});