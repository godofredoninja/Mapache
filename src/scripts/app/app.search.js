export default ($header, $input, blogUrl) => {
  $input
  .focus(() => {
    $header.addClass('is-showSearch');
    $('.search-popout').removeClass('closed');
  })
  .blur(() => {
    setTimeout(() => {
      $header.removeClass('is-showSearch');
      $('.search-popout').addClass('closed');
    }, 200);
  })
  .keyup(() => {
    $('.search-suggest-results').css('display', 'block');
  })
  .ghostHunter({
    results: '#search-results',
    zeroResultsInfo: false,
    displaySearchInfo: false,
    result_template: `<a href="${blogUrl}{{link}}">{{title}}</a>`,
    onKeyUp: true,
  });
};
