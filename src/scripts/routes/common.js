import Share from '../app/app.share';

const $win = $(window);
const $header = $('#header');
const $searchInput = $('.search-field');
const $pageUrl = $('body').attr('mapache-page-url');
const $buttonBackTop = $('.scroll_top');
const urlRegexp = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \+\.-]*)*\/?$/; // eslint-disable-line


/**
 * Sticky Navbar in (home - tag - author)
 * Show the button to go back up
 */
const windowScroll = $win.on('scroll', function () {
  const scrollTop = $win.scrollTop();
  const coverHeight = $('#cover').height() - $header.height();
  const coverWrap = (coverHeight - scrollTop) / coverHeight;

  // show background in header
  (scrollTop >= coverHeight) ? $header.addClass('toolbar-shadow') : $header.removeClass('toolbar-shadow');

  $('.cover-wrap').css('opacity', coverWrap);

  /* show btn SctrollTop */
  ($(this).scrollTop() > 100) ? $buttonBackTop.addClass('visible') : $buttonBackTop.removeClass('visible');

});

// Search
function searchGhostHunter () {
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
  })
  .ghostHunter({
    results: '#search-results',
    zeroResultsInfo: false,
    displaySearchInfo: false,
    result_template: `<a href="${$pageUrl}{{link}}">{{title}}</a>`,
    onKeyUp: true,
  });
}


/**
 * Export events
 */
export default {
  init() {

    // Follow Social Media
    if (typeof followSocialMedia !== 'undefined') {
      $.each(followSocialMedia, (name, url) => { // eslint-disable-line
        if (typeof url === 'string' && urlRegexp.test(url)) {
          const template = `<a title="Follow me in ${name}" href="${url}" target="_blank" class="i-${name}"></a>`;
          $('.social_box').append(template);
        }
      });
    }

    /* Lazy load for image */
    $('span.lazy').lazyload();
    $('div.lazy').lazyload({
      effect : 'fadeIn',
    });

    /* sticky fixed for Sidenar */
    $('.sidebar-sticky').stick_in_parent({
      offset_top: 66,
    });

  },
  finalize() {
    // JavaScript to be fired on all pages, after page specific JS is fired

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

    // Search function
    searchGhostHunter ();

    /* scroll link width click (ID)*/
    $('.scrolltop').on('click', function (e) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top - 50 }, 500, 'linear');
    });

    // button back top
    $buttonBackTop.on('click', function (e) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: 0 }, 500);
    });

    /* Share article in Social media */
    $('.share').bind('click', function (e) {
      e.preventDefault();
      const share = new Share($(this));
      share.mapacheShare();
  });

    /**
     * Sticky Navbar in (home - tag - author)
     * Show the button to go back top
     */
    windowScroll ();

  },
};
