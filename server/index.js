// Load env vars
require('custom-env').env();

// Load dependencies
const express = require('express');
const compression = require('compression');
const log = require('fancy-log');
const serverLogger = require('morgan');
const rateLimit = require('express-rate-limit');
const cache = require('./middlewares/cache');

const app = express();
const routes = require('./routes/routes');
const port = process.env.SERVER_PORT;
const limiter = rateLimit({
  windowMs: 60000,
  max: 100,
  message: {
    error: 'Too many requests, please try again later.'
  }
});

// Middlewares
app.use(serverLogger('dev'));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded
app.use(limiter); // limit each IP to 100 requests per minute
app.use(cache);

// Routes
app.use('/api', routes);

// Server Settings
app.listen(port, () => {
  log(`Server running on port ${port}`);
});

module.exports = app;
