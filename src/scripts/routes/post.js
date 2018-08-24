// import facebookShareCount from '../app/app.facebook-share-count';
import mapacheInstagram from '../app/app.instagram';

/* Iframe SRC video */
const iframeVideo = [
  'iframe[src*="player.vimeo.com"]',
  'iframe[src*="dailymotion.com"]',
  'iframe[src*="youtube.com"]',
  'iframe[src*="youtube-nocookie.com"]',
  'iframe[src*="vid.me"]',
  'iframe[src*="kickstarter.com"][src*="video.html"]',
];

export default {
  init() {
    const $allMedia = $('.post-body').find(iframeVideo.join(','));

    // Video responsive
    // allMedia.map((key, value) => $(value).wrap('<aside class="video-responsive"></aside>'));
    $allMedia.each(function () {
      $(this).wrap('<aside class="video-responsive"></aside>').parent('.video-responsive');
    });
  },
  finalize() {
    // Add data action zoom FOR IMG
    $('.post-body').find('img').attr('data-action', 'zoom');
    $('.post-body').find('a').find('img').removeAttr("data-action")

    // Open Post Comments
    $('.toggle-comments').on('click', function (e) {
      e.preventDefault();
      $('body').toggleClass('has-comments').removeClass('is-showNavMob')
    });

    // Share Count
    // facebookShareCount($('.share-count'));

    // sticky share post in left
    $('.sharePost').theiaStickySidebar({
      additionalMarginTop: 120,
      minWidth: 970,
    });

    // newsletter title change
    // if (typeof newsletterTitle !== 'undefined') $('.newsletter-title').html(newsletterTitle); // eslint-disable-line

    // newsletter Description
    // if (typeof newsletterDescription !== 'undefined') $('.newsletter-description').html(newsletterDescription); // eslint-disable-line

    // Instagram Feed
    if (typeof instagramUserId !== 'undefined' && typeof instagramToken !== 'undefined' && typeof instagramUserName !== 'undefined') {
      mapacheInstagram(instagramUserId, instagramToken, instagramUserName); // eslint-disable-line
    }

    /* Prism autoloader */
    Prism.plugins.autoloader.languages_path = `${$('body').attr('data-page')}/assets/scripts/prism-components/`; // eslint-disable-line
  }, // end finalize
};
