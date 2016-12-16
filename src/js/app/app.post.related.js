/*
* @package godofredoninja
* Post related and use first Tags
*/
class postRelated {
  constructor(elem) {
    this.box = elem;
    this.postID = parseFloat(elem.attr('mapache-post-id'));
    this.postTotal = parseFloat(elem.attr('mapache-post-total'));
    this.postTagID = parseFloat(elem.attr('mapache-tag-id'));
    this.pageURL = elem.attr('mapache-page-url');
    this.realatedTitle = elem.attr('mapache-related-title');
    this.urlApi = ghost.url.api('posts', { include: 'tags' }); // eslint-disable-line
    this.count = 0;
  }

  mapacheTemplate(post) {
    const entryTitle = post.title;
    const entryURL = post.url;
    const entryImage = post.image;

    let html = '';
    let image = '';
    let imageNoCover = 'no-image';

    if (entryImage !== null && entryImage !== '') {
      image = `
        <figure class="entry-image">
          <a href="${this.pageURL}${entryURL}" class="entry-image--link">
            <span class="entry-image--bg" style="background-image:url(${entryImage})"></span>
          </a>
        </figure>`;

      imageNoCover = '';
    }

    html = `
      <div class="col s12 m6 l4 ${imageNoCover}">
        <div class="entry entry--small">
          ${image}
          <h3 class="entry-title"><a href="${this.pageURL}${entryURL}">${entryTitle}</a></h3>
        </div>
      </div>
    `;

    return html;
  }

  /**
   * Display Post
   * @param  {res} All post Json
   * @return {html} Append in #related-wrap
   */
  mapacheCallback(rest) {
    let html = '';

    rest.forEach((post) => {
      post.tags.forEach((tags) => {
        if (tags.id === this.postTagID && post.id !== this.postID) {
          if (this.count < this.postTotal) {
            html += this.mapacheTemplate(post);
            this.count += 1;
          }
        }
      });
    });

    const postRelatedBox = `
      <div class="post-related u-h-b-md" ">
        <h2 class="post-related-title u-b-b">${this.realatedTitle}</h2>
        <div id="post-related-wrap" class="row">${html}</div>
      </div>
    `;

    if (this.count !== 0) this.box.append(postRelatedBox);
  }

  /**
   * Get api ghost
   * @return {res} Json all Post
   */
  mapacheGet() {
    $.get(this.urlApi)
      .done((data) => {
        this.mapacheCallback(data.posts);
      });
      // .fail(() => {
      //   this.box.remove();
      // });
  }

}

/* Export Module */
module.exports = postRelated;
