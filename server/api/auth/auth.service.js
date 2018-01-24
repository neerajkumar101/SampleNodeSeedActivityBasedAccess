'use strict';

const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('underscore');
const config = require('../../config/environment');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const compose = require('composable-middleware');
const User = require('../user/user.model');
const AuthToken = require('./auth.model');
const validateJwt = expressJwt({ secret: config.secrets.session });

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 401
 */
function isAuthenticated() {
  return compose()
    // Validate jwt
    .use(function (req, res, next) {
      // allow access_token to be passed through query parameter as well
      //      if (req.query && req.query.hasOwnProperty('access_token')) {
      //        req.headers.authorization = 'Bearer ' + req.get('authorization');
      //      }   
      if (req.get('authorization')) {
        req.headers.authorization = 'Bearer ' + req.get('authorization');
        validateJwt(req, res, next);
      }else{
        responseHandler.error(res, { message: 'No authorization token was found' }, 'No authorization token was found', 401);
      }
    })
    // Attach user to request
    .use(function (req, res, next) {
      AuthToken.findOne({ user: req.user._id }).populate('user').exec()
        .then(result => {
          if (!result.user) return responseHandler.error(res, { message: 'Unauthenticated' }, 'Unauthenticated', 401);
          req.user = result.user;
          next();
        })
        .catch(err => next(err));
    });
}
/**
 * Attaches the user object to the request if authorized
 * Otherwise returns 403
 */
function isAuthorized(activityName) {
  return compose()
    .use(function (req, res, next) {
      if (_.indexOf(req.user.activities, activityName) > -1) {
        next();
      } else {
        responseHandler.error(res, { message: 'Unauthorized' }, 'Unauthorized', 403);
      }
    })
}

/**
* Checks if the user role has permission of the route
*/
function hasPermission(activityName) {
  if (!activityName) throw new Error(`${activityName} activity needs to be set`);

  return compose()
    .use(isAuthenticated())
    .use(isAuthorized(activityName))
    .use(function (req, res, next) {
      next();
    });
}

/**
 * Returns a jwt token signed by the app secret
 * ex : jwt.sign(<dataObject>, <secretKey>, <optionsObject ex:{ expiresIn: 60 * 60 * 5 }>);
 */
function signToken(id, role) {
  return jwt.sign({ _id: id, role: role }, config.secrets.session);
}

exports.isAuthenticated = isAuthenticated;
exports.signToken = signToken;
exports.hasPermission = hasPermission;
