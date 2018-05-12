import passport from 'passport';
import auth from '../services/auth.service';
import User from '../models/user.model';
import config from '../config';

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

  const getUsers = (req, res) => (
    User.find({})
  );

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
            const errorProperties = err.errors[Object.keys(err.errors)[0]].properties;
            if (errorProperties.type === 'unique' && errorProperties.path === 'local.email') {
              return res.status(409).json({ error: `A User with the email ${errorProperties.value} already exists.` });
            }
            return res.status(500).json({ error: 'Could not create User' });
          });
      });
  };

  const update = (req, res) => {
    User.findById(req.user._id)
      .then((foundUser) => {
        if (!foundUser) {
          return res.status(404).json({ error: `User with id: ${req.user._id} not found` });
        }

        const user = foundUser;

        user.name = req.body.name ? req.body.name : user.name;
        user.local.email = req.body.email ? req.body.email : user.local.email;

        if (req.body.password) {
          user.local.password = req.body.password;
        }

        user.save();
        return res.redirect('/user/user-settings?success-msg=User updated successfully.');
      })
      .catch((err) => /* istanbul ignore next: hard to reproduce */ {
        console.error(err);
        res.status(500).json({ error: `Could not update User with id: ${req.user._id}` });
      });
  };

  const destroy = (req, res) => {
    User.findByIdAndRemove(req.user._id)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: `User with id: ${req.user._id} not found` });
        }

        return res.status(200).json({ message: `Successfully destroyed User with ${req.user._id}` });
      })
      .catch((err) => /* istanbul ignore next: hard to reproduce */ {
        console.error(err);
        return res.status(500).json({ error: `Could not destroy User with id ${req.user._id}` });
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

  const getSettings = (req, res, next) => {
    passport.authenticate('default-policy', { session: true }, (err, authenticatedUser) => {
      return res.render('user_settings', {
        page: 'user-Settings',
        env: 'development',
        roles: authenticatedUser.roles,
        user: {
          uid: authenticatedUser._id,
          email: authenticatedUser.local.email,
          name: authenticatedUser.name,
        },
        projectName: config.projectName,
        copyrightHolder: config.copyrightHolder,
        externalAssetUrl: config.externalAssetUrl,
      });
    })(req, res, next);
  };

  return {
    create,
    destroy,
    get,
    getUsers,
    getSettings,
    update,
    login,
  };
};

export default UserController;
