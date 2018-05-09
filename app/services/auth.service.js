import jwt from 'jsonwebtoken';
import secrets from '../config/secrets';

const auth = {
  issue: payload => jwt.sign(payload, secrets.jwt, { expiresIn: 259200 }),
  verify: (token, next) => jwt.verify(token, secrets.jwt, {}, next),
};

export default auth;
