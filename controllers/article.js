"use strict";
var co = require('co');
var tools = require('../common/tools');
var ObjectId = require('mongodb').ObjectID;
var ArticleModel = require('../models').ArticleModel;
var TagsModel = require('../models').TagsModel;
var CommentModel = require('../models').CommentsModel;
var marked = require('marked');

module.exports = {
    view: function(req, res){
        res.render('./article/post',{
            user: req.session.user
        });
    },
    post: function(req, res) {
        var posts = req.body;
        posts.date = new Date();
        posts.uid = req.session.user.uid;
        posts.head = req.session.user.head;
        posts.name = req.session.user.name;

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
                user: req.session.user
            });
        });
    },
    show: function(req, res) {
        var id = new ObjectId(req.params.id);
        co(function *(){
            var post = yield ArticleModel.findOne({_id: id}).exec();
            post.date = tools.formatDate(post.date, true);
            post.post = marked(post.post);

            var comments = yield CommentModel.find({post_id: id}).exec();
            comments.forEach(function(comment){
                comment.date = tools.formatDate(comment.date, true);
                comment.comment = marked(comment.comment);
            });

            yield res.render('./article/view',{
                post: post,
                comments: comments,
                len: comments.length,
                post_id: id,
                user: req.session.user
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
                    date: new Date()
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
        var tagList = [];
        co(function *(){
            yield ArticleModel.find({},function(err, list){
                list.forEach(function(items){
                    var tag = items.tag1;
                    if(tag.indexOf(tagName) != -1){
                        tagList.push(items);
                    }
                });

                for(var i = 0; i < tagList.length; i++){
                    tagList[i].date = tools.formatDate(tagList[i].date, true);
                }

                if(req.session.user != null){
                    res.render('./article/tags', {
                        user: req.session.user,
                        list: tagList,
                        tagName: tagName
                    });
                }
            });
        });
    }
}