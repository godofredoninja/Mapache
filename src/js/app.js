/*
@package godofredoninja

========================================================================
Mapache Javascript Functions
========================================================================
*/

/**
* Table of Contents:
*
*		1. Imports libraris and modules
*      2. variables Globals
*      3. Functions
*      4. Search header
*      5. Opena and close menu mobile
*      6. Video Responsive youtube and vimeo
*      7. header transparent
*      8. Share social
*      9. Share count social media
*      10. Social Link Header
*      11. Disqus Comments
*      12. Mailchimp list
*/


/* 1. Imports and libraris and modules
========================================================================== */
// import zepto        from "./lib/zepto.js";
// import $            from "jQuery";
import prism        from "./lib/prism.js";
import search       from './lib/jquery.ghostHunter.js'
import GodoShare    from './app/app.share';
import shareCount   from './app/app.share-count';
// import Pagination   from './app/app.pagination';
import              '../sass/main.scss';


/* 2. variables globals
========================================================================== */
const $gd_header        = $('#header'),
    $gd_menu            = $('#menu-mobile'),
    $gd_cover           = $('#cover'),
    $gd_search          = $('#header-search'),
    $sidebar_hidden     = $('.sidebar .fixed'),
    $gd_search_input    = $('.search-field'),
    $gd_comments        = $('#comments'),
    $gd_comment_count   = $('.gd-comment_count'),
    $gd_pagination      = $('#pagination'),
    $gd_newsletter      = $('#newsletter'),
    $gd_newsletter_form = $('#newsletter-form'),
    $gd_share_count     = $('.share-count'),
    url_blog            = window.location,
    url_regexp 			= /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

var $document   = $(document),
    $window     = $(window);

var overlay = {
    opacity: 1,
    visibility: 'visible'
};



/* 3. Functions
========================================================================== */
$('#menu-open').on('click', menuOpen);
$('#menu-close').on('click', menuClose);
$('.share').bind('click', Share);
$document.on('mouseup', mouseUp);

$gd_pagination.on('click', pagination);


/* 4. Search open and close
========================================================================== */
$('#search-open').on('click', (e)  => {
    e.preventDefault();
    $gd_header.addClass('responsive-search-open');
    $gd_search_input.focus();
});

$('#search-close').on('click', (e) => {
    e.preventDefault();
    $gd_header.removeClass('responsive-search-open');
});


$gd_search_input
.focus( () => {
    $gd_header.addClass('search-active');
    $('.search-popout').removeClass('closed');
    })
    .blur( () => {
        setTimeout( () => {
            $gd_header.removeClass('search-active');
            $('.search-popout').addClass('closed');
        }, 100);
    })
    .keyup( () =>  {
        $('.search-suggest-results').css('display','block');
    });

$gd_search_input.ghostHunter({
    results             : "#search-results",
    zeroResultsInfo     : false,
    displaySearchInfo   : false,
    result_template     : '<a href="{{link}}">{{title}}</a>',
    onKeyUp             : true,    
})



/* 5. Menu Mobile open and close
========================================================================== */
function menuOpen(e) {
    e.preventDefault();
    $('html').attr('mapache-state','no-scroll');
    $('.overlay').css(overlay);
    $gd_menu.addClass('open');
}

function menuClose(e) {
    e.preventDefault();
    $('html').removeAttr('mapache-state')
    $('.overlay').removeAttr('style');
    $gd_menu.removeClass('open');
}


/* 6. Video Responsive youtube and vimeo
========================================================================== */
$('.post-content').each( function() {
    var selectors = [
        'iframe[src*="player.vimeo.com"]',
        'iframe[src*="youtube.com"]',
        'iframe[src*="youtube-nocookie.com"]',
        'iframe[src*="kickstarter.com"][src*="video.html"]',
    ];

    var $allVideos = $(this).find(selectors.join(','));

    $allVideos.each( function () {
        $(this).wrap('<aside class="video-responsive"></aside>');
    });

});



/* 7. Header box shadow and transparent
========================================================================== */
function headerShadow() {
    if( $gd_cover.length > 0 ) {
        $gd_header.css('background','transparent');

        $(window).scroll( () => {
            let scrollTop         = $(window).scrollTop();
            let gd_cover_height   = $gd_cover.height() - $gd_header.height();
            let gd_cover_wrap     = ( gd_cover_height - scrollTop ) / gd_cover_height;

            if ( scrollTop >= gd_cover_height ) {
                $gd_header
                .addClass('toolbar-shadow')
                .removeAttr('style');
            } else {
                $gd_header
                .removeClass('toolbar-shadow')
                .css({'background':'transparent'});
            }

            if( gd_cover_wrap >= 0 ){
                $('.cover-wrap').css('opacity', gd_cover_wrap);
            }
        });

    }else{
        $gd_header.addClass('toolbar-shadow');
    }
}


/* 8. Share social
========================================================================== */
function Share(e) {
    e.preventDefault();
    let share = new GodoShare($(this));
    share.godoShare();
}

/* 9. Share count social media
======================================================================== */
function shareConter() {
    if ($gd_share_count.length > 0) {
        let share_count = new shareCount($gd_share_count);
        share_count.godoCount();
    }
}


/* 10. Social Link Header
========================================================================== */
function socialLink() {
    if(typeof social_link != 'undefined'){
        $.each( social_link, ( type, url ) => {
            if( typeof url === 'string' && url_regexp.test(url) ){
                let link = `<a title="${type}" href="${url}" target="_blank" class="i-${type}"></a>`;
                $('.header-social').append(link);
            }
        });
    }
}

/* 11. Disqus Comments
========================================================================== */
function disqusComments() {

    if( typeof disqus_shortname != 'undefined' ){
        $gd_comments.removeAttr('style');

        let d = document, s = d.createElement('script');
        s.src = `//${disqus_shortname}.disqus.com/embed.js` ;
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
    }

}

/* 12. Mailchimp list
========================================================================== */
function mailchimp() {
    if( typeof mailchimp_list != 'undefined' ){
        $gd_newsletter.removeAttr('style');
        $gd_newsletter_form.attr( 'action', mailchimp_list );
    }
}

/* 13. Comments Count
========================================================================== */
function commentsCount() {
    if( typeof disqus_shortname != 'undefined' && typeof disqusPublicKey != 'undefined' ){

        $gd_comment_count.each( function() {
            let url = $(this).attr('godo-url');

            $.ajax({
                type: 'GET',
                url: 'https://disqus.com/api/3.0/threads/set.jsonp',
                data: { api_key: disqusPublicKey, forum : disqus_shortname, thread : 'link:' + url },
                cache: false,
                dataType: 'jsonp',
                success:  ( res ) => {
                    for ( let i in res.response ) {
                        let countText = 'Comments';
                        let count = res.response[i].posts;
                        if (count == 1)
                        countText = 'Comment';
                        $(this).html(`${count} <span>${countText}</span>`);
                    }
                }
            });
        });
    }
}



/* 14. scrolltop
========================================================================== */
$('.scrolltop').on('click', function(e) {
    e.preventDefault();
    $('html, body').animate({scrollTop: $($(this).attr('href')).offset().top - 70}, 500, 'linear');
});

/* 15. pagination
========================================================================== */

if ( $gd_pagination.attr('data-page') == 1 ) {
    $gd_pagination.css({'display':'none'});
}

// var page = 2
//
// $gd_pagination.on('click', function(e) {
//     e.preventDefault();
//     var that = $(this);
//     let pageTotal = that.attr('mapache-page');
//     that.addClass('loading').find('.text').slideUp(320);
// 	that.find('.pagination-icon').addClass('spin');
//
//     if ( page <= pageTotal ){
//
//         setTimeout( () => {
//             let  p = new Pagination(that, page);
//             p.pagination();
//             that.removeClass('loading').find('.text').slideDown(320);
//         	that.find('.pagination-icon').removeClass('spin');
//             page++
//         }, 1000);
//
//     }else{
//         that.html('<h3>You reached the end of the line!</h3><p>No more posts to load.');
//     }
// });
var page = 2;
function pagination(e) {
    e.preventDefault();
    let that = $(this);
    let pageTotal = that.data('page');

    that.addClass('loading').find('.text').slideUp(320);
    that.find('.pagination-icon').addClass('spin');

    if( page <= pageTotal ){

        $.get( ( url_blog +'/page/'+page ))
        .done( (res) =>{
            let entries = $('.entry-list',res);
            setTimeout( () => {
                $('#entry').append(entries);
                that.removeClass('loading').find('.text').slideDown(320);
                that.find('.pagination-icon').removeClass('spin');
                page++;
            }, 1000);
        });

    }else{
        that.html('<h3>You reached the end of the line!</h3><p>No more posts to load.');
    }
}






/* Mouse up
========================================================================== */
function mouseUp(e) {
    if($gd_menu.hasClass('open') && $gd_menu.has(e.target).length===0){
        menuClose(e);
    };
}



$document.on('ready', () => {
    headerShadow();
    socialLink();
    shareConter();
    commentsCount();
    if ( $gd_comments.length > 0 ) disqusComments();
    // if ( $gd_newsletter.length > 0 ) mailchimp();
});
