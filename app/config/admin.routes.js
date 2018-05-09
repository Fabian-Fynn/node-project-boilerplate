const adminRoutes = {
  'GET /': 'adminController.getUsers',
  'PUT /user/:userId': 'adminController.updateUser',
  'PUT /user/:userId/promote': 'adminController.promoteUser',
  'DELETE /user/:userId': 'adminController.destroyUser',
  'DELETE /user/remove-provisional': 'adminController.removeProvisional',
};

export default adminRoutes;
