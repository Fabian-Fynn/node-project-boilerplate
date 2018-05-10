const userRoutes = {
  'GET /user-settings': 'userController.getSettings',
  'POST /update': 'userController.update',
  'DELETE /user/:userId': 'userController.destroy',
};

export default userRoutes;
