const moment = require('moment');

const lightModel = require('../models/lightModel');
const pompModel = require('../models/pompModel');
const fitolampModel = require('../models/fitolampModel');
const gigrometrModel = require('../models/gigrometrModel');

const createLightModel = async (createObject) => {
    return lightModel.create(createObject);
}
const createPompModel = async (createObject) => {
    return pompModel.create(createObject);
}

const createFitolampModel = async (createObject) => {
    return fitolampModel.create(createObject);
}

const createGigrometrModel = async (createObject) => {
    return gigrometrModel.create(createObject);
}


const getLightStatusData = async () => {
    const lastLightTimeDoc = await lightModel.findOne().sort({_id:-1});
    const lastLightTime = moment(lastLightTimeDoc.createdAt).utc();

    const systemStartFromDoc = await lightModel.findOne({ value: '1' }).sort({_id:-1});
    const systemStartFrom = moment(systemStartFromDoc.createdAt).utc();

    const top10LightStartDoc = await lightModel.find({ value: '1' }).sort({_id:-1}).limit(10);
    const top10LightStart = top10LightStartDoc.map(el => moment(el.createdAt).toDate().getTime()).join();

    return { lastLightTime, systemStartFrom, top10LightStart };
}

const getGigrometrStatusData = async () => {
    const lastGigrometrDoc = await gigrometrModel.findOne({ pin: 5 }).sort({_id:-1});
    if(!lastGigrometrDoc) return {};
    const mongoGigrometrLastData = lastGigrometrDoc.value;
    const lastMongoGigrometrTime = moment(lastGigrometrDoc.createdAt).utc();

    return { mongoGigrometrLastData, lastMongoGigrometrTime };
}

const getFitolampLastStatus = async () => {
    const lastFitolampDoc = await fitolampModel.findOne({ pin: 2 }).sort({_id:-1});
    const checkedFitolamp = lastFitolampDoc.value;
    return { checkedFitolamp };
}

const getPompLastWatering = async () => {
    const lastPompDoc = await pompModel.findOne({ pin: 1 }).sort({_id:-1});
    if(!lastPompDoc) return
    const pompMangoButtonLastWatering = moment(lastPompDoc.createdAt).utc();

    return { pompMangoButtonLastWatering };
}

module.exports = {
    createLightModel,
    getLightStatusData,
    getGigrometrStatusData,
    getFitolampLastStatus,
    getPompLastWatering,
    createPompModel,
    createFitolampModel,
    createGigrometrModel,
}