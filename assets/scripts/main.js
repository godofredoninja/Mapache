(function(){
  'use strict';

  // Search Menu
  $('.Menu-openSearch').on('click', Formulario);

  function Formulario(){
    $('.Menu-form').removeClass('close');
  }

  $('.Menu-closeSearch').on('click', function(){
   $('.Menu-form').addClass('close');
  });

  // Menu
  $(".button-collapse").sideNav();

// Search
  $('#Search').ghostHunter({
    results: '#Search-results',
    zeroResultsInfo : false,
    displaySearchInfo   : false,
    result_template : "<a class='Menu-resultForm' href='{{link}}'>{{title}}</a>",
    onKeyUp         : true
  });

// Main post ul li
 $('.Post ul li').prepend('<i class="mdi-image-brightness-1"></i>' );

})();
