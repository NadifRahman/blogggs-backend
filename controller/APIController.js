const asyncHandler = require('express-async-handler');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');

//returns all posts in newst to oldest order
exports.posts_get = [
  asyncHandler(async (req, res, next) => {
    const Posts = await Post.find().sort({ date_created: -1 }).populate({
      path: 'author_id',
      select: 'first_name last_name -_id', // returns only first_name and last_name
    });
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

//URI param should have 'postid'
exports.posts_postid_get = [
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

/*
- URL PARAM should have 'postid' param
- Will return empty array under comments key if no comments exist

This middleware gets all the comments (in newest to oldest older) under a specific post 
given by the postid param

*/
exports.comments_postid_get = [
  asyncHandler(async (req, res, next) => {
    const postId = req.params['postid']; //get from url param

    if (!mongoose.isValidObjectId(postId)) {
      //if the param isnt in mongodb id form

      res.status(404).json({
        statusSucc: false,
        message: 'Post with given postid cannot be found',
      });
      return;
    }

    const postExists = await Post.exists({ _id: postId });

    if (!postExists) {
      //if post does not exist
      res.status(404).json({
        statusSucc: false,
        message: 'Post with given postid cannot be found',
      });
      return;
    }

    const allComments = await Comment.find({ post_id: postId }) ///get all of the comments for the partciular post
      .sort({
        date_created: -1,
      })
      .populate({
        path: 'author_id',
        select: 'first_name last_name -_id', // returns only first_name and last_name
      });

    res.status(200).json({
      statusSucc: true,
      message:
        allComments.length > 0
          ? 'Successfully found comments'
          : 'No comments exist currently',
      comments: allComments,
    });
  }),
];

/*
- URL PARAM should have 'postid' param
- Should have a comment_string on body

This middleware creates a comment under a given post (by the postid param) under 
the user who is authenticated to use this route.
*/
exports.comments_postid_post = [
  body('comment_string')
    .trim()
    .isLength({ min: 1 })
    .withMessage('A comment message string is required')
    .isLength({ max: 250 })
    .withMessage('Comment - Comment too long (max character length is 250)')
    .escape(),

  passport.authenticate('jwt', { session: false }), //PROTECTED ROUTE

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json({
        statusSucc: false,
        message: 'There are errors in the data sent',
        errors: errors.errors,
      });
    }

    const postId = req.params['postid']; //get from url param

    if (!mongoose.isValidObjectId(postId)) {
      //if the param isnt in mongodb id form

      res.status(404).json({
        statusSucc: false,
        message: 'Post with given postid cannot be found',
      });
      return;
    }

    const postExists = await Post.exists({ _id: postId }); //see if post exists

    if (!postExists) {
      //if post does not exist
      res.status(404).json({
        statusSucc: false,
        message: 'Post with given postid cannot be found',
      });
      return;
    }

    const newComment = new Comment({
      author_id: req.user.id,
      post_id: postId,
      comment_string: req.body.comment_string,
    });

    await newComment.save(); //save the comment

    res
      .status(201)
      .json({ statusSucc: true, message: 'Successfully created comment' });
  }),
];
