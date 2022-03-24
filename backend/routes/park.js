const express = require('express');
const Libs = require('../libs');
const parkHandler = require('../handlers/park');
const { ParkModel } = require('../models/Park');

const parkRouter = express.Router();

parkRouter.post('/', createPark);

parkRouter.put('/:parkId([A-Fa-f0-9]{24})', updatePark);

parkRouter.get('/:parkId([A-Fa-f0-9]{24})', getParkById);

parkRouter.delete('/:parkId([A-Fa-f0-9]{24})', deletePark);

parkRouter.get('/', getAllParks);

parkRouter.post('/:parkId([A-Fa-f0-9]{24})/favorites/:userId([A-Fa-f0-9]{24})', addUserToPark);

parkRouter.delete('/:parkId([A-Fa-f0-9]{24})/favorites/:userId([A-Fa-f0-9]{24})', deleteUserFromPark);

function responseError(response, errMessage) {
    let status = 500;
    return response.status(status).send(errMessage);
}

async function createPark(req, res) {
    try {
        const newPark = await ParkModel.createPark(req.body);

        res.send(newPark);
    } catch (err) {
        return responseError(res, err.message);
    }
}

async function updatePark(req, res) {
    try {
        const newParkObj = await ParkModel.updatePark(req.body);

        res.send(newParkObj);
    } catch (err) {
        return responseError(res, err.message);
    }
}

async function getParkById(req, res) {
    const { parkId } = req.params;

    try {
        const park = await ParkModel.getById(parkId);

        res.send(park);
    } catch (error) {
        return response.status(status).send(errMessage);
    }
}

async function deletePark(req, res) {
    const { parkId } = req.params;

    try {
        const result = await ParkModel.deletePark(parkId);

        if (result.deletedCount === 0) {
            return responseError(
                res,
                Libs.Errors.EmployeeValidation.EmployeeDoesNotExists
            );
        }

        return res.send();
    } catch (err) {
        return responseError(res, err.message);
    }
}

async function getAllParks(req, res) {
    const userId = req.get('userId');

    try {
        const parks = await parkHandler.getParks(userId);
        res.send(parks);
    } catch (err) {
        return responseError(res, err.message);
    }
}

async function addUserToPark(req, res) {
    const { parkId, userId } = req.params;

    try {
        await parkHandler.addUserToPark(parkId, userId);

        return res.send();
    } catch (err) {
        return responseError(res, err.message);
    }
}

async function deleteUserFromPark(req, res) {
    const { parkId, userId } = req.params;

    try {
        await parkHandler.deleteUserFromPark(parkId, userId);

        return res.send();
    } catch (err) {
        return responseError(res, err.message);
    }
}

module.exports = parkRouter;
