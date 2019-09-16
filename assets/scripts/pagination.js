(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

/* global maxPages */
(function (window, document) {
  // Variables
  var $buttonLoadMore = $('.load-more');
  var $result = $('.story-feed'); // const $win = $(window);

  var pathname = window.location.pathname;
  var currentPage = 1; // let lastScroll = 0;
  // show button for load more

  if (maxPages >= 2) {
    $buttonLoadMore.removeClass('u-hide');
  }

  function sanitizePathname(path) {
    var paginationRegex = /(?:page\/)(\d)(?:\/)$/i; // remove hash params from path

    path = path.replace(/#(.*)$/g, '').replace('////g', '/'); // remove pagination from the path and replace the current pages
    // with the actual requested page. E. g. `/page/3/` indicates that
    // the user actually requested page 3, so we should request page 4
    // next, unless it's the last page already.

    if (path.match(paginationRegex)) {
      currentPage = parseInt(path.match(paginationRegex)[1]);
      path = path.replace(paginationRegex, '');
    }

    return path;
  }

  function mapachePagination(e) {
    var _this = this;

    e.preventDefault(); // sanitize the pathname from possible pagination or hash params

    pathname = sanitizePathname(pathname);
    /**
    * maxPages is defined in default.hbs and is the value
    * of the amount of pagination pages.
    * If we reached the last page or are past it,
    * we return and disable the listeners.
    */

    if (currentPage >= maxPages) {
      $(this).remove();
      return;
    } // next page


    currentPage += 1; // Load more

    var nextPage = "".concat(pathname, "page/").concat(currentPage, "/");
    /* Fetch Page */

    $.get(nextPage, function (content) {
      var parse = document.createRange().createContextualFragment(content);
      var posts = parse.querySelector('.story-feed-content');
      $result[0].appendChild(posts);
    }).fail(function (xhr) {
      // 404 indicates we've run out of pages
      if (xhr.status === 404) {
        $(_this).remove();
      }
    });
  } //  Click Load More


  $buttonLoadMore.on('click', mapachePagination);
})(window, document);

},{}]},{},[1])

//# sourceMappingURL=map/pagination.js.map
