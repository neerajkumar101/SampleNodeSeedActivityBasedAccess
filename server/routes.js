/**
 * Main application routes
 */

'use strict';

const winston = require('winston');

module.exports = function (app) {

  //auth api initialisation
  app.use('/api', require('./api/auth'));
  // Insert routes below
  app.use('/api/users', require('./api/user'));
  app.use('/api/activities', require('./api/activity'));
};
