export default {
  init() {
    // Change title HOME PAGE
    if (typeof homeTitle !== 'undefined') $('#title-home').html(homeTitle) // eslint-disable-line

    // change BTN ( Name - URL)
    if (typeof homeBtnTitle !== 'undefined' && typeof homeBtnURL !== 'undefined') {
      $('#btn-home').attr('href', homeBtnURL).html(homeBtnTitle); // eslint-disable-line
    }
  },
};
