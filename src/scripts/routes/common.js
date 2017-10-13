import mapacheSearch from '../app/app.search';
import mapacheFollow from '../app/app.follow';
import mapacheFacebook from '../app/app.facebook';
import mapacheTwitter from '../app/app.twitter';

const $win = $(window);
const $header = $('#header');
const $blogUrl = $('body').attr('mapache-page-url');
const $searchInput = $('.search-field');
const $buttonBackTop = $('.scroll_top');


/**
 * Sticky Navbar in (home - tag - author)
 * Show the button to go back up
 */
function mapacheScroll() {
  $win.on('scroll', function () {
    const scrollTop = $win.scrollTop();
    const coverHeight = $('#cover').height() - $header.height();
    const coverWrap = (coverHeight - scrollTop) / coverHeight;

    // show background in header
    (scrollTop >= coverHeight) ? $header.addClass('toolbar-shadow') : $header.removeClass('toolbar-shadow');

    $('.cover-wrap').css('opacity', coverWrap);

    /* show btn SctrollTop */
    ($(this).scrollTop() > 100) ? $buttonBackTop.addClass('visible') : $buttonBackTop.removeClass('visible');

  });
}


/**
 * Export events
 */
export default {
  init() {
    // Follow Social Media
    if (typeof followSocialMedia !== 'undefined') mapacheFollow(followSocialMedia); // eslint-disable-line

    /* Lazy load for image */
    $('span.lazy').lazyload();
    $('div.lazy').lazyload({effect : 'fadeIn'});
  },
  finalize() {
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

    $('.sidebar-sticky').theiaStickySidebar({
      additionalMarginTop: 66,
    });

    // Twitter and facebook fans page
    if (typeof twitterUserName !== 'undefined' && typeof twitterNumber !== 'undefined') {
      mapacheTwitter(twitterUserName, twitterNumber); // eslint-disable-line
    }

    // Facebook Witget
    if (typeof fansPageName !== 'undefined') mapacheFacebook(fansPageName); // eslint-disable-line

    // Search
    mapacheSearch($header, $searchInput, $blogUrl);

    /**
     * Sticky Navbar in (home - tag - author)
     * Show the button to go back top
     */
    mapacheScroll();
  },
};
