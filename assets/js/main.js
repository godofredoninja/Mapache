(function(){
  'use strict';
  // varibles
  var OpenSearch      = false,
      OpenMenu        = false,
      $display_search = $('.nav-search-open'),
      $display_menu 	= $('.nav-open'),
      $nav_height     = $('.navbar-fixed').height();

  // Functions
  $display_menu.on('click', displayMenu);
  $display_search.on('click', displaySearch);

  // input field Search Navigation
  $('.godo-search-field')
    .focus(function(){
      $('.godo-search').addClass('active');
    })
    .blur(function(){
      $('.godo-search').removeClass('active');
      // $('.godo-search-result').html('');
    })
    .ghostHunter({
      results: '#godo-search-result',
      zeroResultsInfo : false,
      displaySearchInfo   : false,
      result_template : "<a href='{{link}}'>{{title}}</a>",
      onKeyUp         : true,
      rss             : "/rss"
    });

  // Open & close Menu
  function displayMenu(e) {
    e.preventDefault();
    if (!OpenMenu) {
      $('html').attr('godo-state','menu_open');
      $display_menu
        .html('<i class="fa fa-times"></i>')
        .addClass('active');
      $('.godo-menu').css({'visibility':'visible','opacity':'1'});
      OpenMenu = true;
    } else {
      $('html').removeAttr('godo-state');
      $display_menu
        .html('<i class="fa fa-bars"></i>')
        .removeClass('active');
      $('.godo-menu').removeAttr('style');
      OpenMenu = false;
    }
  }

  // Open & close form menu Nav Mobile
  function displaySearch(e) {
    e.preventDefault();
    if(!OpenSearch){
      $display_search.html('<i class="fa fa-times-circle"></i>');
      $('.nav-open , .logo').css({'display':'none'});
      $('.godo-search').css({'display':'inline-block'});
      $('.godo-search-field').focus();
      OpenSearch = true;
    }else{
      $display_search.html('<i class="fa fa-search"></i>');
      $('.nav-open , .logo, .godo-search').removeAttr('style');
      $('.godo-search-field').val('');
      OpenSearch = false;
    }
  }

  // Video Responsive Youtube & Vimeo
  $(".post-main").each(function(){
    var selectors = [
      'iframe[src*="player.vimeo.com"]',
      'iframe[src*="youtube.com"]',
      'iframe[src*="youtube-nocookie.com"]',
      'iframe[src*="kickstarter.com"][src*="video.html"]',
    ];

    var $allVideos = $(this).find(selectors.join(','));

    $allVideos.each(function(){
      $(this).wrap('<aside class="video"><div class="video-content"></div></aside>');
    });

  });

  // btn download
  $('.post-main #download')
    .addClass('btn download')
    .prepend('<i class="fa fa-cloud-download"></i>')
    .attr({"target" : "_blank"});
  // bnt link
  $('.post-main #link')
    .addClass('btn link')
    .prepend('<i class="fa fa-link"></i>')
    .attr({"target" : "_blank"});

  // error 404
  resizeHeight();
  function resizeHeight() {
    $('.error').each(function() {
      $(this).height($(window).height() - ($('.godo-footer').height() + $nav_height));
    });
  }
  $(window).resize(resizeHeight);


  // Plugins

  // lazy load img
  var myLazyLoad = new LazyLoad();


  // sidebar hidden aside
  if ($(".sidebar .hidden").length) {
    var sidebar_hidden = $(".sidebar .hidden").offset().top;
    $(window).scroll(function(){
      if($(window).scrollTop() >= (sidebar_hidden - $nav_height - 16)){
        $('.sidebar .hidden').css({'position':'fixed','top':$nav_height + 16, 'width':'300'});
      }else{
        $('.sidebar .hidden').removeAttr('style');
      }
    });
  }

})(); // end of jQuery name space
