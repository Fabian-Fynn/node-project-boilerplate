import mongoose from 'mongoose';

import encrypt from '../services/encryption.service';
import uniqueValidator from "mongoose-unique-validator";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      default: 'user',
    },
    local: {
      email: {
        type: String,
        index: true,
        unique: true,
      },
      password: {
        type: String,
        select: false, // Do not send password
      },
    },
    roles: {
      type: Array,
    },
  },
  {
    retainKeyOrder: true, // will be default in Mongoose v5
  },
);

userSchema.plugin(uniqueValidator);

userSchema.pre('save', function pre(next) {
  if (this.local.password) {
    this.local.password = encrypt.password(this.local.password);
  }
  next();
});

userSchema.pre('update', (next) => {
  throw new Error('Use save to update. This ensures password hashing.');
});

userSchema.methods.comparePasswords = function comparePasswords(passwordToCompare, next) {
  const isMatch = encrypt.comparePasswords(passwordToCompare, this.local.password);
  next(isMatch);
};

let User;

if (mongoose.models.User !== undefined) {
  User = mongoose.model('User');
} else {
  User = mongoose.model('User', userSchema);
}

const UserModel = User;

export default UserModel;
