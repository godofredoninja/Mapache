/* global instagramFeed siteUrl */

// Add Styles and Scripts
import { loadStyle, loadScript } from '../app/app.load-style-script';

// Variables
import * as variable from '../app/app.variables';

// import facebookShareCount from '../app/app.facebook-share-count';
import mapacheInstagram from '../app/app.instagram';

export default {
  init() {
    // Video Responsice
    // -----------------------------------------------------------------------------
    const $allMedia = variable.$postInner.find(variable.iframeVideo.join(','));
    // allMedia.map((key, value) => $(value).wrap('<aside class="video-responsive"></aside>'));
    $allMedia.each(function () {
      $(this).wrap('<aside class="video-responsive"></aside>').parent('.video-responsive');
    });
  },
  finalize() {

    // gallery
    // -----------------------------------------------------------------------------
    const images = document.querySelectorAll('.kg-gallery-image img');

    images.forEach(function (image) {
      const container = image.closest('.kg-gallery-image');
      const width = image.attributes.width.value;
      const height = image.attributes.height.value;
      const ratio = width / height;
      container.style.flex = ratio + ' 1 0%';
    });

    variable.$postInner.find('img').each( function (i, item) {
      const $this = $(this);

      if (!$this.parents('a').length) {
        $this.addClass('mapache-light-gallery');
        $this.attr('data-src' , item.src);

        if ($this.next('figcaption').length) {
          const figcaption = $this.next('figcaption').html();
          $this.attr('data-sub-html' , figcaption);
        }
      }
    });

    const allImgess = variable.$postInner.find('.mapache-light-gallery');

    if (allImgess.length) {
      loadStyle('https://unpkg.com/lightgallery.js/dist/css/lightgallery.min.css');

      loadScript(`${siteUrl}/assets/scripts/lightgallery.min.js`, () => {
        variable.$postInner.each( (i, item) => window.lightGallery(item, { selector: '.mapache-light-gallery' }))
      });

      loadScript(`${siteUrl}/assets/scripts/lg-zoom.min.js`);

      // loadScript('https://cdn.jsdelivr.net/npm/lightgallery.js@1.1.3/dist/js/lightgallery.min.js', () => {
      //   variable.$postInner.each( (i, item) => window.lightGallery(item, { selector: '.mapache-light-gallery' }))
      // });

      // loadScript('https://unpkg.com/lg-zoom.js@1.0.1/dist/lg-zoom.min.js');
    }

    // sticky share post in left
    // -----------------------------------------------------------------------------
    $('.sharePost').theiaStickySidebar({
      additionalMarginTop: 120,
      minWidth: 970,
    });

    // Instagram Feed
    // -----------------------------------------------------------------------------
    if (typeof instagramFeed === 'object' && instagramFeed !== null) {
      const url = `https://api.instagram.com/v1/users/${instagramFeed.userId}/media/recent/?access_token=${instagramFeed.token}&count=10&callback=?`;
      const user = `<a href="https://www.instagram.com/${instagramFeed.userName}" class="button button--large button--chromeless" target="_blank" rel="noopener noreferrer"><i class="i-instagram"></i> ${instagramFeed.userName}</a>`;

      if( $(window).width() > 768 ){ mapacheInstagram(url, user) }
    }

    // PrismJS code syntax
    // -----------------------------------------------------------------------------
    const $prismPre = variable.$postInner.find('code[class*="language-"]');
    if ($prismPre.length) {
      variable.$postInner.find('pre').addClass('line-numbers');
      loadScript(`${siteUrl}/assets/scripts/prismjs.js`);
    }
  }, // end finalize
};
