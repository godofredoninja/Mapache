/*
@package godofredoninja

========================================================================
Mapache Javascript Functions
========================================================================
*/

// import external dependencies
import ghostHunter from './lib/jquery.ghostHunter'; // eslint-disable-line
import stickyKit from './lib/sticky-kit'; // eslint-disable-line
import Prism from './lib/prism'; // eslint-disable-line

// import local dependencies
import Mapache from './app/app.helper';
import Share from './app/app.share';
import Pagination from './app/app.pagination'; // eslint-disable-line

/* variables globals */
const $doc = $(document);
const $win = $(window);

const $comments = $('.post-comments');
const $cover = $('#cover');
const $followBox = $('.social_box');
const $header = $('#header');
const $postBody = $('.post-body');
const $scrollTop = $('.scroll_top');
const $searchInput = $('.search-field');
const $share = $('.share');
const $shareCount = $('.share-count');
const $videoFormatBox = $('#video-format');

const $pageUrl = $('body').attr('mapache-page-url');

const urlRegexp = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \+\.-]*)*\/?$/; // eslint-disable-line

/* Menu open and close for mobile */
$('#nav-mob-toggle').on('click', (e) => {
  e.preventDefault();
  $('body').toggleClass('is-showNavMob');
});

/* Seach open and close for Mobile */
$('#search-mob-toggle').on('click', (e) => {
  e.preventDefault();
  $header.toggleClass('is-showSearchMob');
  $searchInput.focus();
});

/**
 * Search open an close desktop.
 * Api ghost for search
 */
$doc.on('ready', () => {
  $searchInput
    .focus(() => {
      $header.addClass('is-showSearch');
      $('.search-popout').removeClass('closed');
    })
    .blur(() => {
      setTimeout(() => {
        $header.removeClass('is-showSearch');
        $('.search-popout').addClass('closed');
      }, 200);
    })
    .keyup(() => {
      $('.search-suggest-results').css('display', 'block');
    });

  $searchInput.ghostHunter({
    results: '#search-results',
    zeroResultsInfo: false,
    displaySearchInfo: false,
    result_template: `<a href="${$pageUrl}{{link}}">{{title}}</a>`,
    onKeyUp: true,
  });
});

/* Header box shadow and transparent */
function headerBackground() {
  const scrollTop = $win.scrollTop();
  const coverHeight = $cover.height() - $header.height();
  const coverWrap = (coverHeight - scrollTop) / coverHeight;
  if (scrollTop >= coverHeight) {
    $header.addClass('toolbar-shadow').removeAttr('style');
  } else {
    $header.removeClass('toolbar-shadow').css({ background: 'transparent' });
  }
  $('.cover-wrap').css('opacity', coverWrap);
}

/* scroll link width click (ID)*/
$('.scrolltop').on('click', function (e) {
  e.preventDefault();
  $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top - 50 }, 500, 'linear');
});

/* Scroll  */
$scrollTop.on('click', function (e) {
  e.preventDefault();
  $('html, body').animate({ scrollTop: 0 }, 500);
});

/* Disqus Comment */
function disqusComments(shortname) {
  const dsq = document.createElement('script');
  dsq.type = 'text/javascript';
  dsq.async = true;
  dsq.src = `//${shortname}.disqus.com/embed.js`;
  (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
}

/* Video Post Format */
function videoPostFormat() {
  $('.post-image').css('display', 'none');
  const video = $('iframe[src*="youtube.com"]')[0];
  $videoFormatBox.find('.video-featured').prepend(video);

  if (typeof youtubeChannel !== 'undefined') {
    $videoFormatBox.find('.video-content').removeAttr('style');

    $.each(youtubeChannel, (channelName, channelId) => { // eslint-disable-line
      $videoFormatBox.find('.channel-name').html(`Subscribe to <strong>${channelName}</strong>`);
      $('.g-ytsubscribe').attr('data-channelid', channelId);
    });

    const go = document.createElement('script');
    go.type = 'text/javascript';
    go.async = true;
    go.src = 'https://apis.google.com/js/platform.js';
    // document.body.appendChild(go);
    const s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(go, s);
  }
}

// change btn Home
function changeBtnHome(data) {
  const $btnHome = $('#btn-home');
  $.each(data, (title, url) => {
    $btnHome.attr('href', url).html(title);
  });
}


$win.on('scroll', function () {
  /* Add background Header */
  if ($cover.length > 0) headerBackground();

  /* show btn SctrollTop */
  if ($(this).scrollTop() > 100) {
    $scrollTop.addClass('visible');
  } else {
    $scrollTop.removeClass('visible');
  }
});


$doc.on('ready', () => {
  /* Change title home */
  if (typeof homeTitle !== 'undefined') $('#title-home').html(homeTitle); // eslint-disable-line

  /* Change btn Home */
  if (typeof homeBtn !== 'undefined') changeBtnHome(homeBtn); // eslint-disable-line

  /* FollowMe */
  if (typeof followSocialMedia !== 'undefined') Mapache.follow(followSocialMedia, $followBox, urlRegexp); // eslint-disable-line

  /* Facebook Share Count */
  Mapache.facebookShare($shareCount);

  /* Video Post Format*/
  if ($videoFormatBox.length > 0) videoPostFormat();

  /* Video Responsive*/
  Mapache.videoResponsive($postBody);

  /* Share article in Social media */
  $share.bind('click', function (e) {
    e.preventDefault();
    const share = new Share($(this));
    share.mapacheShare();
  });

  /* sticky fixed for Sidenar */
  $('.sidebar-sticky').stick_in_parent({
    offset_top: $header.outerHeight() + 16,
  });

  /* Disqys Comments */
  if (typeof disqusShortName !== 'undefined' && $comments.length > 0) disqusComments(disqusShortName); // eslint-disable-line

  /* Prism autoloader */
  Prism.plugins.autoloader.languages_path = '../assets/js/prism-components/';
});
