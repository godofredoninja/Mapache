export default (name, number) => {
  $('.widget-twitter').parent().removeClass('u-hide');
  const twitterBlock = `<a class="twitter-timeline"  href="https://twitter.com/${name}" data-chrome="nofooter noborders noheader" data-tweet-limit="${number}">Tweets by ${name}</a><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>`; // eslint-disable-line
  $('.widget-twitter').html(twitterBlock);
};
