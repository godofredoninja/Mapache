# Archive Page

> Mapache has a beautiful template for listing articles in a single file.

![Archive Page](https://user-images.githubusercontent.com/10253167/146582392-d4cd4d8e-ef15-471e-8e75-d9ff68e0a524.jpg)

If you want to change the title that says. The full archive, just edit the file `godo-archive.hbs` inside the theme.

👉 Archive Route

``` yaml
## routes.yaml
routes:
  /archive/:
    controller: channel
    order: published_at desc
    limit: 50
    template: godo-archive

collections:
  /:
    permalink: /{slug}/
    template: index

taxonomies:
  tag: /tag/{slug}/
  author: /author/{slug}/
```
