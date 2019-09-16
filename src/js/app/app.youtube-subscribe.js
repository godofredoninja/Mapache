export default ChannelId => {
  const template = `<span class="u-paddingLeft15"><div class="g-ytsubscribe" data-channelid="${ChannelId}" data-layout="default" data-count="default"></div></span>`;

  $('.cc-video-subscribe').append(template);

  const go = document.createElement('script');
  go.type = 'text/javascript';
  go.async = true;
  go.src = 'https://apis.google.com/js/platform.js';
  document.body.appendChild(go);
  // const s = document.getElementsByTagName('script')[0];
  // s.parentNode.insertBefore(go, s);
}
