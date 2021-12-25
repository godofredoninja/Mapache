/* global prismJs */

import loadScript from './load-script'
import docSelectorAll from '../app/document-query-selector-all'

export default codeLanguage => {
  const $codeLanguage = docSelectorAll(codeLanguage)

  if (!$codeLanguage.length && typeof prismJs === 'undefined') return

  // Show Language
  $codeLanguage.forEach(element => {
    let language = element.getAttribute('class')
    language = language.split('-')
    element.parentElement.setAttribute('rel', language[1])
  })

  // Load PrismJs and Plugin Loaf
  loadScript(prismJs)
}
