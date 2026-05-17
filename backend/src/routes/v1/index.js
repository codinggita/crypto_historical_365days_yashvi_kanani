const express = require('express');
const router = express.Router();

const ApiError = require('../../utils/ApiError');
const httpStatus = require('../../constants/httpStatus');

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API working'
  });
});

router.get('/error-test', (req, res) => {
  throw new ApiError(httpStatus.BAD_REQUEST, 'This is a test error');
});

const authRoutes = require('./auth.routes');
const coinRoutes = require('./coin.routes');

router.use('/auth', authRoutes);
router.use('/coins', coinRoutes);

module.exports = router;
