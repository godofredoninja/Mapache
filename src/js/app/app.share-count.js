/*
* @package godofredoninja
*  Share count social media
*/

'use strict';

class GodoShareCount {
	constructor(elem) {
		this.elem 		= elem;
		this.url 		= elem.attr('godo-url');
		this.total 		= 0;
	}

	/**
	 * @function convertNumber
	 * @description  Return rounded and pretty value of share count.
	 */
	convertNumber(n){
		if(n>=1000000000) return (n/1000000000).toFixed(1)+'G';
		if(n>=1000000) return (n/1000000).toFixed(1)+'M';
		if(n>=1000) return (n/1000).toFixed(1)+'K';
		return n;
	}

	/**
	 * @function updateCounter
	 * @description  adds all the number of shared pages
	 */
	addCounter(n){
		this.total = this.total+n;
	}

	/**
	 * @function updateCounter
	 * @description  update the number of shares.
	 */
	updateCounter(){
		this.elem.html(`<span style="margin-right:5px"><strong>${this.convertNumber(this.total)}</strong></span><span>Shares</span>`);
	}

	godoCount(){

		$.getJSON('https://graph.facebook.com/?id=' + encodeURIComponent(this.url) + '&callback=?', response => {
			if (response.shares === undefined) this.addCounter(0);
			else
				this.addCounter(response.shares);
				this.updateCounter();
		});

	}
}

module.exports = GodoShareCount;
