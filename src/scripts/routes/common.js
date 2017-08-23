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
let windowScroll = $win.on('scroll', function () {
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

// Facebook widtget
function widgetFacebook () {
  if (typeof fansPageName !== 'undefined') {
    $('.widget-facebook').parent().removeClass('u-hide');
    const fansPage = `<div class="fb-page" data-href="https://www.facebook.com/${fansPageName}" data-tabs="timeline" data-small-header="false" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="false">`; // eslint-disable-line

    let facebookSdkScript = `<div id="fb-root"></div>
      <script>(function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.async=true;
        js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.10";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));</script>`;

    $('body').append(facebookSdkScript);
    $('.widget-facebook').html(fansPage);
  }
}

// Twitter Widtget
function widgetTwitter () {
  $('.widget-twitter').parent().removeClass('u-hide');
  if (typeof twitterUserName !== 'undefined' && typeof twitterNumber !== 'undefined') {
    const twitterBlock = `<a class="twitter-timeline"  href="https://twitter.com/${twitterUserName}" data-chrome="nofooter noborders noheader" data-tweet-limit="${twitterNumber}">Tweets by ${twitterUserName}</a><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>`; // eslint-disable-line
    $('.widget-twitter').html(twitterBlock);
  }
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

    // Twitter and facebook fans page
    widgetTwitter ();
    widgetFacebook ();

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

    /* Share article in Social media */
    $('.share').bind('click', function (e) {
      e.preventDefault();
      const share = new Share($(this));
      share.mapacheShare();
    });

    $('.sidebar-sticky').theiaStickySidebar({
      additionalMarginTop: 66,
    });

    // Search function
    searchGhostHunter ();

    /**
     * Sticky Navbar in (home - tag - author)
     * Show the button to go back top
     */
    windowScroll ();

  },
};
