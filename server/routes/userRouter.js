const router = require('express').Router();
router.get('/', function (req, res, next) {
  res.send('Welcome on users page');
});

module.exports = router;
