import Typed from 'typed.js';

export default {
  init() {
    // Change title HOME PAGE
    if (typeof homeTitle !== 'undefined') $('#title-home').html(homeTitle); // eslint-disable-line

    // Home Title Typed
    if (typeof homeTitleTyped !== 'undefined') { // eslint-disable-line
      $('#title-home').addClass('u-hide');
      $('#home-typed').removeClass('u-hide');

      var typed = new Typed('#home-title-typed', {
        strings: homeTitleTyped, // eslint-disable-line
        typeSpeed: 100,
        loop: true,
        startDelay: 1000,
        backDelay: 1000,
      });
    }

    // change BTN ( Name - URL)
    if (typeof homeBtnTitle !== 'undefined' && typeof homeBtnURL !== 'undefined') {
      $('#btn-home').attr('href', homeBtnURL).html(homeBtnTitle); // eslint-disable-line
    }
  },
};
