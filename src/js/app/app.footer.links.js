import { qs, urlRegexp } from './app.variables'

export default links => {
  const box = qs('.js-footer-menu')
  box.classList.remove('u-hide')

  Object.entries(links).forEach(([name, url]) => {
    if (name !== 'string' && !urlRegexp.test(url)) return

    const link = document.createElement('li')
    link.innerHTML = `<a href="${url}" title="${name}">${name}</a>`

    box.appendChild(link)
  })
}
