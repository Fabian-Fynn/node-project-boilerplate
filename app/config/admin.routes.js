const adminRoutes = {
  'GET /': 'adminController.getUsers',
  'PUT /user/:userId': 'adminController.updateUser',
  'PUT /user/:userId/promote': 'adminController.promoteUser',
  'DELETE /user/remove-provisional': 'adminController.removeProvisional',
  'DELETE /user/:userId': 'adminController.destroyUser',
};

export default adminRoutes;
