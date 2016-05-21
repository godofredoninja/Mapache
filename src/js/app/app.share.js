/*
* @package godofredoninja
* Share social media
*/

'use strict';

class GodoShare {
	constructor(elem) {
		this.elem = elem;
	}
	
	 /**
     *  @function godoValue
     *  @description Helper to get the attribute of a DOM element
     *  @param {String} attr DOM element attribute
     *  @returns {String|Empty} returns the attr value or empty string
     */
	godoValue(a) {
        let val = this.elem.attr('godo-' + a);
        return (val === undefined || val === null) ? false : val;
	}
	
	/**
     * @event godoShare
     * @description Main share event. Will pop a window or redirect to a link
     */
	godoShare(){
		let share_name = this.godoValue('share').toLowerCase(),

		share_social = {
			facebook: {
				shareUrl: 'https://www.facebook.com/sharer/sharer.php',
				params: {u: this.godoValue('url')}
			},
			twitter: {
                shareUrl: 'https://twitter.com/intent/tweet/',
                params: {
                    text: this.godoValue('title'),
                	url: this.godoValue('url'),
                }
			},
			reddit: {
				shareUrl: 'https://www.reddit.com/submit',
				params: {'url': this.godoValue('url')}
			},
			pinterest: {
            	shareUrl: 'https://www.pinterest.com/pin/create/button/',
				params: {
					url: this.godoValue('url'),					
					description: this.godoValue('title')
                }
			},
			pocket: {
				shareUrl: 'https://getpocket.com/save',
				params: {
					url: this.godoValue('url')
				}
			}
		},

		s = share_social[share_name];
		
		return s !== undefined ? this.godoPopup(s) : false;
	}

	/**
     * @event godoPopup
     * @param {Object} share
     */
	godoPopup(share) {
		var p = share.params || {},
		keys = Object.keys(p),
		i,
		str = keys.length > 0 ? '?' : '';
		
		for (i = 0; i < keys.length; i++) {
			if (str !== '?') {
				str += '&';
			}
			if (p[keys[i]]) {
				str += keys[i] + '=' + encodeURIComponent(p[keys[i]]);
			}
		}
		
		share.shareUrl += str;

		if (!share.isLink) {
			let popWidth = share.width || 600,
			popHeight = share.height || 480,
			left = window.innerWidth / 2 - popWidth / 2 + window.screenX,
			top = window.innerHeight / 2 - popHeight / 2 + window.screenY,
			popParams = 'scrollbars=no, width=' + popWidth + ', height=' + popHeight + ', top=' + top + ', left=' + left,
			newWindow = window.open(share.shareUrl, '', popParams);

			if (window.focus) {
				newWindow.focus();
			}
		} else {
			window.location.href = share.shareUrl;
		}
	}


}


module.exports = GodoShare;
