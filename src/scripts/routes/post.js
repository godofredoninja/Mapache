/* global instagramFeed blogUrl */

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

const $postInner = $('.post-inner');

export default {
  init() {
    const $allMedia = $postInner.find(iframeVideo.join(','));

    // Video responsive
    // allMedia.map((key, value) => $(value).wrap('<aside class="video-responsive"></aside>'));
    $allMedia.each(function () {
      $(this).wrap('<aside class="video-responsive"></aside>').parent('.video-responsive');
    });
  },
  finalize() {
    // Add data action zoom FOR IMG
    $('.post-inner img').not('.kg-width-full img').attr('data-action', 'zoom');
    $postInner.find('a').find('img').removeAttr("data-action")

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
    });

    // PrismJS code syntax
    const $prismPre = $postInner.find('code[class*="language-"]');

    if ($prismPre.length > 0) {
      $postInner.find('pre').addClass('line-numbers');

      let prismScript = document.createElement('script');
      prismScript.src = `${blogUrl}/assets/scripts/prismjs.js`;
      prismScript.defer = true;

      document.body.appendChild(prismScript);
    }
  }, // end finalize
};
