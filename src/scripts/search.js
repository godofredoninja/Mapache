/* global searchSettings */
import ghostSearch from './app/app.search';

$(window).on('load', () => {
  const mySearchSettings = {
    input: '#search-field',
    results: '#searchResults',
    on: {
      beforeFetch: () => {$('body').addClass('is-loading')},
      afterFetch: () => {setTimeout(() => {$('body').removeClass('is-loading')}, 4000)},
    },
  };

  // concatenating the settings of the search engine with those of the user
  if (typeof searchSettings === 'object' && searchSettings !== null) {
    Object.assign(mySearchSettings, searchSettings);
  }

  /* Toggle card for search Search */
  $('.search-toggle').on('click', e => {
    e.preventDefault();
    $('body').toggleClass('is-search').removeClass('is-showNavMob');
  });

  // Search
  new ghostSearch(mySearchSettings);
})
