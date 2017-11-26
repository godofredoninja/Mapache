export default userFacebook => {
  $('.widget-facebook').parent().removeClass('u-hide');
  // const fansPage = `<div class="fb-page" data-href="https://www.facebook.com/${userFacebook}" data-tabs="timeline" data-small-header="false" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="false">`; // eslint-disable-line
  const fansPage = `<div class="fb-page" data-href="https://www.facebook.com/${userFacebook}" data-tabs="timeline" data-small-header="true" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="false"><blockquote cite="https://www.facebook.com/${userFacebook}" class="fb-xfbml-parse-ignore"><a href="https://www.facebook.com/${userFacebook}">GodoFredo</a></blockquote></div>`; // eslint-disable-line

  let facebookSdkScript = `<div id="fb-root"></div>
  <script>(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.11';
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));</script>`;

  if ($("#fb-root").is("div") === false) $('body').append(facebookSdkScript);
  $('.widget-facebook').html(fansPage);
};
