# Mapache for [Ghost](https://github.com/tryghost/ghost/) by GodoFredo

[![Ghost version](https://img.shields.io/badge/Ghost-0.11.x-brightgreen.svg?style=flat-square)](https://ghost.org/)
[![Node version](https://img.shields.io/node/v/uno-zen.svg?style=flat-square)](https://nodejs.org/en/)
[![Donate](https://img.shields.io/badge/donate-paypal-blue.svg?style=flat-square)](http://bit.ly/DonateMapacheGhost)

> Minimalist Material Design and Elegant theme for [Ghost](https://github.com/tryghost/ghost/).

### Free theme for Ghost

Hello, I created this theme Ghost to see how it works. It is available for free so you can use on your site. It is strictly forbidden commercial use. If you have any suggestions to improve the theme,  you can send me tweet to [@GodoFredoNinja](http://bit.ly/tw-GodoFredoNinja)

![](./documentation/mapache-screenshot.png)


## Demo
You can see a demo in my [blog](http://bit.ly/GodoFredoNinja-blog).

## Mapache Support for Web Browsers
Mapache supports the following web [browsers](http://caniuse.com/#search=flexbox)

## Featured
- Responsive layout
- Blog navigation
- Page 404
- Page subscribe
- Pagination Infinite Scroll
- Cover images for blog, tag and author
- links to followers in social media
- Related Articles (6 articles)
- Video Post Format
- Image post Format
- 5 articles featured in the home of the page section sidebar
- 5 articles latest posts in the (author - tag - post) section sidebar
- Support for comments (Facebook or Disqus)
- Support for counter comments (Facebook or Disqus)
- Buttons to share the article
- Counter shared articles on Facebook
- YouTube, Vimeo, kickstarter -> Video Responsive
- Code syntax [Prismjs](http://prismjs.com/index.html) Supported all syntax.


### Replace icon
Replace icon with these measures `155px * 155px` in `./assets/img/icon.png`



## Mapache settings
- You have to enable via a checkbox on the labs page in your Ghost admin panel.

![](./documentation/img-api.png)



``` html
<script>
/* links to followers in social media */
var social_link = {
	'google': 'https://...',
	'youtube': 'https://...',
	'instagram': 'https://...',
	'snapchat': 'https://...',
	'dribbble': 'https://...',
	'github': 'https://...',
	'linkedin':'https://...',
	'spotify':'https://...',
	'codepen':'https://...',
	'behance':'https://...',
	'flickr':'https://...',
	'pinterest':'https://...',
	'feed':'https://...',
}

/* Title for home Page */
var title_home = '... your title ...';

/*Youtube button subscribe for post video format*/
var youtube = {'YOUR_CHANNEL_NAME':'YOUR_CHANNEL_ID'}

/*Disqus for Comments*/
var disqus_shortname = 'YOUR_DISQUS_SHORTCUT_HERE';

</script>

<!-- Disqus Comments Count-->
<script id="dsq-count-scr" src="//YOUR_DISQUS_SHORTCUT_HERE.disqus.com/count.js" async></script>

```

![](./documentation/code-footer.png)


## Add Style Theme

```html
<!-- Theme indigo -->
<link rel="stylesheet" href="/assets/css/themes/indigo.css"/>
<!-- Theme dark blue -->
<link rel="stylesheet" href="/assets/css/themes/dark-blue.css"/>
<!-- Theme blue semi dark -->
<link rel="stylesheet" href="/assets/css/themes/blue-semi-dark.css"/>
<!-- Theme blue -->
<link rel="stylesheet" href="/assets/css/themes/blue.css"/>
<!-- Theme Grey -->
<link rel="stylesheet" href="/assets/css/themes/grey.css"/>
<!-- Theme dark cyan -->
<link rel="stylesheet" href="/assets/css/themes/dark-cyan.css"/>
<!-- Theme purple -->
<link rel="stylesheet" href="/assets/css/themes/purple.css"/>
<!-- Theme teal -->
<link rel="stylesheet" href="/assets/css/themes/teal.css"/>
<!-- Theme Green -->
<link rel="stylesheet" href="/assets/css/themes/green.css"/>

<!-- For theme white add two-color logo 230px * 130px -->

<!--
	***** 230px *****
	*				*
	***************** 130px
	*				*
	*****************
-->


<link rel="stylesheet" href="/assets/css/themes/white.css"/>

```

![](./documentation/img-four.png)


### Edit Sidebar

`./partials/sidebar.hbs`

```html

<div class="sidebar-items">
	<div class="sidebar-title">...your title...</div>
	... your content ...
</div>

<!-- Add your content here - block fixed -->
<div class="sidebar-items">
	<div class="fixed">
		... your content fixed ...
	</div>
</div>

```


### Buttons
```html
... <a class="external" href="http://..." >Your link external</a> ...

<a class="btn external" href="http://..." >link external</a>

<a class="btn btn-download" href="http://..." >download</a>

<a class="btn btn-download-cloud" href="http://..." >download</a>
```
![](./documentation/buttons.png)


### Warning - Note - Success
```html
<p class="warning"> ... your text warning ... </p>

<p class="note"> ... your text note ... </p>

<p class="success"> ... your text success ... </p>
```
![](./documentation/note.png)


### PrismJS code syntax  

Add the alias according to what you need  [List language Prismjs](http://prismjs.com/#languages-list)

![](./documentation/code.png)

## Video Post Format
if you want to have a video format, you only have to add a tag `#video-post-format` the first video will move to large size

![](./documentation/video-format.png)

![](./documentation/video.png)

## Image Post Format
if you want to have a image format, you only have to add a tag `#image-post-format` the image Featured will move to large size

## Enable comments for Facebook
To use facebook comments, skip the configuration Disqus.

This enables comments and counter comment

1. Add the code section -> Code Injection -> Blog Header
```html
<style>
	.mapache-disqus{
		display: none !important;
	}
	.mapache-facebook{
		display: inline !important;
	}
</style>
```
2. Add the code section -> Code Injection -> Blog Footer
```html
	<div id="fb-root"></div>
	<script>
	(function(d, s, id) {
	  var js, fjs = d.getElementsByTagName(s)[0];
	  if (d.getElementById(id)) return;
	  js = d.createElement(s); js.id = id;
	  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.6";
	  fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
	</script>
```

### Credits
- [Normalize](https://necolas.github.io/normalize.css/)
- [Jquery.ghostHunter](https://github.com/jamalneufeld/ghostHunter)
- [Prismjs](http://prismjs.com/)

## Copyright & License

Copyright (c) 2016 GodoFredo - Released under the [MIT license](LICENSE).
