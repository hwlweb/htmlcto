"use strict";
var path = require("path");
var _ = require("lodash");

var env = process.env.NODE_ENV = process.env.NODE_ENV || "production";

var base = {
    app: {
        root: path.normalize(path.join(__dirname, "/..")),
        env: env
    }
};

var specific = {
    production: {
        app: {
            port: process.env.PORT || 3000,
            name: "Koa React Gulp Mongoose Mocha",
        }
    }
};

module.exports = _.merge(base, specific[env]);
