"use strict";
var co = require('co');
var tools = require('../common/tools');
var ObjectId = require('mongodb').ObjectID;
var CommentModel = require('../models').CommentsModel;
var marked = require('marked');

module.exports = {
    comment: function(req, res) {
        var posts = req.body;
        posts.date = new Date();
        posts.uid = req.session.user.uid;
        posts.head = req.session.user.head;
        posts.name = req.session.user.name;

        co(function *(){
            var id = posts.post_id;
            yield CommentModel.create(posts);
            yield res.redirect('/view/' + id);
        });
    }
}