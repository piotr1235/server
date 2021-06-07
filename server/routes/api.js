var express = require('express');
var router = express.Router();

const userRouter = require('./userRouter');
const deviceRouter = require('./deviceRouter');

router.use('/user', userRouter);
router.use('/device', deviceRouter);

module.exports = router;
