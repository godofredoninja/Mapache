/**
 * @package godofredoninja
 * pagination
 */
const $win = $(window);
const paginationUrl = $('link[rel=canonical]').attr('href');
const $btnLoadMore = $('.mapache-load-more');
const $paginationTotal = $btnLoadMore.attr('mapache-page-total');

let enableDisableScroll = false; // false => !1
let pagingNumber = 2;

/* Page end */
function activeScroll() {
  enableDisableScroll = true; // true => !0
}

//  window scroll
$win.on('scroll', activeScroll);

/* Scroll page END */
function PageEnd() {
  const scrollTopWindow = $win.scrollTop() + window.innerHeight;
  const scrollTopBody = document.body.clientHeight - (window.innerHeight * 2);

  return (enableDisableScroll === true && scrollTopWindow > scrollTopBody);
}

/* get urL */
function getURL() {
  $btnLoadMore.text('Loading...');

  $.get((`${paginationUrl}page/${pagingNumber}`), (data) => {
    $win.off('scroll', activeScroll);

    /* Add the following page after 2 seconds */
    setTimeout(() => {
      const entries = $('.feed-entry-wrapper', data);
      $('.feed-entry-content').append(entries);

      $btnLoadMore.html('Load more <i class="i-keyboard_arrow_down">');

      $win.on('scroll', activeScroll);
    }, 400);

    pagingNumber += 1;

    /* Scroll False*/
    enableDisableScroll = false; // => !1;
  });
}

$(document).on('ready', () => {
  // set interbal
  setInterval(() => {
    if (PageEnd()) {
      if (typeof $paginationTotal !== 'undefined' && !$btnLoadMore.hasClass('not-load-more')) {
        /* Add class <.not-load-more> to <.mapache-load-more> */
        if (pagingNumber === 3) $btnLoadMore.addClass('not-load-more');

        if (pagingNumber <= $paginationTotal) {
          getURL();
        } else {
          $btnLoadMore.remove();
        }
      }
    }
  }, 500);

  /* Remove class <.not-load-more> to <.not-load-more> */
  $('.content').on('click', '.mapache-load-more.not-load-more', function (e) {
    e.preventDefault();
    $(this).removeClass('not-load-more');
  });
});
