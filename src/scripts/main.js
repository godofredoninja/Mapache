// import external dependencies
// import 'jquery';
import 'theia-sticky-sidebar/dist/ResizeSensor';
import 'theia-sticky-sidebar';
import 'jquery-lazyload';

// Import everything from autoload
import './autoload/**/*';

// import local dependencies
import Router from './util/Router';
import common from './routes/common';
import home from './routes/home';
import isArticle from './routes/post';
import isVideo from './routes/video';
import isAudio from './routes/audio';

/** Populate Router instance with DOM routes */
const routes = new Router({
  // All pages
  common,
  // Home page
  home,
  // article
  isArticle,
  // Video
  isVideo,
  // Audio
  isAudio,
});

// Load Events
$(document).on('ready', () => routes.loadEvents());
