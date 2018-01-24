'use strict';
const nodemailer = require('nodemailer');
const EmailTemplate = require('email-templates').EmailTemplate;
const path = require('path');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

exports.sendMail = function (templateName, toEmail, locals, attachments) {
    let templatesDir = path.resolve(__dirname, 'templates');
    let template = new EmailTemplate(path.join(templatesDir, templateName));

    return new Promise(function (resolve, reject) {

        template.render(locals, function (err, results) {
            if (err) {
                reject(err);
                return console.error(err)
            }

            // setup email data with unicode symbols
            let mailOptions = {
                from: '"Nandika Residency 👻" <nandika@residency.com>', // sender address
                to: toEmail,//'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
                subject: results.subject,//'Hello ✔', // Subject line
                //text: results.html,//'Hello world ?', // plain text body
                html: results.html,//'<b>Hello world ?</b>' // html body                
            };

            if (attachments && attachments[0]) {
                mailOptions.attachments = attachments
            }

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error);
                    return console.error(error)
                }
                resolve(info);
                console.log('Message %s sent: %s', info.messageId, info.response);
            });
        });
    })
}


//example to send email
/*let mailer = require('./mailer');
let locals = {
    name: {
        first: 'Mamma',
        last: 'Mia'
    }
}
mailer.sendMail('newsletter','ravi.verma@oodlestechnologies.com', locals)
*/