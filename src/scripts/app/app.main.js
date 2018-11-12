// Impornt
import mapacheShare from './app.share';

(function () {
  // Varibles
  const globalBlogUrl = blogUrl; // eslint-disable-line
  const $body = $('body');
  // const $seachInput = $('#search-field');

  // let loadGhostHunter = true;
  let didScroll = false;
  let lastScrollTop = 0; // eslint-disable-line
  let delta = 5;

  // Active Scroll
  $(window).on('scroll', () => didScroll = true );

  /* Menu open and close for mobile */
  $('.menu--toggle').on('click', (e) => {
    e.preventDefault();
    $body.toggleClass('is-showNavMob').removeClass('is-search');
  });

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

  /* Modal Open for susbscribe */
  $('.modal-toggle').on('click', e => {
    e.preventDefault();
    $body.toggleClass('has-modal');
  });

  /* scroll link width click (ID)*/
  $('.scrolltop').on('click', function (e) {
    e.preventDefault();
    $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top - 60 }, 500, 'linear');
  });

  /* Search Template */
  // const searchTemplate = `
  // <a class="u-block" href="${globalBlogUrl}{{link}}">
  //   <span class="u-contentTitle u-fontSizeBase">{{title}}</span>
  //   <span class="u-block u-fontSizeSmaller u-textColorNormal u-paddingTop5">{{pubDate}}</span>
  // </a>`;

  /* Toggle card for search Search */
  $('.search-toggle').on('click', (e) => {
    e.preventDefault();
    $('body').toggleClass('is-search').removeClass('is-showNavMob');
  });

  // Open Post Comments
  $('.toggle-comments').on('click', function (e) {
    e.preventDefault();
    $('body').toggleClass('has-comments').removeClass('is-showNavMob')
  });

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

}());
