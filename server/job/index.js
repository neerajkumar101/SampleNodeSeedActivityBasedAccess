'use strict';

const cron = require('cron');

var job1 = new cron.CronJob({
    cronTime: '*/1 * * * *',
    onTick: function () {
        //call function here
    },
    start: false,
    timeZone: 'Asia/Kolkata'
});

job1.start(); // job 1 started
console.log('job1 status', job1.running); // job1 status true