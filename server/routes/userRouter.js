const router = require('express').Router();
const {
  getAllUsers,
  getOne,
  createOne,
  deleteOne,
} = require('../middleware/db');

router.get('/', function (req, res, next) {
  getAllUsers('users', function (err, rows) {
    if (err) {
      res.status(500).send();
    } else {
      res.json(rows);
    }
  });
});

router.get('/:id', async function (req, res, next) {
  const id = req.params.id;
  getOne('users', id, function (err, rows) {
    if (err) {
      res.status(404).send({ message: 'incorrect id' });
    } else {
      res.json(rows);
    }
  });
  //res.send(`get user with id: ${id}`);
  //res.send("get user with id: " + id);
});

router.post('/', async function (req, res, next) {
  const data = req.body;

  createOne('users', data, function (err) {
    if (err) {
      console.error(err);
      res.status(400).json({ message: 'Failure to create an object' });
    } else {
      res.status(201).send({ message: 'Object has been created' });
    }
  });
  //res.send('create new user');
});

router.delete('/:id', async function (req, res, next) {
  const id = req.params.id;
  deleteOne('users', { id }, function (err) {
    if (err) {
      res.status(404).json({ message: 'incorrect id' });
    } else {
      res.json({ message: 'Object has been deleted' });
    }
  });
  //res.send(`delete user with id: ${id}`);
});

module.exports = router;
