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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigkKXtcclxuXHJcbiAgLy8gYmVnaW4gQ3VzdG9tIFNjcm9sbFxyXG4gICQod2luZG93KS5vbignbG9hZCcsZnVuY3Rpb24oKXtcclxuICAgICQoJy5jb250ZW50JykubUN1c3RvbVNjcm9sbGJhcihcclxuICAgICAge3RoZW1lOiAncm91bmRlZCd9XHJcbiAgICApO1xyXG4gIH0pO1xyXG4gIC8vIGVuZCBDdXN0b20gU2Nyb2xsXHJcblxyXG4gIC8vIGJlZ2luIEFjY29yZGlvblxyXG4gICQoJy5qcy1hY2Nvcmlvbi1idG4nKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xyXG4gICAgJCh0aGlzKS5uZXh0KCcuanMtYWNjb3Jpb24tY29udGVudCcpLnNsaWRlVG9nZ2xlKCk7XHJcbiAgfSk7XHJcbiAgLy8gZW5kIEFjY29yZGlvblxyXG5cclxuXHJcbiAgLy8gYmVnaW4gU2xpZGVyXHJcbiAgLy8gJHNsaWNrX3NsaWRlciA9ICQoJyNjb25kaXRpb25zLXNsaWRlcicpO1xyXG4gIC8vIHZhciBzZXR0aW5ncyA9IHtcclxuICAvLyAgIGRvdHM6IHRydWUsXHJcbiAgLy8gICBhcnJvd3M6IGZhbHNlXHJcbiAgLy8gfTtcclxuICAvLyBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPCA3NjgpIHtcclxuICAvLyAgICRzbGlja19zbGlkZXIuc2xpY2soc2V0dGluZ3MpO1xyXG4gIC8vIH1cclxuICAvLyAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uKCkge1xyXG4gIC8vICAgaWYgKCQod2luZG93KS53aWR0aCgpID4gNzY3KSB7XHJcbiAgLy8gICAgIGlmICgkc2xpY2tfc2xpZGVyLmhhc0NsYXNzKCdzbGljay1pbml0aWFsaXplZCcpKSB7XHJcbiAgLy8gICAgICAgJHNsaWNrX3NsaWRlci5zbGljaygndW5zbGljaycpO1xyXG4gIC8vICAgICB9XHJcbiAgLy8gICAgIHJldHVybjtcclxuICAvLyAgIH1cclxuXHJcbiAgLy8gICBpZiAoISRzbGlja19zbGlkZXIuaGFzQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJykpIHtcclxuICAvLyAgICAgcmV0dXJuICRzbGlja19zbGlkZXIuc2xpY2soc2V0dGluZ3MpO1xyXG4gIC8vICAgfVxyXG4gIC8vIH0pO1xyXG4gIC8vIGVuZCBTbGlkZXJcclxuXHJcblxyXG5cclxuXHJcbiAgJCgnYVtocmVmKj1cIiNcIl0nKVxyXG4gIC8vIFJlbW92ZSBsaW5rcyB0aGF0IGRvbid0IGFjdHVhbGx5IGxpbmsgdG8gYW55dGhpbmdcclxuICAgIC5ub3QoJ1tocmVmPVwiI1wiXScpXHJcbiAgICAubm90KCdbaHJlZj1cIiMwXCJdJylcclxuICAgIC5jbGljayhmdW5jdGlvbihldmVudCkge1xyXG4gICAgLy8gT24tcGFnZSBsaW5rc1xyXG4gICAgICBpZiAoXHJcbiAgICAgICAgbG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXlxcLy8sICcnKSA9PSB0aGlzLnBhdGhuYW1lLnJlcGxhY2UoL15cXC8vLCAnJykgXHJcbiAgICAgICYmIFxyXG4gICAgICBsb2NhdGlvbi5ob3N0bmFtZSA9PSB0aGlzLmhvc3RuYW1lXHJcbiAgICAgICkge1xyXG4gICAgICAvLyBGaWd1cmUgb3V0IGVsZW1lbnQgdG8gc2Nyb2xsIHRvXHJcbiAgICAgICAgdmFyIHRhcmdldCA9ICQodGhpcy5oYXNoKTtcclxuICAgICAgICB0YXJnZXQgPSB0YXJnZXQubGVuZ3RoID8gdGFyZ2V0IDogJCgnW25hbWU9JyArIHRoaXMuaGFzaC5zbGljZSgxKSArICddJyk7XHJcbiAgICAgICAgLy8gRG9lcyBhIHNjcm9sbCB0YXJnZXQgZXhpc3Q/XHJcbiAgICAgICAgaWYgKHRhcmdldC5sZW5ndGgpIHtcclxuICAgICAgICAvLyBPbmx5IHByZXZlbnQgZGVmYXVsdCBpZiBhbmltYXRpb24gaXMgYWN0dWFsbHkgZ29ubmEgaGFwcGVuXHJcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICBzY3JvbGxUb3A6IHRhcmdldC5vZmZzZXQoKS50b3BcclxuICAgICAgICAgIH0sIDEwMDAsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgLy8gQ2FsbGJhY2sgYWZ0ZXIgYW5pbWF0aW9uXHJcbiAgICAgICAgICAvLyBNdXN0IGNoYW5nZSBmb2N1cyFcclxuICAgICAgICAgICAgdmFyICR0YXJnZXQgPSAkKHRhcmdldCk7XHJcbiAgICAgICAgICAgICR0YXJnZXQuZm9jdXMoKTtcclxuICAgICAgICAgICAgaWYgKCR0YXJnZXQuaXMoXCI6Zm9jdXNcIikpIHsgLy8gQ2hlY2tpbmcgaWYgdGhlIHRhcmdldCB3YXMgZm9jdXNlZFxyXG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAkdGFyZ2V0LmF0dHIoJ3RhYmluZGV4JywnLTEnKTsgLy8gQWRkaW5nIHRhYmluZGV4IGZvciBlbGVtZW50cyBub3QgZm9jdXNhYmxlXHJcbiAgICAgICAgICAgICAgJHRhcmdldC5mb2N1cygpOyAvLyBTZXQgZm9jdXMgYWdhaW5cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG59KShqUXVlcnkpOyJdLCJmaWxlIjoibWFpbi5qcyJ9