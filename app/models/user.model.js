import mongoose from 'mongoose';

import encrypt from '../services/encryption.service';

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

userSchema.pre('save', function pre(next) {
  this.local.password = encrypt.password(this.local.password);
  next();
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
