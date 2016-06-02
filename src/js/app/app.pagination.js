$(document).on('ready', function() {
    let page = 2
    const $pagination = $('#pagination');

    /**
     * If not exist pagination remove element
     */
    if ( $pagination.attr('mapache-page') == 1) {
        $pagination.remove();
    }

    $pagination.on('click', function(e) {
        e.preventDefault();
        let that = $(this);
        const pageTotal = that.attr('mapache-page'),
            pageLimit   = that.attr('mapache-limit'),
            urlPage     = $('link[rel=canonical]').attr('href'),
            url         = urlPage+'/page/'+page;

        that.addClass('loading').find('.text').slideUp(320);
        that.find('.pagination-icon').addClass('spin');

        if( page <= pageTotal ){

            fetch(url)
            .then( res => {
                return res.text()
            })
            .then( body => {

                setTimeout( () => {
                    let entries = $('.entry-list',body);
                    $('#entry').append(entries);
                    that.removeClass('loading').find('.text').slideDown(320);
                    that.find('.pagination-icon').removeClass('spin');
                    page++;
                }, 800);

            });

        }else {
            that.html('<h3>You reached the end of the line!</h3><p>No more posts to load.');
        }

    });
});
