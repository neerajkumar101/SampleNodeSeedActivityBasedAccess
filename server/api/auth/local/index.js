'use strict';

const express = require('express');
const passport = require('passport');
const auth = require('../auth.service');
const AuthToken = require('../auth.model');

const router = express.Router();

router.post('/local', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    let error = err || info;
    if (error) return responseHandler.error(res, error, error.message, 401);
    if (!user) return responseHandler.error(res, {}, 'Something went wrong, please try again.', 404);
    
    let token = auth.signToken(user._id, user.role);
    let authTokenObj = new AuthToken({
      user: user._id,
      token: token
    });
    authTokenObj.save(function (error, result) {
      if (error) {
        responseHandler.error(res, error, error.message, 422);
      } else {
        responseHandler.success(res, { token: token }, "Login successfully", 200);
      }
    });
  })(req, res, next)
});

module.exports = router;