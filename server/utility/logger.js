const winston = require('winston');

let logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({ colorize: true }),
    new (require('winston-daily-rotate-file'))({
      filename: './logs/all-logs.log',
      datePattern: 'yyyy-MM-dd.',
      prepend: true,
    })
  ],
  exceptionHandlers: [
    new (winston.transports.Console)({ colorize: true }),
    new (require('winston-daily-rotate-file'))({
      filename: './logs/exception.log',
      datePattern: 'yyyy-MM-dd.',
      prepend: true,
    })
  ]
});

module.exports.logger = logger;

