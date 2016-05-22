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
 */


/* 1. Imports and libraris and modules
========================================================================== */
import zepto        from "./lib/zepto.js";
// import $            from "jquery";
import prism        from "./lib/prism.js";
import GodoShare    from './app/app.share';
import shareCount   from './app/app.share-count';
import              '../sass/main.scss';


/* 2. variables globals
========================================================================== */
const $gd_header      = $('#header'),
    $gd_menu          = $('#menu-mobile'),
    $gd_cover         = $('#cover'),
    $gd_search        = $('#header-search'),
    $sidebar_hidden   = $('.sidebar .fixed'),
    $gd_search_input  = $('.search-field'),
    $gd_share_count   = $('.share-count');

var overlay = {
    opacity: 1,
    visibility: 'visible'
};

const url_regexp = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

/* 3. Functions
========================================================================== */
$('#menu-open').on('click', menuOpen);
$('#menu-close').on('click', menuClose);
$('.share').bind('click', Share);
$(document).on('mouseup', mouseUp);


/* 4. Search open and close
========================================================================== */
$('#search-open').on('click', (e)  => {
    e.preventDefault();
    $gd_header.addClass('search-open-form');
});

$('#search-close').on('click', (e) => {
    e.preventDefault();
    $gd_header.removeClass('search-open-form');
});


$gd_search_input
    .focus( () => {
        $gd_search.addClass('has-focus');
        $('.header-navigation').css({display:'none'});
    })
    .blur( () => {
        $gd_search.removeClass('has-focus');
        $('.header-navigation').removeAttr('style');
    });


/* 5. Menu Mobile open and close
========================================================================== */
function menuOpen(e) {
    e.preventDefault();
    $('html').attr('godo-state','no-scroll');
    $('.overlay').css(overlay);
    $gd_menu.addClass('open');
}

function menuClose(e) {
    e.preventDefault();
    $('html').removeAttr('godo-state')
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
if( $gd_cover.length > 0 ) {
    $gd_header.css({'background':'transparent'});

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


/* 8. Share social
========================================================================== */
function Share(e) {
	e.preventDefault();
	let share = new GodoShare($(this));
	share.godoShare();
}

/* 9. Share social count
======================================================================== */
if ($gd_share_count.length > 0) {
    let share_count = new shareCount($gd_share_count);
    share_count.godoCount();
}


/* 10. Social Link Header
========================================================================== */
if(typeof social_link != 'undefined'){
    $.each( social_link, ( type, url ) => {
        if( typeof url === 'string' && url_regexp.test(url) ){
            let link = `<a title="${type}" href="${url}" target="_blank" class="i-${type}"></a>`;
            $('.header-social').append(link);
        }
    });
}

/* 10. Disqus Comments 
========================================================================== */



/* Mouse up
========================================================================== */
function mouseUp(e) {
    if($gd_menu.hasClass('open') && $gd_menu.has(e.target).length===0){
        menuClose(e);
    };
}


// sidebar hidden aside
// if ($sidebar_hidden.length > 0) {
//     var mela  = $sidebar_hidden.offset().top;
//     $(window).scroll(function(){
//         var scrollTop           = $(window).scrollTop();
//
//         if (scrollTop >= mela - 80) {
//             $sidebar_hidden.css({'position':'fixed','top': '80px', 'width':'300px'});
//         }else {
//             $sidebar_hidden.removeAttr('style');
//         }
//     });
// }



// Plugins

//  Search results ghostHunter
// $gd_search_input.ghostHunter({
//   results: '#search-result',
//   zeroResultsInfo   : false,
//   displaySearchInfo : false,
//   result_template   : '<a href={{link}}">{{title}}</a>',
//   onKeyUp           : true,
//   rss               : "/rss"
// });

// lazy load img
// var myLazyLoad = new LazyLoad();
