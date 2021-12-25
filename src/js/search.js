/* global fetch localStorage searchSettings */

// https://github.com/godofredoninja/simply/blob/631fb0cbc4980c6594a44c10fecd412425a018b1/src/js/app/app.instagram.js

import SearchinGhost from './lib/searchinghost'

(function (document) {
  const $body = document.body
  const $searchBox = document.querySelector('.js-search')
  const $input = document.querySelector('#search-bar')
  const $results = document.querySelector('#search-results')
  // const $searchMessage = document.querySelector('.js-search-message')

  const classIsActive = 'is-active'

  let allSearchLinksLength = 0

  const storageAvailable = () => {
    try {
      window.localStorage.setItem('storage-mapache-test', '')
      window.localStorage.removeItem('storage-mapache-test')
      return window.localStorage
    } catch (err) {
      return undefined
    }
  }

  const isStorageAvailable = storageAvailable()

  // Template
  const templateSearch = post => `<a class="block noWrapWithEllipsis px-4 py-2" href="${post.url}"><svg class="icon is-x-small mr-2"><use xlink:href="#icon-search"></use></svg> <span>${post.name === undefined ? post.title : post.name}</span></a>`

  /* Customized search data
  /* ---------------------------------------------------------- */
  const mySearchSettings = {
    key: searchSettings.key,
    template: post => templateSearch(post),
    onSearchEnd: function (posts) {
      allSearchLinksLength = posts.length

      // Active class to link search
      searchResultActive()

      const geTagsStorage = JSON.parse(localStorage.getItem('mapache_tags'))

      if ($input.value === '' && geTagsStorage) {
        displayTags(geTagsStorage)
      }
    }
  }

  /* when the Enter key is pressed
  /* ---------------------------------------------------------- */
  function enterKey () {
    const link = $results.querySelector(`li.${classIsActive}`)
    link && link.firstChild.click()
  }

  /* Attending the active class to the search link
  /* ---------------------------------------------------------- */
  function searchResultActive (index) {
    index = index || 0

    const allSearchLinks = $results.querySelectorAll('li')

    // Return if there are no results
    if (!allSearchLinks.length) return

    // Remove All class Active
    allSearchLinks.forEach(element => element.classList.remove(classIsActive))

    // Add class active
    allSearchLinks[index].classList.add(classIsActive)
  }

  /* Reacted to the up or down keys
  /* ---------------------------------------------------------- */
  function arrowKeyUpDown (keyNumber) {
    // let upDown
    let indexTheLink = 0

    const resultActive = $results.querySelector(`li.${classIsActive}`)

    if (resultActive) {
      indexTheLink = [].slice.call(resultActive.parentNode.children).indexOf(resultActive)
    }

    $input.blur()

    // 38 === UP
    if (keyNumber === 38) {
      // upDown = 'up'

      if (indexTheLink <= 0) {
        $input.focus()
        indexTheLink = 0
      } else {
        indexTheLink -= 1
      }
    } else {
      // upDown = 'down'

      if (indexTheLink >= allSearchLinksLength - 1) {
        indexTheLink = 0
      } else {
        indexTheLink += 1
      }
    }

    searchResultActive(indexTheLink)
    // searchResultActive(indexTheLink, upDown)
  }

  /* Adding functions to the keys
  /* ---------------------------------------------------------- */
  function mySearchKey (e) {
    const keyNumber = e.keyCode

    /**
      * 38 => Up
      * 40 => down
      * 13 => enter
      **/
    if (keyNumber === 27) {
      toggleSearch()
    } else if (keyNumber === 13) {
      $input.blur()
      enterKey()
    } else if (keyNumber === 38 || keyNumber === 40) {
      arrowKeyUpDown(keyNumber)
      e.preventDefault()
    }
  }

  /* Maps Tags Data
  /* ---------------------------------------------------------- */
  const displayTags = data => {
    allSearchLinksLength = data.length

    data.forEach(tags => {
      const li = document.createElement('li')
      const tag = templateSearch(tags)
      li.innerHTML = tag

      $results.appendChild(li)
    })

    // data.map(tags => {
    //   const li = document.createElement('li')
    //   const tag = templateSearch(tags)
    //   li.innerHTML = tag

    //   return $results.appendChild(li)
    // })

    searchResultActive()
  }

  const getApi = async url => {
    const response = await fetch(url)
    const data = await response.json()
    return data
  }

  const fetchTags = () => {
    const siteURL = searchSettings.url === undefined ? window.location.origin : searchSettings.url
    const apiUrl = `${siteURL}/ghost/api/v4/content/tags/?key=${searchSettings.key}&filter=visibility:public&limit=10`

    const getLocaltags = localStorage.getItem('mapache_tags')

    if (getLocaltags) {
      displayTags(JSON.parse(getLocaltags))
    } else {
      getApi(apiUrl)
        .then(data => {
          displayTags(data.tags)

          if (!isStorageAvailable) return false

          localStorage.setItem('mapache_tags', JSON.stringify(data.tags))
        })
        .catch(err => console.error(err))
    }
  }

  /* Toggle Search arregla tu carrito
  /* ---------------------------------------------------------- */

  const $toggleSearch = document.querySelectorAll('.js-toggle-search')
  let hasSearch = false

  const toggleSearch = () => {
    if (!hasSearch) {
      // $searchBox.classList.add('hidden')
      $searchBox.classList.remove('hidden')
      $body.addEventListener('keydown', mySearchKey)
      $input.focus()

      hasSearch = true
    } else {
      // $searchBox.classList.remove('hidden')
      $searchBox.classList.add('hidden')
      $body.removeEventListener('keydown', mySearchKey)

      hasSearch = false
    }
  }

  $toggleSearch.forEach(btn => btn.addEventListener('click', function (e) {
    e.preventDefault()
    toggleSearch()
  }))

  /* Load tags Data
  /* ---------------------------------------------------------- */
  fetchTags()

  /* Search
  /* ---------------------------------------------------------- */
  /* eslint-disable no-new */
  new SearchinGhost(mySearchSettings)
})(document)
