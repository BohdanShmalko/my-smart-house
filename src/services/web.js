const repositories = require('./repositories');

const renderMainPage = async (req, res) => {
    const lightStatusData = await repositories.getLightStatusData();
    const gigrometrStatusData = await repositories.getGigrometrStatusData();
    const checkedFitolampData = await repositories.getFitolampLastStatus();
    const getPompLastWatering = await repositories.getPompLastWatering();
    return res.render('home.hbs', { 
        ...lightStatusData, 
        ...gigrometrStatusData,
        ...checkedFitolampData,
        ...getPompLastWatering,
    });
}

module.exports = {
    renderMainPage,
}