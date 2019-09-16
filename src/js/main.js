// import external dependencies
import 'lazysizes';
import 'theia-sticky-sidebar';

// Import everything from autoload
// import './autoload/**/*';

// Impor main Script
import './mapache';

// Pagination infinite scroll
// import './app/pagination';

// import local dependencies
import Router from './util/Router';
import common from './routes/common';
import isArticle from './routes/post';
import isVideo from './routes/video';
import isNewsletter from './routes/newsletter';


/** Populate Router instance with DOM routes */
const routes = new Router({
  // All pages
  common,

  // article
  isArticle,

  // video post format
  isVideo,

  // Newsletter page
  isNewsletter,

  // Audio post Format
  // isAudio,
});

// Load Events
jQuery(document).ready(() => routes.loadEvents());
