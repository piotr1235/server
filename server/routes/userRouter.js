const router = require('express').Router();
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../middleware/.env') });
const {
  getAllUsers,
  getOne,
  createOne,
  deleteOne,
  getWhere,
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

// router.get('/:id', async function (req, res, next) {
//   const id = req.params.id;
//   getOne('users', id, function (err, rows) {
//     if (err) {
//       res.status(404).send({ message: 'incorrect id' });
//     } else {
//       res.json(rows);
//     }
//   });
//   //res.send(`get user with id: ${id}`);
//   //res.send("get user with id: " + id);
// });

/**
 * Sign up an user. Save user info with hashed password in MySQL DB.
 */
router.post('/', async function (req, res, next) {
  const data = {
    username: req.body.username, // TODO: validate username
    password: await bcrypt.hash(req.body.password, 10),
    
  };

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

/**
 * Login request from an user. Response with JWT.
 */
 router.post('/login', async function (req, res, next) {
  const username = req.body.username;
  const user = { username: username };
  getWhere('users', user, async function (err, rows) {
    if (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    } else if (rows) {
      if (rows.role) user.role = rows.role;
      if (
        req.body.password &&
        (await bcrypt.compare(req.body.password, rows.password))
      ) {
        // login successful
        const re = /(?:[0-9]{1,3}\.){3}[0-9]{1,3}/;
        const ip = req.ip.match(re) && req.ip.match(re)[0];
        console.log(ip);


        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
        res.status(202).json({ accessToken: accessToken });
      } else {
        res.status(401).json({ message: 'Incorrect password' });
      }
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  });
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

/**
 * Authenticates user from authorization header or an cookie 'jwt'
 */
 function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  let token =
    (authHeader && authHeader.split(' ')[1]) ||
    (req.cookies && req.cookies.jwt);

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized, please login' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, user) {
    if (err)
      return res
        .status(403)
        .json({ message: 'You cannot access this resource' });
    req.user = user;
    next();
  });
}

/**
 * Check username of currently logged user.
 */
 router.get('/whoami', authenticateToken, async function (req, res, next) {
  res.json(req.user.username);
});

module.exports = router;
