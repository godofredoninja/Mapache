/*
* @package godofredoninja
* Articles realred use first tag
*/
class mapacheRelated {
	constructor(elem, pageUrl) {
		this.elem       = elem;
		this.postID     = elem.attr('mapache-post-id');
		this.postTotal  = elem.attr('mapache-post-total');
		this.postTags   = elem.attr('mapache-tag');
		this.urlApi     = ghost.url.api('posts', {include: 'tags'});
		this.count      = 0;
		this.pageUrl	= pageUrl;
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

		$('#post-related-wrap').html(html);
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

		if (post.image !== null) {
			post_image = `
			<figure class="entry-image">
				<a href="${this.pageUrl}${post_url}" class="entry-image--link">
					<span class="entry-image--bg" style="background-image:url(${post.image})"></span>
				</a>
			</figure>`;

			post_no_cover ='';
		}

		html = `
		<div class="col s12 m6 l4 ${post_no_cover}">
			<div class="entry entry--small">
				${post_image}
				<h3 class="entry-title"><a href="${this.pageUrl}${post_url}">${post_title}</a></h3>
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
