import zepto from "./lib/zepto.js";
import prism from "./lib/prism.js";
import '../sass/main.scss';


/* variables
========================================================================== */
const $gd_header      = $('#header'),
    $gd_menu          = $('#menu-mobile'),
    $gd_cover         = $('.godo-cover'),
    // $gd_search_open   = $('#search-open'),
    // $gd_search_close  = $('#search-close'),
    $gd_search        = $('#header-search'),
    $sidebar_hidden   = $('.sidebar .fixed'),
    $gd_search_input  = $('.search-field');

var overlay = {
    opacity: 1,
    visibility: 'visible'
};


/* Functions
========================================================================== */
$('#menu-open').on('click', menuOpen);
$('#menu-close').on('click', menuClose);

/* Search open and close
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




$(document).on('mouseup', mouseUp);
$(window).on('resize', resizeHeight);

// Mouse up
function mouseUp(e) {
    if($gd_menu.hasClass('open') && $gd_menu.has(e.target).length===0){
        menuClose(e);
    };
}

// Menu open
function menuOpen(e) {
    e.preventDefault();
    $('html').attr('godo-state','no-scroll');
    $('.overlay').css(overlay);
    $gd_menu.addClass('open');
}

// Menu Close
function menuClose(e) {
    e.preventDefault();
    $('html').removeAttr('godo-state')
    $('.overlay').removeAttr('style');
    $gd_menu.removeClass('open');
}



// Video Responsive Youtube & Vimeo
$('.post-content').each(function(){
    var selectors = [
        'iframe[src*="player.vimeo.com"]',
        'iframe[src*="youtube.com"]',
        'iframe[src*="youtube-nocookie.com"]',
        'iframe[src*="kickstarter.com"][src*="video.html"]',
    ];

    var $allVideos = $(this).find(selectors.join(','));

    $allVideos.each(function(){
        $(this).wrap('<aside class="video-responsive"></aside>');
    });

});


function resizeHeight() {
    // Resize error page 404
    if ($('#error').length > 0 ) {
        $('#error').height($(window).height() - $('#footer').height());
    }
}

// Header box shadow and transparent
if($gd_cover.length > 0) {
    $gd_header.css({'background':'transparent'});

    $(window).scroll(function(){
        var scrollTop         = $(window).scrollTop();
        var gd_cover_height   = $gd_cover.height();
        var gd_cover_wrap     = (gd_cover_height - scrollTop) / gd_cover_height;

        if (scrollTop >= gd_cover_height ) {
            $gd_header
            .addClass('toolbar-shadow')
            .removeAttr('style');
        }else {
            $gd_header
            .removeClass('toolbar-shadow')
            .css({'background':'transparent'});
        }

        if(gd_cover_wrap >= 0){
            $('.godo-cover-wrap').css('opacity', gd_cover_wrap);
        }

    });

}else{
    $gd_header.addClass('toolbar-shadow');
}


// sidebar hidden aside
if ($sidebar_hidden.length > 0) {
    var mela  = $sidebar_hidden.offset().top;
    $(window).scroll(function(){
        var scrollTop           = $(window).scrollTop();

        if (scrollTop >= mela - 80) {
            $sidebar_hidden.css({'position':'fixed','top': '80px', 'width':'300px'});
        }else {
            $sidebar_hidden.removeAttr('style');
        }
    });
}


resizeHeight();

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
