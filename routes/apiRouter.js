const express = require('express');
const userRouter = require('./userRouter');

const apiRouter = express.Router();

apiRouter.use('/users', userRouter);

module.exports = apiRouter;
