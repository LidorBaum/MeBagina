const express = require('express');
const Libs = require('../libs');
const { ChatModel } = require('../models/Chat');
const { baseURL, env } = require('../config');

const chatRouter = express.Router();

module.exports = chatRouter;
