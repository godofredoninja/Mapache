export default (links, urlRegexp) => {
  $('.footer-menu').removeClass('u-hide');

  return $.each(links, (name, url) => {
    if (typeof url === 'string' && urlRegexp.test(url)) {
      const template = `<li><a href="${url}" title="${name}">${name}</a></li>`;

      $('.footer-menu').append(template);
    }
  });
};
