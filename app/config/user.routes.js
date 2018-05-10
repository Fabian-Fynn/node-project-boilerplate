const userRoutes = {
  'GET /user-settings': 'userController.getSettings',
  'POST /update': 'userController.update',
  'DELETE /delete': 'userController.destroy',
};

export default userRoutes;
