/* add social follow  */
function followMe(links, box, urlRegexp) {
  return $.each(links, (name, url) => {
    if (typeof url === 'string' && urlRegexp.test(url)) {
      const template = `<a title="${name}" href="${url}" target="_blank" class="i-${name}"></a>`;
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

module.exports = {
  follow: followMe,
  videoResponsive: allVideoResponsive,
};
