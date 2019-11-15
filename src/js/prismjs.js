/* global sitePrismJscomponents Prism */
import 'prismjs'
import 'prismjs/plugins/autoloader/prism-autoloader'
// import 'prismjs/plugins/line-numbers/prism-line-numbers'

if (typeof sitePrismJscomponents !== 'undefined') {
  Prism.plugins.autoloader.languages_path = sitePrismJscomponents
}
