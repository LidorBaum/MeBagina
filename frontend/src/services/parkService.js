import httpService from './httpService';

export default {
  createPark,
  updatePark,
  getParkById,
  removePark,
  getAllParks,
  getTotalPrintTime,
  updateVaseStatus,
  updateVasePrintedCount,
  getCustomerParks,
  addFavorite,
  removeFavorite
};

async function addFavorite(parkId, userId){
  return await httpService.post(`park/${parkId}/favorites/${userId}`)
}
async function removeFavorite(parkId, userId){
  return await httpService.delete(`park/${parkId}/favorites/${userId}`)
}

async function getCustomerParks(customerId) {
  return await httpService.get(`park/parks/${customerId}`);
}

async function getTotalPrintTime(vaseArray) {
  return await httpService.get('park/printTime', vaseArray);
}

async function createPark(parkObj) {
  return await httpService.post('park', parkObj);
}
function updatePark(parkObj) {
  return httpService.put(`park/edit/${parkObj._id}`, {
    newStatus: parkObj.status,
  });
}

function updateVasePrintedCount(parkObj) {
  return httpService.put(`park/edit/${parkObj.parkId}/printed`, {
    ...parkObj,
  });
}

function updateVaseStatus(parkObj) {
  return httpService.put(`park/edit/${parkObj.parkId}/vase`, {
    ...parkObj,
  });
}

function getParkById(parkId) {
  return httpService.get(`park/${parkId}`);
}

function removePark(parkId) {
  return httpService.delete(`park/${parkId}`);
}

function getAllParks(userId) {
  return httpService.get('park', null, userId );
}
