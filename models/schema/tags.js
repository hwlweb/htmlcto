"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TagsSchema = new Schema({
    tag : { type:String}
});

mongoose.model('Tags', TagsSchema);