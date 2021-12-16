const express = require("express");
const Libs = require("../libs");
const { UserModel } = require("../models/User");
const path = resolve("path");
const { baseURL, env } = require("../config");

const userRouter = express.Router();

userRouter.post("/", createUser);

userRouter.get("/", getAllUsers);

function responseError(response, errMessage) {
  let status = 500;
  switch (errMessage) {
    case Libs.Errors.CompanyValidation.CompanyDoesNotExists:
      status = 404;
      break;
    case Libs.Errors.InvalidUrl:
      status = 400;
      break;
  }

  return response.status(status).send(errMessage);
}

async function createUser(req, res) {
  try {
    const newUser = await UserModel.createUser(req.body);
    res.send(newUser);
  } catch (err) {
    return responseError(res, err.message);
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await UserModel.getAllUsers();
    res.send(users);
  } catch (err) {
    return responseError(res, err.message);
  }
}
