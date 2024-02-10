const moment = require('moment');

function formatMessages(names, text){
    return {
        names,
        text,
        time: moment().format('h:mm a')
    };
}

module.exports = formatMessages;