/* Return rounded and pretty value of share count. */
const convertNumber = (n) => {
  if (n >= 1000000000) return `${(n / 1000000000).toFixed(1)}G`;
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n;
};

/* add social follow  */
function followMe(links, box, urlRegexp) {
  return $.each(links, (name, url) => {
    if (typeof url === 'string' && urlRegexp.test(url)) {
      const template = `<a title="Follow me in ${name}" href="${url}" target="_blank" class="i-${name}"></a>`;
      box.append(template);
    }
  });
}

/* search all video in <post-body>  for Responsive*/
function allVideoResponsive(elem) {
  return elem.each(function () {
    const selectors = [
      'iframe[src*="player.vimeo.com"]',
      'iframe[src*="youtube.com"]',
      'iframe[src*="youtube-nocookie.com"]',
      'iframe[src*="kickstarter.com"][src*="video.html"]',
    ];

    const $allVideos = $(this).find(selectors.join(','));

    $allVideos.each(function () {
      $(this).wrap('<aside class="video-responsive"></aside>');
    });
  });
}

/* Facebook Comments Counts */
function facebookShareCount(sharebox) {
  sharebox.each(() => {
    const url = sharebox.attr('godo-url');
    const getURL = `https://graph.facebook.com/?id=${encodeURIComponent(url)}&callback=?`;

    $.getJSON(getURL, (res) => {
      if (res.share !== undefined) {
        const n = res.share.share_count;
        const count = convertNumber(n);
        sharebox.html(count);
      }
    });
  });
}


module.exports = {
  follow: followMe,
  videoResponsive: allVideoResponsive,
  facebookShare: facebookShareCount,
};
