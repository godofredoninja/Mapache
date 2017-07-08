/*
* @package godofredoninja
* Share social media
*/

class mapacheShare {
  constructor(elem) {
    this.elem = elem;
  }

  /**
   * @description Helper to get the attribute of a DOM element
   * @param {String} attr DOM element attribute
   * @returns {String|Empty} returns the attr value or empty string
   */
  mapacheValue(a) {
    const val = this.elem.attr(`mapache-${a}`);
    return (val === undefined || val === null) ? false : val;
  }

  /**
   * @description Main share event. Will pop a window or redirect to a link
   */
  mapacheShare() {
    const socialMediaName = this.mapacheValue('share').toLowerCase();

    const socialMedia = {
      facebook: {
        shareUrl: 'https://www.facebook.com/sharer.php',
        params: {
          u: this.mapacheValue('url'),
        },
      },
      twitter: {
        shareUrl: 'https://twitter.com/intent/tweet/',
        params: {
          text: this.mapacheValue('title'),
          url: this.mapacheValue('url'),
        },
      },
      reddit: {
        shareUrl: 'https://www.reddit.com/submit',
        params: {
          url: this.mapacheValue('url'),
        },
      },
      pinterest: {
        shareUrl: 'https://www.pinterest.com/pin/create/button/',
        params: {
          url: this.mapacheValue('url'),
          description: this.mapacheValue('title'),
        },
      },
      linkedin: {
        shareUrl: 'https://www.linkedin.com/shareArticle',
        params: {
          url: this.mapacheValue('url'),
          mini: true,
        },
      },
      pocket: {
        shareUrl: 'https://getpocket.com/save',
        params: {
          url: this.mapacheValue('url'),
        },
      },
    };

    const social = socialMedia[socialMediaName];

    return social !== undefined ? this.mapachePopup(social) : false;
  }

  /* windows Popup */
  mapachePopup(share) {
    const p = share.params || {};
    const keys = Object.keys(p);

    let socialMediaUrl = share.shareUrl;
    let str = keys.length > 0 ? '?' : '';

    for (const i in keys) {
      if (str !== '?') {
        str += '&';
      }
      if (p[keys[i]]) {
        str += `${keys[i]}=${encodeURIComponent(p[keys[i]])}`;
      }
    }

    socialMediaUrl += str;

    if (!share.isLink) {
      const popWidth = 600;
      const popHeight = 480;
      const left = ((window.innerWidth / 2) - (popWidth / 2)) + window.screenX;
      const top = ((window.innerHeight / 2) - (popHeight / 2)) + window.screenY;

      const popParams = `scrollbars=no, width=${popWidth}, height=${popHeight}, top=${top}, left=${left}`;
      const newWindow = window.open(socialMediaUrl, '', popParams);

      if (window.focus) {
        newWindow.focus();
      }
    } else {
      window.location.href = socialMediaUrl;
    }
  }
}

/* Export Class */
module.exports = mapacheShare;
