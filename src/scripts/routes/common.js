import mapacheFollow from '../app/app.follow';
import mapacheFooterLinks from '../app/app.footer.links';
// import simplyGhostSearch from '../app/app.search';
import ghostSearch from '../app/search';
import lazyLoadImage from '../app/app.lazy-load';
import mapacheTwitter from '../app/app.twitter';

// Varibles
const urlRegexp = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \+\.-]*)*\/?$/; // eslint-disable-line

const mySearchSettings = {
  input: '#search-field',
  results: '#searchResults',
  on: {
    beforeFetch: () => {$('body').addClass('is-loading')},
    afterFetch: () => {setTimeout(() => {$('body').removeClass('is-loading')}, 4000)},
  },
}

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
    /* Lazy load for image */
    lazyLoadImage();
    // $('.lazy-load-image').lazyload({effect : 'fadeIn'});
    // $('.lazy-load-image').lazyload({threshold : 200});
  }, // end Init

  finalize() {
    /* sicky sidebar */
    $('.sidebar-sticky').theiaStickySidebar({
      additionalMarginTop: 70,
      minWidth: 970,
    });

    if (typeof searchSettings !== 'undefined') {
      Object.assign(mySearchSettings, searchSettings); // eslint-disable-line
    }

    // Search
    new ghostSearch(mySearchSettings);

    // Twitter Widget
    if (typeof twitterUserName !== 'undefined' && typeof twitterNumber !== 'undefined') {
      mapacheTwitter(twitterUserName, twitterNumber); // eslint-disable-line
    }

    // show comments count of disqus
    // if (typeof disqusShortName !== 'undefined') $('.mapache-disqus').removeClass('u-hide');

  }, //end => Finalize
};
