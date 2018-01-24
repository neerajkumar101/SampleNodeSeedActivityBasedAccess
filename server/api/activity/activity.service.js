'use strict';

const activity = require('./activity.json');
const _ = require('underscore');

/**
 * Get list of activities
 * restriction: 'admin'
 */
exports.index = function () {
    return Promise.resolve(activity);
};

exports.default = function (role) {
    switch (role) {
        case 'admin':
            return _.values(activity)
            break;
    }
}