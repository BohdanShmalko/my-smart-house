const moment = require('moment')

module.exports = {
    log: (...args) => {
        const now = moment().format('YYYY-MM-DD HH:mm:ss');
        const content = args
            .map(el => typeof el === 'object' ? JSON.stringify(el) : el);
        console.log(`\x1b[34m[INFO]\x1b[0m`, `\x1b[35m${now}\x1b[0m`, ...content);
    },

    warn: (...args) => {
        const now = moment().format('YYYY-MM-DD HH:mm:ss');
        const content = args
            .map(el => typeof el === 'object' ? JSON.stringify(el) : el);
        console.log(`\x1b[33m[WARN]\x1b[0m`, `\x1b[35m${now}\x1b[0m`, ...content);
    },

    error: (...args) => {
        const now = moment().format('YYYY-MM-DD HH:mm:ss');
        const content = args
            .map(el => typeof el === 'object' ? JSON.stringify(el) : el);
        console.log(`\x1b[31m[ERROR]\x1b[0m`, `\x1b[35m${now}\x1b[0m`, ...content);
    }
}