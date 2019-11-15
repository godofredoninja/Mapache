/* global instagramFeed sitePrismJs */

import { loadStyle, loadScript } from '../app/app.load-style-script'
import instagram from '../app/app.instagram'

// querySelector and document.querySelectorAll
import { qs, qsa, iframeVideo } from '../app/app.variables'

export default {
  init () {
    // Video Responsive
    // -----------------------------------------------------------------------------
    const arrIframe = qsa(iframeVideo.join(','))
    if (arrIframe.length) {
      arrIframe.forEach(el => {
        const box = document.createElement('div')
        box.className = 'video-responsive'
        el.parentNode.insertBefore(box, el)
        box.appendChild(el)
      })
    }
  },
  finalize () {
    // gallery
    // -----------------------------------------------------------------------------
    const images = qsa('.kg-gallery-image img')

    images.forEach(image => {
      const container = image.closest('.kg-gallery-image')
      const width = image.attributes.width.value
      const height = image.attributes.height.value
      const ratio = width / height
      container.style.flex = ratio + ' 1 0%'
    })

    // <img> Set Atribute (data-src - data-sub-html)
    // -----------------------------------------------------------------------------
    qsa('.js-post-content img').forEach(el => {
      if (el.closest('a')) return

      el.classList.add('mapache-light-gallery')
      el.setAttribute('data-src', el.src)

      const nextElement = el.nextSibling

      if (nextElement !== null && nextElement.nodeName.toLowerCase() === 'figcaption') {
        el.setAttribute('data-sub-html', nextElement.innerHTML)
      }
    })

    // Lightgallery
    // -----------------------------------------------------------------------------
    const lightGallery = qsa('.mapache-light-gallery')

    if (lightGallery.length) {
      loadStyle('https://unpkg.com/lightgallery.js/dist/css/lightgallery.min.css')

      loadScript('https://cdn.jsdelivr.net/npm/lightgallery.js@1.1.3/dist/js/lightgallery.min.js', () => {
        loadScript('https://unpkg.com/lg-zoom.js@1.0.1/dist/lg-zoom.min.js')

        window.lightGallery(qs('.js-post-content'), { selector: '.mapache-light-gallery' })
      })
    }

    // Instagram Feed
    // -----------------------------------------------------------------------------
    const instagramBox = qs('.js-instagram')
    if (typeof instagramFeed === 'object' && instagramFeed !== null && instagramBox) {
      instagram(instagramFeed, instagramBox)
    }

    // highlight prismjs
    // -----------------------------------------------------------------------------
    if (qsa('code[class*="language-"]').length && typeof sitePrismJs !== 'undefined') {
      // line-numbers
      // qsa('code[class*="language-"]').forEach(item => item.classList.add('line-numbers'))

      loadScript(sitePrismJs)
    }

    // Post Share
    // -----------------------------------------------------------------------------
    qsa('.js-share').forEach(item => item.addEventListener('click', e => {
      const width = 640
      const height = 400
      const win = window
      const doc = document

      const dualScreenLeft = win.screenLeft !== undefined ? win.screenLeft : win.screenX
      const dualScreenTop = win.screenTop !== undefined ? win.screenTop : win.screenY

      const containerWidth = win.innerWidth ? win.innerWidth : doc.documentElement.clientWidth ? doc.documentElement.clientWidth : win.screen.width
      const containerHeight = win.innerHeight ? win.innerHeight : doc.documentElement.clientHeight ? doc.documentElement.clientHeight : win.screen.height

      const left = ((containerWidth / 2) - (width / 2)) + dualScreenLeft
      const top = ((containerHeight / 2) - (height / 2)) + dualScreenTop
      const newWindow = win.open(e.currentTarget.href, 'share-window', `scrollbars=yes, width=${width}, height=${height}, top=${top}, left=${left}`)

      // Puts focus on the newWindow
      win.focus && newWindow.focus()

      e.preventDefault()
    }))
  } // end finalize
}
