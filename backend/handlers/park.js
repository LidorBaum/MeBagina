const { ParkModel } = require('../models/Park');
const parkService = require('../services/park');

async function getParks(userId) {
    const parks = await ParkModel.getAllParks();
    
    return parks.map(park => {
        return parkService.formatParkSummaryData(park, userId);
    });
}

module.exports = {
    getParks,
};