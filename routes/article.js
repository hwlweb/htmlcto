"use strict";
var articleController = require('../controllers/article');

module.exports = function(app) {
    app.get('/post', articleController.view);
    app.post('/post', articleController.post);
    app.get('/view/:id', articleController.show);
    app.get('/edit/:id', articleController.edit);
    app.get('/del/:id', articleController.del);
    app.post('/update/:id', articleController.update);
    app.post('/upload', articleController.upload);
    app.get('/tags/:tag', articleController.tags);
}
