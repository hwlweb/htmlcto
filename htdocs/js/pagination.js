function pagination(){
    var searchUrl = window.location.search.split('?')[1];
    var currentPage = searchUrl.split('=')[1];
    $('.pagination').find('li').each(function () {
        var page = $(this).data('page');
        if(currentPage == page){
            $(this).addClass('active');
        }
    })
}

pagination();