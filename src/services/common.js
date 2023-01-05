const { publish } = require("../utils/myMqtt");
const logger = require('../utils/logger');
const repositories = require('./repositories');

const publishMessage = async (req, res) => {
    const { topic, message, pin } = req.body;
    if(!topic || !message) return res.status(400).send({ message: 'Invalid data' });

    if(topic === 'pomp') {
        publish(topic, message);
        logger.log(`Topic: pomp. Sended message ${message}.`);
        await repositories.createPompModel({ value: message, pin });
        logger.log(`Topic: pomp. Value success saved.`);
    } else if (topic === 'fitolamp') {
        publish(topic, message);
        logger.log(`Topic: fitolamp. Sended message ${message}.`);
        await repositories.createFitolampModel({ value: message, pin });
        logger.log(`Topic: fitolamp. Value success saved.`);
    } else {
        logger.warn(`Topic: ${topic}. Not sended message ${message}. Unknown topic.`);
    }

    return res.status(201).send({ message: 'Topic sended', time: Date.now() });
}

const lightStatus = async (req, res) => {
    const data = await repositories.getLightStatusData();
    return res.status(200).send(data);
}

const gigrometrStatus = async (req, res) => {
    const data = await repositories.getGigrometrStatusData();
    return res.status(200).send(data);
}

module.exports = {
    publishMessage,
    lightStatus,
    gigrometrStatus,
}