"use strict";
var commentController = require('../controllers/comments');

module.exports = function(app) {
    app.post('/comment', commentController.comment);
}
