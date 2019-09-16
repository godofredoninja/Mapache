/* global searchSettings */
import ghostSearch from './app/app.search';

$(window).on('load', () => {
  // Return if there is no configuration
  if (typeof searchSettings === 'undefined') return;

  const $body = $('body')
  const $searchInput = $('#search-field');
  const $searchResults = $('#searchResults');
  const $searchMessage = $('.js-search-message');

  let searchResultsHeight = {
    outer: 0,
    scroll: 0,
  }

  // Variable for search
  // -----------------------------------------------------------------------------
  const mySearchSettings = {
    input: '#search-field',
    results: '#searchResults',
    on: {
      beforeFetch: () => $body.addClass('is-loading'),
      afterFetch: () => setTimeout(() => $body.removeClass('is-loading'), 4000),
      afterDisplay: () => {
        searchResultActive();
        searchResultsHeight = {
          outer: $searchResults.outerHeight(),
          scroll: $searchResults.prop('scrollHeight'),
        };
      },
    },
  };

  // concatenating the settings of the search engine with those of the user
  Object.assign(mySearchSettings, searchSettings);

  // when the Enter key is pressed
  // -----------------------------------------------------------------------------
  function enterKey () {
    const $link = $searchResults.find('a.search-result--active').eq(0);

    $link.length && $link[0].click();
  }

  // Attending the active class to the search link
  // -----------------------------------------------------------------------------
  function searchResultActive (t, e) {
    t = t || 0;
    e = e || 'up';

    if ( window.innerWidth < 768 ) return;

    // if there are no links detected
    if ( !$searchResults.find('a').length ) {
      // if there are no results and the input has no value
      if ($searchInput.val().length) {
        $searchMessage.removeClass('u-hide');
      }

      return;
    }

    $searchMessage.addClass('u-hide');

    $searchResults.find('a.search-result--active').removeClass('search-result--active');
    $searchResults.find('a').eq(t).addClass('search-result--active');

    let n = $searchResults.find('a').eq(t).position().top;
    let o = 0;

    'down' == e && n > searchResultsHeight.outer / 2 ? o = n - searchResultsHeight.outer / 2 : 'up' == e && (o = n < searchResultsHeight.scroll - searchResultsHeight.outer / 2 ? n - searchResultsHeight.outer / 2 : searchResultsHeight.scroll);

    $searchResults.scrollTop(o)
  }

  // Lear Input for write new letters
  // -----------------------------------------------------------------------------
  function clearInput () {
    $searchInput.focus();
    $searchInput[0].setSelectionRange(0, $searchInput.val().length);
  }

  // Search close with Key
  // -----------------------------------------------------------------------------
  function searchClose () {
    $body.removeClass('is-search');
    $(document).off('keyup.search');
  }

  // Reacted to the up or down keys
  // -----------------------------------------------------------------------------
  function arrowKeyUpDown (keyNumber) {
    let e = '';
    let indexTheLink = $searchResults.find('.search-result--active').index(); // n

    $searchInput.blur();

    if (38 == keyNumber) {
      e = 'up';
      if ( indexTheLink <= 0 ) {
        $searchInput.focus();
        indexTheLink = 0;
      } else {
        indexTheLink -= 1;
      }
    } else {
      e = 'down';
      if ( indexTheLink >= $searchResults.find('a').length - 1 ) {
        indexTheLink = $searchResults.find('a').length - 1;
      } else {
        indexTheLink = indexTheLink + 1;
      }
    }

    searchResultActive(indexTheLink, e)
  }

  // Adding functions to the keys
  // -----------------------------------------------------------------------------
  function searchKey () {
    $(document).on('keyup.search', function (e) {
      e.preventDefault();

      let keyNumber = e.keyCode;

      /**
        * 38 Top / Arriba
        * 40 down / abajo
        * 27 escape
        * 13 enter
        * 191 /
        **/

      if ( 27 == keyNumber ) {
        searchClose();
      } else if ( 13 == keyNumber) {
        $searchInput.blur();
        enterKey();
      } else if ( 38 == keyNumber || 40 == keyNumber) {
        arrowKeyUpDown(keyNumber);
      } else if ( 191 == keyNumber) {
        clearInput();
      } else {
        return;
      }
    });
  }

  // Toggle Modal for search Search
  // -----------------------------------------------------------------------------
  $('.js-search-open').on('click', e => {
    e.preventDefault();
    $body.addClass('is-search');
    $searchInput.focus();

    window.innerWidth > 768 && searchKey();
  });

  $('.js-search-close').on('click', searchClose)

  // Search
  // -----------------------------------------------------------------------------
  new ghostSearch(mySearchSettings);
})
