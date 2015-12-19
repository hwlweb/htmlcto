"use strict";
var co = require('co');
var tools = require('../common/tools');
var ObjectId = require('mongodb').ObjectID;
var ArticleModel = require('../models').ArticleModel;

module.exports = {
    view: function(req, res){
        res.render('./article/post');
    },
    post: function(req, res) {
        var posts = req.body;
        posts.date = new Date();
        posts.uid = req.session.user.uid;
        posts.head = req.session.user.head;

        co(function *(){
            yield ArticleModel.create(posts);
            yield res.redirect('/');
        });
    },
    edit: function(req, res){
        var id = new ObjectId(req.params.id);
        co(function *(){
            var post = yield ArticleModel.findOne({_id: id}).exec();
            yield res.render('./article/edit',{
                post: post
            });
        });
    },
    show: function(req, res) {
        var id = new ObjectId(req.params.id);
        co(function *(){
            var post = yield ArticleModel.findOne({_id: id}).exec();
            post.date = tools.formatDate(post.date, true);
            yield res.render('./article/view',{
                post: post
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

        co(function *(){
            yield ArticleModel.findByIdAndUpdate({_id: id}, {
                $set: {
                    title: posts.title,
                    tag1: posts.tag1,
                    post: posts.post,
                    date: new Date()
                }
            }).exec();

            yield res.redirect('/');
        });
    }
}