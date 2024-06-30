const asyncHandler = require('express-async-handler');

const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

require('dotenv').config(); //import env variables

//req should have the following keys: password, username, first_name, last_name
exports.signup_post = [
  body('first_name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please enter a first name.')
    .isLength({ max: 20 })
    .withMessage('First Name - Max character lenth is 20')
    .isAlpha()
    .withMessage('First Name - Enter letters only.')
    .escape(),

  body('last_name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please enter a last name.')
    .isLength({ max: 20 })
    .withMessage('Last Name - Max character lenth is 20')
    .isAlpha()
    .withMessage('Last Name - Enter letters only.')
    .escape(),

  body('username')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please enter an email.')
    .isLength({ max: 15 })
    .withMessage('Username - Maximum character length is 15')
    .isAlphanumeric()
    .withMessage('Username - Letters and numbers only')
    .escape(),
  body('password')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please enter a password.')
    .isLength({ max: 20 })
    .withMessage('Password - Password is too long')
    .escape(),

  asyncHandler(async (req, res, next) => {
    //get any errors from body validator
    const errors = validationResult(req);

    const userExists = await User.exists({ username: req.body.username }); //see if a user already exists with the username

    if (userExists) {
      errors.errors.push({ msg: 'User with the username already exists' });
      res.status(409).json({
        statusSucc: false,
        message: 'username already taken',
        errors: errors.errors,
      });
      return;
    }

    if (!errors.isEmpty()) {
      //if errors is not empty
      res.status(422).json({
        statusSucc: false,
        message: 'username already taken',
        errors: errors.errors,
      });
      return;
    }

    //if pass validation then go onto create user document in database
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      //hash the password
      if (err) return next(err);

      try {
        const newUser = new User({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          username: req.body.username,
          hashedPassword: hashedPassword,
        });

        newUser.save(); //SAVE TO DATABASE
        const token = jwt.sign({ sub: newUser.id }, process.env.JWT_SECRET, {
          expiresIn: '14d', //expires in 2 weeks
        });
        res.status(201).json({ message: 'Successfully created user', token });
      } catch (err) {
        return next(err);
      }
    });
  }),
];

//will validate later
//req should have the following keys: password, username
exports.login_post = [
  body('username')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please enter an email.')
    .isLength({ max: 15 })
    .withMessage('Username - Maximum character length is 15')
    .isAlphanumeric()
    .withMessage('Username - Letters and numbers only')
    .escape(),
  body('password')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please enter a password.')
    .isLength({ max: 20 })
    .withMessage('Password - Password is too long')
    .escape(),

  asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ username: req.body.username }); //attempt to get user from database
    if (!user) {
      //if user does not exists
      res
        .status(404)
        .json({ statusSucc: false, msg: 'Username does not exist' });
      return;
    }

    const match = await bcrypt.compare(req.body.password, user.hashedPassword);

    if (!match) {
      res
        .status(401)
        .json({ statusSucc: false, msg: 'Password does not match' });
      return;
    }

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
      expiresIn: '14d', //expires in 2 weeks
    });
    res.json({
      statusSucc: true,
      message: 'Successfully logged in, token dispatched',
      token,
    });
  }),
];
