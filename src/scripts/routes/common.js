/* global homeBtn twitterFeed followSocialMedia footerLinks blogUrl */

import mapacheFollow from '../app/app.follow';
import mapacheFooterLinks from '../app/app.footer.links';
import lazyLoadImage from '../app/app.lazy-load';
import mapacheTwitter from '../app/app.twitter';

// Varibles
const urlRegexp = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \+\.-]*)*\/?$/; // eslint-disable-line

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
    lazyLoadImage();
  }, // end Init

  finalize() {
    /* sicky sidebar */
    $('.sidebar-sticky').theiaStickySidebar({
      additionalMarginTop: 70,
      minWidth: 970,
    });

    // Search
    let searchScript = document.createElement('script');
    searchScript.src = `${blogUrl}/assets/scripts/search.js`;
    searchScript.defer = true;

    document.body.appendChild(searchScript);

    // Twitter Widget
    if (typeof twitterFeed === 'object' && twitterFeed !== null) {
      mapacheTwitter(twitterFeed.name, twitterFeed.number);
    }
  }, //end => Finalize
};
