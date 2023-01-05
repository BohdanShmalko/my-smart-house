const logger = require('../utils/logger');
const repositories = require('./repositories');

module.exports = async (message) => {
    const minutes = Number(message);
    if(isNaN(minutes)) return logger.warn(`Topic: light. ${message} is not a number.`);

    const hours = Math.floor(minutes / 60);
    const minuteRaw = (minutes - hours * 60).toString();
    const minute = minuteRaw.length === 1 ? `0${minuteRaw}` : minuteRaw;

    logger.log(`The system is already wark ${hours} hour and ${minute} minute.`);

    //save to db
    await repositories.createLightModel({ value: message });
    logger.log(`Topic: ligth. Value success saved.`);
}