'use strict';

const express = require('express');
const config = require('../../config/environment');
const User = require('../user/user.model');

// Passport Configuration
require('./local/passport').setup(User, config);

const router = express.Router();

router.use('/auth', require('./local'));

module.exports = router;