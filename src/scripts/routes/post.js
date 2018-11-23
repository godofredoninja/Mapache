/* global instagramFeed */

// import facebookShareCount from '../app/app.facebook-share-count';
import Prism from 'prismjs'
import 'prismjs/plugins/autoloader/prism-autoloader';
import 'prismjs/plugins/line-numbers/prism-line-numbers';

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
    const $allMedia = $('.post-inner').find(iframeVideo.join(','));

    // Video responsive
    // allMedia.map((key, value) => $(value).wrap('<aside class="video-responsive"></aside>'));
    $allMedia.each(function () {
      $(this).wrap('<aside class="video-responsive"></aside>').parent('.video-responsive');
    });
  },
  finalize() {
    // Add data action zoom FOR IMG
    $('.post-inner img').not('.kg-width-full img').attr('data-action', 'zoom');
    $('.post-inner').find('a').find('img').removeAttr("data-action")

    // sticky share post in left
    $('.sharePost').theiaStickySidebar({
      additionalMarginTop: 120,
      minWidth: 970,
    });

    // Instagram Feed
    if (typeof instagramFeed === 'object' && instagramFeed !== null) {
      const url = `https://api.instagram.com/v1/users/${instagramFeed.userId}/media/recent/?access_token=${instagramFeed.token}&count=10&callback=?`;
      const user = `<a href="https://www.instagram.com/${instagramFeed.userName}" class="button button--large button--chromeless" target="_blank"><i class="i-instagram"></i> ${instagramFeed.userName}</a>`;

      mapacheInstagram(url, user);
    }

    // Gallery
    const images = document.querySelectorAll('.kg-gallery-image img');

    images.forEach(function (image) {
        const container = image.closest('.kg-gallery-image');
        const width = image.attributes.width.value;
        const height = image.attributes.height.value;
        const ratio = width / height;
        container.style.flex = ratio + ' 1 0%';
    })

    /* Prism autoloader */
    Prism.highlightAll();

    // Prism.plugins.autoloader.languages_path = `${$('body').attr('data-page')}/assets/scripts/components/`; // eslint-disable-line
  }, // end finalize
};
