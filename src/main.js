const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const commonAPI = require('./controllers/fitolamp');
const myMqtt = require('./utils/myMqtt');
const logger = require('./utils/logger');
const ligthMqtt = require('./services/lightMqtt');

const startServer = async () => {
    const app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use('/fitolamp', commonAPI);
    
    const port = process.env.PORT || 3000;
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/myapp';
    await mongoose.connect(mongoUri);
    
    app.listen(port, () => logger.log(`Server started on port ${port}`));

    const mqttPort = Number(process.env.MQTT_PORT);
    myMqtt.use('light', ligthMqtt);
    myMqtt.listen(() => logger.log(`Mqtt server started on port ${mqttPort}`));
}

startServer();
