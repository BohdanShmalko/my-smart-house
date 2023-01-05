const logger = require('../utils/logger');
const repositories = require('./repositories');

module.exports = async (message) => {
    const percent = Number(message);

    logger.log(`Gigrometr percent ${percent}`);

    //save to db
    await repositories.createGigrometrModel({ value: message });
    logger.log(`Topic: gigrometr. Value success saved.`);
}