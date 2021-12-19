const express = require("express");
const Libs = require("../libs");
const { DogModel } = require("../models/Dog");
const path = resolve("path");
const { baseURL, env } = require("../config");

const dogRouter = express.Router();

dogRouter.post("/", createDog);

dogRouter.put("/edit/:dogId([A-Fa-f0-9]{24})", updateDog);

dogRouter.get("/:dogId([A-Fa-f0-9]{24})", getDogById);

dogRouter.delete("/:dogId([A-Fa-f0-9]{24})", deleteDog);

dogRouter.get("/user/:userId([A-Fa-f0-9]{24})", getUserDogs);

dogRouter.get("/", getAllDogs);

function responseError(response, errMessage) {
  let status = 500;
  return response.status(status).send(errMessage);
}

async function createDog(req, res) {
  try {
    const newDog = await DogModel.createDog(req.body);
    res.send(newDog);
  } catch (err) {
    return responseError(res, err.message);
  }
}

async function updateDog(req, res) {
  try {
    const newDogObj = await DogModel.updateDog(req.body);
    res.send(newDogObj);
  } catch (err) {
    return responseError(res, err.message);
  }
}

async function getDogById(req, res) {
  try {
    const { parkId } = req.params;
    const park = await DogModel.getById(parkId);
    res.send(park);
  } catch (error) {
    return response.status(status).send(errMessage);
  }
}

async function deleteDog(req, res) {
  try {
    const { parkId } = req.params;
    const result = await DogModel.deleteDog(parkId);
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

async function getAllDogs(req, res) {
  try {
    const parks = await DogModel.getAllDogs();
    res.send(parks);
  } catch (err) {
    return responseError(res, err.message);
  }
}

async function getUserDogs(req, res) {
  try {
    const { userId } = req.params;
    const dogsArray = await DogModel.getUserDogs(userId);
    res.send(dogsArray);
  } catch (error) {}
}

module.exports = dogRouter;
