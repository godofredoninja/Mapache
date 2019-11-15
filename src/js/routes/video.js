import { qs, iframeVideo } from '../app/app.variables'

export default {
  init () {
    const firstVideo = qs('.js-post-content').querySelectorAll(iframeVideo.join(','))[0]

    if (!firstVideo) return

    const videoMedia = qs('.cc-video-embed')
    const documentBoby = document.body

    // Append Video in Top of Article
    // -----------------------------------------------------------------------------
    if (firstVideo.closest('.kg-embed-card')) {
      videoMedia.appendChild(firstVideo.closest('.kg-embed-card'))
    } else {
      videoMedia.appendChild(firstVideo.parentNode)
    }

    // Video fixed
    // -----------------------------------------------------------------------------
    const videoMediaScroll = () => {
      if (window.scrollY > (qs('.js-video-post').offsetTop) - 100) {
        documentBoby.classList.add('has-video-fixed')
      } else {
        documentBoby.classList.remove('has-video-fixed')
      }
    }

    if (documentBoby.clientWidth > 1200) {
      window.addEventListener('scroll', videoMediaScroll)
    }

    // Close video fixed
    // -----------------------------------------------------------------------------
    qs('.cc-video-close').addEventListener('click', () => {
      documentBoby.classList.remove('has-video-fixed')
      window.removeEventListener('scroll', videoMediaScroll)
    })
  }
}
