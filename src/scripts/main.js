// import external dependencies
// import 'jquery';
import 'prismjs';
import 'prismjs/plugins/autoloader/prism-autoloader';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'sticky-kit/dist/sticky-kit';
import 'jquery-lazyload';

// Import everything from autoload
import "./autoload/**/*";

// import local dependencies
import Router from './util/Router';
import common from './routes/common';
import home from './routes/home';
import isArticle from './routes/post';

/** Populate Router instance with DOM routes */
const routes = new Router({
  // All pages
  common,
  // Home page
  home,
  // article
  isArticle,
});

// Load Events
$(document).on('ready', () => routes.loadEvents());
