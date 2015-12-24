"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    comment : { type:String},
    post_id : { type:String},
    date  : { type:String},
    uid   : { type:String},
    head  : { type:String},
    name  : { type:String}
});

mongoose.model('Comments', CommentSchema);