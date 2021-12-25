# Podcast Page

👉 To set the podcast page follow the steps below.

- Create a new page
- Choose your favorite title
- Use the URL `podcast`
- In your articles use the internal tags `#podcast`

👉 **Podcast collection**

- Appears on: `site.com/podcast/`
- Post URLs: `site.com/poscast/my-poscast/`

```yaml
routes:

collections:
  # Podcast
  /podcast/:
    permalink: /podcast/{slug}/
    filter: 'tag:[hash-podcast]' # -> #podcast internal tah
    data: page.podcast
    template: godo-podcast
    limit: 12

  # Default
  /:
    permalink: /{slug}/
    template: index

taxonomies:
  tag: /tag/{slug}/
  author: /author/{slug}/
```

- In an `HTML` block in your ghost editor add this code for your content.

```html
<p class="spc-h-e">The Podcast</p>

<p class="spc-des">Updates and behind the scenes stories about the world of Ghost. Hosted by Ghost founders <em>John O'Nolan</em> &amp; <em>Hannah Wolfe</em>.</p>
```

```html
<div class="spc-buttons">

    <a href="https://itunes.apple.com/" class="button">
    <img src="/assets/images/icon-itunes.png" alt="iTunes Logo" rel="presentation"/>
    <span>iTunes</span>
  </a>

  <a href="https://www.pocketcasts.com/" class="button">
    <img src="/assets/images/icon-pocketcasts.png" alt="Pocket Casts Logo" rel="presentation"/>
    <span>Pocket Casts</span>
  </a>

  <a href="https://anchor.fm/" class="button">
    <img src="/assets/images/icon-rss.png" style="height:15px" alt="RSS Icon" rel="presentation"/>
    <span>RSS</span>
  </a>

</div>
```

![Ghost page podcast](https://user-images.githubusercontent.com/10253167/146419231-6a80eedb-c038-4782-b7e2-c27a81ef67f0.jpg)
