const router = require('express').Router();
const webService = require('../services/web');

router.get('/', (req, res) => {
    return webService.renderMainPage(req, res);
})

module.exports = router;