const mqtt = require('mqtt');
const logger = require('./logger');

let client = null;
const middlewares = [];

const startMqtt = () => {
    const options = {
        host: process.env.MQTT_HOST,
        port: Number(process.env.MQTT_PORT),
        protocol: 'mqtts',
        username: process.env.MQTT_NAME,
        password: process.env.MQTT_PASSWORD,
    }
    
    client = mqtt.connect(options);

    for(const middleware of middlewares) {
        const {topic} = middleware;
        client.subscribe(topic);
        logger.log(`Subscribed to the topic ${topic}`);
    }
}

module.exports = {
    use: (topic, callback) => {
        middlewares.push({topic, callback});
    },

    listen: (callback, errorCallback) => {
        startMqtt();
        
        client.on('connect', () => {
            if(callback) callback();
        });
        
        client.on('error', (error) => {
            if(errorCallback) errorCallback();
        });
        
        client.on('message', async (topicMqtt, message) => {
            for(const middleware of middlewares) {
                const {topic, callback} = middleware;
                if(topic === topicMqtt) {
                    await callback(message.toString());
                    break;
                }
            }
        });
    },

    publish: (topic, message) => {
        if(client) {
            client.publish(topic, message);
        } else {
            logger.error(`Cannot publish topic ${topic} (not found client)`);
        }
    }
};

