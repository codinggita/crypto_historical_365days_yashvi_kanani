const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const v1Routes = require('../routes/v1');
const notFoundMiddleware = require('../middlewares/notFoundMiddleware');
const errorMiddleware = require('../middlewares/errorMiddleware');

const app = express();

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json());

// Enable CORS
app.use(cors());

// Test Route
app.get('/', (req, res) => {
  res.send('CryptoVerseX Backend Running');
});

// Mount Routes
app.use('/api/v1', v1Routes);

// Error Handling Middleware
app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
