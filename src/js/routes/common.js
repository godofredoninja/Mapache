/* global twitterFeed  followSocialMedia footerLinks siteSearch localStorage */

import socialMedia from '../app/app.social-media'
import mapacheFooterLinks from '../app/app.footer.links'
import { loadScript } from '../app/app.load-style-script'

// querySelector and document.querySelectorAll
import { qs, qsa } from '../app/app.variables'

export default {
  init () {
    // Change title HOME PAGE
    // -----------------------------------------------------------------------------
    // if (typeof homeTitle !== 'undefined' && qs('#home-title')) {
    //   qs('#home-title').textContent = homeTitle
    // }

    // change BTN ( Name - URL) in Home Page
    // -----------------------------------------------------------------------------
    // const homeButtonBox = qs('#home-button')
    // if (typeof homeBtn === 'object' && homeBtn !== null && homeButtonBox) {
    //   homeButtonBox.href = homeBtn.url
    //   homeButtonBox.textContent = homeBtn.title
    // }

    // Social Media
    // -----------------------------------------------------------------------------
    if (typeof followSocialMedia === 'object' && followSocialMedia !== null) {
      socialMedia(followSocialMedia)
    }

    /* Footer Links */
    if (typeof footerLinks === 'object' && footerLinks !== null) {
      mapacheFooterLinks(footerLinks)
    }
  }, // end Init

  finalize () {
    // Active Dark Mode
    // -----------------------------------------------------------------------------
    qsa('.js-dark-mode').forEach(item => item.addEventListener('click', el => {
      el.preventDefault()

      const dd = document.documentElement
      const dataTheme = dd.getAttribute('data-theme')

      if (dataTheme === 'light') {
        dd.setAttribute('data-theme', 'dark')
        localStorage.setItem('selected-theme', 'dark')
      } else {
        dd.setAttribute('data-theme', 'light')
        localStorage.setItem('selected-theme', 'light')
      }
    }))

    // Toggle Menu
    // -----------------------------------------------------------------------------
    qs('.js-menu-toggle').addEventListener('click', e => {
      e.preventDefault()
      document.body.classList.toggle('has-menu')
    })

    // Scroll Button Home Page
    // -----------------------------------------------------------------------------
    const homeButtonScroll = qs('.js-scrcoll-home')

    if (homeButtonScroll) {
      homeButtonScroll.addEventListener('click', e => {
        e.preventDefault()

        const homeCoverHeight = qs('#hm-cover').offsetHeight - 60

        if (window) {
          try {
            // The New API.
            window.scroll({
              top: homeCoverHeight,
              left: 0,
              behavior: 'smooth'
            })
          } catch (error) {
            // For older browsers.
            window.scrollTo(0, homeCoverHeight)
          }
        }
        //
      })
    }

    // Scroll Back to top animate
    // -----------------------------------------------------------------------------
    qs('.js-back-to-top').addEventListener('click', e => {
      e.preventDefault()

      if (window) {
        try {
          // The New API.
          window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
          })
        } catch (error) {
          // For older browsers.
          window.scrollTo(0, 0)
        }
      }
    })

    // Twitter Widget
    // -----------------------------------------------------------------------------
    const twitterFeedBox = qs('.js-twitter-feed')
    if (typeof twitterFeed !== 'undefined' && twitterFeedBox) {
      twitterFeedBox.classList.remove('u-hide')

      const twitterBox = document.createElement('div')
      twitterBox.innerHTML = `<a class="twitter-timeline" data-height="500" href="https://twitter.com/${twitterFeed}">Tweets by ${twitterFeed}</a>`

      twitterFeedBox.appendChild(twitterBox)

      loadScript('https://platform.twitter.com/widgets.js')
    }

    // Load Search
    // -----------------------------------------------------------------------------
    if (typeof searchSettings !== 'undefined' && typeof siteSearch !== 'undefined') {
      loadScript('https://unpkg.com/@tryghost/content-api@1.3.3/umd/content-api.min.js', () => {
        loadScript(siteSearch)
      })
    }

    // Scrolll
    // -----------------------------------------------------------------------------
    const backToTop = qs('.back-to-top')
    const domBody = document.body
    const hasCover = domBody.closest('.has-cover')

    const mapacheScroll = () => {
      const scrollY = window.scrollY

      //  Show Button for <Back-To-Top>
      if (backToTop && scrollY > 500) {
        backToTop.classList.add('to-top')
      } else {
        backToTop.classList.remove('to-top')
      }

      // show background and transparency
      // in header when page have cover image
      if (hasCover) {
        scrollY >= 60 ? domBody.classList.remove('is-transparency') : domBody.classList.add('is-transparency')
      }
    }

    window.addEventListener('scroll', mapacheScroll)
  }
}
