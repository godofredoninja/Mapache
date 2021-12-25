// Post
import './main'

import videoResponsive from './components/video-responsive'
import resizeImagesInGalleries from './components/resize-images-galleries'
import highlightPrism from './components/highlight-prismjs'
import mapacheGallery from './components/gallery'

// Post
import isSinglePost from './post/is-singgle-post'

const MapachePostSetup = () => {
  /* All Video Responsive
  /* ---------------------------------------------------------- */
  videoResponsive()

  /* Gallery Card
  /* ---------------------------------------------------------- */
  resizeImagesInGalleries()

  /* highlight prismjs
  /* ---------------------------------------------------------- */
  highlightPrism('code[class*=language-]')

  /* Is single post
  /* ---------------------------------------------------------- */
  isSinglePost()

  /* Mapache Gallery
  /* ---------------------------------------------------------- */
  mapacheGallery()

  // End MapacheSetup
}

document.addEventListener('DOMContentLoaded', MapachePostSetup)
