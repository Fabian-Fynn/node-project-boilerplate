import User from '../models/user.model';

const env = process.env.NODE_ENV || 'production';

const adminController = () => {
  const getUsers = (req, res) => {
    User.find({})
      .then((users) => {
        if (!users) {
          return res.status(404).json({ error: 'No Users found' });
        }
        return res.render('admin_area', { page: 'admin', env, users, roles: req.user.roles });
      })
      .catch((err) => /* istanbul ignore next: hard to reproduce */ {
        console.error(err);
        return res.status(500).json({ error: 'Could not read from Database' });
      });
  };

  const destroyUser = (req, res) => {
    User.findById(req.params.userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: `User with id: ${req.params.userId} not found` });
        }

        if (user.roles.indexOf('superadmin') > -1) {
          return res.status(403).json({ error: 'User can not be destroyed because it`s a superadmin' })
        }

        user.remove();

        return res.status(200).json({ message: `Successfully destroyed User with ${req.params.userId}` });
      })
      .catch((err) => /* istanbul ignore next: hard to reproduce */ {
        console.error(err);
        return res.status(500).json({ error: `Could not destroy User with id ${req.params.userId}` });
      });
  };

  const removeProvisional = (req, res) => {
    User.remove({ roles: 'provisional' })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: 'No provisional Users found' });
        }

        return res.status(200).json({ message: 'Successfully destroyed provisional Users.' });
      })
      .catch((err) => /* istanbul ignore next: hard to reproduce */ {
        console.error(err);
        return res.status(500).json({ error: 'Database error.' });
      });
  };

  const updateUser = (req, res) => {
    const data = req.body;
    const id = req.params.userId;

    User.findById(id)
      .then((user) => {
        if (!user) {
          return res.status(404).send('User not found');
        }

        if (user.roles.indexOf('superadmin') > -1 && data.roles.indexOf('superadmin') === -1) {
          return res.status(403).json({ error: 'Superadmin role can not be revoked' });
        }

        if (user.roles.indexOf('superadmin') === -1 && data.roles.indexOf('superadmin') > -1) {
          return res.status(403).json({ error: 'User can not become superadmin' });
        }

        return User.findByIdAndUpdate(id, data)
          .then((updatedUser) => {
            if (!updatedUser) {
              return res.status(404).send('User not found');
            }
            return res.status(200).json({ id });
          })
          .catch((err) => res.status(500).send(`Database error: ${err}`));
      })
      .catch((err) => res.status(500).send(`Database error: ${err}`));
  };

  const promoteUser = (req, res) => {
    const id = req.params.userId;

    User.findOne({ _id: id })
      .then((user) => {
        if (!user) {
          return res.status(404).send('User not found');
        }

        const filter = (role) => role !== 'provisional';

        const u = user;
        u.roles = user.roles.filter(filter);

        u.roles.push('dev');
        u.update();

        return res.status(200).json({ id });
      })
      .catch((err) => res.status(500).send(`Database error: ${err}`));
  };

  return {
    destroyUser,
    getUsers,
    promoteUser,
    removeProvisional,
    updateUser,
  };
};

export default adminController;
