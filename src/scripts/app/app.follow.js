export default links => {
  const urlRegexp = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \+\.-]*)*\/?$/; // eslint-disable-line

  return $.each(links, (name, url) => { // eslint-disable-line
    if (typeof url === 'string' && urlRegexp.test(url)) {
      const template = `<a title="Follow me in ${name}" href="${url}" target="_blank" class="i-${name}"></a>`;
      $('.social_box').append(template);
    }
  });
};
