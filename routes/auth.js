"use strict";
const passport = require('passport');
const userModel = require('../models').UserModel;

module.exports = function(app) {
    app.get('/auth/qq',
        passport.authenticate('qq' ,{session: false}),
        function(req, res){
            // The request will be redirected to qq for authentication, so this
            // function will not be called.
        });

    app.get('/auth/qq/callback',
        passport.authenticate('qq', {
            failureRedirect: '/login',
            session: false
        }), function(req, res) {
            if(res.req.user) {
                var userMsg = res.req.user._json;
                if (userMsg) {
                    //存储用户
                    userMsg.userId = res.req.user.id;
                    userModel.findOne({userId: res.req.user.id}, function(err, user){
                        if(user == null){
                            userModel.create(userMsg);
                        }
                    });
                    //写入session
                    req.session.user = {name: userMsg.nickname, head: userMsg.figureurl_qq_2, uid: res.req.user.id};
                }
            }
            // Successful authentication, redirect home.
            res.redirect('/');

        });

    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

    app.get('/profile', ensureAuthenticated, function(req, res){
        res.render('profile', { user: req.session.user });
    });

    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) { return next(); }
        res.redirect('/login')
    }
}


