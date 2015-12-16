"use strict";
/**
 * Dependencies
 */
const express = require('express');
const dustjs = require('adaro');
const path = require('path');
const logger = require('morgan');

/**
 * Config
 */
const config = require("./config/config");

/**
 * Server
 */
const app = express();
app.proxy = true; // trust proxy

/**
 * Template engine
 */
// 注册
app.engine("dust",dustjs.dust({ cache: false }));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'dust');

/**
 * logger
 */
app.use(logger('dev'));

/**
 * Start app
 */
if (!module.parent) {
    app.listen(config.app.port);
    console.log("Server started, listening on port: " + config.app.port);
}
console.log("Environment: " + config.app.env);