"use strict";
var co = require('co');
var tools = require('../common/tools');
var ObjectId = require('mongodb').ObjectID;
var ArticleModel = require('../models').ArticleModel;
var TagsModel = require('../models').TagsModel;
var CommentModel = require('../models').CommentsModel;
var marked = require('marked');
var Categories = require('../config/categories');

module.exports = {
    view: function(req, res){
        res.render('./article/post',{
            user: req.session.user || null,
            categories: Categories
        });
    },
    post: function(req, res) {
        var posts = req.body;
        posts.date = new Date();
        posts.uid = req.session.user.uid;
        posts.head = req.session.user.head;
        posts.name = req.session.user.name;

        var tags = posts.tag1.split(',');

        posts.pv = 0;

        co(function *(){
            for(var i = 0; i < tags.length; i++){
                yield TagsModel.findOne({tag: tags[i]}, function(err, tag){
                    if(tag == null){
                        TagsModel.create({tag :tags[i]});
                    }
                });
            }
            yield ArticleModel.create(posts);
            yield res.redirect('/');
        });
    },
    edit: function(req, res){
        var id = new ObjectId(req.params.id);
        co(function *(){
            var post = yield ArticleModel.findOne({_id: id}).exec();
            yield res.render('./article/edit',{
                post: post,
                user: req.session.user || null,
                categories: Categories
            });
        });
    },
    show: function(req, res) {
        var id = new ObjectId(req.params.id);
        co(function *(){
            var post = yield ArticleModel.findOne({_id: id}).exec();
            post.date = tools.formatDate(post.date, true);
            post.post = marked(post.post);
            post.tag = post.tag1.split(',');
            //变更pv
            var comments = yield CommentModel.find({post_id: id}, function(){
                ArticleModel.findByIdAndUpdate({_id: id}, {
                    $inc: {pv: 1}
                }).exec();
            }).exec();

            comments.forEach(function(comment){
                comment.date = tools.formatDate(comment.date, true);
                comment.comment = marked(comment.comment);
            });

            yield res.render('./article/view',{
                post: post,
                comments: comments,
                len: comments.length,
                post_id: id,
                user: req.session.user || null,
                categories: Categories
            });
        });
    },
    del: function(req, res){
        var id = new ObjectId(req.params.id);
        co(function *(){
            yield ArticleModel.findOne({_id: id}).remove();
            yield res.redirect('/');
        });
    },
    update: function(req, res) {
        var id = new ObjectId(req.params.id);
        var posts = req.body;

        var tags = posts.tag1.split(',');
        posts.tag1 = tags;

        co(function *(){
            for(var i = 0; i < tags.length; i++){
                yield TagsModel.findOne({tag: tags[i]}, function(err, tag){
                    if(tag == null){
                        TagsModel.create({tag :tags[i]});
                    }
                });
            }
            yield ArticleModel.findByIdAndUpdate({_id: id}, {
                $set: {
                    title: posts.title,
                    tag1: posts.tag1,
                    post: posts.post,
                    date: new Date(),
                    cate: posts.cate
                }
            }).exec();

            yield res.redirect('/view/' + id);
        });
    },
    upload: function(req, res){
        res.redirect('/post');
    },
    tags: function(req, res){
        var tagName = req.params.tag;
        var pattern = new RegExp(tagName, "i");
        co(function *(){
            yield ArticleModel.find({
                tag1: pattern
            },function(err, list){
                for(var i = 0; i < list.length; i++){
                    list[i].date = tools.formatDate(list[i].date, true);
                    list[i].tag = list[i].tag1.split(',');
                }

                res.render('./article/tags', {
                    user: req.session.user || null,
                    list: list,
                    tagName: tagName,
                    categories: Categories
                });
            });
        });
    },
    search: function(req, res){
        var keywords = req.query.keyword;
        var pattern = new RegExp(keywords, "i");

        co(function *(){
            yield ArticleModel.find({
                title: pattern
            },function(err, list){
                for(var i = 0; i < list.length; i++){
                    list[i].date = tools.formatDate(list[i].date, true);
                    list[i].tag = list[i].tag1.split(',');
                }

                res.render('./article/search', {
                    user: req.session.user || null,
                    list: list,
                    keywords: keywords,
                    categories: Categories
                });
            });
        });
    },
    categories: function(req, res){
        var cateName = req.params.cate;
        var pattern = new RegExp(cateName, "i");

        co(function *(){
            yield ArticleModel.find({
                cate: pattern
            },function(err, list){
                var total = list.length; //总条数
                var limit = 25;
                var page = parseInt(req.query.p) || 1;
                var skip = (page - 1) * limit;
                var pageNum = Math.floor(total/limit) > 1 ? Math.floor(total/limit) : 1;

                for(var i = 0; i < list.length; i++){
                    list[i].date = tools.formatDate(list[i].date, true);
                    list[i].tag = list[i].tag1.split(',');
                }

                res.render('./home', {
                    user: req.session.user || null,
                    list: list,
                    categories: Categories,
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
                        return page < pageNum ? page + 1 : pageNum;
                    }
                });
            });
        });
    }
}