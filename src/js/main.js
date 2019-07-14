(function($){

  // begin Custom Scroll
  $(window).on('load',function(){
    $('.content').mCustomScrollbar(
      {theme: 'rounded'}
    );
  });
  // end Custom Scroll

  // begin Accordion
  $('.js-accorion-btn').on('click', function() {
    $(this).toggleClass('is-active');
    $(this).next('.js-accorion-content').slideToggle();
  });
  // end Accordion


  // begin Slider
  // $slick_slider = $('#conditions-slider');
  // var settings = {
  //   dots: true,
  //   arrows: false
  // };
  // if ($(window).width() < 768) {
  //   $slick_slider.slick(settings);
  // }
  // $(window).on('resize', function() {
  //   if ($(window).width() > 767) {
  //     if ($slick_slider.hasClass('slick-initialized')) {
  //       $slick_slider.slick('unslick');
  //     }
  //     return;
  //   }

  //   if (!$slick_slider.hasClass('slick-initialized')) {
  //     return $slick_slider.slick(settings);
  //   }
  // });
  // end Slider




  $('a[href*="#"]')
  // Remove links that don't actually link to anything
    .not('[href="#"]')
    .not('[href="#0"]')
    .click(function(event) {
    // On-page links
      if (
        location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
      && 
      location.hostname == this.hostname
      ) {
      // Figure out element to scroll to
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        // Does a scroll target exist?
        if (target.length) {
        // Only prevent default if animation is actually gonna happen
          event.preventDefault();
          $('html, body').animate({
            scrollTop: target.offset().top
          }, 1000, function() {
          // Callback after animation
          // Must change focus!
            var $target = $(target);
            $target.focus();
            if ($target.is(":focus")) { // Checking if the target was focused
              return false;
            } else {
              $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
              $target.focus(); // Set focus again
            };
          });
        }
      }
    });

})(jQuery);