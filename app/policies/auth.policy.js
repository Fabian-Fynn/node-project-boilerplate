import passportJwt from 'passport-jwt';

import secrets from '../config/secrets';
import User from '../models/user.model';

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;
const jwtOptions = {};

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.jwt;
  }
  return token;
};

jwtOptions.jwtFromRequest = ExtractJwt.fromExtractors([cookieExtractor]);
jwtOptions.secretOrKey = secrets.jwt;

const strategy = new JwtStrategy(jwtOptions, (payload, next) => {
  User.findById(payload.id)
    .then((user) => {
      if (user) {
        next(null, user);
      } else {
        next(null, false);
      }
    })
    .catch(err => next(err));
});

export default strategy;
