/*
* @package godofredoninja
*  pagination
*/

$(document).on('ready', function() {
	let page = 2;

	const $pagination   = $('#pagination'),
		pageTotal       = $pagination.attr('mapache-page'),
		pageLimit       = $pagination.attr('mapache-limit'),
		urlPage         = $('link[rel=canonical]').attr('href'),
		$win            = $(window);

	if ( pageTotal >= page) {
		$('.pagination').css('display', 'block');
		// infiniteScroll();
	}

	/**
	 * @description call first getPost and add class for infinite-scroll
	 * @return {getPost} [returns the number of the page with articles]
	 */
	$pagination.on('click', function(e){
		e.preventDefault();
		$pagination.addClass('infinite-scroll');
		
		if( page <= pageTotal ){
			getPost();
		}else {
			$('.pagination').remove();
		}
	});

	/**
	 * @description the second brings forward makes infinite scroll
	 * @return {getPost} [returns the number of the page with articles]
	 */
	$win.on('scroll', () => {
		if ( $pagination.hasClass('infinite-scroll') ) {

			if( $win.scrollTop() + $win.height() == $(document).height() ) {

				if( page <= pageTotal ){
					getPost();
				}else {
					$('.pagination').remove();
				}

			}
		}

	});

	/**
	 * @description does the requested of items according to the page number sent
	 */
	function getPost() {

		$pagination.addClass('loanding').html('Loading more');

		fetch(urlPage+'page/'+page)
		.then( res => {
			return res.text()
		})
		.then( body => {

			setTimeout( () => {
				let entries = $('.entry-pagination',body);
				$('.feed-wrapper').append(entries);
				$pagination.removeClass('loanding').html('Load more');
				page++;
			}, 1000);

		});
	}



});
