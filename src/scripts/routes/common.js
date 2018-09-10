import mapacheFollow from '../app/app.follow';
import mapacheFooterLinks from '../app/app.footer.links';
import mapacheTwitter from '../app/app.twitter';

// Varibles
const urlRegexp = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \+\.-]*)*\/?$/; // eslint-disable-line

export default {
  init() {
    // Change title HOME PAGE
    if (typeof homeTitle !== 'undefined') $('#home-title').html(homeTitle); // eslint-disable-line

    // change BTN ( Name - URL) in Home Page
    if (typeof homeBtnTitle !== 'undefined' && typeof homeBtnURL !== 'undefined') {
      $('#home-button').attr('href', homeBtnURL).html(homeBtnTitle); // eslint-disable-line
    }

    // Follow me
    if (typeof followSocialMedia !== 'undefined') mapacheFollow(followSocialMedia, urlRegexp); // eslint-disable-line

    /* Footer Links */
    if (typeof footerLinks !== 'undefined') mapacheFooterLinks (footerLinks, urlRegexp); // eslint-disable-line

    /* Lazy load for image */
    $('.cover-lazy').lazyload({effect : 'fadeIn'});
    $('.story-image-lazy').lazyload({threshold : 200});
  }, // end Init

  finalize() {
    /* sicky sidebar */
    $('.sidebar-sticky').theiaStickySidebar({
      additionalMarginTop: 70,
      minWidth: 970,
    });

    // Twitter Widget
    if (typeof twitterUserName !== 'undefined' && typeof twitterNumber !== 'undefined') {
      mapacheTwitter(twitterUserName, twitterNumber); // eslint-disable-line
    }

    // show comments count of disqus
    // if (typeof disqusShortName !== 'undefined') $('.mapache-disqus').removeClass('u-hide');

  }, //end => Finalize
};
