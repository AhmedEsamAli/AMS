const moment = require('moment');

const millisInDays = (day)=>{
    return moment().add(day,"d") - moment();
}
const afterDays = (day)=>{
    return moment().add(day,"d").toDate();
}
module.exports = {millisInDays,afterDays}