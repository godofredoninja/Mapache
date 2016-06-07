$(document).on('ready', function() {
    let page = 2
    const $pagination = $('#pagination');

    /**
     * If not exist pagination remove element
     */
    if ( $pagination.attr('mapache-page') == 1) {
        $('.pagination').remove();
    }

    $pagination.on('click', function(e) {
        e.preventDefault();
        let that = $(this);
        const pageTotal = that.attr('mapache-page'),
            pageLimit   = that.attr('mapache-limit'),
            urlPage     = $('link[rel=canonical]').attr('href'),
            url         = urlPage+'/page/'+page;

        that.addClass('loanding').html('Loading more');

        if( page <= pageTotal ){

            fetch(url)
            .then( res => {
                return res.text()
            })
            .then( body => {

                setTimeout( () => {
                    let entries = $('.entry-list',body);
                    $('#entry').append(entries);
                    that.removeClass('loanding').html('Load more');
                    page++;
                }, 1000);

            });

        }else {
            $('.pagination').css('display','none');
        }

    });
});
