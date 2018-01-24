'use strict';

const activityService = require('../activity/activity.service');
const User = require('./user.model');
const config = require('../../config/environment');
const jwt = require('jsonwebtoken');

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function () {
  return User.find({ "deleted": { $ne: true } }, '-salt -hashedPassword').exec();
};

/**
 * Creates a new user
 */
exports.create = function (userObj) {
  let newUser = new User(userObj);
  newUser.provider = 'local';
  newUser.role = 'user';
  return newUser.save()
    .then(user => {
      let token = jwt.sign({ _id: user._id }, config.secrets.session);
      returnPromise.resolve({ token: token });
    });
};

/**
 * Get a single user
 */
exports.show = function (userId) {
  return User.findById(userId).exec();
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function (userId) {
  return User.delete({ "_id": userId }).exec()
};

/**
 * Change a users password
 */
exports.changePassword = function (userId, oldPass, newPass) {
  return User.findById(userId).exec()
    .then(user => {
      return user.authenticate(oldPass)
        .then(isPasswordMatched => {
          if (isPasswordMatched) {
            user.password = newPass;
            return user.save().exec();
          } else {
            return Promise.reject('Forbidden');
          }
        })
    });
};

/**
 * Get my info
 */
exports.me = function (userId) {
  return User.findOne({
    _id: userId
  }, '-salt -hashedPassword').exec()
};

/* 
* update user's activity
*/
exports.updateActivity = function (userId, isDefault, activities) {
  if (isDefault === 'true') {
    return User.findOne({ _id: userId }, 'role').exec()
      .then(result => {
        activities = activityService.default(result.role);
        return User.findByIdAndUpdate(userId, { $set: { activities: activities } }).exec()
      })
  } else {
    return User.findByIdAndUpdate(userId, { $set: { activities: activities } }).exec();
  }
}
