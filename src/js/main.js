/* global followSocialMedia siteSearch */

// lib
import 'lazysizes'

import socialMedia from './app/social-media'
import darkMode from './app/dark-mode'
import headerTransparency from './app/header-transparency'
import loadScript from './components/load-script'
import scrollHideHeader from './components/scroll-hide-header'

const MapacheSetup = () => {
  /**
   * Links to social media
   *
   * @param  {Object[name, url, title]} followSocialMedia -  This variable will come from the ghost dashboard
   * @param  {Element} '.js-social-media' - All elements containing this class will be selected and the social media links will be appended.
   */
  if (typeof followSocialMedia === 'object' && followSocialMedia !== null) {
    socialMedia(followSocialMedia, '.js-social-media')
  }

  /**
   * Dark Mode
   * @param  {Element} '.js-dark-mode' - Class name of all buttons for changing the dark mode
   */
  darkMode('.js-dark-mode')

  /**
   * Header - Add and remove transparency when the header is larger than 64px
   * and the page contains the cover.
   *
   * @param  {Element} '.has-cover' - The class will be in the body indicating that it is enabled to add transparency.
   * @param  {className} 'is-head-transparent' - Add this class to the body to make it transparent.
   */
  headerTransparency('.has-cover', 'is-head-transparent')

  /* Toggle Mobile Menu
  /* ---------------------------------------------------------- */
  document.querySelector('.js-menu-open').addEventListener('click', function (e) {
    e.preventDefault()
    document.querySelector('.js-search').classList.add('hidden')
    document.body.classList.add('has-menu')
  })

  document.querySelector('.js-menu-close').addEventListener('click', function (e) {
    e.preventDefault()
    document.body.classList.remove('has-menu')
  })

  /**
   * Search - Load the lazy search Script
   * @param  {String} siteSearch - assets/scripts/search.js
   */
  if (typeof searchSettings !== 'undefined' && typeof siteSearch !== 'undefined') {
    loadScript(siteSearch)
  }

  /**
   * header hide when scrolling down and show when scrolling up
   * @param  {Element} '.js-hide-header' - Header class
   */
  scrollHideHeader('.js-hide-header')

  // End MapacheSetup
}

document.addEventListener('DOMContentLoaded', MapacheSetup)
