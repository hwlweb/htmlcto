"use strict";

var connectURl = require('../config/mongo_setting');
var mongoose = require('mongoose');
var db;

db = connectURl.connectURl;

mongoose.connect(db, function(err){
    if (err) {
        console.error('connect to %s error: ', db, err.message);
        process.exit(1);
    }
});

require('./schema/article');
require('./schema/user');

module.exports = {
    ArticleModel: mongoose.model('Article'),
    UserModel: mongoose.model('User')
}