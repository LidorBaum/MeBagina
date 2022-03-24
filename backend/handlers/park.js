const { ParkModel } = require('../models/Park');
const parkService = require('../services/park');

async function getParks(userId) {
    const parks = await ParkModel.getAllParks();
    
    return parks.map(park => {
        return parkService.formatParkSummaryData(park, userId);
    });
}

function addUserToPark(parkId, userId) {
    return ParkModel.addUserToPark(parkId, userId);
}

function deleteUserFromPark(parkId, userId) {
    return ParkModel.deleteUserFromPark(parkId, userId);
}

module.exports = {
    getParks,
    addUserToPark,
    deleteUserFromPark,
};