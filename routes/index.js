const express = require('express');
const passport = require('passport');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({ message: 'welcome to the site' });
});

//test route
router.get(
  '/protected',
  passport.authenticate('jwt', { session: false }),
  function (req, res, next) {
    res.status(200).json({ message: 'Protected route!', user: req.user });
  }
);

module.exports = router;
