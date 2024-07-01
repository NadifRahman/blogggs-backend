const express = require('express');
const passport = require('passport');
const router = express.Router();
const APIController = require('../controller/APIController');

router.get('/', function (req, res, next) {
  res.json({ msg: 'hi' });
});

router.get('/posts', APIController.posts_get);

router.post('/posts', APIController.posts_post);

router.get('/posts/:postid', APIController.posts_postid_get);

router.get('/comments/:postid', APIController.comments_postid_get);

router.post('/comments/:postid', APIController.comments_postid_post);

module.exports = router;
