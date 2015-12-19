"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    userId: { type:String},
    ret  : { type:String},
    msg  : { type:String},
    is_lost : { type:String},
    nickname : { type:String},
    gender  : { type:String},
    province  : { type:String},
    city  : { type:String},
    year  : { type:String},
    figureurl  : { type:String},
    figureurl_1  : { type:String},
    figureurl_2  : { type:String},
    figureurl_qq_1  : { type:String},
    figureurl_qq_2  : { type:String},
    is_yellow_vip  : { type:String},
    vip  : { type:String},
    yellow_vip_level  : { type:String},
    level  : { type:String},
    is_yellow_year_vip  : { type:String}
});

mongoose.model('User', UserSchema);