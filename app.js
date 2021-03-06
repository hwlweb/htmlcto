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
const bodyParser = require('body-parser');
/**
 * Server
 */
const app = express();
app.proxy = true; // trust proxy

/**
 * middleware
 */
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'htdocs'))); //静态文件目录
app.use(favicon(__dirname + '/htdocs/img/favicon.ico'));
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * uploads
 */
var multer  = require('multer');
app.use(multer({
    dest: './htdocs/img/uploads',
    rename: function (fieldname, filename) {
        return filename;
    }
}));

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
// 当有错误发生时，就将错误信息保存到了根目录下的 error.log 文件夹里。
app.use(logger({stream: accessLog}));
var fs = require('fs');
var accessLog = fs.createWriteStream('access.log', {flags: 'a'});
var errorLog = fs.createWriteStream('error.log', {flags: 'a'});
app.use(function (err, req, res, next) {
    var meta = '[' + new Date() + '] ' + req.url + '\n';
    errorLog.write(meta + err.stack + '\n');
    next();
});

/**
 * routes
 */
const routes = require('./routes/index');
const auth = require('./routes/auth');
const article = require('./routes/article');
const comment = require('./routes/comments');
routes(app);
auth(app);
article(app);
comment(app);

//捕获404错误，并转发到错误处理器。
app.use(function(req, res, next) {
    res.statusCode = "404";
    res.render('404');
});

//开发环境下的错误处理器，将错误信息渲染error模版并显示到浏览器中。
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
//生产环境下的错误处理器，将错误信息渲染error模版并显示到浏览器中。
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


/**
 * Start app
 */
app.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
