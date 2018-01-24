'use strict';

const activityService = require('./activity.service');

/**
 * Get list of activities
 * restriction: 'admin'
 */
exports.index = function (req, res) {
    activityService.index()
        .then(activities => res.status(200).json(activities));
};