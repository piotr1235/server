#!/usr/bin/env node

const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { getInsertParams } = require('./middleware/db.js');
const app = express();
const port = 5000;

const api = require('./routes/api.js');

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://192.168.1.200:3000',
    credentials: true,
  })
);
app.use('/api', api);

app.get('/', (req, res) => {
  res.send('Welcome on the main page');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const temp = {
  username: 'sample_username',
  password: 'sample_pass',
  role: 'sample_role',
  test: 'nie_wiem',
};

console.log(getInsertParams(temp));
