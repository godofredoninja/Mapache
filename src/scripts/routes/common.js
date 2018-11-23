/* global homeBtn twitterFeed followSocialMedia footerLinks searchSettings */

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
    if (typeof homeBtn === 'object' && homeBtn !== null) {
      $('#home-button').attr('href', homeBtn.url).html(homeBtn.title);
    }

    // Follow me
    if (typeof followSocialMedia === 'object' && followSocialMedia !== null) {
      mapacheFollow(followSocialMedia, urlRegexp);
    }

    /* Footer Links */
    if (typeof footerLinks === 'object' && footerLinks !== null) {
      mapacheFooterLinks (footerLinks, urlRegexp);
    }

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

    // concatenating the settings of the search engine with those of the user
    if (typeof searchSettings === 'object' && searchSettings !== null) {
      Object.assign(mySearchSettings, searchSettings);
    }

    // Search
    new ghostSearch(mySearchSettings);

    // Twitter Widget
    if (typeof twitterFeed === 'object' && twitterFeed !== null) {
      mapacheTwitter(twitterFeed.name, twitterFeed.number);
    }

    // show comments count of disqus
    // if (typeof disqusShortName !== 'undefined') $('.mapache-disqus').removeClass('u-hide');

  }, //end => Finalize
};
