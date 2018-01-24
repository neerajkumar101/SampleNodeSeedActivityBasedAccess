'use strict';
const timestamps = require('mongoose-timestamp');
const mongooseDelete = require('mongoose-delete');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AuthTokenSchema = new Schema({
    token: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});
AuthTokenSchema.plugin(timestamps);
AuthTokenSchema.plugin(mongooseDelete);
module.exports = mongoose.model('AuthToken', AuthTokenSchema);