/*
* @package godofredoninja
* Articles realred use first tag
*/
class mapacheRelated {
    constructor(elem) {
        this.elem       = elem;
        this.postID     = elem.attr('mapache-post-id');
        this.postTotal  = elem.attr('mapache-post-total');
        this.postTags   = elem.attr('mapache-tag');
        this.urlApi     = ghost.url.api('posts', {include: 'tags'});
        this.count      = 0;
    }

    /**
     * Display Post
     * @method mapacheCallback
     * @param  {res} All post Json
     * @return {html} Append in #related-wrap
     */
    mapacheCallback(res){
        let html = '';
        res.forEach( post => {
            for ( var i = 0; i < post.tags.length; i++ ) {
                if ( post.tags[i].id == this.postTags && post.id != this.postID ) {
                    if ( this.count < this.postTotal ) {
                        html += this.mapacheTemplate(post);
                        this.count++;
                    }
                }
            }
        });

        if (this.count == 0) {
            this.elem.css('display','none');
        }

        $('#related-wrap').html(html);
    }

    /**
     * Template related post
     * @method mapacheTemplate
     * @param  {post} Content Json post
     * @return {html} content related post
     */
    mapacheTemplate(post){
        let html            = '',
            post_image      = '',
            post_no_cover   = 'no-image',
            post_title      = post.title,
            post_url        = post.url;

        if (post.image != null) {
            post_image = `
            <figure class="image">
                <a href="${post_url}" class="image-link">
                    <span class="entries-bg" style="background-image:url(${post.image})"></span>
                </a>
            </figure>`;

            post_no_cover ='';
        }

        html = `
        <div class="col m4 ${post_no_cover}">
            <div class="related-posts-list">
                ${post_image}
                <h2 class="title"><a href="${post_url}">${post_title}</a></h2>
            </div>
        </div>`;

        return html;
    }

    /**
     * Get api ghost
     * @method mapacheGet
     * @return {res} Json all Post
     */
    mapacheGet(){
        fetch(this.urlApi)
        .then( res => {
            return res.json();
        })
        .then( json => {
            this.mapacheCallback( json.posts );
        });
    }

}

module.exports = mapacheRelated;
