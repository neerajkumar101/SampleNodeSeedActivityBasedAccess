/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
// Insert seed models below

const _ = require('underscore');
const User = require('../api/user/user.model');

const activityService = require('../api/activity/activity.service');

// Insert seed data below
let userSeed = require('../api/user/user.seed.json');

userSeed = _.map(userSeed, function (userObj) {
  userObj.activities = activityService.default(userObj.role);
  return userObj;
});

// Insert seed inserts below
async function run() {
  await User.find({}).remove();
  await User.create(userSeed);
}

run().catch(error => console.error(error.stack));