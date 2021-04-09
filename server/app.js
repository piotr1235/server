const express = require('express');
const logger = require('morgan');
const app = express();
const port = 3000;

const api = require('./routes/api.js');

app.use(logger('dev'));
app.use(express.json());
app.use('/api', api);

app.get('/', (req, res) => {
  res.send('Welcome on the main page');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
