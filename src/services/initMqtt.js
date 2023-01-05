const logger = require('../utils/logger');
const repositories = require('./repositories');
const { publish } = require("../utils/myMqtt");

module.exports = async () => {
    logger.log(`Mqtt server started on port ${Number(process.env.MQTT_PORT)}`);
    const checkedFitolampData = await repositories.getGigrometrStatusData();
    publish('fitolamp', checkedFitolampData.checkedFitolamp);
}