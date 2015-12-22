"use strict";

define(function(require, exports) {
    // 代码高亮
    var highlight = function(dom) {
        if(typeof dom == 'string') {
            dom = $(dom);
        }

        dom.each(function(){
            hljs.highlightBlock($(this)[0]);
            var lines = $(this).text().split('\n').length - 1;
            var $numbering = $('<ul/>').addClass('pre-numbering');
            $(this)
                .addClass('has-numbering')
                .parent()
                .append($numbering);
            for(var i = 1; i <= lines; i++){
                $numbering.append($('<li/>').text(i));
            }
        });
    }

    exports.init = function(){
        highlight('#content-box pre code');
    }
});