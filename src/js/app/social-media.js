
import docSelectorAll from './document-query-selector-all'

export default (socialMediaData, boxSelector) => {
  // check if the box for the menu exists
  const nodeBox = docSelectorAll(boxSelector)

  if (!nodeBox.length) return

  const urlRegexp = url => /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/.test(url) //eslint-disable-line

  const createElement = element => {
    Object.entries(socialMediaData).forEach(([name, urlTitle]) => {
      const url = urlTitle[0]

      // The url is being validated if it is false it returns
      if (!urlRegexp(url)) return

      const link = document.createElement('a')
      link.href = url
      link.title = urlTitle[1]
      link.classList = `button border-none hover:text-${name}`
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      link.innerHTML = `<svg class="icon icon--${name}"><use xlink:href="#icon-${name}"></use></svg>`

      element.appendChild(link)
    })
  }

  return nodeBox.forEach(createElement)
}
