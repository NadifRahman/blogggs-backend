const asyncHandler = require('express-async-handler');
const Post = require('../models/Post');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');

//returns all posts in newst to oldest order
exports.posts_get = [
  passport.authenticate('jwt', { session: false }), //PROTECTED ROUTE

  asyncHandler(async (req, res, next) => {
    const Posts = await Post.find().sort({ date_created: -1 });
    res.status(200).json({
      statusSucc: true,
      message:
        Posts.length > 0
          ? 'Successfully found posts'
          : 'No posts exist currently',
      posts: Posts,
    });
  }),
];

/* Takes title, textcontent from request body, author is taken from req.user */
exports.posts_post = [
  body('title')
    .trim()
    .isLength({ min: 1 })
    .withMessage('A title is required')
    .isLength({ max: 25 })
    .withMessage('Title - Title too long (max character length is 25)')
    .escape(),

  body('text_content')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Text content is required')
    .isLength({ max: 4000 })
    .withMessage(
      'Text content - Text content too long (max character length is 4000)'
    ),

  passport.authenticate('jwt', { session: false }), //PROTECTED ROUTE

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json({
        statusSucc: false,
        message: 'There are errors in the data',
        errors: errors.errors,
      });
      return;
    }

    const newPost = new Post({
      title: req.body.title,
      text_content: req.body.text_content,
      author_id: req.user.id,
      isPublished: true,
    });

    await newPost.save();

    res
      .status(201)
      .json({ statusSucc: true, message: 'Successfull created blogpost' });
  }),
];

exports.posts_postid_get = [
  passport.authenticate('jwt', { session: false }), //PROTECTED ROUTE

  asyncHandler(async (req, res, next) => {
    const postId = req.params['postid']; //get from url param

    if (!mongoose.isValidObjectId(postId)) {
      //if the param isnt in mongodb id form

      res.status(404).json({ statusSucc: false, message: 'Cannot find post' });
      return;
    }

    const foundPost = await Post.findOne({ _id: postId });

    if (!foundPost) {
      //if no post was found
      res.status(404).json({ statusSucc: false, message: 'Cannot find post' });
    } else {
      //post was found
      res
        .status(200)
        .json({ statusSucc: true, message: 'Found post', post: foundPost });
    }
  }),
];
