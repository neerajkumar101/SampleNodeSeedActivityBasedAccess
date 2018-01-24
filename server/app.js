/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';


global.responseHandler = require('./utility/responseHandler');
global.logger = require('./utility/logger').logger;

const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// load all variable from .env file to system enviornment
require('dotenv').config({ path: __dirname + '/config/.env' });
const config = require('./config/environment');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function (err) {
	console.error('MongoDB connection error: ' + err);
	process.exit(-1);
});

// Populate DB with sample data
if (config.seedDB) { require('./config/seed'); }

// Setup server
let app = express();
let server = require('http').createServer(app);

require('./config/express')(app);
require('./routes')(app);
require('./config/errorHandling')(app);

// Start server
server.listen(config.port, config.ip, function () {
	logger.info('Express server listening on %d, in %s mode', config.port, app.get('env'));
	/*
	* Cron job 
	 */
	//require('./job');
});
// Expose app
exports = module.exports = app;