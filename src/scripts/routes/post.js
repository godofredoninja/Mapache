import 'prismjs';
import 'prismjs/plugins/autoloader/prism-autoloader';
import 'prismjs/plugins/line-numbers/prism-line-numbers';

import Share from '../app/app.share';

/* Iframe SRC video */
const iframeForVideoResponsive = [
  'iframe[src*="player.vimeo.com"]',
  'iframe[src*="dailymotion.com"]',
  'iframe[src*="facebook.com/plugins/video.php"]',
  'iframe[src*="youtube.com"]',
  'iframe[src*="youtube-nocookie.com"]',
  'iframe[src*="vid.me"]',
  'iframe[src*="kickstarter.com"][src*="video.html"]',
];


export default {
  init() {
    const $allVideos = $('.post-body').find(iframeForVideoResponsive.join(','));
    // allVideos.map((key, value) => $(value).wrap('<aside class="video-responsive"></aside>'));

    $allVideos.each(function () {
      const $this = $(this);

      const height = ( this.tagName.toLowerCase() === 'object' || ($this.attr('height') && !isNaN(parseInt($this.attr('height'), 10))) ) ? parseInt($this.attr('height'), 10) : $this.height();
      const width = !isNaN(parseInt($this.attr('width'), 10)) ? parseInt($this.attr('width'), 10) : $this.width();
      const aspectRatio = height / width;

      $(this).wrap('<aside class="video-responsive"></aside>').parent('.video-responsive').css('padding-bottom', (aspectRatio * 100)+'%');
    });
  },
  finalize() {
    /* Share article in Social media */
    $('.share').bind('click', function (e) {
      e.preventDefault();
      const share = new Share($(this));
      share.mapacheShare();
    });

    /* add line Numbers */
    $('.post-body').find('pre').addClass('line-numbers');

    /* Prism autoloader */
    Prism.plugins.autoloader.languages_path = `${$('body').attr('mapache-page-url')}/assets/scripts/prism-components/`; // eslint-disable-line
  },
};
