import InfiniteScroll from 'infinite-scroll'

(document => {
  if (!document.body.classList.contains('paged-next')) return

  let infScroll = ''

  const $button = document.querySelector('.load-more-btn')
  const $iconLoader = $button.querySelector('.icon')
  const $label = $button.querySelector('.label')

  $button.classList.remove('hidden')

  infScroll = new InfiniteScroll('.js-post-feed', {
    append: '.js-story',
    button: '.load-more-btn',
    debug: false,
    hideNav: '.pagination',
    path: '.pagination .older-posts',
    scrollThreshold: false
  })

  infScroll.on('request', function () {
    $label.classList.add('hidden')
    $iconLoader.classList.remove('hidden')
  })

  infScroll.on('append', function () {
    // items[0].classList.add('feed-paged')
    $label.classList.remove('hidden')
    $iconLoader.classList.add('hidden')
  })
})(document)
