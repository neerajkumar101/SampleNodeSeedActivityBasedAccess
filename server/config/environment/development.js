'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/nandikaresidency-dev',
    options: {
      useMongoClient: true
    }
  },
  // seedDB: true
};
