'use strict';
const timestamps = require('mongoose-timestamp');
const mongooseDelete = require('mongoose-delete');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const saltRounds = 10;

const UserSchema = new Schema({
  name: String,
  email: {
    type: String,
    lowercase: true,
    required: [true, 'User email required']
  },
  role: {
    type: String,
    default: 'user'
  },
  hashedPassword: {
    type: String
  },
  provider: String,
  isActive: {
    type: Boolean,
    default: false
  },
  hasSetPassword: {
    default: false,
    type: Boolean
  },
  /*activateAccount: {
    token: results.keyHash.hash,
    expires: Date.now() + 10000000 //TODO: set token expiration in config
  }, */
  activities: [{
    type: String
  }]
});

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.hashedPassword = this.encryptPassword(password)
    /* .then(hash => {
      this.hashedPassword = hash;
      resolve()
    }); */
  })
  .get(function () {
    return this._password;
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function () {
    return {
      'name': this.name,
      'role': this.role
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function () {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('email')
  .validate(function (email) {
    return new Promise(function (resolve, reject) {
      resolve(email.length);
    });
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function (hashedPassword) {
    return new Promise(function (resolve, reject) {
      resolve(hashedPassword.length);
    });
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function (value) {
    return new Promise((resolve, reject) => {
      this.constructor.findOne({ email: value }, (err, user) => {
        if (err) reject(err);//throw err; //TODO : Handle error
        if (user) {
          reject();
        } else {
          resolve();
        }
      });
    });
  }, 'The specified email address is already in use.');

var validatePresenceOf = function (value) {
  return value && value.length;
};

UserSchema
  .pre('save', function (next) {
    if (!this.isNew) return next();
    if (!validatePresenceOf(this.hashedPassword)) {
      next(new Error('Invalid password'));
    } else {
      next();
    }
  });

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function (plainText) {
    return bcrypt.compare(plainText, this.hashedPassword);
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function (password) {
    if (!password) return Promise.resolve('');
    //TODO: replace 'hashSync' function with 'hash' function to make it asynchronous
    return bcrypt.hashSync(password, saltRounds);
  }
};

UserSchema.plugin(timestamps);
UserSchema.plugin(mongooseDelete);
module.exports = mongoose.model('User', UserSchema);
