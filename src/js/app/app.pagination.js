/*
* @package godofredoninja
*  pagination
*/

$(document).on('ready', function() {
    let page = 2;

    const $pagination   = $('#pagination'),
        pageTotal       = $pagination.attr('mapache-page'),
        pageLimit       = $pagination.attr('mapache-limit'),
        urlPage         = $('link[rel=canonical]').attr('href'),
        $win            = $(window);

    if ( pageTotal >= page) {
        $('.pagination').css('display', 'block');
        infiniteScroll();
    }

    function infiniteScroll() {
        $win.on('scroll', () => {
            if( $win.scrollTop() + $win.height() == $(document).height() ) {

                $pagination.addClass('loanding').html('Loading more');

                if( page <= pageTotal ){
                    getPost();
                }else {
                    $('.pagination').remove();
                }

            }

        });
    }

    function getPost() {
        fetch(urlPage+'page/'+page)
        .then( res => {
            return res.text()
        })
        .then( body => {

            setTimeout( () => {
                let entries = $('.entry-list',body);
                $('#entry').append(entries);
                $pagination.removeClass('loanding').html('Load more');
                page++;
            }, 1000);

        });
    }



});
