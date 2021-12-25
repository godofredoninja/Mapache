export default el => {
  const $header = document.querySelector(el)

  if (!$header) return

  const $search = document.querySelector('.js-search')

  let prevScrollpos = window.pageYOffset

  window.onscroll = function () {
    const currentScrollPos = window.pageYOffset

    if (prevScrollpos > currentScrollPos) {
      $header.classList.remove('-top-18')
      $search.classList.add('mt-16')
    } else {
      $header.classList.add('-top-18')
      $search.classList.remove('mt-16')
    }

    prevScrollpos = currentScrollPos
  }
}
