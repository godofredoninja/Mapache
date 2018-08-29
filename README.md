# Free theme for [Ghost](https://github.com/tryghost/ghost/)

[![Ghost version](https://img.shields.io/badge/Ghost-1.x-brightgreen.svg)](https://github.com/TryGhost/Ghost)
[![Node](https://img.shields.io/node/v/uno-zen.svg)](https://nodejs.org/en/)
[![Donate](https://img.shields.io/badge/donate-paypal-blue.svg)](https://bit.ly/PayPal-GodoFredoNinja)

> Minimalist Material Design and Elegant theme.

Hi. I created this theme for ghost especially for you.
It is available for free so you can use on your site. It is strictly forbidden to use it for commercial use. If you have any suggestions to improve the theme,  you can send me a tweet [@GodoFredoNinja](https://goo.gl/y3aivK)

## If you have a ❤ heart and value my work. 🙏 Please, help me with a small donation on [Paypal](https://bit.ly/PayPal-GodoFredoNinja). It'll help motivate me to update the theme with many improvements

[![donate](./donate.gif)](https://bit.ly/PayPal-GodoFredoNinja)

![mapache theme for ghost](./screenshot.png)

## Demo

You can see mapache in action on my Page [Demo](https://goo.gl/V7moIY)

## Featured

- Support for different [languages](http://themes.ghost.org/docs/i18n#section-how-to-add-any-language) (en - es)
- Responsive layout
- 404 error page (emoticons — last 6 articles)
- Page subscribe
- Pagination Infinite Scroll
- Instagram Feed in footer of Post
- Optional menu at the footer of the page
- [AMP](https://github.com/godofredoninja/Hodor-AMP-Template-for-Ghost) Template (Accelerated Mobile Pages)
- Follow on Social Media
- Related Articles (6 articles)
- Template - Post single
- Template - Post full header
- Template - Video post format
- Template - Image post format
- Template - Image single post format
- Template - not image post => featured image is not displayed
- 5 featured articles in the sidebar (home - tag - author)
- 5 lates articles in the sidebar (post)
- Tag Cloud in the sidebar
- Previous and next articles buttons
- Support for comments (Facebook or Disqus)
- Support for counter comments (Facebook or Disqus)
- Buttons to share the article (Facebook - Twitter - Reddit - Linkedin - Pinterest - Whatsapp)
- Sticky content in the sidebar
- YouTube, Vimeo, kickstarter, Facebook, dailymotion => Responsive
- Lazy image loading for better performance only in backgrounds
- Code syntax [Prismjs](http://prismjs.com/index.html#languages-list) Supported all syntax.

## Ghost settings

- Enable **all** checkboxes on the labs page in your Ghost admin panel.

![](./documentation/img-api.png)

## Mapache settings

### Social Links

Add the Social Links only for the services you want to appear in the header section of your website. Pay attention as enabling too many services will cause menu problems.

### YouTube Subscribe Button

This section enables the YouTube Post format. Add the Channel Name and Channel ID which can be found here [YouTube Advanced Settings](https://www.youtube.com/account_advanced)

— Copy the below script to `Settings -> Code Injection  -> Blog Footer section`

```html
<script>
/*====================================================
  THEME SETTINGS & GLOBAL VARIABLES

### Facebook Comments

To use facebook comments, skip the configuration Disqus.

This enables comments and comment counter

— Add the code `Settings -> Code Injection -> Blog Footer`

```html
  <div id="fb-root"></div>
  <script>(function(d, s, id) {
    $('.mapache-facebook').removeClass('u-hide');
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.async=true;
    js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.11';
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));</script>
```

## Publication Language

**Mapache supports:**

- `en` — English default language
- `es` — Español
- `de` — German

![](./documentation/language.png)

if you want to have in another language you just have to copy `locales>en.json` and rename the file then translate to your favorite language:

Just enter the [language/locale tag](https://www.w3schools.com/tags/ref_language_codes.asp) of the files to use (e.g.: `fr.json` for French, `zh.json` for Chinese, `ja.json` for Japanese)

## Change Theme Style

To change the color of the Mapache theme select one of the theme styles below and copy it into the Setting -> Code Injection -> Blog Header

```html
<!-- Theme indigo -->
<link rel="stylesheet" href="/assets/styles/theme-indigo.css"/>
<!-- Theme dark blue -->
<link rel="stylesheet" href="/assets/styles/theme-dark-blue.css"/>
<!-- Theme blue semi dark -->
<link rel="stylesheet" href="/assets/styles/theme-blue-semi-dark.css"/>
<!-- Theme blue -->
<link rel="stylesheet" href="/assets/styles/theme-blue.css"/>
<!-- Theme Grey -->
<link rel="stylesheet" href="/assets/styles/theme-grey.css"/>
<!-- Theme dark cyan -->
<link rel="stylesheet" href="/assets/styles/theme-dark-cyan.css"/>
<!-- Theme purple -->
<link rel="stylesheet" href="/assets/styles/theme-purple.css"/>
<!-- Theme teal -->
<link rel="stylesheet" href="/assets/styles/theme-teal.css"/>
<!-- Theme Green -->
<link rel="stylesheet" href="/assets/styles/theme-green.css"/>

<!-- For theme white add two-color logo 230px * 130px -->

<!--
  ***** 230px *****
  *               *
  ***************** 130px
  *               *
  *****************
-->


<link rel="stylesheet" href="/assets/styles/theme-white.css"/>
```

![](./documentation/img-four.png)

### Add additional content to the sidebar

Add you own custom content into the side bar by editing the `./partials/sidebar.hbs` file.

```html
<!-- Add your content to the bottom -->
<div class="sidebar-items">
  <div class="sidebar-title">...your title...</div>
  ... your content ...
</div>
```

### Warning - Note - Success

Add some more styling options to your articles text with these three styles.

```html
<p class="warning"> ... your text warning ... </p>

<p class="note"> ... your text note ... </p>

<p class="success"> ... your text success ... </p>
```

![](./documentation/note.png)

### PrismJS code syntax

Make your code stand out. WIth the PrismJS code highlighter. PrismJS allows you to select which languge you embeded and performs code highlighting according to the language. Neat!

Take a look at the [Prismjs Supported Language List](http://prismjs.com/#languages-list)

![](./documentation/code.png) to find your coding language.

## Template for (Video - Image - Audio)

**Image** — The Featured image will become large in size.

**Video** — The first video in the article will be large in size. Supports formats

- vimeo
- Dailymotion
- Youtube
- Vid
- kickstarter

**Audio** — The first Audio in the article will be large in size. Supports formats

- Soundcloud
- Mixcloud
- Spotify

> Add video or Audio where convenient. When you change the theme you will not have problems and not have Problem in your AMP Template

![](./documentation/video-format.png)

![](./documentation/video.png)

### Credits

- [Hodor AMP Template](https://github.com/godofredoninja/Hodor-AMP-Template-for-Ghost)
- [Normalize](https://necolas.github.io/normalize.css/)
- [Jquery.ghostHunter](https://github.com/jamalneufeld/ghostHunter)
- [Prismjs](http://prismjs.com/)
- [sticky-kit](https://github.com/leafo/sticky-kit)
- [lunr.js](https://github.com/olivernn/lunr.js)
- [zoom.js](https://github.com/fat/zoom.js/)
- [jquery-lazyload](http://www.appelsiini.net/projects/lazyload)
- [Fonts](https://fonts.google.com/?selection.family=Fira+Mono|Merriweather:400,700|Ruda:400,700,900&query=Merriweather)

## Copyright & License

Copyright (c) 2017 GodoFredoNinja - Released under the [CC BY-NC-SA 4.0](LICENSE).
