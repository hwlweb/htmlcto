"use strict";
var articleController = require('../controllers/article');

module.exports = function(app) {
    app.get('/post', articleController.view);
    app.post('/post', articleController.post);
    app.get('/edit/:id', articleController.edit);
}
