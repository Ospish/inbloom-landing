/**
  -webkit-background-clip: text Polyfill
  
  # What? #
  A polyfill which replaces the specified element with a SVG
  in browser where "-webkit-background-clip: text" 
  is not available.

  Fork it on GitHub
  https://github.com/TimPietrusky/background-clip-text-polyfill

  # 2013 by Tim Pietrusky
  # timpietrusky.com
**/

Element.prototype.backgroundClipPolyfill = function () {
  var a = arguments[0],
    d = document,
    b = d.body,
    el = this;

  function hasBackgroundClip() {
    return b.style.webkitBackgroundClip != undefined;
  };
  
  function addAttributes(el, attributes) {
    for (var key in attributes) {
      el.setAttribute(key, attributes[key]);
    }
  }
  
  function createSvgElement(tagname) {
    return d.createElementNS('http://www.w3.org/2000/svg', tagname);
  }
  
  function createSVG() {
    var a = arguments[0],
      svg = createSvgElement('svg'),
      pattern = createSvgElement('pattern'),
      image = createSvgElement('image'),
      text = createSvgElement('text');
    
    // Add attributes to elements
    addAttributes(pattern, {
      'id' : a.id,
      'patternUnits' : 'userSpaceOnUse',
      'width' : a.width,
      'height' : a.height
    });
    
    addAttributes(image, {
      'width' : a.width,
      'height' : a.height
    });
    image.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', a.url);
    
    addAttributes(text, {
      'x' : 0,
      'y' : 80,
      'class' : a['class'],
      'style' : 'fill:url(#' + a.id + ');'
    });
    
    // Set text
    text.textContent = a.text;
      
    // Add elements to pattern
    pattern.appendChild(image);
      
    // Add elements to SVG
    svg.appendChild(pattern);
    svg.appendChild(text);
    
    return svg;
  };
  
  /*
   * Replace the element if background-clip
   * is not available.
   */
  if (!hasBackgroundClip()) {
    var img = new Image();
    img.onload = function() {
      var svg = createSVG({
        'id' : a.patternID,
        'url' : a.patternURL,
        'class' : a['class'],
        'width' : this.width,
        'height' : this.height,
        'text' : el.textContent
      });
      
      el.parentNode.replaceChild(svg, el);
    }
    img.src = a.patternURL;
  }
};

var element = document.querySelector('.headline'); 

/*
 * Call the polyfill
 *
 * patternID : the unique ID of the SVG pattern
 * patternURL : the URL to the background-image
 * class : the css-class applied to the SVG
 */
element.backgroundClipPolyfill({
  'patternID' : 'mypattern',
  'patternURL' : 'http://timpietrusky.com/cdn/army.png',
  'class' : 'headline'
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJwb2x5ZmlsbHMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAgLXdlYmtpdC1iYWNrZ3JvdW5kLWNsaXA6IHRleHQgUG9seWZpbGxcclxuICBcclxuICAjIFdoYXQ/ICNcclxuICBBIHBvbHlmaWxsIHdoaWNoIHJlcGxhY2VzIHRoZSBzcGVjaWZpZWQgZWxlbWVudCB3aXRoIGEgU1ZHXHJcbiAgaW4gYnJvd3NlciB3aGVyZSBcIi13ZWJraXQtYmFja2dyb3VuZC1jbGlwOiB0ZXh0XCIgXHJcbiAgaXMgbm90IGF2YWlsYWJsZS5cclxuXHJcbiAgRm9yayBpdCBvbiBHaXRIdWJcclxuICBodHRwczovL2dpdGh1Yi5jb20vVGltUGlldHJ1c2t5L2JhY2tncm91bmQtY2xpcC10ZXh0LXBvbHlmaWxsXHJcblxyXG4gICMgMjAxMyBieSBUaW0gUGlldHJ1c2t5XHJcbiAgIyB0aW1waWV0cnVza3kuY29tXHJcbioqL1xyXG5cclxuRWxlbWVudC5wcm90b3R5cGUuYmFja2dyb3VuZENsaXBQb2x5ZmlsbCA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgYSA9IGFyZ3VtZW50c1swXSxcclxuICAgIGQgPSBkb2N1bWVudCxcclxuICAgIGIgPSBkLmJvZHksXHJcbiAgICBlbCA9IHRoaXM7XHJcblxyXG4gIGZ1bmN0aW9uIGhhc0JhY2tncm91bmRDbGlwKCkge1xyXG4gICAgcmV0dXJuIGIuc3R5bGUud2Via2l0QmFja2dyb3VuZENsaXAgIT0gdW5kZWZpbmVkO1xyXG4gIH07XHJcbiAgXHJcbiAgZnVuY3Rpb24gYWRkQXR0cmlidXRlcyhlbCwgYXR0cmlidXRlcykge1xyXG4gICAgZm9yICh2YXIga2V5IGluIGF0dHJpYnV0ZXMpIHtcclxuICAgICAgZWwuc2V0QXR0cmlidXRlKGtleSwgYXR0cmlidXRlc1trZXldKTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbiAgZnVuY3Rpb24gY3JlYXRlU3ZnRWxlbWVudCh0YWduYW1lKSB7XHJcbiAgICByZXR1cm4gZC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgdGFnbmFtZSk7XHJcbiAgfVxyXG4gIFxyXG4gIGZ1bmN0aW9uIGNyZWF0ZVNWRygpIHtcclxuICAgIHZhciBhID0gYXJndW1lbnRzWzBdLFxyXG4gICAgICBzdmcgPSBjcmVhdGVTdmdFbGVtZW50KCdzdmcnKSxcclxuICAgICAgcGF0dGVybiA9IGNyZWF0ZVN2Z0VsZW1lbnQoJ3BhdHRlcm4nKSxcclxuICAgICAgaW1hZ2UgPSBjcmVhdGVTdmdFbGVtZW50KCdpbWFnZScpLFxyXG4gICAgICB0ZXh0ID0gY3JlYXRlU3ZnRWxlbWVudCgndGV4dCcpO1xyXG4gICAgXHJcbiAgICAvLyBBZGQgYXR0cmlidXRlcyB0byBlbGVtZW50c1xyXG4gICAgYWRkQXR0cmlidXRlcyhwYXR0ZXJuLCB7XHJcbiAgICAgICdpZCcgOiBhLmlkLFxyXG4gICAgICAncGF0dGVyblVuaXRzJyA6ICd1c2VyU3BhY2VPblVzZScsXHJcbiAgICAgICd3aWR0aCcgOiBhLndpZHRoLFxyXG4gICAgICAnaGVpZ2h0JyA6IGEuaGVpZ2h0XHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgYWRkQXR0cmlidXRlcyhpbWFnZSwge1xyXG4gICAgICAnd2lkdGgnIDogYS53aWR0aCxcclxuICAgICAgJ2hlaWdodCcgOiBhLmhlaWdodFxyXG4gICAgfSk7XHJcbiAgICBpbWFnZS5zZXRBdHRyaWJ1dGVOUygnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycsICd4bGluazpocmVmJywgYS51cmwpO1xyXG4gICAgXHJcbiAgICBhZGRBdHRyaWJ1dGVzKHRleHQsIHtcclxuICAgICAgJ3gnIDogMCxcclxuICAgICAgJ3knIDogODAsXHJcbiAgICAgICdjbGFzcycgOiBhWydjbGFzcyddLFxyXG4gICAgICAnc3R5bGUnIDogJ2ZpbGw6dXJsKCMnICsgYS5pZCArICcpOydcclxuICAgIH0pO1xyXG4gICAgXHJcbiAgICAvLyBTZXQgdGV4dFxyXG4gICAgdGV4dC50ZXh0Q29udGVudCA9IGEudGV4dDtcclxuICAgICAgXHJcbiAgICAvLyBBZGQgZWxlbWVudHMgdG8gcGF0dGVyblxyXG4gICAgcGF0dGVybi5hcHBlbmRDaGlsZChpbWFnZSk7XHJcbiAgICAgIFxyXG4gICAgLy8gQWRkIGVsZW1lbnRzIHRvIFNWR1xyXG4gICAgc3ZnLmFwcGVuZENoaWxkKHBhdHRlcm4pO1xyXG4gICAgc3ZnLmFwcGVuZENoaWxkKHRleHQpO1xyXG4gICAgXHJcbiAgICByZXR1cm4gc3ZnO1xyXG4gIH07XHJcbiAgXHJcbiAgLypcclxuICAgKiBSZXBsYWNlIHRoZSBlbGVtZW50IGlmIGJhY2tncm91bmQtY2xpcFxyXG4gICAqIGlzIG5vdCBhdmFpbGFibGUuXHJcbiAgICovXHJcbiAgaWYgKCFoYXNCYWNrZ3JvdW5kQ2xpcCgpKSB7XHJcbiAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XHJcbiAgICBpbWcub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIHZhciBzdmcgPSBjcmVhdGVTVkcoe1xyXG4gICAgICAgICdpZCcgOiBhLnBhdHRlcm5JRCxcclxuICAgICAgICAndXJsJyA6IGEucGF0dGVyblVSTCxcclxuICAgICAgICAnY2xhc3MnIDogYVsnY2xhc3MnXSxcclxuICAgICAgICAnd2lkdGgnIDogdGhpcy53aWR0aCxcclxuICAgICAgICAnaGVpZ2h0JyA6IHRoaXMuaGVpZ2h0LFxyXG4gICAgICAgICd0ZXh0JyA6IGVsLnRleHRDb250ZW50XHJcbiAgICAgIH0pO1xyXG4gICAgICBcclxuICAgICAgZWwucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQoc3ZnLCBlbCk7XHJcbiAgICB9XHJcbiAgICBpbWcuc3JjID0gYS5wYXR0ZXJuVVJMO1xyXG4gIH1cclxufTtcclxuXHJcbnZhciBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRsaW5lJyk7IFxyXG5cclxuLypcclxuICogQ2FsbCB0aGUgcG9seWZpbGxcclxuICpcclxuICogcGF0dGVybklEIDogdGhlIHVuaXF1ZSBJRCBvZiB0aGUgU1ZHIHBhdHRlcm5cclxuICogcGF0dGVyblVSTCA6IHRoZSBVUkwgdG8gdGhlIGJhY2tncm91bmQtaW1hZ2VcclxuICogY2xhc3MgOiB0aGUgY3NzLWNsYXNzIGFwcGxpZWQgdG8gdGhlIFNWR1xyXG4gKi9cclxuZWxlbWVudC5iYWNrZ3JvdW5kQ2xpcFBvbHlmaWxsKHtcclxuICAncGF0dGVybklEJyA6ICdteXBhdHRlcm4nLFxyXG4gICdwYXR0ZXJuVVJMJyA6ICdodHRwOi8vdGltcGlldHJ1c2t5LmNvbS9jZG4vYXJteS5wbmcnLFxyXG4gICdjbGFzcycgOiAnaGVhZGxpbmUnXHJcbn0pOyJdLCJmaWxlIjoicG9seWZpbGxzLmpzIn0=