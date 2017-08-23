(function () {
  /**
   * @package godofredoninja
   * pagination
   */
  const $win = $(window);
  const $pathname = $('link[rel=canonical]').attr('href');
  const $btnLoadMore = $('.mapache-load-more');
  const $maxPages = $btnLoadMore.attr('data-page-total');

  let scrollTime = false;
  let currentPage = 2;

  /* active Scroll */
  let onScroll = () => scrollTime = true;


  /* Scroll page END */
  let  detectPageEnd = () => {
    const scrollTopWindow = $win.scrollTop() + window.innerHeight;
    const scrollTopBody = document.body.clientHeight - (window.innerHeight * 2);

    return (scrollTime === true && scrollTopWindow > scrollTopBody);
  }

  /* Fetch Page */
  function fetchPage () {
    if (typeof $maxPages !== 'undefined' && currentPage <= $maxPages && detectPageEnd()) {
      $.ajax({
        type: 'GET',
        url: `${$pathname}page/${currentPage}`,
        dataType: 'html',
        beforeSend: () => {
          $win.off('scroll', onScroll);
          $btnLoadMore.text('Loading...');
        },
        success: (data) => {
          const entries = $('.feed-entry-wrapper', data);
          $('.feed-entry-content').append(entries);
          $btnLoadMore.html('Load more <i class="i-keyboard_arrow_down');

          currentPage ++;

          /* Lazy load for image */
          $('span.lazy').lazyload();

          $win.on('scroll', onScroll);
        },
      });

      /* Disable scroll */
      scrollTime = false;
    } else {
      $btnLoadMore.remove();
    }
  }


  //  window scroll
  $win.on('scroll', onScroll);

  // set interbal
  setInterval(() => {
    fetchPage();
  }, 500);

})();
