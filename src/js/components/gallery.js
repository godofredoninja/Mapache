/* global mapacheGallery */

import loadScript from './load-script'

export default () => {
  if (mapacheGallery === false) return

  if (window.innerWidth < 768) return

  const $postBody = document.getElementById('post-body')

  if (!$postBody) return

  /* <img> Set Atribute (data-src - data-sub-html)
  /* ---------------------------------------------------------- */
  $postBody.querySelectorAll('img').forEach(el => {
    if (el.closest('a')) return

    el.classList.add('mapache-light-gallery')
    el.setAttribute('data-src', el.src)

    const nextElement = el.nextSibling

    if (nextElement !== null && nextElement.nodeName.toLowerCase() === 'figcaption') {
      el.setAttribute('data-sub-html', nextElement.innerHTML)
    }
  })

  /* Lightgallery
  /* ---------------------------------------------------------- */
  const $imgLightGallery = $postBody.querySelectorAll('.mapache-light-gallery')

  if (!$imgLightGallery.length) return

  const loadCSS = href => {
    const link = document.createElement('link')
    link.media = 'print'
    link.rel = 'stylesheet'
    link.href = href
    link.onload = () => { link.media = 'all' }
    document.head.insertBefore(link, document.head.childNodes[document.head.childNodes.length - 1].nextSibling)
  }

  loadCSS('https://unpkg.com/lightgallery@2.1.8/css/lightgallery.css')

  loadScript('https://unpkg.com/lightgallery@2.1.8/lightgallery.min.js', () => {
    window.lightGallery($postBody, {
      speed: 500,
      selector: '.mapache-light-gallery'
    })
  })
}
