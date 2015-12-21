"use strict";
var co = require('co');
var tools = require('../common/tools');
var ArticleModel = require('../models').ArticleModel;

module.exports = {
    home: function(req, res){
        co(function *(){
            var list = yield ArticleModel.find().limit(25).sort({date: -1});
            for(var i = 0; i < list.length; i++){
                list[i].date = tools.formatDate(list[i].date, true);
            }
            if(req.session.user != null){
                yield res.render('home', {
                    title: '主页',
                    user: req.session.user,
                    list: list
                });
            }else{
                yield res.render('home', {
                    title: '主页',
                    list: list
                });
            }
        });
    }
}