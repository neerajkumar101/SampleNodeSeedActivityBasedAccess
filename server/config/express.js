/**
 * Express configuration
 */

'use strict';

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const path = require('path');
const config = require('./environment');
const passport = require('passport');
const winston = require('winston');
const mailer = require('../mailer');

module.exports = function (app) {
  /* Set winston request logger: it will print log wen any request comes to server
 */
  let env = app.get('env') || 'development';
  if ('development' === env || 'test' === env) {
    let logger = new (winston.Logger)({ transports: [new (winston.transports.Console)({ colorize: true })] });
    app.use(require('winston-request-logger').create(logger));
  }

  app.use(cors())
  app.use('/api/static', express.static(path.join(__dirname, '../', 'uploads')))
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(passport.initialize()); 
};
