import mapacheShare from '../app/app.share';
import mapacheFollow from '../app/app.follow';
import mapacheSearch from '../app/app.search';
import mapacheFooterLinks from '../app/app.footer.links';

// Varibles
const $body = $('body');
const $blogUrl = $body.attr('data-page');
const $seachInput = $('#search-field');
const urlRegexp = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \+\.-]*)*\/?$/; // eslint-disable-line

let didScroll = false;
let lastScrollTop = 0; // eslint-disable-line
let delta = 5;

// Active Scroll
$(window).on('scroll', () => didScroll = true );

export default {
  init() {
    // Change title HOME PAGE
    if (typeof homeTitle !== 'undefined') $('#home-title').html(homeTitle); // eslint-disable-line

    // change BTN ( Name - URL) in Home Page
    if (typeof homeBtnTitle !== 'undefined' && typeof homeBtnURL !== 'undefined') {
      $('#home-button').attr('href', homeBtnURL).html(homeBtnTitle); // eslint-disable-line
    }

    // Follow me
    if (typeof followSocialMedia !== 'undefined') mapacheFollow(followSocialMedia, urlRegexp); // eslint-disable-line

    /* Footer Links */
    if (typeof footerLinks !== 'undefined') mapacheFooterLinks (footerLinks, urlRegexp); // eslint-disable-line

    /* Lazy load for image */
    $('.cover-lazy').lazyload({effect : 'fadeIn'});
    $('.story-image-lazy').lazyload({threshold : 200});
  }, // end Init

  finalize() {
    /* Menu open and close for mobile */
    $('.menu--toggle').on('click', (e) => {
      e.preventDefault();
      $body.toggleClass('is-showNavMob').removeClass('is-search');
    });

    /* rocket to the moon (retur TOP HOME) */
    // $('.rocket').on('click', function (e) {
    //   e.preventDefault();
    //   $('html, body').animate({scrollTop: 0}, 250);
    // });

    /* Share article in Social media */
    $('.mapache-share').bind('click', function (e) {
      e.preventDefault();
      const share = new mapacheShare($(this));
      share.share();
    });

    /* Toggle show more social media */
    $('.follow-toggle').on('click', (e) => {
      e.preventDefault();
      $body.toggleClass('is-showFollowMore');
    });

    /* scroll link width click (ID)*/
    $('.scrolltop').on('click', function (e) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top - 60 }, 500, 'linear');
    });

    /* Modal Open for susbscribe */
    $('.modal-toggle').on('click', e => {
      e.preventDefault();
      $body.toggleClass('has-modal');
    });

    /* sicky sidebar */
    $('.sidebar-sticky').theiaStickySidebar({additionalMarginTop: 70});

    // show comments count of disqus
    if (typeof disqusShortName !== 'undefined') $('.mapache-disqus').removeClass('u-hide');

    // functions that are activated when scrolling
    function hasScrolled() {
      const st = $(window).scrollTop();

      // Make sure they scroll more than delta
      if(Math.abs(lastScrollTop - st) <= delta) {
        return;
      }

      // show background and transparency
      // in header when page hace cover image
      if (st >= 50) {
        $('body.has-cover').removeClass('is-transparency');
      } else {
        $('body.has-cover').addClass('is-transparency');
      }

      lastScrollTop = st;
    }

    setInterval(() => {
      if (didScroll) {
        hasScrolled();
        didScroll = false;
      }
    }, 500);

    // Search
    mapacheSearch($seachInput, $blogUrl);

    /* show btn for Retur TOP PAGE */
    // setInterval( () => {
    //   ($(window).scrollTop() > 100) ? $('.rocket').removeClass('u-hide') : $('.rocket').addClass('u-hide');
    // }, 250);

  }, //end => Finalize
};
