/**
 * @package godofredoninja
 * pagination
 * the code only runs on the first home page, author, tag
 *
 * the page is inspired by the casper code theme for ghost
 */

export default {
  init() {
    // Variables
    const $buttonLoadMore = $('.load-more-btn');
    const $result = $('.story-feed');
    const $win = $(window);

    let pathname = window.location.pathname;
    let currentPage = 1;
    let lastScroll = 0;

    // show button for load more
    if (maxPages >= 2){ // eslint-disable-line
      $buttonLoadMore.parent().removeClass('u-hide');
    }

    function sanitizePathname(path) {
      let paginationRegex = /(?:page\/)(\d)(?:\/)$/i;

      // remove hash params from path
      path = path.replace(/#(.*)$/g, '').replace('////g', '/');

      // remove pagination from the path and replace the current pages
      // with the actual requested page. E. g. `/page/3/` indicates that
      // the user actually requested page 3, so we should request page 4
      // next, unless it's the last page already.
      if (path.match(paginationRegex)) {
        currentPage = parseInt(path.match(paginationRegex)[1]);

        path = path.replace(paginationRegex, '');
      }

      return path;
    }

    function mapachePagination (e) {
      e.preventDefault();

      // sanitize the pathname from possible pagination or hash params
      pathname = sanitizePathname(pathname);

      /**
      * maxPages is defined in default.hbs and is the value
      * of the amount of pagination pages.
      * If we reached the last page or are past it,
      * we return and disable the listeners.
      */
      if (currentPage >= maxPages) { // eslint-disable-line
        $(this).parent().remove();

        return;
      }

      // next page
      currentPage += 1;

      // Load more
      const nextPage = `${pathname}page/${currentPage}/`;

      /* Fetch Page */
      $.get(nextPage, (content) => {
        const parse = document.createRange().createContextualFragment(content);
        const posts = parse.querySelector('.story-feed-content');

        $result[0].appendChild(posts);

      }).fail( (xhr) => {
        // 404 indicates we've run out of pages
        if (xhr.status === 404) {
          $(this).parent().remove();
        }
      }).always( () => {
        /* Lazy load for image */
        $('.story-image-lazy').lazyload({ threshold : 200 });
      });

    }

    /* Is visble next page */
    function isVisible(element) {
      const scroll_pos = $win.scrollTop();
      const windowHeight = $win.height();
      const elementTop = $(element).offset().top;
      const elementHeight = $(element).height();
      const elementBottom = elementTop + elementHeight;

      return ((elementBottom - elementHeight * 0.25 > scroll_pos) && (elementTop < (scroll_pos + 0.5 * windowHeight)));
    }

    /**
     * the url is changed when the articles on the next page are loaded.
     */
    function historyReplaceState () {
      const scroll = $win.scrollTop();

      if (Math.abs(scroll - lastScroll) > $win.height() * 0.1) {
        lastScroll = scroll;

        $('.story-feed-content').each(function () {
          if (isVisible($(this))) {
            history.replaceState(null, null, $(this).attr("data-page"));
            return false;
          }
        });
      }
    }


    // Click buttom for Load More Post
    $buttonLoadMore.on('click', mapachePagination);

    // history Replace State
    setInterval(() => historyReplaceState(), 500);
  },
};
