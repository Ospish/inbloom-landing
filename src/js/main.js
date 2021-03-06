(function(e) {
  e.matches = e.matches || e.mozMatchesSelector || e.msMatchesSelector || e.oMatchesSelector || e.webkitMatchesSelector;
  e.closest = e.closest || function closest(selector) {
    if (!this) return null;
    if (this.matches(selector)) return this;
    if (!this.parentElement) { return null; }
    else return this.parentElement.closest(selector);
  };
}(Element.prototype));

document.querySelectorAll('a[href^="#"]').forEach( function (anchor) {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    var element = document.querySelector(this.getAttribute('href'));
    window.scroll({
      top: getCoords(element).top ,
      behavior: 'smooth'
    });
  });
});

function getCoords(elem) { // кроме IE8-
  var box = elem.getBoundingClientRect();
  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  };
}


(function(window, document, undefined){
  var classes = [];
  var tests = [];
  var ModernizrProto = {
    _version: '3.6.0',
    _config: {
      'classPrefix': '',
      'enableClasses': true,
      'enableJSClass': true,
      'usePrefixes': true
    },
    _q: [],
    on: function(test, cb) {
      var self = this;
      setTimeout(function() {
        cb(self[test]);
      }, 0);
    },
    addTest: function(name, fn, options) {
      tests.push({name: name, fn: fn, options: options});
    },

    addAsyncTest: function(fn) {
      tests.push({name: null, fn: fn});
    }
  };

  var Modernizr = function() {};
  Modernizr.prototype = ModernizrProto;
  Modernizr = new Modernizr();

  function is(obj, type) {
    return typeof obj === type;
  }

  function testRunner() {
    var featureNames;
    var feature;
    var aliasIdx;
    var result;
    var nameIdx;
    var featureName;
    var featureNameSplit;

    for (var featureIdx in tests) {
      if (tests.hasOwnProperty(featureIdx)) {
        featureNames = [];
        feature = tests[featureIdx];
        if (feature.name) {
          featureNames.push(feature.name.toLowerCase());

          if (feature.options && feature.options.aliases && feature.options.aliases.length) {
            for (aliasIdx = 0; aliasIdx < feature.options.aliases.length; aliasIdx++) {
              featureNames.push(feature.options.aliases[aliasIdx].toLowerCase());
            }
          }
        }
        result = is(feature.fn, 'function') ? feature.fn() : feature.fn;

        for (nameIdx = 0; nameIdx < featureNames.length; nameIdx++) {
          featureNameSplit = featureName.split('.');

          if (featureNameSplit.length === 1) {
            Modernizr[featureNameSplit[0]] = result;
          } else {
            if (Modernizr[featureNameSplit[0]] && !(Modernizr[featureNameSplit[0]] instanceof Boolean)) {
              Modernizr[featureNameSplit[0]] = new Boolean(Modernizr[featureNameSplit[0]]);
            }

            Modernizr[featureNameSplit[0]][featureNameSplit[1]] = result;
          }

          classes.push((result ? '' : 'no-') + featureNameSplit.join('-'));
        }
      }
    }
  }

  var docElement = document.documentElement;
  var isSVG = docElement.nodeName.toLowerCase() === 'svg';

  function setClasses(classes) {
    var className = docElement.className;
    var classPrefix = Modernizr._config.classPrefix || '';
    if (isSVG) {
      className = className.baseVal;
    }
    if (Modernizr._config.enableJSClass) {
      var reJS = new RegExp('(^|\\s)' + classPrefix + 'no-js(\\s|$)');
      className = className.replace(reJS, '$1' + classPrefix + 'js$2');
    }

    if (Modernizr._config.enableClasses) {
      className += ' ' + classPrefix + classes.join(' ' + classPrefix);
      if (isSVG) {
        docElement.className.baseVal = className;
      } else {
        docElement.className = className;
      }
    }
  }

  var hasOwnProp;

  (function() {
    var _hasOwnProperty = ({}).hasOwnProperty;
    if (!is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined')) {
      hasOwnProp = function(object, property) {
        return _hasOwnProperty.call(object, property);
      };
    }
    else {
      hasOwnProp = function(object, property) {
        return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
      };
    }
  })();

  ModernizrProto._l = {};


  ModernizrProto.on = function(feature, cb) {
    // Create the list of listeners if it doesn't exist
    if (!this._l[feature]) {
      this._l[feature] = [];
    }
    this._l[feature].push(cb);

    if (Modernizr.hasOwnProperty(feature)) {
      setTimeout(function() {
        Modernizr._trigger(feature, Modernizr[feature]);
      }, 0);
    }
  };

  ModernizrProto._trigger = function(feature, res) {
    if (!this._l[feature]) {
      return;
    }

    var cbs = this._l[feature];

    // Force async
    setTimeout(function() {
      var i, cb;
      for (i = 0; i < cbs.length; i++) {
        cb = cbs[i];
        cb(res);
      }
    }, 0);

    delete this._l[feature];
  };

  function addTest(feature, test) {

    if (typeof feature == 'object') {
      for (var key in feature) {
        if (hasOwnProp(feature, key)) {
          addTest(key, feature[ key ]);
        }
      }
    } else {

      feature = feature.toLowerCase();
      var featureNameSplit = feature.split('.');
      var last = Modernizr[featureNameSplit[0]];
      if (featureNameSplit.length == 2) {
        last = last[featureNameSplit[1]];
      }
      if (typeof last != 'undefined') {
        return Modernizr;
      }
      test = typeof test == 'function' ? test() : test;
      if (featureNameSplit.length == 1) {
        Modernizr[featureNameSplit[0]] = test;
      } else {
        if (Modernizr[featureNameSplit[0]] && !(Modernizr[featureNameSplit[0]] instanceof Boolean)) {
          Modernizr[featureNameSplit[0]] = new Boolean(Modernizr[featureNameSplit[0]]);
        }
        Modernizr[featureNameSplit[0]][featureNameSplit[1]] = test;
      }
      setClasses([(!!test && test != false ? '' : 'no-') + featureNameSplit.join('-')]);
      Modernizr._trigger(feature, test);
    }
    return Modernizr; // allow chaining.
  }
  Modernizr._q.push(function() {
    ModernizrProto.addTest = addTest;
  });

  Modernizr.addAsyncTest(function() {

    var webpTests = [{
      'uri': 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=',
      'name': 'webp'
    }, {
      'uri': 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA==',
      'name': 'webp.alpha'
    }, {
      'uri': 'data:image/webp;base64,UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA',
      'name': 'webp.animation'
    }, {
      'uri': 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=',
      'name': 'webp.lossless'
    }];

    var webp = webpTests.shift();
    function test(name, uri, cb) {

      var image = new Image();

      function addResult(event) {
        var result = event && event.type === 'load' ? image.width == 1 : false;
        var baseTest = name === 'webp';
        addTest(name, (baseTest && result) ? new Boolean(result) : result);
        if (cb) {
          cb(event);
        }
      }
      image.onerror = addResult;
      image.onload = addResult;
      image.src = uri;
    }

    test(webp.name, webp.uri, function(e) {
      if (e && e.type === 'load') {
        for (var i = 0; i < webpTests.length; i++) {
          test(webpTests[i].name, webpTests[i].uri);
        }
      }
    });
  });

  testRunner();
  setClasses(classes);

  delete ModernizrProto.addTest;
  delete ModernizrProto.addAsyncTest;

  for (var i = 0; i < Modernizr._q.length; i++) {
    Modernizr._q[i]();
  }
  window.Modernizr = Modernizr;
})(window, document);

var btnBurger = document.getElementById('btn-burger');
var nav = document.getElementById('nav');
btnBurger.onclick = function() {
  nav.classList.toggle('is-visible');
};


Modernizr.on('webp');

document.addEventListener('mousemove', parallax);

function parallax(e) {
  this.querySelectorAll('.js-layer').forEach(function (layer) {
    var speed = layer.getAttribute('data-speed');
    var x = (window.innerWidth - e.pageX * speed) / 100;
    var y = (window.innerWidth - e.pageY * speed) / 100;
    layer.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
  });
}

AOS.init({
  duration: 1000,
  once: true
});

var flowersSlider = document.getElementById('select-size-list');
if (flowersSlider) {
  $(flowersSlider).slick({
    slidesToShow: 3,
    infinite: false,
    arrows: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          prevArrow: $('#flowersBack'),
          nextArrow: $('#flowersNext'),
          arrows: true,
          slidesToShow: 1
        }
      }
    ]
  });
}

var formSliderElement = document.getElementById('formSlider');
if (formSliderElement) {
  $(formSliderElement).slick({
    slidesToShow: 1,
    infinite: false,
    prevArrow: $('.form__btn-back'),
    nextArrow: $('#nextbutton'),
  });
}
var rewritesSlider = document.getElementById('rewrites-slider');
if (rewritesSlider) {
  $('#rewrites-slider').slick({
    slidesToShow: 1,
    prevArrow: $('#rewritesBack'),
    nextArrow: $('#rewritesNext'),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          adaptiveHeight: true 
        }
      }
    ]
  })
  
  $('#rewrites-slider').on('afterChange', function(event, slick, currentSlide){
    var imageSrc = slick.$slides[currentSlide].getAttribute('data-image')
    $('.rewrites__photo-slider img').attr('src', imageSrc)
  
  })
}



document.onclick = function(event) {
  if (event.target.cssList.contains('js-open-size-card')) {
    event.target.closest('.js-size-card').classList.add('is-active');
  }

  if (event.target.classList.contains('js-close-size-card')) {
    event.target.closest('.js-size-card').classList.remove('is-active');
  }
};

/**
 * begin Popups
 */

var popups = document.getElementsByClassName('js-popup');
var popupsElements = Array.prototype.slice.call(popups);
popupsElements.forEach(function(popup) {
  popup.classList.add('is-init');
  popup.onmousedown = function (event) {
    if (popup === event.target) {
      togglePopup();
    }
  };
});

var popupBtns = document.getElementsByClassName('js-open-popup');
var popupBtnsElements = Array.prototype.slice.call(popupBtns);
popupBtnsElements.forEach(function(btn) {
  btn.onclick = function () {
    var popupId = this.getAttribute('data-popup');
    if (popupId) {
      togglePopup(popupId);
    }
  };
});

var popupCloseBtns = document.getElementsByClassName('js-close-popup');
var popupCloseBtnsElements = Array.prototype.slice.call(popupCloseBtns);
popupCloseBtnsElements.forEach(function(btn) {
  btn.onclick = function (e) {
    togglePopup();
  };
});


function togglePopup(id) {
  if (id) {
    var popup = document.getElementById(id);
    if (popup.classList.contains('is-visible')) {
      popup.classList.remove('is-visible');
    } else {
      popup.classList.add('is-visible');
    }
  } else {
    var popups = document.getElementsByClassName('popup');
    var popupsElements = Array.prototype.slice.call(popups);
    popupsElements.forEach(function(popup) {
      popup.classList.remove('is-visible');
    });
  }
}

/**
 * end Popups
 */

var scrollBtn = document.getElementById('scroll-to-top');

window.onscroll = function() {scrollFunction()}

function scrollFunction() {
  if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
    scrollBtn.style.display = "block";
  } else {
    scrollBtn.style.display = "none";
  }
}

function topFunction() {
  $("html, body").animate({ scrollTop: 0 }, "slow");
  return false;
}


