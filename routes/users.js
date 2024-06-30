const express = require('express');
const router = express.Router();
const UserController = require('../controller/UserController');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.json({ message: 'users' });
});

router.post('/sign-up', UserController.signup_post);
router.post('/log-in', UserController.login_post);

module.exports = router;
