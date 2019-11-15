// import external dependencies
import 'lazysizes'

// import local dependencies
import Router from './util/Router'
import common from './routes/common'
import isArticle from './routes/post'
import isArticleSingle from './routes/post-single'
import isVideo from './routes/video'

/** Populate Router instance with DOM routes */
const routes = new Router({
  // All pages
  common,

  // article
  isArticle,

  // video post format
  isVideo,

  // Article Single
  isArticleSingle
})

// Load Events
window.addEventListener('load', routes.loadEvents(), false)
