const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //use bearer token style
  secretOrKey: process.env.JWT_SECRET, //jwt key
};

passport.use(
  new JwtStrategy(options, async function (jwt_payload, done) {
    try {
      const user = await User.findById(jwt_payload.sub);

      if (!user) {
        //if no user found with such a id
        return done(null, false);
      } else {
        return done(null, user);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);
