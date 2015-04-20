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

  // Menu Open & close Desktop
  $('.Menu-openDesktop').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrain_width: false, // Does not change width of dropdown to that of the activator
      hover: false, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: false, // Displays dropdown below the button
    }
  );

  // Add Script Video responsive
  $('.Post-content').fitVids();

})();
