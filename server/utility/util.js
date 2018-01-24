Date.prototype.addDays = function (days) {
    var dat = new Date(this.valueOf())
    dat.setDate(dat.getDate() + days);
    return dat;
}
/* 
* get all b/w a date range
*/
exports.getDateArrayFromRange = function (startDate, endDate, addFn, interval) {
    addFn = addFn || Date.prototype.addDays;
    interval = interval || 1;

    let retVal = [];
    let current = new Date(startDate);
    endDate = new Date(endDate);
    while (current < endDate) {
        retVal.push((new Date(current)).toISOString());
        current = addFn.call(current, interval);
    }
    return retVal;
}