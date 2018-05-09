import auth from '../services/auth.service';
import User from '../models/user.model';

const UserController = () => {
  const get = (req, res) => {
    User.findById(req.params.userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: `User with id: ${req.params.userId} not found` });
        }

        return res.status(200).json(user);
      })
      .catch((err) => /* istanbul ignore next: hard to reproduce */ {
        console.error(err);
        return res.status(500).json({ error: `Could not get User with id: ${req.params.userId}` });
      });
  };

  const create = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status().json({ error: 'Param(s) not found. Required: email, password' });
    }

    return User.find({})
      .then((users) => {
        let roles = ['provisional'];

        if (users.length === 0) {
          roles = ['superadmin', 'admin'];
        }
        const user = new User({
          local: {
            email,
            password,
          },
          roles,
        });

        return user.save()
          .then((userSaved) => {
            const payload = { id: userSaved._id };
            const token = auth.issue(payload);
            return res.status(201).json({ token });
          })
          .catch((err) => /* istanbul ignore next: hard to reproduce */ {
            console.error(err);
            return res.status(500).json({ error: 'Could not create User' });
          });
      });
  };

  const update = (req, res) => {
    const body = req.body;

    // because we later have values that are arrays that needs to be pased
    // we use findById and then update
    User.findById(req.params.userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: `User with id: ${req.params.userId} not found` });
        }

        const firstName = body.firstName ? body.firstName : user.firstName;
        const lastName = body.lastName ? body.lastName : user.lastName;
        const birthdate = body.birthdate ? body.birthdate : user.birthdate;
        const gender = body.gender ? body.gender : user.gender;

        const updateUser = {
          firstName,
          lastName,
          birthdate,
          gender,
        };

        return User.update({ _id: req.params.userId }, updateUser)
          .then(() => res.status(200).json({ message: `Successfully updated User with id: ${req.params.userId}` }))
          .catch((err) => /* istanbul ignore next: hard to reproduce */ {
            console.error(err);
            return res.status(500).json({ error: `Could not update User with id: ${req.params.userId}` });
          });
      })
      .catch((err) => /* istanbul ignore next: hard to reproduce */ {
        console.error(err);
        res.status(500).json({ error: `Could not update User with id: ${req.params.userId}` });
      });
  };

  const destroy = (req, res) => {
    User.findByIdAndRemove(req.params.userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: `User with id: ${req.params.userId} not found` });
        }

        return res.status(200).json({ message: `Successfully destroyed User with ${req.params.userId}` });
      })
      .catch((err) => /* istanbul ignore next: hard to reproduce */ {
        console.error(err);
        return res.status(500).json({ error: `Could not destroy User with id ${req.params.userId}` });
      });
  };

  const login = (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
      User.findOne({
        'local.email': email,
      }).select('+local.password')
        .then((user) => {
          if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
          }

          return user.comparePasswords(password, (isMatch) => {
            if (isMatch) {
              const payload = { id: user._id };
              const token = auth.issue(payload);

              return res.status(200).json({ token });
            }
            return res.status(401).json({ error: 'Unauthorized' });
          });
        })
        .catch((err) => /* istanbul ignore next: hard to reproduce */ {
          console.error(err);
          return res.status(500).json({ error: 'Could not login User' });
        });
    }
  };

  return {
    create,
    destroy,
    get,
    update,
    login,
  };
};

export default UserController;
