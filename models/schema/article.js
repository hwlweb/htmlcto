"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title : { type:String},
    post  : { type:String},
    date  : { type:String},
    tag1  : { type:String},
    uid   : { type:String},
    head  : { type:String}
});

mongoose.model('Article', ArticleSchema);