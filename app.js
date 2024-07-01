const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

//CONFIG THE DATABASE
require('./config/database.js');

//CONFIG passport
require('./config/passport.js');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
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

  /* delete this after, from generator
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  */
});

module.exports = app;
