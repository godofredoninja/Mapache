export default (links, urlRegexp) => {

  $('.follow-toggle').removeClass('u-hide');

  return $.each(links, (name, url) => {
    if (typeof url === 'string' && urlRegexp.test(url)) {
      const template = `<a href="${url}" title="Follow me in ${name}" target="_blank" rel="noopener noreferrer" class="i-${name}"></a>`;

      $('.followMe').append(template);
    }
  });
};
