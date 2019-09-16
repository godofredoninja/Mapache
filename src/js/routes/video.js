/* global youtubeChannelID */

// Variables
import * as variable from '../app/app.variables';

import { loadScript } from '../app/app.load-style-script';

export default {
  init() {
    const $win = $(window);
    const $videoEmbed = $('.cc-video-embed');
    //  Dnot scroll
    let didScroll = false;

    // Video Post Format
    // -----------------------------------------------------------------------------
    const firstVideo = variable.$postInner.find(variable.iframeVideo.join(','))[0];
    const $video = $(firstVideo);

    // if there are no videos, it returns
    if ( !$video.length ) return;

    if ( $video.parents('.kg-embed-card').length ) {
      $video.parents('.kg-embed-card').appendTo($videoEmbed)
    } else {
      $video.parent().appendTo($videoEmbed)
    }

    // Youtube subscribe
    // -----------------------------------------------------------------------------
    if (typeof youtubeChannelID !== 'undefined') {
      const template = `<span class="u-paddingLeft15"><div class="g-ytsubscribe" data-channelid="${youtubeChannelID}" data-layout="default" data-count="default"></div></span>`;

      $('.cc-video-subscribe').append(template);
      loadScript('https://apis.google.com/js/platform.js');
    }

    // Fixed video in te footer of page
    // -----------------------------------------------------------------------------
    function fixedVideo() {
      const scrollTop = $win.scrollTop();
      const elementOffset = $('.post').offset().top;

      if (scrollTop > elementOffset){
        variable.$body.addClass('has-video-fixed');
      } else {
        variable.$body.removeClass('has-video-fixed');
      }
    }

    // Close video fixed
    // -----------------------------------------------------------------------------
    $('.cc-video-close').on('click', () => {
      variable.$body.removeClass('has-video-fixed');
      $win.off('scroll.video');
    });

    if( $win.width() > 1200 ) {
      // Active Scroll
      $win.on('scroll.video', () => didScroll = true );

      setInterval(() => {
        if (didScroll) {
          fixedVideo();
          didScroll = false;
        }
      }, 500);
    }

  },
}
