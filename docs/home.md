# Home Page

> Mapache has 5 different home pages

1. [Default](#default) `index.hbs`
2. [Blog](#blog) `godo-home-blog.hbs`
3. [Travel](#travel) `godo-home-travel.hbs`
4. [Fashion](#fashion) `godo-home-fashion-concept`
5. [Personal](#personal) `godo-home-personal.hbs`

---

- First back up your `routes.yml` in your ghost settings ​ `Dashboard -> Labs -> Routes -> Download current routes.yml`
- Re-download the Route and edit `routes.yml` line `collections -> template`
- After doing the changes, save the file and upload again.
- If do not observe changes restart ghost

## Default

Default uses the `index.hbs` template, the stories are arranged in a grid pattern. If you want to use this template you don't need to make any changes.

![home-default](https://user-images.githubusercontent.com/10253167/146089544-d733cf02-e810-4d3d-ac62-637305e927b4.jpg)

## Blog

Beautiful and elegant post style

![home-blog](https://user-images.githubusercontent.com/10253167/146089541-6f4e86c9-413c-42e1-b48a-8a1e0a1f9c34.jpg)

```yaml
## routes.yaml
routes:

collections:
  /:
    permalink: /{slug}/
    template: godo-home-blog
    limit: 10

taxonomies:
  tag: /tag/{slug}/
  author: /author/{slug}/
```

## Travel

If you love to travel or you like photography, this is ideal for you. this template has a very large featured post

![home-travel](https://user-images.githubusercontent.com/10253167/146089553-2605c0c2-c0d4-424a-9cd0-a6269e88aeb7.jpg)

```yaml
## routes.yaml
routes:

collections:
  /:
    permalink: /{slug}/
    template: godo-home-travel

taxonomies:
  tag: /tag/{slug}/
  author: /author/{slug}/
```

## Fashion

It is dedicated to show post about fashion, the first three are featured posts.

![home-fashion](https://user-images.githubusercontent.com/10253167/146089546-674f72d4-1f62-4752-8dcf-ef6198f2befe.jpg)

```yaml
## routes.yaml
routes:

collections:
  /:
    permalink: /{slug}/
    template: godo-home-fashion-concept
    limit: 12

taxonomies:
  tag: /tag/{slug}/
  author: /author/{slug}/
```

## Personal

A very simple template for personal use showing information on the home page with a large image covering the background.

![home-personal-01](https://user-images.githubusercontent.com/10253167/146091438-cf1f8aa3-fadb-453c-91fe-434a99a061c4.jpg)

- Create a new page
- Choose your favorite title
- Use the `URL` -> `home-personal`

```yaml
## routes.yaml
routes:

collections:
  /:
    permalink: /{slug}/
    data:
      post: page.home-personal
    template: godo-home-personal
    limit: 12

taxonomies:
  tag: /tag/{slug}/
  author: /author/{slug}/
