'use strict';

const express = require('express');
const controller = require('./activity.controller');
const auth = require('../auth/auth.service');
const activity = require('./activity.json');

const router = express.Router();

router.get('/', auth.hasPermission(activity.canViewActivity), controller.index);

module.exports = router;