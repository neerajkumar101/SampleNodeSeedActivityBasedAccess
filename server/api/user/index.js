'use strict';

const express = require('express');
const controller = require('./user.controller');
const auth = require('../auth/auth.service');
const activity = require('../activity/activity.json');

const router = express.Router();

router.get('/', auth.hasPermission(activity.canViewUser), controller.index);
router.delete('/:id', auth.hasPermission(activity.canDeleteUser), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.hasPermission(activity.canViewUser), controller.show);
router.post('/', controller.create);
router.put('/:id/activities', auth.hasPermission(activity.canUpdateUserActivity), controller.updateActivity);

module.exports = router;