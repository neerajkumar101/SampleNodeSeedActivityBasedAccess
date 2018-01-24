'use strict';

const userService = require('./user.service');

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function (req, res, next) {
  userService.index()
    .then(users => responseHandler.success(res, users, "User retrieved successfully", 200))
    .catch(error => responseHandler.error(res, error, error.message, 500));
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  userService.create(req.body)
    .then(result => responseHandler.success(res, result, "User created successfully", 200))
    .catch(error => responseHandler.error(res, error, error.message, 422));
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  userService.show(req.params.id)
    .then(user => {
      if (!user) {
        responseHandler.error(res, { message: 'Unauthorized' }, "Unauthorized", 401);
      } else {
        responseHandler.success(res, user.profile, "User profile retrieved successfully", 200);
      }
    })
    .catch(error => responseHandler.error(res, error, error.message, 500));
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function (req, res, next) {
  userService.destroy(req.params.id)
    .then(result => responseHandler.success(res, { message: "User deleted successfully" }, "User deleted successfully", 200))
    .catch(error => responseHandler.error(res, error, error.message, 500));
};

/**
 * Change a users password
 */
exports.changePassword = function (req, res, next) {
  userService.changePassword(req.user._id, req.body.oldPassword, req.body.newPassword)
    .then(result => responseHandler.success(res, { message: 'Password changed successfully' }, 'Password changed successfully', 200))
    .catch(error => {
      if (error === 'Forbidden') {
        responseHandler.error(res, { message: 'Forbidden' }, 'Forbidden', 403)
      } else {
        responseHandler.error(res, error, error.message, 422)
      }
    });
};

/**
 * Get my info
 */
exports.me = function (req, res, next) {
  userService.me(req.user._id)
    .then(user => {
      if (!user) {
        responseHandler.error(res, { message: 'Unauthorized' }, 'Unauthorized', 401);
      } else {
        responseHandler.success(res, user, 'successfully', 200);
      }
    })
    .catch(error => responseHandler.error(res, error, error.message, 500));
};

/* 
* update user's activity
*/
exports.updateActivity = function (req, res, next) {
  userService.updateActivity(req.user._id, req.query.default, req.body.activities)
    .then(result => responseHandler.success(res, { message: 'Activity updated successfully' }, 'Activity updated successfully', 200))
    .catch(error => responseHandler.error(res, error, error.message, 500));
}
