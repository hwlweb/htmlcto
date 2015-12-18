"use strict";
const passport = require('passport');

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
                    //写入session
                    req.session.user = {name: userMsg.nickname, head: userMsg.figureurl_qq_2};
                }
            }
            // Successful authentication, redirect home.
            res.redirect('/');

        });
}
