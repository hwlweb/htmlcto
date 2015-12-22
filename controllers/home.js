"use strict";
var co = require('co');
var tools = require('../common/tools');
var ArticleModel = require('../models').ArticleModel;

module.exports = {
    home: function(req, res){
        co(function *(){
            var total = yield  ArticleModel.count(); //总条数
            var limit = 25;
            var page = parseInt(req.query.p) || 1;
            var skip = (page - 1) * limit;
            var pageNum = Math.floor(total/limit) > 1 ? Math.floor(total/limit) : 1;
            var list = yield ArticleModel.find().skip( skip ).limit( limit ).sort({date: -1});
            for(var i = 0; i < list.length; i++){
                list[i].date = tools.formatDate(list[i].date, true);
            }
            if(req.session.user != null){
                yield res.render('home', {
                    title: '主页',
                    user: req.session.user,
                    list: list,
                    page: function(){
                        var pageList = [];
                        for(i = 1 ; i <= pageNum; i++){
                            pageList.push(i);
                        }
                        return pageList;
                    },
                    isFirstPage: function(){
                        return page - 1 == 0 ? true : false;
                    },
                    isLastPage: function(){
                        return ((page - 1) * 10 + list.length) == total ? true : false;
                    },
                    prev: function(){
                        return page > 1 ? page - 1 : 1;
                    },
                    next: function(){
                        return page < total ? page + 1 : total;
                    }
                });
            }
        });
    }
}