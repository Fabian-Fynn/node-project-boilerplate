import bcrypt from 'bcrypt-nodejs';

const encrypt = {
  password: (pw) => {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(pw, salt);

    return hash;
  },
  comparePasswords: (pw, hash) => bcrypt.compareSync(pw, hash),
};

export default encrypt;
