const express = require('express');
const Libs = require('../libs');
const { ParkModel } = require('../models/Park');
const { baseURL, env } = require('../config');

const parkRouter = express.Router();

parkRouter.post('/', createPark);

parkRouter.put('/edit/:parkId([A-Fa-f0-9]{24})', updatePark);

parkRouter.get('/:parkId([A-Fa-f0-9]{24})', getParkById);

parkRouter.delete('/:parkId([A-Fa-f0-9]{24})', deletePark);

parkRouter.get('/', getAllParks);

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
    try {
        const { parkId } = req.params;
        const park = await ParkModel.getById(parkId);
        res.send(park);
    } catch (error) {
        return response.status(status).send(errMessage);
    }
}

async function deletePark(req, res) {
    try {
        const { parkId } = req.params;
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
    try {
        const parks = await ParkModel.getAllParks();
        res.send(parks);
    } catch (err) {
        return responseError(res, err.message);
    }
}

module.exports = parkRouter;
