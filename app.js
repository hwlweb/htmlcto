"use strict";

/**
 * Dependencies
 */
const express = require('express');
const dustjs = require('adaro');
const path = require('path');
const logger = require('morgan');
const favicon = require('serve-favicon');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

/**
 * Config
 */
const config = require("./config/config");
const routes = require('./routes/index');
const auth = require('./routes/auth');

/**
 * Server
 */
const app = express();
app.proxy = true; // trust proxy

/**
 * middleware
 */
app.set('port', process.env.PORT || 3000);
app.use(favicon(__dirname + '/htdocs/img/favicon.ico'));

/**
 * auth
 */
const passport = require('passport');
app.use(passport.initialize());//初始化 Passport
require('./config/auth_strategy');

/**
 * session
 */
const settings = require('./config/mongo_setting');
app.use(session({
    secret: settings.cookieSecret,
    key: settings.db,//cookie name
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
    store: new MongoStore({
        db: settings.db,
        host: settings.host,
        port: settings.port
    })
}));

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
 * routes
 */
routes(app);
auth(app);

/**
 * Start app
 */
app.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});