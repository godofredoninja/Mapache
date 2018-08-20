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
    const $videoEmbed = $('.cc-video-embed');
    const firstVideo = $('.post-body-wrap').find(iframeVideo.join(','))[0];

    if (typeof firstVideo === 'undefined') {
      return;
    }

    const $video = $(firstVideo);
    const $firstParentVideo = $video.parent('.video-responsive');
    const $secondParentVideo = $firstParentVideo.parent('.kg-embed-card');

    // Append Video
    if ($secondParentVideo.hasClass('kg-embed-card')) {
      $secondParentVideo.appendTo($videoEmbed);
    } else {
      $firstParentVideo.appendTo($videoEmbed);
    }
  },

  finalize() {
    //  Dnot scroll
    let didScroll = false;

    // Active Scroll
    $(window).on('scroll.video', () => didScroll = true );

    // Fixed video in te footer of page
    function fixedVideo() {
      const scrollTop = $(window).scrollTop();
      const elementOffset = $('.post').offset().top;

      if (scrollTop > elementOffset){
        $('body').addClass('has-video-fixed');
      } else {
        $('body').removeClass('has-video-fixed');
      }
    }

    // Close video fixed
    $('.cc-video-close').on('click', () => {
      $('body').removeClass('has-video-fixed');
      $(window).off('scroll.video');
    });

    setInterval(() => {
      if (didScroll) {
        fixedVideo();
        didScroll = false;
      }
    }, 500);
  },
}
