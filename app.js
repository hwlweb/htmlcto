"use strict";
/**
 * Dependencies
 */
const koa = require("koa");

/**
 * Config
 */
const config = require("./config/config");

/**
 * Server
 */
const app = koa();
app.proxy = true; // trust proxy

/**
 *  Error handler
 */
const logger = require('koa-logger');
app.use(logger());

/**
 * Template engine
 */
const View = require('koa-views');  //模板解析
const dust = require('dustjs-helpers');
dust.config.whitespace = true; // 不压缩html代码
app.use(View('./views', {
    default: 'dust'
}));

/**
 * Start app
 */
if (!module.parent) {
    app.listen(config.app.port);
    console.log("Server started, listening on port: " + config.app.port);
}
console.log("Environment: " + config.app.env);