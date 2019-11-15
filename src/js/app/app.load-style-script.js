export function loadStyle (href) {
  var linkElement = document.createElement('link')
  linkElement.rel = 'stylesheet'
  linkElement.href = href
  document.head.appendChild(linkElement)
}

export function loadScript (src, callback) {
  var scriptElement = document.createElement('script')
  scriptElement.src = src
  scriptElement.defer = true
  callback && scriptElement.addEventListener('load', callback)
  document.body.appendChild(scriptElement)
}
