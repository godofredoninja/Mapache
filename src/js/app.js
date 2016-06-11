/*
@package godofredoninja

========================================================================
Mapache Javascript Functions
========================================================================
*/

/**
* Table of Contents:
*
*       1. Imports libraris and modules
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
*/


/* 1. Imports and libraris and modules
====================================================================== */
// import zepto        from "./lib/zepto.js";
// import $            from "jQuery";
import prism            from "./lib/prism.js";
import search           from './lib/jquery.ghostHunter.js'
import mapacheShare     from './app/app.share';
import shareCount       from './app/app.share-count';
import pagination       from './app/app.pagination';
import mapacheRelated   from './app/app.related.post';

// import              '../sass/main.scss';



(function() {

    /* 2. variables globals */
    const $gd_header        = $('#header'),
        $gd_menu            = $('#menu-mobile'),
        $gd_cover           = $('#cover'),
        $gd_search_btn      = $('#search-btn'),
        $gd_search          = $('#header-search'),
        $gd_search_input    = $('.search-field'),
        $gd_comments        = $('#comments'),
        $gd_related         = $('#related'),
        $gd_comment_count   = $('.gd-comment_count'),
        $gd_share_count     = $('.share-count'),
        $gd_video           = $('#video-format'),
        $gd_sidebar_fixed    = $('#sidebar').find('.fixed'),

        url_regexp 			= /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

    var $document   = $(document),
        $window     = $(window);

    var overlay = {
        opacity: 1,
        visibility: 'visible'
    };

    /**
     * Post related
     */
    $document.on('ready', () =>{
        if ($gd_related.length > 0) {
            let related = new mapacheRelated($gd_related);
            related.mapacheGet();
        }
    });



    /**
     * Functions
     */
    $('.share').bind('click', shareSocial);
    $document.on('mouseup', mouseUp);

    /**
     * menu Mobile open
     */
    $('#menu-open').on('click', e => {
        e.preventDefault();
        $('html').attr('mapache-state','no-scroll');
        $('.overlay').css(overlay);
        $gd_menu.addClass('open');
    });

    /**
     * Menu Close Mobile
     */
    function menuClose(e) {
        e.preventDefault();
        $('html').removeAttr('mapache-state');
        $('.overlay').removeAttr('style');
        $gd_menu.removeClass('open');
    }

    /**
     *  Functions MouseUp
     */
    function mouseUp(e) {
        if( $gd_menu.hasClass('open') && $gd_menu.has(e.target).length === 0 ){
            menuClose(e);
        }
    }

    /**
     *  Search Open and close mobile
     */
    $gd_search_btn.on('click', function(e) {
        e.preventDefault();
        $(this).toggleClass('i-search');
        $gd_header.toggleClass('responsive-search-open');
        $gd_search_input.focus();
    });

    /**
     * Search open an close desktop.
     * Api ghost for search
     */
    $document.on('ready', () => {

        $gd_search_input.focus( () => {
            $gd_header.addClass('search-active');
            $('.search-popout').removeClass('closed');
        });

        $gd_search_input.blur( () => {
            setTimeout( () => {
                $gd_header.removeClass('search-active');
                $('.search-popout').addClass('closed');
            }, 100);
        });

        $gd_search_input.keyup( () =>  {
            $('.search-suggest-results').css('display','block');
        });

        $gd_search_input.ghostHunter({
            results             : "#search-results",
            zeroResultsInfo     : false,
            displaySearchInfo   : false,
            result_template     : '<a href="{{link}}">{{title}}</a>',
            onKeyUp             : true,
        });

    });

    /**
     * Header box shadow and transparent
     */
    $document.on('ready', () => {

       if( $gd_cover.length > 0 ) {
            $gd_header.css('background','transparent');
            $window.on('scroll', coverScroll);
        }else{
            $gd_header.addClass('toolbar-shadow');
        }

        function coverScroll(){
            let scrollTop         = $window.scrollTop(),
                gd_cover_height   = $gd_cover.height() - $gd_header.height(),
                gd_cover_wrap     = ( gd_cover_height - scrollTop ) / gd_cover_height;

            if ( scrollTop >= gd_cover_height ) {
                $gd_header.addClass('toolbar-shadow').removeAttr('style');
            } else {
                $gd_header.removeClass('toolbar-shadow').css({'background':'transparent'});
            }

            $('.cover-wrap').css('opacity', gd_cover_wrap);

        }
    });

    /**
     * Video Full for post tag video
     */
    function videoPost() {
        $('.post-image').css('display', 'none');
        let video = $('iframe[src*="youtube.com"]')[0];
        $gd_video.find('.video-featured').prepend(video);

        if( typeof youtube != 'undefined' ){
            $gd_video.find('.video-content').removeAttr('style');

            $.each( youtube, ( channelName, channelId ) => {
                $gd_video.find('.channel-name').html(`Subscribe to <strong>${channelName}</strong>`);
                $('.g-ytsubscribe').attr('data-channelid', channelId)
            });

            let s = document.createElement("script");
            s.src='https://apis.google.com/js/platform.js';
            document.body.appendChild(s);
        }
    }

     /**
     * Video Responsive Youtube
     */
    function videoResponsive() {
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
    }


    /**
     * Share Social
     */
    function shareSocial(e) {
        e.preventDefault();
        let share = new mapacheShare($(this));
        share.godoShare();
    }

    /**
     * Share Social Count
     */
    function shareConter() {
        if ($gd_share_count.length > 0) {
            let share_count = new shareCount($gd_share_count);
            share_count.godoCount();
        }
    }

    /**
     * Header Social Links
     */
    function socialLink(links) {
        $.each( links, ( type, url ) => {
            if( typeof url === 'string' && url_regexp.test(url) ){
                let template = `<a title="${type}" href="${url}" target="_blank" class="i-${type}"></a>`;
                $('.header-social').append(template);
            }
        });
    }

    /**
     * Disqus Comment
     */
    function disqusComments () {
        if(typeof disqus_shortname != 'undefined'){
            $gd_comments.removeAttr('style');
            let d = document, s = d.createElement('script');
            s.src = `//${disqus_shortname}.disqus.com/embed.js` ;
            s.setAttribute('data-timestamp', +new Date());
            (d.head || d.body).appendChild(s);
        }
    }

    /**
     * Comments Count Disqus
     */
    function commentsCount() {
        $gd_comment_count.each( function() {
            let url = $(this).attr('godo-url');
            $.ajax({
                type: 'GET',
                url: 'https://disqus.com/api/3.0/threads/set.jsonp',
                data: { api_key: disqusPublicKey, forum : disqus_shortname, thread : 'link:' + url },
                cache: false,
                dataType: 'jsonp',

                success:  ( commet ) => {
                    for ( let i in commet.response ) {
                        let countText = 'Comments';
                        let count = commet.response[i].posts;
                        if (count == 1)
                        countText = 'Comment';
                        $(this).html(`${count} <span>${countText}</span>`);
                    }
                }
            });
        });
    }

    /**
     * Scroll btn link
     */
    $('.scrolltop').on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({scrollTop: $($(this).attr('href')).offset().top - 70}, 500, 'linear');
    });


    /**
     * Move excerpt
     */
    if ( $('p.excerpt').length > 0) {
        $('p.excerpt').insertAfter($('h1.title'));
    }

    // sidebar hidden aside
    function sidebarFixed() {
        let mela  = $gd_sidebar_fixed.offset().top;
        $window.on('scroll', () => {
            let scrollTop = $window.scrollTop();
            if ( scrollTop > mela - 78) {
                $gd_sidebar_fixed.addClass('active');
            }else{
                $gd_sidebar_fixed.removeClass('active');
            }
        });
    }


    $document.on('ready', () => {
        shareConter();
        if( typeof social_link != 'undefined' ) socialLink(social_link);
        if( $gd_comments.length > 0 ) disqusComments();
        if( typeof disqus_shortname != 'undefined' && typeof disqusPublicKey != 'undefined' ) commentsCount();
        if( $gd_video.length > 0 ) videoPost();
        videoResponsive();
        if ($gd_sidebar_fixed.length > 0) sidebarFixed();
    });

})();
