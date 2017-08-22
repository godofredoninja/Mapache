// const $postBody = $('.post-body');
const $videoPostFormat = $('.video-post-format');

/* Iframe SRC video */
const iframeForVideoResponsive = [
  'iframe[src*="player.vimeo.com"]',
  'iframe[src*="dailymotion.com"]',
  'iframe[src*="facebook.com/plugins/video.php"]',
  'iframe[src*="youtube.com"]',
  'iframe[src*="youtube-nocookie.com"]',
  'iframe[src*="kickstarter.com"][src*="video.html"]',
];

/* Iframe src audio */
const iframeForAudioResponsive = [
  'iframe[src*="w.soundcloud.com"]',
  'iframe[src*="soundcloud.com"]',
  'iframe[src*="embed.spotify.com"]',
  'iframe[src*="spotify.com"]',
];

/* Video Post Format */
function videoPostFormat () {
  // video Large in tOP
  const firstVideo = $('.post-body').find(iframeForVideoResponsive.join(','))[0];
  $(firstVideo).appendTo($videoPostFormat).wrap('<aside class="video-responsive"></aside>');
}

/* search all video in <post-body>  for Responsive*/
function videoResponsive () {
  const iframe = iframeForAudioResponsive.concat(iframeForVideoResponsive);
  const allVideos = $('.post-body').find(iframe.join(','));

  return allVideos.map((key, value) => $(value).wrap('<aside class="video-responsive"></aside>'));
}

function youtubeBtnSubscribe () {
  if (typeof youtubeChannelName !== 'undefined' && typeof youtubeChannelID !== 'undefined') {
    /*eslint-disable */
    let template = `<div class="video-subscribe u-flex u-h-b-md" style="margin-bottom:16px">
      <span class="channel-name" style="margin-right:16px">Subscribe to ${youtubeChannelName}</span>
      <div class="g-ytsubscribe" data-channelid="${youtubeChannelID}" data-layout="default" data-count="default"></div>
    </div>`;
    /*eslint-enable */

    $videoPostFormat.append(template);

    const go = document.createElement('script');
    go.type = 'text/javascript';
    go.async = true;
    go.src = 'https://apis.google.com/js/platform.js';
    // document.body.appendChild(go);
    const s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(go, s);
  }
}

/**
 *  Events in post Page
 */
export default {
  init() {
    // Video Responsive
    videoPostFormat ();
  },
  finalize() {
    // btn subscribe for Youtube
    youtubeBtnSubscribe ();
    // Video Responsive
    videoResponsive ();

    /* Prism autoloader */
    Prism.plugins.autoloader.languages_path = '../assets/scripts/prism-components/'; // eslint-disable-line
  },
};
