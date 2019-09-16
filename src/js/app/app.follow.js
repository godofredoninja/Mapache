export default (links, urlRegexp) => {

  $('.js-toggle-social-media').removeClass('u-hide');

  return $.each(links, (name, urlTitle) => {
    if (typeof urlTitle[0] === 'string' && urlRegexp.test(urlTitle[0])) {
      const template = `<a href="${urlTitle[0]}" title="${urlTitle[1]}" target="_blank" rel="noopener noreferrer" class="i-${name}"></a>`;

      $('.js-social-media').append(template);
    }
  });
};
