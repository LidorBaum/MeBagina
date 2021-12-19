const express = require("express");
const Libs = require("../libs");
const { ChatModel } = require("../models/Chat");
const path = resolve("path");
const { baseURL, env } = require("../config");

const chatRouter = express.Router();

module.exports = chatRouter;
