const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

//Limiter
//Limiter
const RateLimit = require('express-rate-limit');
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 1000,
  message: 'Too many requests, please wait',
}); //1 minute window, max 1000 requests per min
app.use(limiter);

//CONFIG THE DATABASE
require('./config/database.js');

//CONFIG passport
require('./config/passport.js');

require('dotenv').config();

app.use(
  cors({
    origin: `${process.env.FRONTEND_URI}`,
  })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development

  res.status(err.status || 500);

  let responseToJson = {
    statusSucc: false,
    message: `Status code ${err.status || 500}`,
  };

  if (req.app.get('env') === 'development') {
    //if in dev, pass the error
    responseToJson.err = err;
  }
  res.json(responseToJson);
});

module.exports = app;
