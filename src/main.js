const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const expressHbs = require("express-handlebars");
require('dotenv').config();

const commonAPI = require('./controllers/common');
const webAPI = require('./controllers/web');
const myMqtt = require('./utils/myMqtt');
const logger = require('./utils/logger');
const ligthMqtt = require('./services/lightMqtt');
const gigrometrMqtt = require('./services/gigrometrMqtt');
const initMqtt = require('./services/initMqtt');

const startServer = async () => {
    const app = express();
    app.use(cors());
    app.use(bodyParser.urlencoded({
        extended: true,
    }))
    app.use(bodyParser.json());
    app.engine("hbs", expressHbs.engine(
        {
            layoutsDir: "views", 
            defaultLayout: "home",
            extname: "hbs"
        }
    ))
    app.set("view engine", "hbs");
    app.use('/common', commonAPI);
    app.use('/', webAPI);
    app.use((err, req, res, next) => {
        if(err.statusCode >= 400){
            logger.error(`(${statusCode}) ${req.originalUrl}`, req.body);
        }
        next();
    });
    
    const port = process.env.PORT || 3000;
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/myapp';
    await mongoose.connect(mongoUri);
    
    app.listen(port, () => logger.log(`Server started on port ${port}`));

    myMqtt.use('light', ligthMqtt);
    myMqtt.use('gigrometr', gigrometrMqtt);
    myMqtt.listen(
        initMqtt,
        () => logger.log(`Mqtt server error - internet problems`),
    );
}

startServer();
