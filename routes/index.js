const express = require('express');
const passport = require('passport');
const router = express.Router();
const apiRoute = require('./api');

router.use('/api', apiRoute);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({ message: 'welcome to the site' });
});

module.exports = router;
