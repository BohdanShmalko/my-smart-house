const router = require('express').Router();
const commonService = require('../services/common');

router.post('/publish', (req, res) => {
    return commonService.publishMessage(req, res);
})

router.get('/lightStatus', (req, res) => {
    return commonService.lightStatus(req, res);
})

router.get('/gigrometrStatus', (req, res) => {
    return commonService.gigrometrStatus(req, res);
})

module.exports = router;