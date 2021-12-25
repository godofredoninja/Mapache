/* global localStorage  */
import docSelectorAll from './document-query-selector-all'

export default el => {
  const $toggleTheme = docSelectorAll(el)

  if (!$toggleTheme.length) return

  const rootEl = document.documentElement

  $toggleTheme.forEach(item => item.addEventListener('click', function (event) {
    event.preventDefault()

    if (!rootEl.classList.contains('dark')) {
      rootEl.classList.add('dark')
      localStorage.theme = 'dark'
    } else {
      rootEl.classList.remove('dark')
      localStorage.theme = 'light'
    }
  }))
}
