"use strict";

module.exports = function(app) {
    app.get('/', function(req, res){
        if(req.session.user != null){
            res.render('home', {
                title: '主页',
                user: req.session.user
            });
        }else{
            res.render('home', {
                title: '主页'
            });
        }
        //res.render('home', {
        //    title: '主页'
        //});
    });
}
