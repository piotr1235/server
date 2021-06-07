const router = require('express').Router();
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../middleware/.env') });
const {
  getAllUsers,
  getOne,
  getDeviceByUserName,
} = require('../middleware/db');

router.get('/', function (req, res, next) {
  getAllUsers('devices', function (err, rows) {
    if (err) {
      res.status(500).send();
    } else {
      res.json(rows);
    }
  });
});

/**
 * Check username of currently logged user.
 */

router.get('/:id', async function (req, res, next) {
  const id = req.params.id;
  getDeviceByUserName(id, function (err, rows) {
    if (err) {
      res.status(500).send();
    } else {
      res.json(rows);
    }
  });
});

module.exports = router;
