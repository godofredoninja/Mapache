import { qsa, urlRegexp } from './app.variables'

export default socialMedia => {
  const createElement = box => {
    Object.entries(socialMedia).forEach(([name, urlTitle]) => {
      if (urlTitle[0] !== 'string' && !urlRegexp.test(urlTitle[0])) return

      const link = document.createElement('a')
      link.href = urlTitle[0]
      link.title = urlTitle[1]
      // link.classList = `i-${name}`
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      link.innerHTML = `<svg class="icon"><use xlink:href="#icon-${name}"></use></svg>`

      box.appendChild(link)
    })
  }

  // Append Social Media
  qsa('.js-social-media').forEach(el => createElement(el))
}
