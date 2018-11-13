// import external dependencies
import 'theia-sticky-sidebar';

// Import everything from autoload
import './autoload/**/*';

// Impor main Script
import './app/app.main'

// Pagination infinite scroll
// import './app/pagination';

// import local dependencies
import Router from './util/Router';
import common from './routes/common';
import isArticle from './routes/post';
import isVideo from './routes/video';
// import isAudio from './routes/audio';
import isPagination from './app/app.pagination'


/** Populate Router instance with DOM routes */
const routes = new Router({
  // All pages
  common,

  // article
  isArticle,

  // Pagination (home - tag - author) infinite scroll
  isPagination,

  // video post format
  isVideo,

  // Audio post Format
  // isAudio,
});

// Load Events
jQuery(document).ready(() => routes.loadEvents());
