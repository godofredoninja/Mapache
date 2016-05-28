/*
* @package godofredoninja
* pagination infinite scroll use Api ghost
*/

class Pagination {

    constructor(elem, page) {
        this.elem       = elem;
        this.pageLimit  = elem.attr('mapache-limit');
        this.pageUrl    = elem.attr('mapache-url');
        this.page       = page;
    }

    /**
    * @function callback
    * @description receives parameter. and he makes the travel arrangements. concatenated with the html
    */
    callback(res){
        let html = '';
        for ( let data of res ){
            html += this.pageTemplate(data);
        }
        $('#entry').append(html);
        // console.log(html);
    }

    /**
    * @description It calls through to get ghost api
    * @returns {res} json entries post
    */
    pagination(){
        $.get(ghost.url.api('posts', {limit: this.pageLimit, page: this.page, include: 'tags,author'}))
        .done( (res) => {
            this.callback(res.posts);
            console.log(res.posts);
        })
        .fail ( (err) => {
            console.log(err);
        });
    }

    /**
    * @function pageTemplate
    * @description  template page for post entries
    * @returns returns {html} Template page for post entries
    */
    pageTemplate(data){
        let post_url 	= data.url,
    		post_image 	= data.image,
    		post_title 	= data.title,
    		tag_name	= data.tags[0].name,
    		tag_url		= data.tags[0].slug,
    		author_name	= data.author.name,
    		author_url	= data.author.slug;

            if(post_image == null){
                console.log('no hay imagen');
            }

        var html = '';

        html =
        `<article class="col s12 entry-list">
    		<div class="entries">
    			<div class="row layout-wrap layout-row">

    				<figure class="col-gd-post-image image">
    					<a href="${post_url}" class="image-link">
    						<img src="${post_image}" alt="${post_title}" class="hide-after-lg"/>
    						<span class="entries-bg hide-before-lg" style="background-image:url(${post_image})"></span>
    					</a>
    				</figure>

    				<div class="col-gd-post-meta entries-meta">
    					<div class="tag"><a href="/tag/${tag_url}/">${tag_name}</a></div>
    					<h2 class="title"><a href="${post_url}" title="${post_title}">${post_title}</a></h2>
    					<div class="meta-author-date">
    						<span class="comment-count"><i class="i-chat"></i> <a class="gd-comment_count scroll" href="${post_url}#comments" godo-url="${this.pageUrl}${post_url}">0 Comments</a></span>
    						<i class="point">·</i>
    						<span class="author-name">By <strong><a href="/author/${author_url}/">${author_name}</a></strong></span>
    						<i class="point">·</i>
    						<span class="timestamp"><time datetime="{{date format='YYYY-MM-DD'}}">{{date published_at timeago="true"}}</time></span>
    					</div>
    					<div class="entries-excerpt hide-before-lg">{{excerpt words="15"}}</div>
    				</div>
    			</div>
    		</div>
    	</article>`;

        return html;
    }

}

module.exports = Pagination;
