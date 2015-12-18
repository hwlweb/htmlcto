"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title : { type:String },
    post  : { type:String},
    date  : { type:String }
});

mongoose.model('Article', ArticleSchema);