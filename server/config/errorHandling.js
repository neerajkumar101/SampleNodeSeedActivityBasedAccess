'use strict';

const errorHandler = require('errorhandler');
module.exports = function (app) {
    let env = app.get('env') || 'development';

    if ('production' === env) {
        process.on('unhandledRejection', (reason, p) => {
            let locals = {
                error: {
                    reason: reason,
                    p: p
                }
            }
            mailer.sendMail('error', 'ravi.verma@oodlestechnologies.com', 'unhandledRejection in Nandika residency', locals);
        });
        process.on('uncaughtException', (err) => {
            let locals = {
                error: err
            }
            mailer.sendMail('error', 'ravi.verma@oodlestechnologies.com', 'uncaughtException in Nandika residency', locals);
        });
    }

    if ('development' === env || 'test' === env) {
        app.use(errorHandler({ log: errorNotification })) // Error handler - has to be last
    }
};

//If any error occure on development or test enviorment we are showing a notification
function errorNotification(err, str, req) {

    const notifier = require('node-notifier');
    console.log(`Error occured : ${str}`);
    var title = 'Error in ' + req.method + ' ' + req.url
    notifier.notify({
        title: title,
        message: str
    })
}