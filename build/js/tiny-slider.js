var tns = (function (){
  // Object.keys
    if (!Object.keys) {
      Object.keys = function(object) {
        var keys = [];
        for (var name in object) {
          if (Object.prototype.hasOwnProperty.call(object, name)) {
            keys.push(name);
          }
        }
        return keys;
      };
    }
  
  // ChildNode.remove
    if(!("remove" in Element.prototype)){
      Element.prototype.remove = function(){
        if(this.parentNode) {
          this.parentNode.removeChild(this);
        }
      };
    }
  
    var win = window;
  
    var raf = win.requestAnimationFrame
      || win.webkitRequestAnimationFrame
      || win.mozRequestAnimationFrame
      || win.msRequestAnimationFrame
      || function(cb) { return setTimeout(cb, 16); };
  
    var win$1 = window;
  
    var caf = win$1.cancelAnimationFrame
      || win$1.mozCancelAnimationFrame
      || function(id){ clearTimeout(id); };
  
    function extend() {
      var obj, name, copy,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length;
  
      for (; i < length; i++) {
        if ((obj = arguments[i]) !== null) {
          for (name in obj) {
            copy = obj[name];
  
            if (target === copy) {
              continue;
            } else if (copy !== undefined) {
              target[name] = copy;
            }
          }
        }
      }
      return target;
    }
  
    function checkStorageValue (value) {
      return ['true', 'false'].indexOf(value) >= 0 ? JSON.parse(value) : value;
    }
  
    function setLocalStorage(storage, key, value, access) {
      if (access) {
        try { storage.setItem(key, value); } catch (e) {}
      }
      return value;
    }
  
    function getSlideId() {
      var id = window.tnsId;
      window.tnsId = !id ? 1 : id + 1;
  
      return 'tns' + window.tnsId;
    }
  
    function getBody () {
      var doc = document,
        body = doc.body;
  
      if (!body) {
        body = doc.createElement('body');
        body.fake = true;
      }
  
      return body;
    }
  
    var docElement = document.documentElement;
  
    function setFakeBody (body) {
      var docOverflow = '';
      if (body.fake) {
        docOverflow = docElement.style.overflow;
        //avoid crashing IE8, if background image is used
        body.style.background = '';
        //Safari 5.13/5.1.4 OSX stops loading if ::-webkit-scrollbar is used and scrollbars are visible
        body.style.overflow = docElement.style.overflow = 'hidden';
        docElement.appendChild(body);
      }
  
      return docOverflow;
    }
  
    function resetFakeBody (body, docOverflow) {
      if (body.fake) {
        body.remove();
        docElement.style.overflow = docOverflow;
        // Trigger layout so kinetic scrolling isn't disabled in iOS6+
        // eslint-disable-next-line
        docElement.offsetHeight;
      }
    }
  
  // get css-calc
  
    function calc() {
      var doc = document,
        body = getBody(),
        docOverflow = setFakeBody(body),
        div = doc.createElement('div'),
        result = false;
  
      body.appendChild(div);
      try {
        var str = '(10px * 10)',
          vals = ['calc' + str, '-moz-calc' + str, '-webkit-calc' + str],
          val;
        for (var i = 0; i < 3; i++) {
          val = vals[i];
          div.style.width = val;
          if (div.offsetWidth === 100) {
            result = val.replace(str, '');
            break;
          }
        }
      } catch (e) {}
  
      body.fake ? resetFakeBody(body, docOverflow) : div.remove();
  
      return result;
    }
  
  // get subpixel support value
  
    function percentageLayout() {
      // check subpixel layout supporting
      var doc = document,
        body = getBody(),
        docOverflow = setFakeBody(body),
        wrapper = doc.createElement('div'),
        outer = doc.createElement('div'),
        str = '',
        count = 70,
        perPage = 3,
        supported = false;
  
      wrapper.className = "tns-t-subp2";
      outer.className = "tns-t-ct";
  
      for (var i = 0; i < count; i++) {
        str += '<div></div>';
      }
  
      outer.innerHTML = str;
      wrapper.appendChild(outer);
      body.appendChild(wrapper);
  
      supported = Math.abs(wrapper.getBoundingClientRect().left - outer.children[count - perPage].getBoundingClientRect().left) < 2;
  
      body.fake ? resetFakeBody(body, docOverflow) : wrapper.remove();
  
      return supported;
    }
  
    function mediaquerySupport () {
      var doc = document,
        body = getBody(),
        docOverflow = setFakeBody(body),
        div = doc.createElement('div'),
        style = doc.createElement('style'),
        rule = '@media all and (min-width:1px){.tns-mq-test{position:absolute}}',
        position;
  
      style.type = 'text/css';
      div.className = 'tns-mq-test';
  
      body.appendChild(style);
      body.appendChild(div);
  
      if (style.styleSheet) {
        style.styleSheet.cssText = rule;
      } else {
        style.appendChild(doc.createTextNode(rule));
      }
  
      position = window.getComputedStyle ? window.getComputedStyle(div).position : div.currentStyle['position'];
  
      body.fake ? resetFakeBody(body, docOverflow) : div.remove();
  
      return position === "absolute";
    }
  
  // create and append style sheet
    function createStyleSheet (media) {
      // Create the <style> tag
      var style = document.createElement("style");
      // style.setAttribute("type", "text/css");
  
      // Add a media (and/or media query) here if you'd like!
      // style.setAttribute("media", "screen")
      // style.setAttribute("media", "only screen and (max-width : 1024px)")
      if (media) { style.setAttribute("media", media); }
  
      // WebKit hack :(
      // style.appendChild(document.createTextNode(""));
  
      // Add the <style> element to the page
      document.querySelector('head').appendChild(style);
  
      return style.sheet ? style.sheet : style.styleSheet;
    }
  
  // cross browsers addRule method
    function addCSSRule(sheet, selector, rules, index) {
      // return raf(function() {
      'insertRule' in sheet ?
        sheet.insertRule(selector + '{' + rules + '}', index) :
        sheet.addRule(selector, rules, index);
      // });
    }
  
  // cross browsers addRule method
    function removeCSSRule(sheet, index) {
      // return raf(function() {
      'deleteRule' in sheet ?
        sheet.deleteRule(index) :
        sheet.removeRule(index);
      // });
    }
  
    function getCssRulesLength(sheet) {
      var rule = ('insertRule' in sheet) ? sheet.cssRules : sheet.rules;
      return rule.length;
    }
  
    function toDegree (y, x) {
      return Math.atan2(y, x) * (180 / Math.PI);
    }
  
    function getTouchDirection(angle, range) {
      var direction = false,
        gap = Math.abs(90 - Math.abs(angle));
  
      if (gap >= 90 - range) {
        direction = 'horizontal';
      } else if (gap <= range) {
        direction = 'vertical';
      }
  
      return direction;
    }
  
  // https://toddmotto.com/ditch-the-array-foreach-call-nodelist-hack/
    function forEach (arr, callback, scope) {
      for (var i = 0, l = arr.length; i < l; i++) {
        callback.call(scope, arr[i], i);
      }
    }
  
    var classListSupport = 'classList' in document.createElement('_');
  
    var hasClass = classListSupport ?
      function (el, str) { return el.classList.contains(str); } :
      function (el, str) { return el.className.indexOf(str) >= 0; };
  
    var addClass = classListSupport ?
      function (el, str) {
        if (!hasClass(el,  str)) { el.classList.add(str); }
      } :
      function (el, str) {
        if (!hasClass(el,  str)) { el.className += ' ' + str; }
      };
  
    var removeClass = classListSupport ?
      function (el, str) {
        if (hasClass(el,  str)) { el.classList.remove(str); }
      } :
      function (el, str) {
        if (hasClass(el, str)) { el.className = el.className.replace(str, ''); }
      };
  
    function hasAttr(el, attr) {
      return el.hasAttribute(attr);
    }
  
    function getAttr(el, attr) {
      return el.getAttribute(attr);
    }
  
    function isNodeList(el) {
      // Only NodeList has the "item()" function
      return typeof el.item !== "undefined";
    }
  
    function setAttrs(els, attrs) {
      els = (isNodeList(els) || els instanceof Array) ? els : [els];
      if (Object.prototype.toString.call(attrs) !== '[object Object]') { return; }
  
      for (var i = els.length; i--;) {
        for(var key in attrs) {
          els[i].setAttribute(key, attrs[key]);
        }
      }
    }
  
    function removeAttrs(els, attrs) {
      els = (isNodeList(els) || els instanceof Array) ? els : [els];
      attrs = (attrs instanceof Array) ? attrs : [attrs];
  
      var attrLength = attrs.length;
      for (var i = els.length; i--;) {
        for (var j = attrLength; j--;) {
          els[i].removeAttribute(attrs[j]);
        }
      }
    }
  
    function arrayFromNodeList (nl) {
      var arr = [];
      for (var i = 0, l = nl.length; i < l; i++) {
        arr.push(nl[i]);
      }
      return arr;
    }
  
    function hideElement(el, forceHide) {
      if (el.style.display !== 'none') { el.style.display = 'none'; }
    }
  
    function showElement(el, forceHide) {
      if (el.style.display === 'none') { el.style.display = ''; }
    }
  
    function isVisible(el) {
      return window.getComputedStyle(el).display !== 'none';
    }
  
    function whichProperty(props){
      if (typeof props === 'string') {
        var arr = [props],
          Props = props.charAt(0).toUpperCase() + props.substr(1),
          prefixes = ['Webkit', 'Moz', 'ms', 'O'];
  
        prefixes.forEach(function(prefix) {
          if (prefix !== 'ms' || props === 'transform') {
            arr.push(prefix + Props);
          }
        });
  
        props = arr;
      }
  
      var el = document.createElement('fakeelement'),
        len = props.length;
      for(var i = 0; i < props.length; i++){
        var prop = props[i];
        if( el.style[prop] !== undefined ){ return prop; }
      }
  
      return false; // explicit for ie9-
    }
  
    function has3DTransforms(tf){
      if (!tf) { return false; }
      if (!window.getComputedStyle) { return false; }
  
      var doc = document,
        body = getBody(),
        docOverflow = setFakeBody(body),
        el = doc.createElement('p'),
        has3d,
        cssTF = tf.length > 9 ? '-' + tf.slice(0, -9).toLowerCase() + '-' : '';
  
      cssTF += 'transform';
  
      // Add it to the body to get the computed style
      body.insertBefore(el, null);
  
      el.style[tf] = 'translate3d(1px,1px,1px)';
      has3d = window.getComputedStyle(el).getPropertyValue(cssTF);
  
      body.fake ? resetFakeBody(body, docOverflow) : el.remove();
  
      return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
    }
  
  // get transitionend, animationend based on transitionDuration
  // @propin: string
  // @propOut: string, first-letter uppercase
  // Usage: getEndProperty('WebkitTransitionDuration', 'Transition') => webkitTransitionEnd
    function getEndProperty(propIn, propOut) {
      var endProp = false;
      if (/^Webkit/.test(propIn)) {
        endProp = 'webkit' + propOut + 'End';
      } else if (/^O/.test(propIn)) {
        endProp = 'o' + propOut + 'End';
      } else if (propIn) {
        endProp = propOut.toLowerCase() + 'end';
      }
      return endProp;
    }
  
  // Test via a getter in the options object to see if the passive property is accessed
    var supportsPassive = false;
    try {
      var opts = Object.defineProperty({}, 'passive', {
        get: function() {
          supportsPassive = true;
        }
      });
      window.addEventListener("test", null, opts);
    } catch (e) {}
    var passiveOption = supportsPassive ? { passive: true } : false;
  
    function addEvents(el, obj, preventScrolling) {
      for (var prop in obj) {
        var option = ['touchstart', 'touchmove'].indexOf(prop) >= 0 && !preventScrolling ? passiveOption : false;
        el.addEventListener(prop, obj[prop], option);
      }
    }
  
    function removeEvents(el, obj) {
      for (var prop in obj) {
        var option = ['touchstart', 'touchmove'].indexOf(prop) >= 0 ? passiveOption : false;
        el.removeEventListener(prop, obj[prop], option);
      }
    }
  
    function Events() {
      return {
        topics: {},
        on: function (eventName, fn) {
          this.topics[eventName] = this.topics[eventName] || [];
          this.topics[eventName].push(fn);
        },
        off: function(eventName, fn) {
          if (this.topics[eventName]) {
            for (var i = 0; i < this.topics[eventName].length; i++) {
              if (this.topics[eventName][i] === fn) {
                this.topics[eventName].splice(i, 1);
                break;
              }
            }
          }
        },
        emit: function (eventName, data) {
          data.type = eventName;
          if (this.topics[eventName]) {
            this.topics[eventName].forEach(function(fn) {
              fn(data, eventName);
            });
          }
        }
      };
    }
  
    function jsTransform(element, attr, prefix, postfix, to, duration, callback) {
      var tick = Math.min(duration, 10),
        unit = (to.indexOf('%') >= 0) ? '%' : 'px',
        to = to.replace(unit, ''),
        from = Number(element.style[attr].replace(prefix, '').replace(postfix, '').replace(unit, '')),
        positionTick = (to - from) / duration * tick,
        running;
  
      setTimeout(moveElement, tick);
      function moveElement() {
        duration -= tick;
        from += positionTick;
        element.style[attr] = prefix + from + unit + postfix;
        if (duration > 0) {
          setTimeout(moveElement, tick);
        } else {
          callback();
        }
      }
    }
  
    var tns = function(options) {
      options = extend({
        container: '.slider',
        mode: 'carousel',
        axis: 'horizontal',
        items: 1,
        gutter: 0,
        edgePadding: 0,
        fixedWidth: false,
        autoWidth: false,
        viewportMax: false,
        slideBy: 1,
        center: false,
        controls: true,
        controlsPosition: 'top',
        controlsText: ['prev', 'next'],
        controlsContainer: false,
        prevButton: false,
        nextButton: false,
        nav: true,
        navPosition: 'top',
        navContainer: false,
        navAsThumbnails: false,
        arrowKeys: false,
        speed: 300,
        autoplay: false,
        autoplayPosition: 'top',
        autoplayTimeout: 5000,
        autoplayDirection: 'forward',
        autoplayText: ['start', 'stop'],
        autoplayHoverPause: false,
        autoplayButton: false,
        autoplayButtonOutput: true,
        autoplayResetOnVisibility: true,
        animateIn: 'tns-fadeIn',
        animateOut: 'tns-fadeOut',
        animateNormal: 'tns-normal',
        animateDelay: false,
        loop: true,
        rewind: false,
        autoHeight: false,
        responsive: false,
        lazyload: false,
        lazyloadSelector: '.tns-lazy-img',
        touch: true,
        mouseDrag: false,
        swipeAngle: 15,
        nested: false,
        preventActionWhenRunning: false,
        preventScrollOnTouch: false,
        freezable: true,
        onInit: false,
        useLocalStorage: true
      }, options || {});
  
      var doc = document,
        win = window,
        KEYS = {
          ENTER: 13,
          SPACE: 32,
          LEFT: 37,
          RIGHT: 39
        },
        tnsStorage = {},
        localStorageAccess = options.useLocalStorage;
  
      if (localStorageAccess) {
        // check browser version and local storage access
        var browserInfo = navigator.userAgent;
        var uid = new Date;
  
        try {
          tnsStorage = win.localStorage;
          if (tnsStorage) {
            tnsStorage.setItem(uid, uid);
            localStorageAccess = tnsStorage.getItem(uid) == uid;
            tnsStorage.removeItem(uid);
          } else {
            localStorageAccess = false;
          }
          if (!localStorageAccess) { tnsStorage = {}; }
        } catch(e) {
          localStorageAccess = false;
        }
  
        if (localStorageAccess) {
          // remove storage when browser version changes
          if (tnsStorage['tnsApp'] && tnsStorage['tnsApp'] !== browserInfo) {
            ['tC', 'tPL', 'tMQ', 'tTf', 't3D', 'tTDu', 'tTDe', 'tADu', 'tADe', 'tTE', 'tAE'].forEach(function(item) { tnsStorage.removeItem(item); });
          }
          // update browserInfo
          localStorage['tnsApp'] = browserInfo;
        }
      }
  
      var CALC = tnsStorage['tC'] ? checkStorageValue(tnsStorage['tC']) : setLocalStorage(tnsStorage, 'tC', calc(), localStorageAccess),
        PERCENTAGELAYOUT = tnsStorage['tPL'] ? checkStorageValue(tnsStorage['tPL']) : setLocalStorage(tnsStorage, 'tPL', percentageLayout(), localStorageAccess),
        CSSMQ = tnsStorage['tMQ'] ? checkStorageValue(tnsStorage['tMQ']) : setLocalStorage(tnsStorage, 'tMQ', mediaquerySupport(), localStorageAccess),
        TRANSFORM = tnsStorage['tTf'] ? checkStorageValue(tnsStorage['tTf']) : setLocalStorage(tnsStorage, 'tTf', whichProperty('transform'), localStorageAccess),
        HAS3DTRANSFORMS = tnsStorage['t3D'] ? checkStorageValue(tnsStorage['t3D']) : setLocalStorage(tnsStorage, 't3D', has3DTransforms(TRANSFORM), localStorageAccess),
        TRANSITIONDURATION = tnsStorage['tTDu'] ? checkStorageValue(tnsStorage['tTDu']) : setLocalStorage(tnsStorage, 'tTDu', whichProperty('transitionDuration'), localStorageAccess),
        TRANSITIONDELAY = tnsStorage['tTDe'] ? checkStorageValue(tnsStorage['tTDe']) : setLocalStorage(tnsStorage, 'tTDe', whichProperty('transitionDelay'), localStorageAccess),
        ANIMATIONDURATION = tnsStorage['tADu'] ? checkStorageValue(tnsStorage['tADu']) : setLocalStorage(tnsStorage, 'tADu', whichProperty('animationDuration'), localStorageAccess),
        ANIMATIONDELAY = tnsStorage['tADe'] ? checkStorageValue(tnsStorage['tADe']) : setLocalStorage(tnsStorage, 'tADe', whichProperty('animationDelay'), localStorageAccess),
        TRANSITIONEND = tnsStorage['tTE'] ? checkStorageValue(tnsStorage['tTE']) : setLocalStorage(tnsStorage, 'tTE', getEndProperty(TRANSITIONDURATION, 'Transition'), localStorageAccess),
        ANIMATIONEND = tnsStorage['tAE'] ? checkStorageValue(tnsStorage['tAE']) : setLocalStorage(tnsStorage, 'tAE', getEndProperty(ANIMATIONDURATION, 'Animation'), localStorageAccess);
  
      // get element nodes from selectors
      var supportConsoleWarn = win.console && typeof win.console.warn === "function",
        tnsList = ['container', 'controlsContainer', 'prevButton', 'nextButton', 'navContainer', 'autoplayButton'],
        optionsElements = {};
  
      tnsList.forEach(function(item) {
        if (typeof options[item] === 'string') {
          var str = options[item],
            el = doc.querySelector(str);
          optionsElements[item] = str;
  
          if (el && el.nodeName) {
            options[item] = el;
          } else {
            if (supportConsoleWarn) { console.warn('Can\'t find', options[item]); }
            return;
          }
        }
      });
  
      // make sure at least 1 slide
      if (options.container.children.length < 1) {
        if (supportConsoleWarn) { console.warn('No slides found in', options.container); }
        return;
      }
  
      // update options
      var responsive = options.responsive,
        nested = options.nested,
        carousel = options.mode === 'carousel' ? true : false;
  
      if (responsive) {
        // apply responsive[0] to options and remove it
        if (0 in responsive) {
          options = extend(options, responsive[0]);
          delete responsive[0];
        }
  
        var responsiveTem = {};
        for (var key in responsive) {
          var val = responsive[key];
          // update responsive
          // from: 300: 2
          // to:
          //   300: {
          //     items: 2
          //   }
          val = typeof val === 'number' ? {items: val} : val;
          responsiveTem[key] = val;
        }
        responsive = responsiveTem;
        responsiveTem = null;
      }
  
      // update options
      function updateOptions (obj) {
        for (var key in obj) {
          if (!carousel) {
            if (key === 'slideBy') { obj[key] = 'page'; }
            if (key === 'edgePadding') { obj[key] = false; }
            if (key === 'autoHeight') { obj[key] = false; }
          }
  
          // update responsive options
          if (key === 'responsive') { updateOptions(obj[key]); }
        }
      }
      if (!carousel) { updateOptions(options); }
  
  
      // === define and set variables ===
      if (!carousel) {
        options.axis = 'horizontal';
        options.slideBy = 'page';
        options.edgePadding = false;
  
        var animateIn = options.animateIn,
          animateOut = options.animateOut,
          animateDelay = options.animateDelay,
          animateNormal = options.animateNormal;
      }
  
      var horizontal = options.axis === 'horizontal' ? true : false,
        outerWrapper = doc.createElement('div'),
        innerWrapper = doc.createElement('div'),
        middleWrapper,
        container = options.container,
        containerParent = container.parentNode,
        containerHTML = container.outerHTML,
        slideItems = container.children,
        slideCount = slideItems.length,
        breakpointZone,
        windowWidth = getWindowWidth(),
        isOn = false;
      if (responsive) { setBreakpointZone(); }
      if (carousel) { container.className += ' tns-vpfix'; }
  
      // fixedWidth: viewport > rightBoundary > indexMax
      var autoWidth = options.autoWidth,
        fixedWidth = getOption('fixedWidth'),
        edgePadding = getOption('edgePadding'),
        gutter = getOption('gutter'),
        viewport = getViewportWidth(),
        center = getOption('center'),
        items = !autoWidth ? Math.floor(getOption('items')) : 1,
        slideBy = getOption('slideBy'),
        viewportMax = options.viewportMax || options.fixedWidthViewportWidth,
        arrowKeys = getOption('arrowKeys'),
        speed = getOption('speed'),
        rewind = options.rewind,
        loop = rewind ? false : options.loop,
        autoHeight = getOption('autoHeight'),
        controls = getOption('controls'),
        controlsText = getOption('controlsText'),
        nav = getOption('nav'),
        touch = getOption('touch'),
        mouseDrag = getOption('mouseDrag'),
        autoplay = getOption('autoplay'),
        autoplayTimeout = getOption('autoplayTimeout'),
        autoplayText = getOption('autoplayText'),
        autoplayHoverPause = getOption('autoplayHoverPause'),
        autoplayResetOnVisibility = getOption('autoplayResetOnVisibility'),
        sheet = createStyleSheet(),
        lazyload = options.lazyload,
        lazyloadSelector = options.lazyloadSelector,
        slidePositions, // collection of slide positions
        slideItemsOut = [],
        cloneCount = loop ? getCloneCountForLoop() : 0,
        slideCountNew = !carousel ? slideCount + cloneCount : slideCount + cloneCount * 2,
        hasRightDeadZone = (fixedWidth || autoWidth) && !loop ? true : false,
        rightBoundary = fixedWidth ? getRightBoundary() : null,
        updateIndexBeforeTransform = (!carousel || !loop) ? true : false,
        // transform
        transformAttr = horizontal ? 'left' : 'top',
        transformPrefix = '',
        transformPostfix = '',
        // index
        getIndexMax = (function () {
          if (fixedWidth) {
            return function() { return center && !loop ? slideCount - 1 : Math.ceil(- rightBoundary / (fixedWidth + gutter)); };
          } else if (autoWidth) {
            return function() {
              for (var i = slideCountNew; i--;) {
                if (slidePositions[i] >= - rightBoundary) { return i; }
              }
            };
          } else {
            return function() {
              if (center && carousel && !loop) {
                return slideCount - 1;
              } else {
                return loop || carousel ? Math.max(0, slideCountNew - Math.ceil(items)) : slideCountNew - 1;
              }
            };
          }
        })(),
        index = getStartIndex(getOption('startIndex')),
        indexCached = index,
        displayIndex = getCurrentSlide(),
        indexMin = 0,
        indexMax = !autoWidth ? getIndexMax() : null,
        // resize
        resizeTimer,
        preventActionWhenRunning = options.preventActionWhenRunning,
        swipeAngle = options.swipeAngle,
        moveDirectionExpected = swipeAngle ? '?' : true,
        running = false,
        onInit = options.onInit,
        events = new Events(),
        // id, class
        newContainerClasses = ' tns-slider tns-' + options.mode,
        slideId = container.id || getSlideId(),
        disable = getOption('disable'),
        disabled = false,
        freezable = options.freezable,
        freeze = freezable && !autoWidth ? getFreeze() : false,
        frozen = false,
        controlsEvents = {
          'click': onControlsClick,
          'keydown': onControlsKeydown
        },
        navEvents = {
          'click': onNavClick,
          'keydown': onNavKeydown
        },
        hoverEvents = {
          'mouseover': mouseoverPause,
          'mouseout': mouseoutRestart
        },
        visibilityEvent = {'visibilitychange': onVisibilityChange},
        docmentKeydownEvent = {'keydown': onDocumentKeydown},
        touchEvents = {
          'touchstart': onPanStart,
          'touchmove': onPanMove,
          'touchend': onPanEnd,
          'touchcancel': onPanEnd
        }, dragEvents = {
          'mousedown': onPanStart,
          'mousemove': onPanMove,
          'mouseup': onPanEnd,
          'mouseleave': onPanEnd
        },
        hasControls = hasOption('controls'),
        hasNav = hasOption('nav'),
        navAsThumbnails = autoWidth ? true : options.navAsThumbnails,
        hasAutoplay = hasOption('autoplay'),
        hasTouch = hasOption('touch'),
        hasMouseDrag = hasOption('mouseDrag'),
        slideActiveClass = 'tns-slide-active',
        imgCompleteClass = 'tns-complete',
        imgEvents = {
          'load': onImgLoaded,
          'error': onImgFailed
        },
        imgsComplete,
        liveregionCurrent,
        preventScroll = options.preventScrollOnTouch === 'force' ? true : false;
  
      // controls
      if (hasControls) {
        var controlsContainer = options.controlsContainer,
          controlsContainerHTML = options.controlsContainer ? options.controlsContainer.outerHTML : '',
          prevButton = options.prevButton,
          nextButton = options.nextButton,
          prevButtonHTML = options.prevButton ? options.prevButton.outerHTML : '',
          nextButtonHTML = options.nextButton ? options.nextButton.outerHTML : '',
          prevIsButton,
          nextIsButton;
      }
  
      // nav
      if (hasNav) {
        var navContainer = options.navContainer,
          navContainerHTML = options.navContainer ? options.navContainer.outerHTML : '',
          navItems,
          pages = autoWidth ? slideCount : getPages(),
          pagesCached = 0,
          navClicked = -1,
          navCurrentIndex = getCurrentNavIndex(),
          navCurrentIndexCached = navCurrentIndex,
          navActiveClass = 'tns-nav-active',
          navStr = 'Carousel Page ',
          navStrCurrent = ' (Current Slide)';
      }
  
      // autoplay
      if (hasAutoplay) {
        var autoplayDirection = options.autoplayDirection === 'forward' ? 1 : -1,
          autoplayButton = options.autoplayButton,
          autoplayButtonHTML = options.autoplayButton ? options.autoplayButton.outerHTML : '',
          autoplayHtmlStrings = ['<span class=\'tns-visually-hidden\'>', ' animation</span>'],
          autoplayTimer,
          animating,
          autoplayHoverPaused,
          autoplayUserPaused,
          autoplayVisibilityPaused;
      }
  
      if (hasTouch || hasMouseDrag) {
        var initPosition = {},
          lastPosition = {},
          translateInit,
          disX,
          disY,
          panStart = false,
          rafIndex,
          getDist = horizontal ?
            function(a, b) { return a.x - b.x; } :
            function(a, b) { return a.y - b.y; };
      }
  
      // disable slider when slidecount <= items
      if (!autoWidth) { resetVariblesWhenDisable(disable || freeze); }
  
      if (TRANSFORM) {
        transformAttr = TRANSFORM;
        transformPrefix = 'translate';
  
        if (HAS3DTRANSFORMS) {
          transformPrefix += horizontal ? '3d(' : '3d(0px, ';
          transformPostfix = horizontal ? ', 0px, 0px)' : ', 0px)';
        } else {
          transformPrefix += horizontal ? 'X(' : 'Y(';
          transformPostfix = ')';
        }
  
      }
  
      if (carousel) { container.className = container.className.replace('tns-vpfix', ''); }
      initStructure();
      initSheet();
      initSliderTransform();
  
      // === COMMON FUNCTIONS === //
      function resetVariblesWhenDisable (condition) {
        if (condition) {
          controls = nav = touch = mouseDrag = arrowKeys = autoplay = autoplayHoverPause = autoplayResetOnVisibility = false;
        }
      }
  
      function getCurrentSlide () {
        var tem = carousel ? index - cloneCount : index;
        while (tem < 0) { tem += slideCount; }
        return tem%slideCount + 1;
      }
  
      function getStartIndex (ind) {
        ind = ind ? Math.max(0, Math.min(loop ? slideCount - 1 : slideCount - items, ind)) : 0;
        return carousel ? ind + cloneCount : ind;
      }
  
      function getAbsIndex (i) {
        if (i == null) { i = index; }
  
        if (carousel) { i -= cloneCount; }
        while (i < 0) { i += slideCount; }
  
        return Math.floor(i%slideCount);
      }
  
      function getCurrentNavIndex () {
        var absIndex = getAbsIndex(),
          result;
  
        result = navAsThumbnails ? absIndex :
          fixedWidth || autoWidth ? Math.ceil((absIndex + 1) * pages / slideCount - 1) :
            Math.floor(absIndex / items);
  
        // set active nav to the last one when reaches the right edge
        if (!loop && carousel && index === indexMax) { result = pages - 1; }
  
        return result;
      }
  
      function getItemsMax () {
        // fixedWidth or autoWidth while viewportMax is not available
        if (autoWidth || (fixedWidth && !viewportMax)) {
          return slideCount - 1;
          // most cases
        } else {
          var str = fixedWidth ? 'fixedWidth' : 'items',
            arr = [];
  
          if (fixedWidth || options[str] < slideCount) { arr.push(options[str]); }
  
          if (responsive) {
            for (var bp in responsive) {
              var tem = responsive[bp][str];
              if (tem && (fixedWidth || tem < slideCount)) { arr.push(tem); }
            }
          }
  
          if (!arr.length) { arr.push(0); }
  
          return Math.ceil(fixedWidth ? viewportMax / Math.min.apply(null, arr) : Math.max.apply(null, arr));
        }
      }
  
      function getCloneCountForLoop () {
        var itemsMax = getItemsMax(),
          result = carousel ? Math.ceil((itemsMax * 5 - slideCount)/2) : (itemsMax * 4 - slideCount);
        result = Math.max(itemsMax, result);
  
        return hasOption('edgePadding') ? result + 1 : result;
      }
  
      function getWindowWidth () {
        return win.innerWidth || doc.documentElement.clientWidth || doc.body.clientWidth;
      }
  
      function getInsertPosition (pos) {
        return pos === 'top' ? 'afterbegin' : 'beforeend';
      }
  
      function getClientWidth (el) {
        var div = doc.createElement('div'), rect, width;
        el.appendChild(div);
        rect = div.getBoundingClientRect();
        width = rect.right - rect.left;
        div.remove();
        return width || getClientWidth(el.parentNode);
      }
  
      function getViewportWidth () {
        var gap = edgePadding ? edgePadding * 2 - gutter : 0;
        return getClientWidth(containerParent) - gap;
      }
  
      function hasOption (item) {
        if (options[item]) {
          return true;
        } else {
          if (responsive) {
            for (var bp in responsive) {
              if (responsive[bp][item]) { return true; }
            }
          }
          return false;
        }
      }
  
      // get option:
      // fixed width: viewport, fixedWidth, gutter => items
      // others: window width => all variables
      // all: items => slideBy
      function getOption (item, ww) {
        if (ww == null) { ww = windowWidth; }
  
        if (item === 'items' && fixedWidth) {
          return Math.floor((viewport + gutter) / (fixedWidth + gutter)) || 1;
  
        } else {
          var result = options[item];
  
          if (responsive) {
            for (var bp in responsive) {
              // bp: convert string to number
              if (ww >= parseInt(bp)) {
                if (item in responsive[bp]) { result = responsive[bp][item]; }
              }
            }
          }
  
          if (item === 'slideBy' && result === 'page') { result = getOption('items'); }
          if (!carousel && (item === 'slideBy' || item === 'items')) { result = Math.floor(result); }
  
          return result;
        }
      }
  
      function getSlideMarginLeft (i) {
        return CALC ?
          CALC + '(' + i * 100 + '% / ' + slideCountNew + ')' :
          i * 100 / slideCountNew + '%';
      }
  
      function getInnerWrapperStyles (edgePaddingTem, gutterTem, fixedWidthTem, speedTem, autoHeightBP) {
        var str = '';
  
        if (edgePaddingTem !== undefined) {
          var gap = edgePaddingTem;
          if (gutterTem) { gap -= gutterTem; }
          str = horizontal ?
            'margin: 0 ' + gap + 'px 0 ' + edgePaddingTem + 'px;' :
            'margin: ' + edgePaddingTem + 'px 0 ' + gap + 'px 0;';
        } else if (gutterTem && !fixedWidthTem) {
          var gutterTemUnit = '-' + gutterTem + 'px',
            dir = horizontal ? gutterTemUnit + ' 0 0' : '0 ' + gutterTemUnit + ' 0';
          str = 'margin: 0 ' + dir + ';';
        }
  
        if (!carousel && autoHeightBP && TRANSITIONDURATION && speedTem) { str += getTransitionDurationStyle(speedTem); }
        return str;
      }
  
      function getContainerWidth (fixedWidthTem, gutterTem, itemsTem) {
        if (fixedWidthTem) {
          return (fixedWidthTem + gutterTem) * slideCountNew + 'px';
        } else {
          return CALC ?
            CALC + '(' + slideCountNew * 100 + '% / ' + itemsTem + ')' :
            slideCountNew * 100 / itemsTem + '%';
        }
      }
  
      function getSlideWidthStyle (fixedWidthTem, gutterTem, itemsTem) {
        var width;
  
        if (fixedWidthTem) {
          width = (fixedWidthTem + gutterTem) + 'px';
        } else {
          if (!carousel) { itemsTem = Math.floor(itemsTem); }
          var dividend = carousel ? slideCountNew : itemsTem;
          width = CALC ?
            CALC + '(100% / ' + dividend + ')' :
            100 / dividend + '%';
        }
  
        width = 'width:' + width;
  
        // inner slider: overwrite outer slider styles
        return nested !== 'inner' ? width + ';' : width + ' !important;';
      }
  
      function getSlideGutterStyle (gutterTem) {
        var str = '';
  
        // gutter maybe interger || 0
        // so can't use 'if (gutter)'
        if (gutterTem !== false) {
          var prop = horizontal ? 'padding-' : 'margin-',
            dir = horizontal ? 'right' : 'bottom';
          str = prop +  dir + ': ' + gutterTem + 'px;';
        }
  
        return str;
      }
  
      function getCSSPrefix (name, num) {
        var prefix = name.substring(0, name.length - num).toLowerCase();
        if (prefix) { prefix = '-' + prefix + '-'; }
  
        return prefix;
      }
  
      function getTransitionDurationStyle (speed) {
        return getCSSPrefix(TRANSITIONDURATION, 18) + 'transition-duration:' + speed / 1000 + 's;';
      }
  
      function getAnimationDurationStyle (speed) {
        return getCSSPrefix(ANIMATIONDURATION, 17) + 'animation-duration:' + speed / 1000 + 's;';
      }
  
      function initStructure () {
        var classOuter = 'tns-outer',
          classInner = 'tns-inner',
          hasGutter = hasOption('gutter');
  
        outerWrapper.className = classOuter;
        innerWrapper.className = classInner;
        outerWrapper.id = slideId + '-ow';
        innerWrapper.id = slideId + '-iw';
  
        // set container properties
        if (container.id === '') { container.id = slideId; }
        newContainerClasses += PERCENTAGELAYOUT || autoWidth ? ' tns-subpixel' : ' tns-no-subpixel';
        newContainerClasses += CALC ? ' tns-calc' : ' tns-no-calc';
        if (autoWidth) { newContainerClasses += ' tns-autowidth'; }
        newContainerClasses += ' tns-' + options.axis;
        container.className += newContainerClasses;
  
        // add constrain layer for carousel
        if (carousel) {
          middleWrapper = doc.createElement('div');
          middleWrapper.id = slideId + '-mw';
          middleWrapper.className = 'tns-ovh';
  
          outerWrapper.appendChild(middleWrapper);
          middleWrapper.appendChild(innerWrapper);
        } else {
          outerWrapper.appendChild(innerWrapper);
        }
  
        if (autoHeight) {
          var wp = middleWrapper ? middleWrapper : innerWrapper;
          wp.className += ' tns-ah';
        }
  
        containerParent.insertBefore(outerWrapper, container);
        innerWrapper.appendChild(container);
  
        // add id, class, aria attributes
        // before clone slides
        forEach(slideItems, function(item, i) {
          addClass(item, 'tns-item');
          if (!item.id) { item.id = slideId + '-item' + i; }
          if (!carousel && animateNormal) { addClass(item, animateNormal); }
          setAttrs(item, {
            'aria-hidden': 'true',
            'tabindex': '-1'
          });
        });
  
        // ## clone slides
        // carousel: n + slides + n
        // gallery:      slides + n
        if (cloneCount) {
          var fragmentBefore = doc.createDocumentFragment(),
            fragmentAfter = doc.createDocumentFragment();
  
          for (var j = cloneCount; j--;) {
            var num = j%slideCount,
              cloneFirst = slideItems[num].cloneNode(true);
            removeAttrs(cloneFirst, 'id');
            fragmentAfter.insertBefore(cloneFirst, fragmentAfter.firstChild);
  
            if (carousel) {
              var cloneLast = slideItems[slideCount - 1 - num].cloneNode(true);
              removeAttrs(cloneLast, 'id');
              fragmentBefore.appendChild(cloneLast);
            }
          }
  
          container.insertBefore(fragmentBefore, container.firstChild);
          container.appendChild(fragmentAfter);
          slideItems = container.children;
        }
  
      }
  
      function initSliderTransform () {
        // ## images loaded/failed
        if (hasOption('autoHeight') || autoWidth || !horizontal) {
          var imgs = container.querySelectorAll('img');
  
          // add complete class if all images are loaded/failed
          forEach(imgs, function(img) {
            var src = img.src;
  
            if (src && src.indexOf('data:image') < 0) {
              addEvents(img, imgEvents);
              img.src = '';
              img.src = src;
              addClass(img, 'loading');
            } else if (!lazyload) {
              imgLoaded(img);
            }
          });
  
          // All imgs are completed
          raf(function(){ imgsLoadedCheck(arrayFromNodeList(imgs), function() { imgsComplete = true; }); });
  
          // Check imgs in window only for auto height
          if (!autoWidth && horizontal) { imgs = getImageArray(index, Math.min(index + items - 1, slideCountNew - 1)); }
  
          lazyload ? initSliderTransformStyleCheck() : raf(function(){ imgsLoadedCheck(arrayFromNodeList(imgs), initSliderTransformStyleCheck); });
  
        } else {
          // set container transform property
          if (carousel) { doContainerTransformSilent(); }
  
          // update slider tools and events
          initTools();
          initEvents();
        }
      }
  
      function initSliderTransformStyleCheck () {
        if (autoWidth) {
          // check styles application
          var num = loop ? index : slideCount - 1;
          (function stylesApplicationCheck() {
            slideItems[num - 1].getBoundingClientRect().right.toFixed(2) === slideItems[num].getBoundingClientRect().left.toFixed(2) ?
              initSliderTransformCore() :
              setTimeout(function(){ stylesApplicationCheck(); }, 16);
          })();
        } else {
          initSliderTransformCore();
        }
      }
  
  
      function initSliderTransformCore () {
        // run Fn()s which are rely on image loading
        if (!horizontal || autoWidth) {
          setSlidePositions();
  
          if (autoWidth) {
            rightBoundary = getRightBoundary();
            if (freezable) { freeze = getFreeze(); }
            indexMax = getIndexMax(); // <= slidePositions, rightBoundary <=
            resetVariblesWhenDisable(disable || freeze);
          } else {
            updateContentWrapperHeight();
          }
        }
  
        // set container transform property
        if (carousel) { doContainerTransformSilent(); }
  
        // update slider tools and events
        initTools();
        initEvents();
      }
  
      function initSheet () {
        // gallery:
        // set animation classes and left value for gallery slider
        if (!carousel) {
          for (var i = index, l = index + Math.min(slideCount, items); i < l; i++) {
            var item = slideItems[i];
            item.style.left = (i - index) * 100 / items + '%';
            addClass(item, animateIn);
            removeClass(item, animateNormal);
          }
        }
  
        // #### LAYOUT
  
        // ## INLINE-BLOCK VS FLOAT
  
        // ## PercentageLayout:
        // slides: inline-block
        // remove blank space between slides by set font-size: 0
  
        // ## Non PercentageLayout:
        // slides: float
        //         margin-right: -100%
        //         margin-left: ~
  
        // Resource: https://docs.google.com/spreadsheets/d/147up245wwTXeQYve3BRSAD4oVcvQmuGsFteJOeA5xNQ/edit?usp=sharing
        if (horizontal) {
          if (PERCENTAGELAYOUT || autoWidth) {
            addCSSRule(sheet, '#' + slideId + ' > .tns-item', 'font-size:' + win.getComputedStyle(slideItems[0]).fontSize + ';', getCssRulesLength(sheet));
            addCSSRule(sheet, '#' + slideId, 'font-size:0;', getCssRulesLength(sheet));
          } else if (carousel) {
            forEach(slideItems, function (slide, i) {
              slide.style.marginLeft = getSlideMarginLeft(i);
            });
          }
        }
  
  
        // ## BASIC STYLES
        if (CSSMQ) {
          // middle wrapper style
          if (TRANSITIONDURATION) {
            var str = middleWrapper && options.autoHeight ? getTransitionDurationStyle(options.speed) : '';
            addCSSRule(sheet, '#' + slideId + '-mw', str, getCssRulesLength(sheet));
          }
  
          // inner wrapper styles
          str = getInnerWrapperStyles(options.edgePadding, options.gutter, options.fixedWidth, options.speed, options.autoHeight);
          addCSSRule(sheet, '#' + slideId + '-iw', str, getCssRulesLength(sheet));
  
          // container styles
          if (carousel) {
            str = horizontal && !autoWidth ? 'width:' + getContainerWidth(options.fixedWidth, options.gutter, options.items) + ';' : '';
            if (TRANSITIONDURATION) { str += getTransitionDurationStyle(speed); }
            addCSSRule(sheet, '#' + slideId, str, getCssRulesLength(sheet));
          }
  
          // slide styles
          str = horizontal && !autoWidth ? getSlideWidthStyle(options.fixedWidth, options.gutter, options.items) : '';
          if (options.gutter) { str += getSlideGutterStyle(options.gutter); }
          // set gallery items transition-duration
          if (!carousel) {
            if (TRANSITIONDURATION) { str += getTransitionDurationStyle(speed); }
            if (ANIMATIONDURATION) { str += getAnimationDurationStyle(speed); }
          }
          if (str) { addCSSRule(sheet, '#' + slideId + ' > .tns-item', str, getCssRulesLength(sheet)); }
  
          // non CSS mediaqueries: IE8
          // ## update inner wrapper, container, slides if needed
          // set inline styles for inner wrapper & container
          // insert stylesheet (one line) for slides only (since slides are many)
        } else {
          // middle wrapper styles
          update_carousel_transition_duration();
  
          // inner wrapper styles
          innerWrapper.style.cssText = getInnerWrapperStyles(edgePadding, gutter, fixedWidth, autoHeight);
  
          // container styles
          if (carousel && horizontal && !autoWidth) {
            container.style.width = getContainerWidth(fixedWidth, gutter, items);
          }
  
          // slide styles
          var str = horizontal && !autoWidth ? getSlideWidthStyle(fixedWidth, gutter, items) : '';
          if (gutter) { str += getSlideGutterStyle(gutter); }
  
          // append to the last line
          if (str) { addCSSRule(sheet, '#' + slideId + ' > .tns-item', str, getCssRulesLength(sheet)); }
        }
  
        // ## MEDIAQUERIES
        if (responsive && CSSMQ) {
          for (var bp in responsive) {
            // bp: convert string to number
            bp = parseInt(bp);
  
            var opts = responsive[bp],
              str = '',
              middleWrapperStr = '',
              innerWrapperStr = '',
              containerStr = '',
              slideStr = '',
              itemsBP = !autoWidth ? getOption('items', bp) : null,
              fixedWidthBP = getOption('fixedWidth', bp),
              speedBP = getOption('speed', bp),
              edgePaddingBP = getOption('edgePadding', bp),
              autoHeightBP = getOption('autoHeight', bp),
              gutterBP = getOption('gutter', bp);
  
            // middle wrapper string
            if (TRANSITIONDURATION && middleWrapper && getOption('autoHeight', bp) && 'speed' in opts) {
              middleWrapperStr = '#' + slideId + '-mw{' + getTransitionDurationStyle(speedBP) + '}';
            }
  
            // inner wrapper string
            if ('edgePadding' in opts || 'gutter' in opts) {
              innerWrapperStr = '#' + slideId + '-iw{' + getInnerWrapperStyles(edgePaddingBP, gutterBP, fixedWidthBP, speedBP, autoHeightBP) + '}';
            }
  
            // container string
            if (carousel && horizontal && !autoWidth && ('fixedWidth' in opts || 'items' in opts || (fixedWidth && 'gutter' in opts))) {
              containerStr = 'width:' + getContainerWidth(fixedWidthBP, gutterBP, itemsBP) + ';';
            }
            if (TRANSITIONDURATION && 'speed' in opts) {
              containerStr += getTransitionDurationStyle(speedBP);
            }
            if (containerStr) {
              containerStr = '#' + slideId + '{' + containerStr + '}';
            }
  
            // slide string
            if ('fixedWidth' in opts || (fixedWidth && 'gutter' in opts) || !carousel && 'items' in opts) {
              slideStr += getSlideWidthStyle(fixedWidthBP, gutterBP, itemsBP);
            }
            if ('gutter' in opts) {
              slideStr += getSlideGutterStyle(gutterBP);
            }
            // set gallery items transition-duration
            if (!carousel && 'speed' in opts) {
              if (TRANSITIONDURATION) { slideStr += getTransitionDurationStyle(speedBP); }
              if (ANIMATIONDURATION) { slideStr += getAnimationDurationStyle(speedBP); }
            }
            if (slideStr) { slideStr = '#' + slideId + ' > .tns-item{' + slideStr + '}'; }
  
            // add up
            str = middleWrapperStr + innerWrapperStr + containerStr + slideStr;
  
            if (str) {
              sheet.insertRule('@media (min-width: ' + bp / 16 + 'em) {' + str + '}', sheet.cssRules.length);
            }
          }
        }
      }
  
      function initTools () {
        // == slides ==
        updateSlideStatus();
  
        // == live region ==
        outerWrapper.insertAdjacentHTML('afterbegin', '<div class="tns-liveregion tns-visually-hidden" aria-live="polite" aria-atomic="true">slide <span class="current">' + getLiveRegionStr() + '</span>  of ' + slideCount + '</div>');
        liveregionCurrent = outerWrapper.querySelector('.tns-liveregion .current');
  
        // == autoplayInit ==
        if (hasAutoplay) {
          var txt = autoplay ? 'stop' : 'start';
          if (autoplayButton) {
            setAttrs(autoplayButton, {'data-action': txt});
          } else if (options.autoplayButtonOutput) {
            outerWrapper.insertAdjacentHTML(getInsertPosition(options.autoplayPosition), '<button data-action="' + txt + '">' + autoplayHtmlStrings[0] + txt + autoplayHtmlStrings[1] + autoplayText[0] + '</button>');
            autoplayButton = outerWrapper.querySelector('[data-action]');
          }
  
          // add event
          if (autoplayButton) {
            addEvents(autoplayButton, {'click': toggleAutoplay});
          }
  
          if (autoplay) {
            startAutoplay();
            if (autoplayHoverPause) { addEvents(container, hoverEvents); }
            if (autoplayResetOnVisibility) { addEvents(container, visibilityEvent); }
          }
        }
  
        // == navInit ==
        if (hasNav) {
          var initIndex = !carousel ? 0 : cloneCount;
          // customized nav
          // will not hide the navs in case they're thumbnails
          if (navContainer) {
            setAttrs(navContainer, {'aria-label': 'Carousel Pagination'});
            navItems = navContainer.children;
            forEach(navItems, function(item, i) {
              setAttrs(item, {
                'data-nav': i,
                'tabindex': '-1',
                'aria-label': navStr + (i + 1),
                'aria-controls': slideId,
              });
            });
  
            // generated nav
          } else {
            var navHtml = '',
              hiddenStr = navAsThumbnails ? '' : 'style="display:none"';
            for (var i = 0; i < slideCount; i++) {
              // hide nav items by default
              navHtml += '<button data-nav="' + i +'" tabindex="-1" aria-controls="' + slideId + '" ' + hiddenStr + ' aria-label="' + navStr + (i + 1) +'"></button>';
            }
            navHtml = '<div class="tns-nav" aria-label="Carousel Pagination">' + navHtml + '</div>';
            outerWrapper.insertAdjacentHTML(getInsertPosition(options.navPosition), navHtml);
  
            navContainer = outerWrapper.querySelector('.tns-nav');
            navItems = navContainer.children;
          }
  
          updateNavVisibility();
  
          // add transition
          if (TRANSITIONDURATION) {
            var prefix = TRANSITIONDURATION.substring(0, TRANSITIONDURATION.length - 18).toLowerCase(),
              str = 'transition: all ' + speed / 1000 + 's';
  
            if (prefix) {
              str = '-' + prefix + '-' + str;
            }
  
            addCSSRule(sheet, '[aria-controls^=' + slideId + '-item]', str, getCssRulesLength(sheet));
          }
  
          setAttrs(navItems[navCurrentIndex], {'aria-label': navStr + (navCurrentIndex + 1) + navStrCurrent});
          removeAttrs(navItems[navCurrentIndex], 'tabindex');
          addClass(navItems[navCurrentIndex], navActiveClass);
  
          // add events
          addEvents(navContainer, navEvents);
        }
  
  
  
        // == controlsInit ==
        if (hasControls) {
          if (!controlsContainer && (!prevButton || !nextButton)) {
            outerWrapper.insertAdjacentHTML(getInsertPosition(options.controlsPosition), '<div class="tns-controls" aria-label="Carousel Navigation" tabindex="0"><button data-controls="prev" aria-label="prev slide" tabindex="-1" aria-controls="' + slideId +'">' + controlsText[0] + '</button><button data-controls="next" aria-label="next slide" tabindex="-1" aria-controls="' + slideId +'">' + controlsText[1] + '</button></div>');
  
            controlsContainer = outerWrapper.querySelector('.tns-controls');
          }
  
          if (!prevButton || !nextButton) {
            prevButton = controlsContainer.children[0];
            nextButton = controlsContainer.children[1];
          }
  
          if (options.controlsContainer) {
            setAttrs(controlsContainer, {
              'aria-label': 'Carousel Navigation',
              'tabindex': '0'
            });
          }
  
          if (options.controlsContainer || (options.prevButton && options.nextButton)) {
            setAttrs([prevButton, nextButton], {
              'aria-controls': slideId,
              'tabindex': '-1',
            });
          }
  
          if (options.controlsContainer || (options.prevButton && options.nextButton)) {
            setAttrs(prevButton, {'data-controls' : 'prev'});
            setAttrs(nextButton, {'data-controls' : 'next'});
          }
  
          prevIsButton = isButton(prevButton);
          nextIsButton = isButton(nextButton);
  
          updateControlsStatus();
  
          // add events
          if (controlsContainer) {
            addEvents(controlsContainer, controlsEvents);
          } else {
            addEvents(prevButton, controlsEvents);
            addEvents(nextButton, controlsEvents);
          }
        }
  
        // hide tools if needed
        disableUI();
      }
  
      function initEvents () {
        // add events
        if (carousel && TRANSITIONEND) {
          var eve = {};
          eve[TRANSITIONEND] = onTransitionEnd;
          addEvents(container, eve);
        }
  
        if (touch) { addEvents(container, touchEvents, options.preventScrollOnTouch); }
        if (mouseDrag) { addEvents(container, dragEvents); }
        if (arrowKeys) { addEvents(doc, docmentKeydownEvent); }
  
        if (nested === 'inner') {
          events.on('outerResized', function () {
            resizeTasks();
            events.emit('innerLoaded', info());
          });
        } else if (responsive || fixedWidth || autoWidth || autoHeight || !horizontal) {
          addEvents(win, {'resize': onResize});
        }
  
        if (autoHeight) {
          if (nested === 'outer') {
            events.on('innerLoaded', doAutoHeight);
          } else if (!disable) { doAutoHeight(); }
        }
  
        doLazyLoad();
        if (disable) { disableSlider(); } else if (freeze) { freezeSlider(); }
  
        events.on('indexChanged', additionalUpdates);
        if (nested === 'inner') { events.emit('innerLoaded', info()); }
        if (typeof onInit === 'function') { onInit(info()); }
        isOn = true;
      }
  
      function destroy () {
        // sheet
        sheet.disabled = true;
        if (sheet.ownerNode) { sheet.ownerNode.remove(); }
  
        // remove win event listeners
        removeEvents(win, {'resize': onResize});
  
        // arrowKeys, controls, nav
        if (arrowKeys) { removeEvents(doc, docmentKeydownEvent); }
        if (controlsContainer) { removeEvents(controlsContainer, controlsEvents); }
        if (navContainer) { removeEvents(navContainer, navEvents); }
  
        // autoplay
        removeEvents(container, hoverEvents);
        removeEvents(container, visibilityEvent);
        if (autoplayButton) { removeEvents(autoplayButton, {'click': toggleAutoplay}); }
        if (autoplay) { clearInterval(autoplayTimer); }
  
        // container
        if (carousel && TRANSITIONEND) {
          var eve = {};
          eve[TRANSITIONEND] = onTransitionEnd;
          removeEvents(container, eve);
        }
        if (touch) { removeEvents(container, touchEvents); }
        if (mouseDrag) { removeEvents(container, dragEvents); }
  
        // cache Object values in options && reset HTML
        var htmlList = [containerHTML, controlsContainerHTML, prevButtonHTML, nextButtonHTML, navContainerHTML, autoplayButtonHTML];
  
        tnsList.forEach(function(item, i) {
          var el = item === 'container' ? outerWrapper : options[item];
  
          if (typeof el === 'object') {
            var prevEl = el.previousElementSibling ? el.previousElementSibling : false,
              parentEl = el.parentNode;
            el.outerHTML = htmlList[i];
            options[item] = prevEl ? prevEl.nextElementSibling : parentEl.firstElementChild;
          }
        });
  
  
        // reset variables
        tnsList = animateIn = animateOut = animateDelay = animateNormal = horizontal = outerWrapper = innerWrapper = container = containerParent = containerHTML = slideItems = slideCount = breakpointZone = windowWidth = autoWidth = fixedWidth = edgePadding = gutter = viewport = items = slideBy = viewportMax = arrowKeys = speed = rewind = loop = autoHeight = sheet = lazyload = slidePositions = slideItemsOut = cloneCount = slideCountNew = hasRightDeadZone = rightBoundary = updateIndexBeforeTransform = transformAttr = transformPrefix = transformPostfix = getIndexMax = index = indexCached = indexMin = indexMax = resizeTimer = swipeAngle = moveDirectionExpected = running = onInit = events = newContainerClasses = slideId = disable = disabled = freezable = freeze = frozen = controlsEvents = navEvents = hoverEvents = visibilityEvent = docmentKeydownEvent = touchEvents = dragEvents = hasControls = hasNav = navAsThumbnails = hasAutoplay = hasTouch = hasMouseDrag = slideActiveClass = imgCompleteClass = imgEvents = imgsComplete = controls = controlsText = controlsContainer = controlsContainerHTML = prevButton = nextButton = prevIsButton = nextIsButton = nav = navContainer = navContainerHTML = navItems = pages = pagesCached = navClicked = navCurrentIndex = navCurrentIndexCached = navActiveClass = navStr = navStrCurrent = autoplay = autoplayTimeout = autoplayDirection = autoplayText = autoplayHoverPause = autoplayButton = autoplayButtonHTML = autoplayResetOnVisibility = autoplayHtmlStrings = autoplayTimer = animating = autoplayHoverPaused = autoplayUserPaused = autoplayVisibilityPaused = initPosition = lastPosition = translateInit = disX = disY = panStart = rafIndex = getDist = touch = mouseDrag = null;
        // check variables
        // [animateIn, animateOut, animateDelay, animateNormal, horizontal, outerWrapper, innerWrapper, container, containerParent, containerHTML, slideItems, slideCount, breakpointZone, windowWidth, autoWidth, fixedWidth, edgePadding, gutter, viewport, items, slideBy, viewportMax, arrowKeys, speed, rewind, loop, autoHeight, sheet, lazyload, slidePositions, slideItemsOut, cloneCount, slideCountNew, hasRightDeadZone, rightBoundary, updateIndexBeforeTransform, transformAttr, transformPrefix, transformPostfix, getIndexMax, index, indexCached, indexMin, indexMax, resizeTimer, swipeAngle, moveDirectionExpected, running, onInit, events, newContainerClasses, slideId, disable, disabled, freezable, freeze, frozen, controlsEvents, navEvents, hoverEvents, visibilityEvent, docmentKeydownEvent, touchEvents, dragEvents, hasControls, hasNav, navAsThumbnails, hasAutoplay, hasTouch, hasMouseDrag, slideActiveClass, imgCompleteClass, imgEvents, imgsComplete, controls, controlsText, controlsContainer, controlsContainerHTML, prevButton, nextButton, prevIsButton, nextIsButton, nav, navContainer, navContainerHTML, navItems, pages, pagesCached, navClicked, navCurrentIndex, navCurrentIndexCached, navActiveClass, navStr, navStrCurrent, autoplay, autoplayTimeout, autoplayDirection, autoplayText, autoplayHoverPause, autoplayButton, autoplayButtonHTML, autoplayResetOnVisibility, autoplayHtmlStrings, autoplayTimer, animating, autoplayHoverPaused, autoplayUserPaused, autoplayVisibilityPaused, initPosition, lastPosition, translateInit, disX, disY, panStart, rafIndex, getDist, touch, mouseDrag ].forEach(function(item) { if (item !== null) { console.log(item); } });
  
        for (var a in this) {
          if (a !== 'rebuild') { this[a] = null; }
        }
        isOn = false;
      }
  
  // === ON RESIZE ===
      // responsive || fixedWidth || autoWidth || !horizontal
      function onResize (e) {
        raf(function(){ resizeTasks(getEvent(e)); });
      }
  
      function resizeTasks (e) {
        if (!isOn) { return; }
        if (nested === 'outer') { events.emit('outerResized', info(e)); }
        windowWidth = getWindowWidth();
        var bpChanged,
          breakpointZoneTem = breakpointZone,
          needContainerTransform = false;
  
        if (responsive) {
          setBreakpointZone();
          bpChanged = breakpointZoneTem !== breakpointZone;
          // if (hasRightDeadZone) { needContainerTransform = true; } // *?
          if (bpChanged) { events.emit('newBreakpointStart', info(e)); }
        }
  
        var indChanged,
          itemsChanged,
          itemsTem = items,
          disableTem = disable,
          freezeTem = freeze,
          arrowKeysTem = arrowKeys,
          controlsTem = controls,
          navTem = nav,
          touchTem = touch,
          mouseDragTem = mouseDrag,
          autoplayTem = autoplay,
          autoplayHoverPauseTem = autoplayHoverPause,
          autoplayResetOnVisibilityTem = autoplayResetOnVisibility,
          indexTem = index;
  
        if (bpChanged) {
          var fixedWidthTem = fixedWidth,
            autoHeightTem = autoHeight,
            controlsTextTem = controlsText,
            centerTem = center,
            autoplayTextTem = autoplayText;
  
          if (!CSSMQ) {
            var gutterTem = gutter,
              edgePaddingTem = edgePadding;
          }
        }
  
        // get option:
        // fixed width: viewport, fixedWidth, gutter => items
        // others: window width => all variables
        // all: items => slideBy
        arrowKeys = getOption('arrowKeys');
        controls = getOption('controls');
        nav = getOption('nav');
        touch = getOption('touch');
        center = getOption('center');
        mouseDrag = getOption('mouseDrag');
        autoplay = getOption('autoplay');
        autoplayHoverPause = getOption('autoplayHoverPause');
        autoplayResetOnVisibility = getOption('autoplayResetOnVisibility');
  
        if (bpChanged) {
          disable = getOption('disable');
          fixedWidth = getOption('fixedWidth');
          speed = getOption('speed');
          autoHeight = getOption('autoHeight');
          controlsText = getOption('controlsText');
          autoplayText = getOption('autoplayText');
          autoplayTimeout = getOption('autoplayTimeout');
  
          if (!CSSMQ) {
            edgePadding = getOption('edgePadding');
            gutter = getOption('gutter');
          }
        }
        // update options
        resetVariblesWhenDisable(disable);
  
        viewport = getViewportWidth(); // <= edgePadding, gutter
        if ((!horizontal || autoWidth) && !disable) {
          setSlidePositions();
          if (!horizontal) {
            updateContentWrapperHeight(); // <= setSlidePositions
            needContainerTransform = true;
          }
        }
        if (fixedWidth || autoWidth) {
          rightBoundary = getRightBoundary(); // autoWidth: <= viewport, slidePositions, gutter
                                              // fixedWidth: <= viewport, fixedWidth, gutter
          indexMax = getIndexMax(); // autoWidth: <= rightBoundary, slidePositions
                                    // fixedWidth: <= rightBoundary, fixedWidth, gutter
        }
  
        if (bpChanged || fixedWidth) {
          items = getOption('items');
          slideBy = getOption('slideBy');
          itemsChanged = items !== itemsTem;
  
          if (itemsChanged) {
            if (!fixedWidth && !autoWidth) { indexMax = getIndexMax(); } // <= items
            // check index before transform in case
            // slider reach the right edge then items become bigger
            updateIndex();
          }
        }
  
        if (bpChanged) {
          if (disable !== disableTem) {
            if (disable) {
              disableSlider();
            } else {
              enableSlider(); // <= slidePositions, rightBoundary, indexMax
            }
          }
        }
  
        if (freezable && (bpChanged || fixedWidth || autoWidth)) {
          freeze = getFreeze(); // <= autoWidth: slidePositions, gutter, viewport, rightBoundary
                                // <= fixedWidth: fixedWidth, gutter, rightBoundary
                                // <= others: items
  
          if (freeze !== freezeTem) {
            if (freeze) {
              doContainerTransform(getContainerTransformValue(getStartIndex(0)));
              freezeSlider();
            } else {
              unfreezeSlider();
              needContainerTransform = true;
            }
          }
        }
  
        resetVariblesWhenDisable(disable || freeze); // controls, nav, touch, mouseDrag, arrowKeys, autoplay, autoplayHoverPause, autoplayResetOnVisibility
        if (!autoplay) { autoplayHoverPause = autoplayResetOnVisibility = false; }
  
        if (arrowKeys !== arrowKeysTem) {
          arrowKeys ?
            addEvents(doc, docmentKeydownEvent) :
            removeEvents(doc, docmentKeydownEvent);
        }
        if (controls !== controlsTem) {
          if (controls) {
            if (controlsContainer) {
              showElement(controlsContainer);
            } else {
              if (prevButton) { showElement(prevButton); }
              if (nextButton) { showElement(nextButton); }
            }
          } else {
            if (controlsContainer) {
              hideElement(controlsContainer);
            } else {
              if (prevButton) { hideElement(prevButton); }
              if (nextButton) { hideElement(nextButton); }
            }
          }
        }
        if (nav !== navTem) {
          nav ?
            showElement(navContainer) :
            hideElement(navContainer);
        }
        if (touch !== touchTem) {
          touch ?
            addEvents(container, touchEvents, options.preventScrollOnTouch) :
            removeEvents(container, touchEvents);
        }
        if (mouseDrag !== mouseDragTem) {
          mouseDrag ?
            addEvents(container, dragEvents) :
            removeEvents(container, dragEvents);
        }
        if (autoplay !== autoplayTem) {
          if (autoplay) {
            if (autoplayButton) { showElement(autoplayButton); }
            if (!animating && !autoplayUserPaused) { startAutoplay(); }
          } else {
            if (autoplayButton) { hideElement(autoplayButton); }
            if (animating) { stopAutoplay(); }
          }
        }
        if (autoplayHoverPause !== autoplayHoverPauseTem) {
          autoplayHoverPause ?
            addEvents(container, hoverEvents) :
            removeEvents(container, hoverEvents);
        }
        if (autoplayResetOnVisibility !== autoplayResetOnVisibilityTem) {
          autoplayResetOnVisibility ?
            addEvents(doc, visibilityEvent) :
            removeEvents(doc, visibilityEvent);
        }
  
        if (bpChanged) {
          if (fixedWidth !== fixedWidthTem || center !== centerTem) { needContainerTransform = true; }
  
          if (autoHeight !== autoHeightTem) {
            if (!autoHeight) { innerWrapper.style.height = ''; }
          }
  
          if (controls && controlsText !== controlsTextTem) {
            prevButton.innerHTML = controlsText[0];
            nextButton.innerHTML = controlsText[1];
          }
  
          if (autoplayButton && autoplayText !== autoplayTextTem) {
            var i = autoplay ? 1 : 0,
              html = autoplayButton.innerHTML,
              len = html.length - autoplayTextTem[i].length;
            if (html.substring(len) === autoplayTextTem[i]) {
              autoplayButton.innerHTML = html.substring(0, len) + autoplayText[i];
            }
          }
        } else {
          if (center && (fixedWidth || autoWidth)) { needContainerTransform = true; }
        }
  
        if (itemsChanged || fixedWidth && !autoWidth) {
          pages = getPages();
          updateNavVisibility();
        }
  
        indChanged = index !== indexTem;
        if (indChanged) {
          events.emit('indexChanged', info());
          needContainerTransform = true;
        } else if (itemsChanged) {
          if (!indChanged) { additionalUpdates(); }
        } else if (fixedWidth || autoWidth) {
          doLazyLoad();
          updateSlideStatus();
          updateLiveRegion();
        }
  
        if (itemsChanged && !carousel) { updateGallerySlidePositions(); }
  
        if (!disable && !freeze) {
          // non-meduaqueries: IE8
          if (bpChanged && !CSSMQ) {
            // middle wrapper styles
            if (autoHeight !== autoheightTem || speed !== speedTem) {
              update_carousel_transition_duration();
            }
  
            // inner wrapper styles
            if (edgePadding !== edgePaddingTem || gutter !== gutterTem) {
              innerWrapper.style.cssText = getInnerWrapperStyles(edgePadding, gutter, fixedWidth, speed, autoHeight);
            }
  
            if (horizontal) {
              // container styles
              if (carousel) {
                container.style.width = getContainerWidth(fixedWidth, gutter, items);
              }
  
              // slide styles
              var str = getSlideWidthStyle(fixedWidth, gutter, items) +
                getSlideGutterStyle(gutter);
  
              // remove the last line and
              // add new styles
              removeCSSRule(sheet, getCssRulesLength(sheet) - 1);
              addCSSRule(sheet, '#' + slideId + ' > .tns-item', str, getCssRulesLength(sheet));
            }
          }
  
          // auto height
          if (autoHeight) { doAutoHeight(); }
  
          if (needContainerTransform) {
            doContainerTransformSilent();
            indexCached = index;
          }
        }
  
        if (bpChanged) { events.emit('newBreakpointEnd', info(e)); }
      }
  
  
  
  
  
      // === INITIALIZATION FUNCTIONS === //
      function getFreeze () {
        if (!fixedWidth && !autoWidth) {
          var a = center ? items - (items - 1) / 2 : items;
          return  slideCount <= a;
        }
  
        var width = fixedWidth ? (fixedWidth + gutter) * slideCount : slidePositions[slideCount],
          vp = edgePadding ? viewport + edgePadding * 2 : viewport + gutter;
  
        if (center) {
          vp -= fixedWidth ? (viewport - fixedWidth) / 2 : (viewport - (slidePositions[index + 1] - slidePositions[index] - gutter)) / 2;
        }
  
        return width <= vp;
      }
  
      function setBreakpointZone () {
        breakpointZone = 0;
        for (var bp in responsive) {
          bp = parseInt(bp); // convert string to number
          if (windowWidth >= bp) { breakpointZone = bp; }
        }
      }
  
      // (slideBy, indexMin, indexMax) => index
      var updateIndex = (function () {
        return loop ?
          carousel ?
            // loop + carousel
            function () {
              var leftEdge = indexMin,
                rightEdge = indexMax;
  
              leftEdge += slideBy;
              rightEdge -= slideBy;
  
              // adjust edges when has edge paddings
              // or fixed-width slider with extra space on the right side
              if (edgePadding) {
                leftEdge += 1;
                rightEdge -= 1;
              } else if (fixedWidth) {
                if ((viewport + gutter)%(fixedWidth + gutter)) { rightEdge -= 1; }
              }
  
              if (cloneCount) {
                if (index > rightEdge) {
                  index -= slideCount;
                } else if (index < leftEdge) {
                  index += slideCount;
                }
              }
            } :
            // loop + gallery
            function() {
              if (index > indexMax) {
                while (index >= indexMin + slideCount) { index -= slideCount; }
              } else if (index < indexMin) {
                while (index <= indexMax - slideCount) { index += slideCount; }
              }
            } :
          // non-loop
          function() {
            index = Math.max(indexMin, Math.min(indexMax, index));
          };
      })();
  
      function disableUI () {
        if (!autoplay && autoplayButton) { hideElement(autoplayButton); }
        if (!nav && navContainer) { hideElement(navContainer); }
        if (!controls) {
          if (controlsContainer) {
            hideElement(controlsContainer);
          } else {
            if (prevButton) { hideElement(prevButton); }
            if (nextButton) { hideElement(nextButton); }
          }
        }
      }
  
      function enableUI () {
        if (autoplay && autoplayButton) { showElement(autoplayButton); }
        if (nav && navContainer) { showElement(navContainer); }
        if (controls) {
          if (controlsContainer) {
            showElement(controlsContainer);
          } else {
            if (prevButton) { showElement(prevButton); }
            if (nextButton) { showElement(nextButton); }
          }
        }
      }
  
      function freezeSlider () {
        if (frozen) { return; }
  
        // remove edge padding from inner wrapper
        if (edgePadding) { innerWrapper.style.margin = '0px'; }
  
        // add class tns-transparent to cloned slides
        if (cloneCount) {
          var str = 'tns-transparent';
          for (var i = cloneCount; i--;) {
            if (carousel) { addClass(slideItems[i], str); }
            addClass(slideItems[slideCountNew - i - 1], str);
          }
        }
  
        // update tools
        disableUI();
  
        frozen = true;
      }
  
      function unfreezeSlider () {
        if (!frozen) { return; }
  
        // restore edge padding for inner wrapper
        // for mordern browsers
        if (edgePadding && CSSMQ) { innerWrapper.style.margin = ''; }
  
        // remove class tns-transparent to cloned slides
        if (cloneCount) {
          var str = 'tns-transparent';
          for (var i = cloneCount; i--;) {
            if (carousel) { removeClass(slideItems[i], str); }
            removeClass(slideItems[slideCountNew - i - 1], str);
          }
        }
  
        // update tools
        enableUI();
  
        frozen = false;
      }
  
      function disableSlider () {
        if (disabled) { return; }
  
        sheet.disabled = true;
        container.className = container.className.replace(newContainerClasses.substring(1), '');
        removeAttrs(container, ['style']);
        if (loop) {
          for (var j = cloneCount; j--;) {
            if (carousel) { hideElement(slideItems[j]); }
            hideElement(slideItems[slideCountNew - j - 1]);
          }
        }
  
        // vertical slider
        if (!horizontal || !carousel) { removeAttrs(innerWrapper, ['style']); }
  
        // gallery
        if (!carousel) {
          for (var i = index, l = index + slideCount; i < l; i++) {
            var item = slideItems[i];
            removeAttrs(item, ['style']);
            removeClass(item, animateIn);
            removeClass(item, animateNormal);
          }
        }
  
        // update tools
        disableUI();
  
        disabled = true;
      }
  
      function enableSlider () {
        if (!disabled) { return; }
  
        sheet.disabled = false;
        container.className += newContainerClasses;
        doContainerTransformSilent();
  
        if (loop) {
          for (var j = cloneCount; j--;) {
            if (carousel) { showElement(slideItems[j]); }
            showElement(slideItems[slideCountNew - j - 1]);
          }
        }
  
        // gallery
        if (!carousel) {
          for (var i = index, l = index + slideCount; i < l; i++) {
            var item = slideItems[i],
              classN = i < index + items ? animateIn : animateNormal;
            item.style.left = (i - index) * 100 / items + '%';
            addClass(item, classN);
          }
        }
  
        // update tools
        enableUI();
  
        disabled = false;
      }
  
      function updateLiveRegion () {
        var str = getLiveRegionStr();
        if (liveregionCurrent.innerHTML !== str) { liveregionCurrent.innerHTML = str; }
      }
  
      function getLiveRegionStr () {
        var arr = getVisibleSlideRange(),
          start = arr[0] + 1,
          end = arr[1] + 1;
        return start === end ? start + '' : start + ' to ' + end;
      }
  
      function getVisibleSlideRange (val) {
        if (val == null) { val = getContainerTransformValue(); }
        var start = index, end, rangestart, rangeend;
  
        // get range start, range end for autoWidth and fixedWidth
        if (center || edgePadding) {
          if (autoWidth || fixedWidth) {
            rangestart = - (parseFloat(val) + edgePadding);
            rangeend = rangestart + viewport + edgePadding * 2;
          }
        } else {
          if (autoWidth) {
            rangestart = slidePositions[index];
            rangeend = rangestart + viewport;
          }
        }
  
        // get start, end
        // - check auto width
        if (autoWidth) {
          slidePositions.forEach(function(point, i) {
            if (i < slideCountNew) {
              if ((center || edgePadding) && point <= rangestart + 0.5) { start = i; }
              if (rangeend - point >= 0.5) { end = i; }
            }
          });
  
          // - check percentage width, fixed width
        } else {
  
          if (fixedWidth) {
            var cell = fixedWidth + gutter;
            if (center || edgePadding) {
              start = Math.floor(rangestart/cell);
              end = Math.ceil(rangeend/cell - 1);
            } else {
              end = start + Math.ceil(viewport/cell) - 1;
            }
  
          } else {
            if (center || edgePadding) {
              var a = items - 1;
              if (center) {
                start -= a / 2;
                end = index + a / 2;
              } else {
                end = index + a;
              }
  
              if (edgePadding) {
                var b = edgePadding * items / viewport;
                start -= b;
                end += b;
              }
  
              start = Math.floor(start);
              end = Math.ceil(end);
            } else {
              end = start + items - 1;
            }
          }
  
          start = Math.max(start, 0);
          end = Math.min(end, slideCountNew - 1);
        }
  
        return [start, end];
      }
  
      function doLazyLoad () {
        if (lazyload && !disable) {
          getImageArray.apply(null, getVisibleSlideRange()).forEach(function (img) {
            if (!hasClass(img, imgCompleteClass)) {
              // stop propagation transitionend event to container
              var eve = {};
              eve[TRANSITIONEND] = function (e) { e.stopPropagation(); };
              addEvents(img, eve);
  
              addEvents(img, imgEvents);
  
              // update src
              img.src = getAttr(img, 'data-src');
  
              // update srcset
              var srcset = getAttr(img, 'data-srcset');
              if (srcset) { img.srcset = srcset; }
  
              addClass(img, 'loading');
            }
          });
        }
      }
  
      function onImgLoaded (e) {
        imgLoaded(getTarget(e));
      }
  
      function onImgFailed (e) {
        imgFailed(getTarget(e));
      }
  
      function imgLoaded (img) {
        addClass(img, 'loaded');
        imgCompleted(img);
      }
  
      function imgFailed (img) {
        addClass(img, 'failed');
        imgCompleted(img);
      }
  
      function imgCompleted (img) {
        addClass(img, 'tns-complete');
        removeClass(img, 'loading');
        removeEvents(img, imgEvents);
      }
  
      function getImageArray (start, end) {
        var imgs = [];
        while (start <= end) {
          forEach(slideItems[start].querySelectorAll('img'), function (img) { imgs.push(img); });
          start++;
        }
  
        return imgs;
      }
  
      // check if all visible images are loaded
      // and update container height if it's done
      function doAutoHeight () {
        var imgs = getImageArray.apply(null, getVisibleSlideRange());
        raf(function(){ imgsLoadedCheck(imgs, updateInnerWrapperHeight); });
      }
  
      function imgsLoadedCheck (imgs, cb) {
        // directly execute callback function if all images are complete
        if (imgsComplete) { return cb(); }
  
        // check selected image classes otherwise
        imgs.forEach(function (img, index) {
          if (hasClass(img, imgCompleteClass)) { imgs.splice(index, 1); }
        });
  
        // execute callback function if selected images are all complete
        if (!imgs.length) { return cb(); }
  
        // otherwise execute this functiona again
        raf(function(){ imgsLoadedCheck(imgs, cb); });
      }
  
      function additionalUpdates () {
        doLazyLoad();
        updateSlideStatus();
        updateLiveRegion();
        updateControlsStatus();
        updateNavStatus();
      }
  
  
      function update_carousel_transition_duration () {
        if (carousel && autoHeight) {
          middleWrapper.style[TRANSITIONDURATION] = speed / 1000 + 's';
        }
      }
  
      function getMaxSlideHeight (slideStart, slideRange) {
        var heights = [];
        for (var i = slideStart, l = Math.min(slideStart + slideRange, slideCountNew); i < l; i++) {
          heights.push(slideItems[i].offsetHeight);
        }
  
        return Math.max.apply(null, heights);
      }
  
      // update inner wrapper height
      // 1. get the max-height of the visible slides
      // 2. set transitionDuration to speed
      // 3. update inner wrapper height to max-height
      // 4. set transitionDuration to 0s after transition done
      function updateInnerWrapperHeight () {
        var maxHeight = autoHeight ? getMaxSlideHeight(index, items) : getMaxSlideHeight(cloneCount, slideCount),
          wp = middleWrapper ? middleWrapper : innerWrapper;
  
        if (wp.style.height !== maxHeight) { wp.style.height = maxHeight + 'px'; }
      }
  
      // get the distance from the top edge of the first slide to each slide
      // (init) => slidePositions
      function setSlidePositions () {
        slidePositions = [0];
        var attr = horizontal ? 'left' : 'top',
          attr2 = horizontal ? 'right' : 'bottom',
          base = slideItems[0].getBoundingClientRect()[attr];
  
        forEach(slideItems, function(item, i) {
          // skip the first slide
          if (i) { slidePositions.push(item.getBoundingClientRect()[attr] - base); }
          // add the end edge
          if (i === slideCountNew - 1) { slidePositions.push(item.getBoundingClientRect()[attr2] - base); }
        });
      }
  
      // update slide
      function updateSlideStatus () {
        var range = getVisibleSlideRange(),
          start = range[0],
          end = range[1];
  
        forEach(slideItems, function(item, i) {
          // show slides
          if (i >= start && i <= end) {
            if (hasAttr(item, 'aria-hidden')) {
              removeAttrs(item, ['aria-hidden', 'tabindex']);
              addClass(item, slideActiveClass);
            }
            // hide slides
          } else {
            if (!hasAttr(item, 'aria-hidden')) {
              setAttrs(item, {
                'aria-hidden': 'true',
                'tabindex': '-1'
              });
              removeClass(item, slideActiveClass);
            }
          }
        });
      }
  
      // gallery: update slide position
      function updateGallerySlidePositions () {
        var l = index + Math.min(slideCount, items);
        for (var i = slideCountNew; i--;) {
          var item = slideItems[i];
  
          if (i >= index && i < l) {
            // add transitions to visible slides when adjusting their positions
            addClass(item, 'tns-moving');
  
            item.style.left = (i - index) * 100 / items + '%';
            addClass(item, animateIn);
            removeClass(item, animateNormal);
          } else if (item.style.left) {
            item.style.left = '';
            addClass(item, animateNormal);
            removeClass(item, animateIn);
          }
  
          // remove outlet animation
          removeClass(item, animateOut);
        }
  
        // removing '.tns-moving'
        setTimeout(function() {
          forEach(slideItems, function(el) {
            removeClass(el, 'tns-moving');
          });
        }, 300);
      }
  
      // set tabindex on Nav
      function updateNavStatus () {
        // get current nav
        if (nav) {
          navCurrentIndex = navClicked >= 0 ? navClicked : getCurrentNavIndex();
          navClicked = -1;
  
          if (navCurrentIndex !== navCurrentIndexCached) {
            var navPrev = navItems[navCurrentIndexCached],
              navCurrent = navItems[navCurrentIndex];
  
            setAttrs(navPrev, {
              'tabindex': '-1',
              'aria-label': navStr + (navCurrentIndexCached + 1)
            });
            removeClass(navPrev, navActiveClass);
  
            setAttrs(navCurrent, {'aria-label': navStr + (navCurrentIndex + 1) + navStrCurrent});
            removeAttrs(navCurrent, 'tabindex');
            addClass(navCurrent, navActiveClass);
  
            navCurrentIndexCached = navCurrentIndex;
          }
        }
      }
  
      function getLowerCaseNodeName (el) {
        return el.nodeName.toLowerCase();
      }
  
      function isButton (el) {
        return getLowerCaseNodeName(el) === 'button';
      }
  
      function isAriaDisabled (el) {
        return el.getAttribute('aria-disabled') === 'true';
      }
  
      function disEnableElement (isButton, el, val) {
        if (isButton) {
          el.disabled = val;
        } else {
          el.setAttribute('aria-disabled', val.toString());
        }
      }
  
      // set 'disabled' to true on controls when reach the edges
      function updateControlsStatus () {
        if (!controls || rewind || loop) { return; }
  
        var prevDisabled = (prevIsButton) ? prevButton.disabled : isAriaDisabled(prevButton),
          nextDisabled = (nextIsButton) ? nextButton.disabled : isAriaDisabled(nextButton),
          disablePrev = (index <= indexMin) ? true : false,
          disableNext = (!rewind && index >= indexMax) ? true : false;
  
        if (disablePrev && !prevDisabled) {
          disEnableElement(prevIsButton, prevButton, true);
        }
        if (!disablePrev && prevDisabled) {
          disEnableElement(prevIsButton, prevButton, false);
        }
        if (disableNext && !nextDisabled) {
          disEnableElement(nextIsButton, nextButton, true);
        }
        if (!disableNext && nextDisabled) {
          disEnableElement(nextIsButton, nextButton, false);
        }
      }
  
      // set duration
      function resetDuration (el, str) {
        if (TRANSITIONDURATION) { el.style[TRANSITIONDURATION] = str; }
      }
  
      function getSliderWidth () {
        return fixedWidth ? (fixedWidth + gutter) * slideCountNew : slidePositions[slideCountNew];
      }
  
      function getCenterGap (num) {
        if (num == null) { num = index; }
  
        var gap = edgePadding ? gutter : 0;
        return autoWidth ? ((viewport - gap) - (slidePositions[num + 1] - slidePositions[num] - gutter))/2 :
          fixedWidth ? (viewport - fixedWidth) / 2 :
            (items - 1) / 2;
      }
  
      function getRightBoundary () {
        var gap = edgePadding ? gutter : 0,
          result = (viewport + gap) - getSliderWidth();
  
        if (center && !loop) {
          result = fixedWidth ? - (fixedWidth + gutter) * (slideCountNew - 1) - getCenterGap() :
            getCenterGap(slideCountNew - 1) - slidePositions[slideCountNew - 1];
        }
        if (result > 0) { result = 0; }
  
        return result;
      }
  
      function getContainerTransformValue (num) {
        if (num == null) { num = index; }
  
        var val;
        if (horizontal && !autoWidth) {
          if (fixedWidth) {
            val = - (fixedWidth + gutter) * num;
            if (center) { val += getCenterGap(); }
          } else {
            var denominator = TRANSFORM ? slideCountNew : items;
            if (center) { num -= getCenterGap(); }
            val = - num * 100 / denominator;
          }
        } else {
          val = - slidePositions[num];
          if (center && autoWidth) {
            val += getCenterGap();
          }
        }
  
        if (hasRightDeadZone) { val = Math.max(val, rightBoundary); }
  
        val += (horizontal && !autoWidth && !fixedWidth) ? '%' : 'px';
  
        return val;
      }
  
      function doContainerTransformSilent (val) {
        resetDuration(container, '0s');
        doContainerTransform(val);
      }
  
      function doContainerTransform (val) {
        if (val == null) { val = getContainerTransformValue(); }
        container.style[transformAttr] = transformPrefix + val + transformPostfix;
      }
  
      function animateSlide (number, classOut, classIn, isOut) {
        var l = number + items;
        if (!loop) { l = Math.min(l, slideCountNew); }
  
        for (var i = number; i < l; i++) {
          var item = slideItems[i];
  
          // set item positions
          if (!isOut) { item.style.left = (i - index) * 100 / items + '%'; }
  
          if (animateDelay && TRANSITIONDELAY) {
            item.style[TRANSITIONDELAY] = item.style[ANIMATIONDELAY] = animateDelay * (i - number) / 1000 + 's';
          }
          removeClass(item, classOut);
          addClass(item, classIn);
  
          if (isOut) { slideItemsOut.push(item); }
        }
      }
  
      // make transfer after click/drag:
      // 1. change 'transform' property for mordern browsers
      // 2. change 'left' property for legacy browsers
      var transformCore = (function () {
        return carousel ?
          function () {
            resetDuration(container, '');
            if (TRANSITIONDURATION || !speed) {
              // for morden browsers with non-zero duration or
              // zero duration for all browsers
              doContainerTransform();
              // run fallback function manually
              // when duration is 0 / container is hidden
              if (!speed || !isVisible(container)) { onTransitionEnd(); }
  
            } else {
              // for old browser with non-zero duration
              jsTransform(container, transformAttr, transformPrefix, transformPostfix, getContainerTransformValue(), speed, onTransitionEnd);
            }
  
            if (!horizontal) { updateContentWrapperHeight(); }
          } :
          function () {
            slideItemsOut = [];
  
            var eve = {};
            eve[TRANSITIONEND] = eve[ANIMATIONEND] = onTransitionEnd;
            removeEvents(slideItems[indexCached], eve);
            addEvents(slideItems[index], eve);
  
            animateSlide(indexCached, animateIn, animateOut, true);
            animateSlide(index, animateNormal, animateIn);
  
            // run fallback function manually
            // when transition or animation not supported / duration is 0
            if (!TRANSITIONEND || !ANIMATIONEND || !speed || !isVisible(container)) { onTransitionEnd(); }
          };
      })();
  
      function render (e, sliderMoved) {
        if (updateIndexBeforeTransform) { updateIndex(); }
  
        // render when slider was moved (touch or drag) even though index may not change
        if (index !== indexCached || sliderMoved) {
          // events
          events.emit('indexChanged', info());
          events.emit('transitionStart', info());
          if (autoHeight) { doAutoHeight(); }
  
          // pause autoplay when click or keydown from user
          if (animating && e && ['click', 'keydown'].indexOf(e.type) >= 0) { stopAutoplay(); }
  
          running = true;
          transformCore();
        }
      }
  
      /*
       * Transfer prefixed properties to the same format
       * CSS: -Webkit-Transform => webkittransform
       * JS: WebkitTransform => webkittransform
       * @param {string} str - property
       *
       */
      function strTrans (str) {
        return str.toLowerCase().replace(/-/g, '');
      }
  
      // AFTER TRANSFORM
      // Things need to be done after a transfer:
      // 1. check index
      // 2. add classes to visible slide
      // 3. disable controls buttons when reach the first/last slide in non-loop slider
      // 4. update nav status
      // 5. lazyload images
      // 6. update container height
      function onTransitionEnd (event) {
        // check running on gallery mode
        // make sure trantionend/animationend events run only once
        if (carousel || running) {
          events.emit('transitionEnd', info(event));
  
          if (!carousel && slideItemsOut.length > 0) {
            for (var i = 0; i < slideItemsOut.length; i++) {
              var item = slideItemsOut[i];
              // set item positions
              item.style.left = '';
  
              if (ANIMATIONDELAY && TRANSITIONDELAY) {
                item.style[ANIMATIONDELAY] = '';
                item.style[TRANSITIONDELAY] = '';
              }
              removeClass(item, animateOut);
              addClass(item, animateNormal);
            }
          }
  
          /* update slides, nav, controls after checking ...
           * => legacy browsers who don't support 'event'
           *    have to check event first, otherwise event.target will cause an error
           * => or 'gallery' mode:
           *   + event target is slide item
           * => or 'carousel' mode:
           *   + event target is container,
           *   + event.property is the same with transform attribute
           */
          if (!event ||
            !carousel && event.target.parentNode === container ||
            event.target === container && strTrans(event.propertyName) === strTrans(transformAttr)) {
  
            if (!updateIndexBeforeTransform) {
              var indexTem = index;
              updateIndex();
              if (index !== indexTem) {
                events.emit('indexChanged', info());
  
                doContainerTransformSilent();
              }
            }
  
            if (nested === 'inner') { events.emit('innerLoaded', info()); }
            running = false;
            indexCached = index;
          }
        }
  
      }
  
      // # ACTIONS
      function goTo (targetIndex, e) {
        if (freeze) { return; }
  
        // prev slideBy
        if (targetIndex === 'prev') {
          onControlsClick(e, -1);
  
          // next slideBy
        } else if (targetIndex === 'next') {
          onControlsClick(e, 1);
  
          // go to exact slide
        } else {
          if (running) {
            if (preventActionWhenRunning) { return; } else { onTransitionEnd(); }
          }
  
          var absIndex = getAbsIndex(),
            indexGap = 0;
  
          if (targetIndex === 'first') {
            indexGap = - absIndex;
          } else if (targetIndex === 'last') {
            indexGap = carousel ? slideCount - items - absIndex : slideCount - 1 - absIndex;
          } else {
            if (typeof targetIndex !== 'number') { targetIndex = parseInt(targetIndex); }
  
            if (!isNaN(targetIndex)) {
              // from directly called goTo function
              if (!e) { targetIndex = Math.max(0, Math.min(slideCount - 1, targetIndex)); }
  
              indexGap = targetIndex - absIndex;
            }
          }
  
          // gallery: make sure new page won't overlap with current page
          if (!carousel && indexGap && Math.abs(indexGap) < items) {
            var factor = indexGap > 0 ? 1 : -1;
            indexGap += (index + indexGap - slideCount) >= indexMin ? slideCount * factor : slideCount * 2 * factor * -1;
          }
  
          index += indexGap;
  
          // make sure index is in range
          if (carousel && loop) {
            if (index < indexMin) { index += slideCount; }
            if (index > indexMax) { index -= slideCount; }
          }
  
          // if index is changed, start rendering
          if (getAbsIndex(index) !== getAbsIndex(indexCached)) {
            render(e);
          }
  
        }
      }
  
      // on controls click
      function onControlsClick (e, dir) {
        if (running) {
          if (preventActionWhenRunning) { return; } else { onTransitionEnd(); }
        }
        var passEventObject;
  
        if (!dir) {
          e = getEvent(e);
          var target = getTarget(e);
  
          while (target !== controlsContainer && [prevButton, nextButton].indexOf(target) < 0) { target = target.parentNode; }
  
          var targetIn = [prevButton, nextButton].indexOf(target);
          if (targetIn >= 0) {
            passEventObject = true;
            dir = targetIn === 0 ? -1 : 1;
          }
        }
  
        if (rewind) {
          if (index === indexMin && dir === -1) {
            goTo('last', e);
            return;
          } else if (index === indexMax && dir === 1) {
            goTo('first', e);
            return;
          }
        }
  
        if (dir) {
          index += slideBy * dir;
          if (autoWidth) { index = Math.floor(index); }
          // pass e when click control buttons or keydown
          render((passEventObject || (e && e.type === 'keydown')) ? e : null);
        }
      }
  
      // on nav click
      function onNavClick (e) {
        if (running) {
          if (preventActionWhenRunning) { return; } else { onTransitionEnd(); }
        }
  
        e = getEvent(e);
        var target = getTarget(e), navIndex;
  
        // find the clicked nav item
        while (target !== navContainer && !hasAttr(target, 'data-nav')) { target = target.parentNode; }
        if (hasAttr(target, 'data-nav')) {
          var navIndex = navClicked = Number(getAttr(target, 'data-nav')),
            targetIndexBase = fixedWidth || autoWidth ? navIndex * slideCount / pages : navIndex * items,
            targetIndex = navAsThumbnails ? navIndex : Math.min(Math.ceil(targetIndexBase), slideCount - 1);
          goTo(targetIndex, e);
  
          if (navCurrentIndex === navIndex) {
            if (animating) { stopAutoplay(); }
            navClicked = -1; // reset navClicked
          }
        }
      }
  
      // autoplay functions
      function setAutoplayTimer () {
        autoplayTimer = setInterval(function () {
          onControlsClick(null, autoplayDirection);
        }, autoplayTimeout);
  
        animating = true;
      }
  
      function stopAutoplayTimer () {
        clearInterval(autoplayTimer);
        animating = false;
      }
  
      function updateAutoplayButton (action, txt) {
        setAttrs(autoplayButton, {'data-action': action});
        autoplayButton.innerHTML = autoplayHtmlStrings[0] + action + autoplayHtmlStrings[1] + txt;
      }
  
      function startAutoplay () {
        setAutoplayTimer();
        if (autoplayButton) { updateAutoplayButton('stop', autoplayText[1]); }
      }
  
      function stopAutoplay () {
        stopAutoplayTimer();
        if (autoplayButton) { updateAutoplayButton('start', autoplayText[0]); }
      }
  
      // programaitcally play/pause the slider
      function play () {
        if (autoplay && !animating) {
          startAutoplay();
          autoplayUserPaused = false;
        }
      }
      function pause () {
        if (animating) {
          stopAutoplay();
          autoplayUserPaused = true;
        }
      }
  
      function toggleAutoplay () {
        if (animating) {
          stopAutoplay();
          autoplayUserPaused = true;
        } else {
          startAutoplay();
          autoplayUserPaused = false;
        }
      }
  
      function onVisibilityChange () {
        if (doc.hidden) {
          if (animating) {
            stopAutoplayTimer();
            autoplayVisibilityPaused = true;
          }
        } else if (autoplayVisibilityPaused) {
          setAutoplayTimer();
          autoplayVisibilityPaused = false;
        }
      }
  
      function mouseoverPause () {
        if (animating) {
          stopAutoplayTimer();
          autoplayHoverPaused = true;
        }
      }
  
      function mouseoutRestart () {
        if (autoplayHoverPaused) {
          setAutoplayTimer();
          autoplayHoverPaused = false;
        }
      }
  
      // keydown events on document
      function onDocumentKeydown (e) {
        e = getEvent(e);
        var keyIndex = [KEYS.LEFT, KEYS.RIGHT].indexOf(e.keyCode);
  
        if (keyIndex >= 0) {
          onControlsClick(e, keyIndex === 0 ? -1 : 1);
        }
      }
  
      // on key control
      function onControlsKeydown (e) {
        e = getEvent(e);
        var keyIndex = [KEYS.LEFT, KEYS.RIGHT].indexOf(e.keyCode);
  
        if (keyIndex >= 0) {
          if (keyIndex === 0) {
            if (!prevButton.disabled) { onControlsClick(e, -1); }
          } else if (!nextButton.disabled) {
            onControlsClick(e, 1);
          }
        }
      }
  
      // set focus
      function setFocus (el) {
        el.focus();
      }
  
      // on key nav
      function onNavKeydown (e) {
        e = getEvent(e);
        var curElement = doc.activeElement;
        if (!hasAttr(curElement, 'data-nav')) { return; }
  
        // var code = e.keyCode,
        var keyIndex = [KEYS.LEFT, KEYS.RIGHT, KEYS.ENTER, KEYS.SPACE].indexOf(e.keyCode),
          navIndex = Number(getAttr(curElement, 'data-nav'));
  
        if (keyIndex >= 0) {
          if (keyIndex === 0) {
            if (navIndex > 0) { setFocus(navItems[navIndex - 1]); }
          } else if (keyIndex === 1) {
            if (navIndex < pages - 1) { setFocus(navItems[navIndex + 1]); }
          } else {
            navClicked = navIndex;
            goTo(navIndex, e);
          }
        }
      }
  
      function getEvent (e) {
        e = e || win.event;
        return isTouchEvent(e) ? e.changedTouches[0] : e;
      }
      function getTarget (e) {
        return e.target || win.event.srcElement;
      }
  
      function isTouchEvent (e) {
        return e.type.indexOf('touch') >= 0;
      }
  
      function preventDefaultBehavior (e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
      }
  
      function getMoveDirectionExpected () {
        return getTouchDirection(toDegree(lastPosition.y - initPosition.y, lastPosition.x - initPosition.x), swipeAngle) === options.axis;
      }
  
      function onPanStart (e) {
        if (running) {
          if (preventActionWhenRunning) { return; } else { onTransitionEnd(); }
        }
  
        if (autoplay && animating) { stopAutoplayTimer(); }
  
        panStart = true;
        if (rafIndex) {
          caf(rafIndex);
          rafIndex = null;
        }
  
        var $ = getEvent(e);
        events.emit(isTouchEvent(e) ? 'touchStart' : 'dragStart', info(e));
  
        if (!isTouchEvent(e) && ['img', 'a'].indexOf(getLowerCaseNodeName(getTarget(e))) >= 0) {
          preventDefaultBehavior(e);
        }
  
        lastPosition.x = initPosition.x = $.clientX;
        lastPosition.y = initPosition.y = $.clientY;
        if (carousel) {
          translateInit = parseFloat(container.style[transformAttr].replace(transformPrefix, ''));
          resetDuration(container, '0s');
        }
      }
  
      function onPanMove (e) {
        if (panStart) {
          var $ = getEvent(e);
          lastPosition.x = $.clientX;
          lastPosition.y = $.clientY;
  
          if (carousel) {
            if (!rafIndex) { rafIndex = raf(function(){ panUpdate(e); }); }
          } else {
            if (moveDirectionExpected === '?') { moveDirectionExpected = getMoveDirectionExpected(); }
            if (moveDirectionExpected) { preventScroll = true; }
          }
  
          if (preventScroll) { e.preventDefault(); }
        }
      }
  
      function panUpdate (e) {
        if (!moveDirectionExpected) {
          panStart = false;
          return;
        }
        caf(rafIndex);
        if (panStart) { rafIndex = raf(function(){ panUpdate(e); }); }
  
        if (moveDirectionExpected === '?') { moveDirectionExpected = getMoveDirectionExpected(); }
        if (moveDirectionExpected) {
          if (!preventScroll && isTouchEvent(e)) { preventScroll = true; }
  
          try {
            if (e.type) { events.emit(isTouchEvent(e) ? 'touchMove' : 'dragMove', info(e)); }
          } catch(err) {}
  
          var x = translateInit,
            dist = getDist(lastPosition, initPosition);
          if (!horizontal || fixedWidth || autoWidth) {
            x += dist;
            x += 'px';
          } else {
            var percentageX = TRANSFORM ? dist * items * 100 / ((viewport + gutter) * slideCountNew): dist * 100 / (viewport + gutter);
            x += percentageX;
            x += '%';
          }
  
          container.style[transformAttr] = transformPrefix + x + transformPostfix;
        }
      }
  
      function onPanEnd (e) {
        if (panStart) {
          if (rafIndex) {
            caf(rafIndex);
            rafIndex = null;
          }
          if (carousel) { resetDuration(container, ''); }
          panStart = false;
  
          var $ = getEvent(e);
          lastPosition.x = $.clientX;
          lastPosition.y = $.clientY;
          var dist = getDist(lastPosition, initPosition);
  
          if (Math.abs(dist)) {
            // drag vs click
            if (!isTouchEvent(e)) {
              // prevent "click"
              var target = getTarget(e);
              addEvents(target, {'click': function preventClick (e) {
                  preventDefaultBehavior(e);
                  removeEvents(target, {'click': preventClick});
                }});
            }
  
            if (carousel) {
              rafIndex = raf(function() {
                if (horizontal && !autoWidth) {
                  var indexMoved = - dist * items / (viewport + gutter);
                  indexMoved = dist > 0 ? Math.floor(indexMoved) : Math.ceil(indexMoved);
                  index += indexMoved;
                } else {
                  var moved = - (translateInit + dist);
                  if (moved <= 0) {
                    index = indexMin;
                  } else if (moved >= slidePositions[slideCountNew - 1]) {
                    index = indexMax;
                  } else {
                    var i = 0;
                    while (i < slideCountNew && moved >= slidePositions[i]) {
                      index = i;
                      if (moved > slidePositions[i] && dist < 0) { index += 1; }
                      i++;
                    }
                  }
                }
  
                render(e, dist);
                events.emit(isTouchEvent(e) ? 'touchEnd' : 'dragEnd', info(e));
              });
            } else {
              if (moveDirectionExpected) {
                onControlsClick(e, dist > 0 ? -1 : 1);
              }
            }
          }
        }
  
        // reset
        if (options.preventScrollOnTouch === 'auto') { preventScroll = false; }
        if (swipeAngle) { moveDirectionExpected = '?'; }
        if (autoplay && !animating) { setAutoplayTimer(); }
      }
  
      // === RESIZE FUNCTIONS === //
      // (slidePositions, index, items) => vertical_conentWrapper.height
      function updateContentWrapperHeight () {
        var wp = middleWrapper ? middleWrapper : innerWrapper;
        wp.style.height = slidePositions[index + items] - slidePositions[index] + 'px';
      }
  
      function getPages () {
        var rough = fixedWidth ? (fixedWidth + gutter) * slideCount / viewport : slideCount / items;
        return Math.min(Math.ceil(rough), slideCount);
      }
  
      /*
       * 1. update visible nav items list
       * 2. add "hidden" attributes to previous visible nav items
       * 3. remove "hidden" attrubutes to new visible nav items
       */
      function updateNavVisibility () {
        if (!nav || navAsThumbnails) { return; }
  
        if (pages !== pagesCached) {
          var min = pagesCached,
            max = pages,
            fn = showElement;
  
          if (pagesCached > pages) {
            min = pages;
            max = pagesCached;
            fn = hideElement;
          }
  
          while (min < max) {
            fn(navItems[min]);
            min++;
          }
  
          // cache pages
          pagesCached = pages;
        }
      }
  
      function info (e) {
        return {
          container: container,
          slideItems: slideItems,
          navContainer: navContainer,
          navItems: navItems,
          controlsContainer: controlsContainer,
          hasControls: hasControls,
          prevButton: prevButton,
          nextButton: nextButton,
          items: items,
          slideBy: slideBy,
          cloneCount: cloneCount,
          slideCount: slideCount,
          slideCountNew: slideCountNew,
          index: index,
          indexCached: indexCached,
          displayIndex: getCurrentSlide(),
          navCurrentIndex: navCurrentIndex,
          navCurrentIndexCached: navCurrentIndexCached,
          pages: pages,
          pagesCached: pagesCached,
          sheet: sheet,
          isOn: isOn,
          event: e || {},
        };
      }
  
      return {
        version: '2.9.1',
        getInfo: info,
        events: events,
        goTo: goTo,
        play: play,
        pause: pause,
        isOn: isOn,
        updateSliderHeight: updateInnerWrapperHeight,
        refresh: initSliderTransform,
        destroy: destroy,
        rebuild: function() {
          return tns(extend(options, optionsElements));
        }
      };
    };
  
    return tns;
  })();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ0aW55LXNsaWRlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgdG5zID0gKGZ1bmN0aW9uICgpe1xyXG4gIC8vIE9iamVjdC5rZXlzXHJcbiAgICBpZiAoIU9iamVjdC5rZXlzKSB7XHJcbiAgICAgIE9iamVjdC5rZXlzID0gZnVuY3Rpb24ob2JqZWN0KSB7XHJcbiAgICAgICAgdmFyIGtleXMgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBuYW1lIGluIG9iamVjdCkge1xyXG4gICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIG5hbWUpKSB7XHJcbiAgICAgICAgICAgIGtleXMucHVzaChuYW1lKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGtleXM7XHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgXHJcbiAgLy8gQ2hpbGROb2RlLnJlbW92ZVxyXG4gICAgaWYoIShcInJlbW92ZVwiIGluIEVsZW1lbnQucHJvdG90eXBlKSl7XHJcbiAgICAgIEVsZW1lbnQucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgaWYodGhpcy5wYXJlbnROb2RlKSB7XHJcbiAgICAgICAgICB0aGlzLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIFxyXG4gICAgdmFyIHdpbiA9IHdpbmRvdztcclxuICBcclxuICAgIHZhciByYWYgPSB3aW4ucmVxdWVzdEFuaW1hdGlvbkZyYW1lXHJcbiAgICAgIHx8IHdpbi53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcclxuICAgICAgfHwgd2luLm1velJlcXVlc3RBbmltYXRpb25GcmFtZVxyXG4gICAgICB8fCB3aW4ubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcclxuICAgICAgfHwgZnVuY3Rpb24oY2IpIHsgcmV0dXJuIHNldFRpbWVvdXQoY2IsIDE2KTsgfTtcclxuICBcclxuICAgIHZhciB3aW4kMSA9IHdpbmRvdztcclxuICBcclxuICAgIHZhciBjYWYgPSB3aW4kMS5jYW5jZWxBbmltYXRpb25GcmFtZVxyXG4gICAgICB8fCB3aW4kMS5tb3pDYW5jZWxBbmltYXRpb25GcmFtZVxyXG4gICAgICB8fCBmdW5jdGlvbihpZCl7IGNsZWFyVGltZW91dChpZCk7IH07XHJcbiAgXHJcbiAgICBmdW5jdGlvbiBleHRlbmQoKSB7XHJcbiAgICAgIHZhciBvYmosIG5hbWUsIGNvcHksXHJcbiAgICAgICAgdGFyZ2V0ID0gYXJndW1lbnRzWzBdIHx8IHt9LFxyXG4gICAgICAgIGkgPSAxLFxyXG4gICAgICAgIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XHJcbiAgXHJcbiAgICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAoKG9iaiA9IGFyZ3VtZW50c1tpXSkgIT09IG51bGwpIHtcclxuICAgICAgICAgIGZvciAobmFtZSBpbiBvYmopIHtcclxuICAgICAgICAgICAgY29weSA9IG9ialtuYW1lXTtcclxuICBcclxuICAgICAgICAgICAgaWYgKHRhcmdldCA9PT0gY29weSkge1xyXG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGNvcHkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgIHRhcmdldFtuYW1lXSA9IGNvcHk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRhcmdldDtcclxuICAgIH1cclxuICBcclxuICAgIGZ1bmN0aW9uIGNoZWNrU3RvcmFnZVZhbHVlICh2YWx1ZSkge1xyXG4gICAgICByZXR1cm4gWyd0cnVlJywgJ2ZhbHNlJ10uaW5kZXhPZih2YWx1ZSkgPj0gMCA/IEpTT04ucGFyc2UodmFsdWUpIDogdmFsdWU7XHJcbiAgICB9XHJcbiAgXHJcbiAgICBmdW5jdGlvbiBzZXRMb2NhbFN0b3JhZ2Uoc3RvcmFnZSwga2V5LCB2YWx1ZSwgYWNjZXNzKSB7XHJcbiAgICAgIGlmIChhY2Nlc3MpIHtcclxuICAgICAgICB0cnkgeyBzdG9yYWdlLnNldEl0ZW0oa2V5LCB2YWx1ZSk7IH0gY2F0Y2ggKGUpIHt9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG4gIFxyXG4gICAgZnVuY3Rpb24gZ2V0U2xpZGVJZCgpIHtcclxuICAgICAgdmFyIGlkID0gd2luZG93LnRuc0lkO1xyXG4gICAgICB3aW5kb3cudG5zSWQgPSAhaWQgPyAxIDogaWQgKyAxO1xyXG4gIFxyXG4gICAgICByZXR1cm4gJ3RucycgKyB3aW5kb3cudG5zSWQ7XHJcbiAgICB9XHJcbiAgXHJcbiAgICBmdW5jdGlvbiBnZXRCb2R5ICgpIHtcclxuICAgICAgdmFyIGRvYyA9IGRvY3VtZW50LFxyXG4gICAgICAgIGJvZHkgPSBkb2MuYm9keTtcclxuICBcclxuICAgICAgaWYgKCFib2R5KSB7XHJcbiAgICAgICAgYm9keSA9IGRvYy5jcmVhdGVFbGVtZW50KCdib2R5Jyk7XHJcbiAgICAgICAgYm9keS5mYWtlID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICByZXR1cm4gYm9keTtcclxuICAgIH1cclxuICBcclxuICAgIHZhciBkb2NFbGVtZW50ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xyXG4gIFxyXG4gICAgZnVuY3Rpb24gc2V0RmFrZUJvZHkgKGJvZHkpIHtcclxuICAgICAgdmFyIGRvY092ZXJmbG93ID0gJyc7XHJcbiAgICAgIGlmIChib2R5LmZha2UpIHtcclxuICAgICAgICBkb2NPdmVyZmxvdyA9IGRvY0VsZW1lbnQuc3R5bGUub3ZlcmZsb3c7XHJcbiAgICAgICAgLy9hdm9pZCBjcmFzaGluZyBJRTgsIGlmIGJhY2tncm91bmQgaW1hZ2UgaXMgdXNlZFxyXG4gICAgICAgIGJvZHkuc3R5bGUuYmFja2dyb3VuZCA9ICcnO1xyXG4gICAgICAgIC8vU2FmYXJpIDUuMTMvNS4xLjQgT1NYIHN0b3BzIGxvYWRpbmcgaWYgOjotd2Via2l0LXNjcm9sbGJhciBpcyB1c2VkIGFuZCBzY3JvbGxiYXJzIGFyZSB2aXNpYmxlXHJcbiAgICAgICAgYm9keS5zdHlsZS5vdmVyZmxvdyA9IGRvY0VsZW1lbnQuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcclxuICAgICAgICBkb2NFbGVtZW50LmFwcGVuZENoaWxkKGJvZHkpO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIHJldHVybiBkb2NPdmVyZmxvdztcclxuICAgIH1cclxuICBcclxuICAgIGZ1bmN0aW9uIHJlc2V0RmFrZUJvZHkgKGJvZHksIGRvY092ZXJmbG93KSB7XHJcbiAgICAgIGlmIChib2R5LmZha2UpIHtcclxuICAgICAgICBib2R5LnJlbW92ZSgpO1xyXG4gICAgICAgIGRvY0VsZW1lbnQuc3R5bGUub3ZlcmZsb3cgPSBkb2NPdmVyZmxvdztcclxuICAgICAgICAvLyBUcmlnZ2VyIGxheW91dCBzbyBraW5ldGljIHNjcm9sbGluZyBpc24ndCBkaXNhYmxlZCBpbiBpT1M2K1xyXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxyXG4gICAgICAgIGRvY0VsZW1lbnQub2Zmc2V0SGVpZ2h0O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgXHJcbiAgLy8gZ2V0IGNzcy1jYWxjXHJcbiAgXHJcbiAgICBmdW5jdGlvbiBjYWxjKCkge1xyXG4gICAgICB2YXIgZG9jID0gZG9jdW1lbnQsXHJcbiAgICAgICAgYm9keSA9IGdldEJvZHkoKSxcclxuICAgICAgICBkb2NPdmVyZmxvdyA9IHNldEZha2VCb2R5KGJvZHkpLFxyXG4gICAgICAgIGRpdiA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKSxcclxuICAgICAgICByZXN1bHQgPSBmYWxzZTtcclxuICBcclxuICAgICAgYm9keS5hcHBlbmRDaGlsZChkaXYpO1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHZhciBzdHIgPSAnKDEwcHggKiAxMCknLFxyXG4gICAgICAgICAgdmFscyA9IFsnY2FsYycgKyBzdHIsICctbW96LWNhbGMnICsgc3RyLCAnLXdlYmtpdC1jYWxjJyArIHN0cl0sXHJcbiAgICAgICAgICB2YWw7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcclxuICAgICAgICAgIHZhbCA9IHZhbHNbaV07XHJcbiAgICAgICAgICBkaXYuc3R5bGUud2lkdGggPSB2YWw7XHJcbiAgICAgICAgICBpZiAoZGl2Lm9mZnNldFdpZHRoID09PSAxMDApIHtcclxuICAgICAgICAgICAgcmVzdWx0ID0gdmFsLnJlcGxhY2Uoc3RyLCAnJyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSBjYXRjaCAoZSkge31cclxuICBcclxuICAgICAgYm9keS5mYWtlID8gcmVzZXRGYWtlQm9keShib2R5LCBkb2NPdmVyZmxvdykgOiBkaXYucmVtb3ZlKCk7XHJcbiAgXHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgXHJcbiAgLy8gZ2V0IHN1YnBpeGVsIHN1cHBvcnQgdmFsdWVcclxuICBcclxuICAgIGZ1bmN0aW9uIHBlcmNlbnRhZ2VMYXlvdXQoKSB7XHJcbiAgICAgIC8vIGNoZWNrIHN1YnBpeGVsIGxheW91dCBzdXBwb3J0aW5nXHJcbiAgICAgIHZhciBkb2MgPSBkb2N1bWVudCxcclxuICAgICAgICBib2R5ID0gZ2V0Qm9keSgpLFxyXG4gICAgICAgIGRvY092ZXJmbG93ID0gc2V0RmFrZUJvZHkoYm9keSksXHJcbiAgICAgICAgd3JhcHBlciA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKSxcclxuICAgICAgICBvdXRlciA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKSxcclxuICAgICAgICBzdHIgPSAnJyxcclxuICAgICAgICBjb3VudCA9IDcwLFxyXG4gICAgICAgIHBlclBhZ2UgPSAzLFxyXG4gICAgICAgIHN1cHBvcnRlZCA9IGZhbHNlO1xyXG4gIFxyXG4gICAgICB3cmFwcGVyLmNsYXNzTmFtZSA9IFwidG5zLXQtc3VicDJcIjtcclxuICAgICAgb3V0ZXIuY2xhc3NOYW1lID0gXCJ0bnMtdC1jdFwiO1xyXG4gIFxyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcclxuICAgICAgICBzdHIgKz0gJzxkaXY+PC9kaXY+JztcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBvdXRlci5pbm5lckhUTUwgPSBzdHI7XHJcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQob3V0ZXIpO1xyXG4gICAgICBib2R5LmFwcGVuZENoaWxkKHdyYXBwZXIpO1xyXG4gIFxyXG4gICAgICBzdXBwb3J0ZWQgPSBNYXRoLmFicyh3cmFwcGVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgLSBvdXRlci5jaGlsZHJlbltjb3VudCAtIHBlclBhZ2VdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQpIDwgMjtcclxuICBcclxuICAgICAgYm9keS5mYWtlID8gcmVzZXRGYWtlQm9keShib2R5LCBkb2NPdmVyZmxvdykgOiB3cmFwcGVyLnJlbW92ZSgpO1xyXG4gIFxyXG4gICAgICByZXR1cm4gc3VwcG9ydGVkO1xyXG4gICAgfVxyXG4gIFxyXG4gICAgZnVuY3Rpb24gbWVkaWFxdWVyeVN1cHBvcnQgKCkge1xyXG4gICAgICB2YXIgZG9jID0gZG9jdW1lbnQsXHJcbiAgICAgICAgYm9keSA9IGdldEJvZHkoKSxcclxuICAgICAgICBkb2NPdmVyZmxvdyA9IHNldEZha2VCb2R5KGJvZHkpLFxyXG4gICAgICAgIGRpdiA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKSxcclxuICAgICAgICBzdHlsZSA9IGRvYy5jcmVhdGVFbGVtZW50KCdzdHlsZScpLFxyXG4gICAgICAgIHJ1bGUgPSAnQG1lZGlhIGFsbCBhbmQgKG1pbi13aWR0aDoxcHgpey50bnMtbXEtdGVzdHtwb3NpdGlvbjphYnNvbHV0ZX19JyxcclxuICAgICAgICBwb3NpdGlvbjtcclxuICBcclxuICAgICAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XHJcbiAgICAgIGRpdi5jbGFzc05hbWUgPSAndG5zLW1xLXRlc3QnO1xyXG4gIFxyXG4gICAgICBib2R5LmFwcGVuZENoaWxkKHN0eWxlKTtcclxuICAgICAgYm9keS5hcHBlbmRDaGlsZChkaXYpO1xyXG4gIFxyXG4gICAgICBpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xyXG4gICAgICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IHJ1bGU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc3R5bGUuYXBwZW5kQ2hpbGQoZG9jLmNyZWF0ZVRleHROb2RlKHJ1bGUpKTtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBwb3NpdGlvbiA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlID8gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZGl2KS5wb3NpdGlvbiA6IGRpdi5jdXJyZW50U3R5bGVbJ3Bvc2l0aW9uJ107XHJcbiAgXHJcbiAgICAgIGJvZHkuZmFrZSA/IHJlc2V0RmFrZUJvZHkoYm9keSwgZG9jT3ZlcmZsb3cpIDogZGl2LnJlbW92ZSgpO1xyXG4gIFxyXG4gICAgICByZXR1cm4gcG9zaXRpb24gPT09IFwiYWJzb2x1dGVcIjtcclxuICAgIH1cclxuICBcclxuICAvLyBjcmVhdGUgYW5kIGFwcGVuZCBzdHlsZSBzaGVldFxyXG4gICAgZnVuY3Rpb24gY3JlYXRlU3R5bGVTaGVldCAobWVkaWEpIHtcclxuICAgICAgLy8gQ3JlYXRlIHRoZSA8c3R5bGU+IHRhZ1xyXG4gICAgICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XHJcbiAgICAgIC8vIHN0eWxlLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJ0ZXh0L2Nzc1wiKTtcclxuICBcclxuICAgICAgLy8gQWRkIGEgbWVkaWEgKGFuZC9vciBtZWRpYSBxdWVyeSkgaGVyZSBpZiB5b3UnZCBsaWtlIVxyXG4gICAgICAvLyBzdHlsZS5zZXRBdHRyaWJ1dGUoXCJtZWRpYVwiLCBcInNjcmVlblwiKVxyXG4gICAgICAvLyBzdHlsZS5zZXRBdHRyaWJ1dGUoXCJtZWRpYVwiLCBcIm9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoIDogMTAyNHB4KVwiKVxyXG4gICAgICBpZiAobWVkaWEpIHsgc3R5bGUuc2V0QXR0cmlidXRlKFwibWVkaWFcIiwgbWVkaWEpOyB9XHJcbiAgXHJcbiAgICAgIC8vIFdlYktpdCBoYWNrIDooXHJcbiAgICAgIC8vIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiXCIpKTtcclxuICBcclxuICAgICAgLy8gQWRkIHRoZSA8c3R5bGU+IGVsZW1lbnQgdG8gdGhlIHBhZ2VcclxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaGVhZCcpLmFwcGVuZENoaWxkKHN0eWxlKTtcclxuICBcclxuICAgICAgcmV0dXJuIHN0eWxlLnNoZWV0ID8gc3R5bGUuc2hlZXQgOiBzdHlsZS5zdHlsZVNoZWV0O1xyXG4gICAgfVxyXG4gIFxyXG4gIC8vIGNyb3NzIGJyb3dzZXJzIGFkZFJ1bGUgbWV0aG9kXHJcbiAgICBmdW5jdGlvbiBhZGRDU1NSdWxlKHNoZWV0LCBzZWxlY3RvciwgcnVsZXMsIGluZGV4KSB7XHJcbiAgICAgIC8vIHJldHVybiByYWYoZnVuY3Rpb24oKSB7XHJcbiAgICAgICdpbnNlcnRSdWxlJyBpbiBzaGVldCA/XHJcbiAgICAgICAgc2hlZXQuaW5zZXJ0UnVsZShzZWxlY3RvciArICd7JyArIHJ1bGVzICsgJ30nLCBpbmRleCkgOlxyXG4gICAgICAgIHNoZWV0LmFkZFJ1bGUoc2VsZWN0b3IsIHJ1bGVzLCBpbmRleCk7XHJcbiAgICAgIC8vIH0pO1xyXG4gICAgfVxyXG4gIFxyXG4gIC8vIGNyb3NzIGJyb3dzZXJzIGFkZFJ1bGUgbWV0aG9kXHJcbiAgICBmdW5jdGlvbiByZW1vdmVDU1NSdWxlKHNoZWV0LCBpbmRleCkge1xyXG4gICAgICAvLyByZXR1cm4gcmFmKGZ1bmN0aW9uKCkge1xyXG4gICAgICAnZGVsZXRlUnVsZScgaW4gc2hlZXQgP1xyXG4gICAgICAgIHNoZWV0LmRlbGV0ZVJ1bGUoaW5kZXgpIDpcclxuICAgICAgICBzaGVldC5yZW1vdmVSdWxlKGluZGV4KTtcclxuICAgICAgLy8gfSk7XHJcbiAgICB9XHJcbiAgXHJcbiAgICBmdW5jdGlvbiBnZXRDc3NSdWxlc0xlbmd0aChzaGVldCkge1xyXG4gICAgICB2YXIgcnVsZSA9ICgnaW5zZXJ0UnVsZScgaW4gc2hlZXQpID8gc2hlZXQuY3NzUnVsZXMgOiBzaGVldC5ydWxlcztcclxuICAgICAgcmV0dXJuIHJ1bGUubGVuZ3RoO1xyXG4gICAgfVxyXG4gIFxyXG4gICAgZnVuY3Rpb24gdG9EZWdyZWUgKHksIHgpIHtcclxuICAgICAgcmV0dXJuIE1hdGguYXRhbjIoeSwgeCkgKiAoMTgwIC8gTWF0aC5QSSk7XHJcbiAgICB9XHJcbiAgXHJcbiAgICBmdW5jdGlvbiBnZXRUb3VjaERpcmVjdGlvbihhbmdsZSwgcmFuZ2UpIHtcclxuICAgICAgdmFyIGRpcmVjdGlvbiA9IGZhbHNlLFxyXG4gICAgICAgIGdhcCA9IE1hdGguYWJzKDkwIC0gTWF0aC5hYnMoYW5nbGUpKTtcclxuICBcclxuICAgICAgaWYgKGdhcCA+PSA5MCAtIHJhbmdlKSB7XHJcbiAgICAgICAgZGlyZWN0aW9uID0gJ2hvcml6b250YWwnO1xyXG4gICAgICB9IGVsc2UgaWYgKGdhcCA8PSByYW5nZSkge1xyXG4gICAgICAgIGRpcmVjdGlvbiA9ICd2ZXJ0aWNhbCc7XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgcmV0dXJuIGRpcmVjdGlvbjtcclxuICAgIH1cclxuICBcclxuICAvLyBodHRwczovL3RvZGRtb3R0by5jb20vZGl0Y2gtdGhlLWFycmF5LWZvcmVhY2gtY2FsbC1ub2RlbGlzdC1oYWNrL1xyXG4gICAgZnVuY3Rpb24gZm9yRWFjaCAoYXJyLCBjYWxsYmFjaywgc2NvcGUpIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBhcnIubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgY2FsbGJhY2suY2FsbChzY29wZSwgYXJyW2ldLCBpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIFxyXG4gICAgdmFyIGNsYXNzTGlzdFN1cHBvcnQgPSAnY2xhc3NMaXN0JyBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdfJyk7XHJcbiAgXHJcbiAgICB2YXIgaGFzQ2xhc3MgPSBjbGFzc0xpc3RTdXBwb3J0ID9cclxuICAgICAgZnVuY3Rpb24gKGVsLCBzdHIpIHsgcmV0dXJuIGVsLmNsYXNzTGlzdC5jb250YWlucyhzdHIpOyB9IDpcclxuICAgICAgZnVuY3Rpb24gKGVsLCBzdHIpIHsgcmV0dXJuIGVsLmNsYXNzTmFtZS5pbmRleE9mKHN0cikgPj0gMDsgfTtcclxuICBcclxuICAgIHZhciBhZGRDbGFzcyA9IGNsYXNzTGlzdFN1cHBvcnQgP1xyXG4gICAgICBmdW5jdGlvbiAoZWwsIHN0cikge1xyXG4gICAgICAgIGlmICghaGFzQ2xhc3MoZWwsICBzdHIpKSB7IGVsLmNsYXNzTGlzdC5hZGQoc3RyKTsgfVxyXG4gICAgICB9IDpcclxuICAgICAgZnVuY3Rpb24gKGVsLCBzdHIpIHtcclxuICAgICAgICBpZiAoIWhhc0NsYXNzKGVsLCAgc3RyKSkgeyBlbC5jbGFzc05hbWUgKz0gJyAnICsgc3RyOyB9XHJcbiAgICAgIH07XHJcbiAgXHJcbiAgICB2YXIgcmVtb3ZlQ2xhc3MgPSBjbGFzc0xpc3RTdXBwb3J0ID9cclxuICAgICAgZnVuY3Rpb24gKGVsLCBzdHIpIHtcclxuICAgICAgICBpZiAoaGFzQ2xhc3MoZWwsICBzdHIpKSB7IGVsLmNsYXNzTGlzdC5yZW1vdmUoc3RyKTsgfVxyXG4gICAgICB9IDpcclxuICAgICAgZnVuY3Rpb24gKGVsLCBzdHIpIHtcclxuICAgICAgICBpZiAoaGFzQ2xhc3MoZWwsIHN0cikpIHsgZWwuY2xhc3NOYW1lID0gZWwuY2xhc3NOYW1lLnJlcGxhY2Uoc3RyLCAnJyk7IH1cclxuICAgICAgfTtcclxuICBcclxuICAgIGZ1bmN0aW9uIGhhc0F0dHIoZWwsIGF0dHIpIHtcclxuICAgICAgcmV0dXJuIGVsLmhhc0F0dHJpYnV0ZShhdHRyKTtcclxuICAgIH1cclxuICBcclxuICAgIGZ1bmN0aW9uIGdldEF0dHIoZWwsIGF0dHIpIHtcclxuICAgICAgcmV0dXJuIGVsLmdldEF0dHJpYnV0ZShhdHRyKTtcclxuICAgIH1cclxuICBcclxuICAgIGZ1bmN0aW9uIGlzTm9kZUxpc3QoZWwpIHtcclxuICAgICAgLy8gT25seSBOb2RlTGlzdCBoYXMgdGhlIFwiaXRlbSgpXCIgZnVuY3Rpb25cclxuICAgICAgcmV0dXJuIHR5cGVvZiBlbC5pdGVtICE9PSBcInVuZGVmaW5lZFwiO1xyXG4gICAgfVxyXG4gIFxyXG4gICAgZnVuY3Rpb24gc2V0QXR0cnMoZWxzLCBhdHRycykge1xyXG4gICAgICBlbHMgPSAoaXNOb2RlTGlzdChlbHMpIHx8IGVscyBpbnN0YW5jZW9mIEFycmF5KSA/IGVscyA6IFtlbHNdO1xyXG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGF0dHJzKSAhPT0gJ1tvYmplY3QgT2JqZWN0XScpIHsgcmV0dXJuOyB9XHJcbiAgXHJcbiAgICAgIGZvciAodmFyIGkgPSBlbHMubGVuZ3RoOyBpLS07KSB7XHJcbiAgICAgICAgZm9yKHZhciBrZXkgaW4gYXR0cnMpIHtcclxuICAgICAgICAgIGVsc1tpXS5zZXRBdHRyaWJ1dGUoa2V5LCBhdHRyc1trZXldKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICBcclxuICAgIGZ1bmN0aW9uIHJlbW92ZUF0dHJzKGVscywgYXR0cnMpIHtcclxuICAgICAgZWxzID0gKGlzTm9kZUxpc3QoZWxzKSB8fCBlbHMgaW5zdGFuY2VvZiBBcnJheSkgPyBlbHMgOiBbZWxzXTtcclxuICAgICAgYXR0cnMgPSAoYXR0cnMgaW5zdGFuY2VvZiBBcnJheSkgPyBhdHRycyA6IFthdHRyc107XHJcbiAgXHJcbiAgICAgIHZhciBhdHRyTGVuZ3RoID0gYXR0cnMubGVuZ3RoO1xyXG4gICAgICBmb3IgKHZhciBpID0gZWxzLmxlbmd0aDsgaS0tOykge1xyXG4gICAgICAgIGZvciAodmFyIGogPSBhdHRyTGVuZ3RoOyBqLS07KSB7XHJcbiAgICAgICAgICBlbHNbaV0ucmVtb3ZlQXR0cmlidXRlKGF0dHJzW2pdKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICBcclxuICAgIGZ1bmN0aW9uIGFycmF5RnJvbU5vZGVMaXN0IChubCkge1xyXG4gICAgICB2YXIgYXJyID0gW107XHJcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gbmwubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgYXJyLnB1c2gobmxbaV0pO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBhcnI7XHJcbiAgICB9XHJcbiAgXHJcbiAgICBmdW5jdGlvbiBoaWRlRWxlbWVudChlbCwgZm9yY2VIaWRlKSB7XHJcbiAgICAgIGlmIChlbC5zdHlsZS5kaXNwbGF5ICE9PSAnbm9uZScpIHsgZWwuc3R5bGUuZGlzcGxheSA9ICdub25lJzsgfVxyXG4gICAgfVxyXG4gIFxyXG4gICAgZnVuY3Rpb24gc2hvd0VsZW1lbnQoZWwsIGZvcmNlSGlkZSkge1xyXG4gICAgICBpZiAoZWwuc3R5bGUuZGlzcGxheSA9PT0gJ25vbmUnKSB7IGVsLnN0eWxlLmRpc3BsYXkgPSAnJzsgfVxyXG4gICAgfVxyXG4gIFxyXG4gICAgZnVuY3Rpb24gaXNWaXNpYmxlKGVsKSB7XHJcbiAgICAgIHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCkuZGlzcGxheSAhPT0gJ25vbmUnO1xyXG4gICAgfVxyXG4gIFxyXG4gICAgZnVuY3Rpb24gd2hpY2hQcm9wZXJ0eShwcm9wcyl7XHJcbiAgICAgIGlmICh0eXBlb2YgcHJvcHMgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgdmFyIGFyciA9IFtwcm9wc10sXHJcbiAgICAgICAgICBQcm9wcyA9IHByb3BzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcHJvcHMuc3Vic3RyKDEpLFxyXG4gICAgICAgICAgcHJlZml4ZXMgPSBbJ1dlYmtpdCcsICdNb3onLCAnbXMnLCAnTyddO1xyXG4gIFxyXG4gICAgICAgIHByZWZpeGVzLmZvckVhY2goZnVuY3Rpb24ocHJlZml4KSB7XHJcbiAgICAgICAgICBpZiAocHJlZml4ICE9PSAnbXMnIHx8IHByb3BzID09PSAndHJhbnNmb3JtJykge1xyXG4gICAgICAgICAgICBhcnIucHVzaChwcmVmaXggKyBQcm9wcyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgXHJcbiAgICAgICAgcHJvcHMgPSBhcnI7XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZmFrZWVsZW1lbnQnKSxcclxuICAgICAgICBsZW4gPSBwcm9wcy5sZW5ndGg7XHJcbiAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgdmFyIHByb3AgPSBwcm9wc1tpXTtcclxuICAgICAgICBpZiggZWwuc3R5bGVbcHJvcF0gIT09IHVuZGVmaW5lZCApeyByZXR1cm4gcHJvcDsgfVxyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIHJldHVybiBmYWxzZTsgLy8gZXhwbGljaXQgZm9yIGllOS1cclxuICAgIH1cclxuICBcclxuICAgIGZ1bmN0aW9uIGhhczNEVHJhbnNmb3Jtcyh0Zil7XHJcbiAgICAgIGlmICghdGYpIHsgcmV0dXJuIGZhbHNlOyB9XHJcbiAgICAgIGlmICghd2luZG93LmdldENvbXB1dGVkU3R5bGUpIHsgcmV0dXJuIGZhbHNlOyB9XHJcbiAgXHJcbiAgICAgIHZhciBkb2MgPSBkb2N1bWVudCxcclxuICAgICAgICBib2R5ID0gZ2V0Qm9keSgpLFxyXG4gICAgICAgIGRvY092ZXJmbG93ID0gc2V0RmFrZUJvZHkoYm9keSksXHJcbiAgICAgICAgZWwgPSBkb2MuY3JlYXRlRWxlbWVudCgncCcpLFxyXG4gICAgICAgIGhhczNkLFxyXG4gICAgICAgIGNzc1RGID0gdGYubGVuZ3RoID4gOSA/ICctJyArIHRmLnNsaWNlKDAsIC05KS50b0xvd2VyQ2FzZSgpICsgJy0nIDogJyc7XHJcbiAgXHJcbiAgICAgIGNzc1RGICs9ICd0cmFuc2Zvcm0nO1xyXG4gIFxyXG4gICAgICAvLyBBZGQgaXQgdG8gdGhlIGJvZHkgdG8gZ2V0IHRoZSBjb21wdXRlZCBzdHlsZVxyXG4gICAgICBib2R5Lmluc2VydEJlZm9yZShlbCwgbnVsbCk7XHJcbiAgXHJcbiAgICAgIGVsLnN0eWxlW3RmXSA9ICd0cmFuc2xhdGUzZCgxcHgsMXB4LDFweCknO1xyXG4gICAgICBoYXMzZCA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKS5nZXRQcm9wZXJ0eVZhbHVlKGNzc1RGKTtcclxuICBcclxuICAgICAgYm9keS5mYWtlID8gcmVzZXRGYWtlQm9keShib2R5LCBkb2NPdmVyZmxvdykgOiBlbC5yZW1vdmUoKTtcclxuICBcclxuICAgICAgcmV0dXJuIChoYXMzZCAhPT0gdW5kZWZpbmVkICYmIGhhczNkLmxlbmd0aCA+IDAgJiYgaGFzM2QgIT09IFwibm9uZVwiKTtcclxuICAgIH1cclxuICBcclxuICAvLyBnZXQgdHJhbnNpdGlvbmVuZCwgYW5pbWF0aW9uZW5kIGJhc2VkIG9uIHRyYW5zaXRpb25EdXJhdGlvblxyXG4gIC8vIEBwcm9waW46IHN0cmluZ1xyXG4gIC8vIEBwcm9wT3V0OiBzdHJpbmcsIGZpcnN0LWxldHRlciB1cHBlcmNhc2VcclxuICAvLyBVc2FnZTogZ2V0RW5kUHJvcGVydHkoJ1dlYmtpdFRyYW5zaXRpb25EdXJhdGlvbicsICdUcmFuc2l0aW9uJykgPT4gd2Via2l0VHJhbnNpdGlvbkVuZFxyXG4gICAgZnVuY3Rpb24gZ2V0RW5kUHJvcGVydHkocHJvcEluLCBwcm9wT3V0KSB7XHJcbiAgICAgIHZhciBlbmRQcm9wID0gZmFsc2U7XHJcbiAgICAgIGlmICgvXldlYmtpdC8udGVzdChwcm9wSW4pKSB7XHJcbiAgICAgICAgZW5kUHJvcCA9ICd3ZWJraXQnICsgcHJvcE91dCArICdFbmQnO1xyXG4gICAgICB9IGVsc2UgaWYgKC9eTy8udGVzdChwcm9wSW4pKSB7XHJcbiAgICAgICAgZW5kUHJvcCA9ICdvJyArIHByb3BPdXQgKyAnRW5kJztcclxuICAgICAgfSBlbHNlIGlmIChwcm9wSW4pIHtcclxuICAgICAgICBlbmRQcm9wID0gcHJvcE91dC50b0xvd2VyQ2FzZSgpICsgJ2VuZCc7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGVuZFByb3A7XHJcbiAgICB9XHJcbiAgXHJcbiAgLy8gVGVzdCB2aWEgYSBnZXR0ZXIgaW4gdGhlIG9wdGlvbnMgb2JqZWN0IHRvIHNlZSBpZiB0aGUgcGFzc2l2ZSBwcm9wZXJ0eSBpcyBhY2Nlc3NlZFxyXG4gICAgdmFyIHN1cHBvcnRzUGFzc2l2ZSA9IGZhbHNlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgdmFyIG9wdHMgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdwYXNzaXZlJywge1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBzdXBwb3J0c1Bhc3NpdmUgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidGVzdFwiLCBudWxsLCBvcHRzKTtcclxuICAgIH0gY2F0Y2ggKGUpIHt9XHJcbiAgICB2YXIgcGFzc2l2ZU9wdGlvbiA9IHN1cHBvcnRzUGFzc2l2ZSA/IHsgcGFzc2l2ZTogdHJ1ZSB9IDogZmFsc2U7XHJcbiAgXHJcbiAgICBmdW5jdGlvbiBhZGRFdmVudHMoZWwsIG9iaiwgcHJldmVudFNjcm9sbGluZykge1xyXG4gICAgICBmb3IgKHZhciBwcm9wIGluIG9iaikge1xyXG4gICAgICAgIHZhciBvcHRpb24gPSBbJ3RvdWNoc3RhcnQnLCAndG91Y2htb3ZlJ10uaW5kZXhPZihwcm9wKSA+PSAwICYmICFwcmV2ZW50U2Nyb2xsaW5nID8gcGFzc2l2ZU9wdGlvbiA6IGZhbHNlO1xyXG4gICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIocHJvcCwgb2JqW3Byb3BdLCBvcHRpb24pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgXHJcbiAgICBmdW5jdGlvbiByZW1vdmVFdmVudHMoZWwsIG9iaikge1xyXG4gICAgICBmb3IgKHZhciBwcm9wIGluIG9iaikge1xyXG4gICAgICAgIHZhciBvcHRpb24gPSBbJ3RvdWNoc3RhcnQnLCAndG91Y2htb3ZlJ10uaW5kZXhPZihwcm9wKSA+PSAwID8gcGFzc2l2ZU9wdGlvbiA6IGZhbHNlO1xyXG4gICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIocHJvcCwgb2JqW3Byb3BdLCBvcHRpb24pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgXHJcbiAgICBmdW5jdGlvbiBFdmVudHMoKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdG9waWNzOiB7fSxcclxuICAgICAgICBvbjogZnVuY3Rpb24gKGV2ZW50TmFtZSwgZm4pIHtcclxuICAgICAgICAgIHRoaXMudG9waWNzW2V2ZW50TmFtZV0gPSB0aGlzLnRvcGljc1tldmVudE5hbWVdIHx8IFtdO1xyXG4gICAgICAgICAgdGhpcy50b3BpY3NbZXZlbnROYW1lXS5wdXNoKGZuKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG9mZjogZnVuY3Rpb24oZXZlbnROYW1lLCBmbikge1xyXG4gICAgICAgICAgaWYgKHRoaXMudG9waWNzW2V2ZW50TmFtZV0pIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnRvcGljc1tldmVudE5hbWVdLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgaWYgKHRoaXMudG9waWNzW2V2ZW50TmFtZV1baV0gPT09IGZuKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvcGljc1tldmVudE5hbWVdLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW1pdDogZnVuY3Rpb24gKGV2ZW50TmFtZSwgZGF0YSkge1xyXG4gICAgICAgICAgZGF0YS50eXBlID0gZXZlbnROYW1lO1xyXG4gICAgICAgICAgaWYgKHRoaXMudG9waWNzW2V2ZW50TmFtZV0pIHtcclxuICAgICAgICAgICAgdGhpcy50b3BpY3NbZXZlbnROYW1lXS5mb3JFYWNoKGZ1bmN0aW9uKGZuKSB7XHJcbiAgICAgICAgICAgICAgZm4oZGF0YSwgZXZlbnROYW1lKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIFxyXG4gICAgZnVuY3Rpb24ganNUcmFuc2Zvcm0oZWxlbWVudCwgYXR0ciwgcHJlZml4LCBwb3N0Zml4LCB0bywgZHVyYXRpb24sIGNhbGxiYWNrKSB7XHJcbiAgICAgIHZhciB0aWNrID0gTWF0aC5taW4oZHVyYXRpb24sIDEwKSxcclxuICAgICAgICB1bml0ID0gKHRvLmluZGV4T2YoJyUnKSA+PSAwKSA/ICclJyA6ICdweCcsXHJcbiAgICAgICAgdG8gPSB0by5yZXBsYWNlKHVuaXQsICcnKSxcclxuICAgICAgICBmcm9tID0gTnVtYmVyKGVsZW1lbnQuc3R5bGVbYXR0cl0ucmVwbGFjZShwcmVmaXgsICcnKS5yZXBsYWNlKHBvc3RmaXgsICcnKS5yZXBsYWNlKHVuaXQsICcnKSksXHJcbiAgICAgICAgcG9zaXRpb25UaWNrID0gKHRvIC0gZnJvbSkgLyBkdXJhdGlvbiAqIHRpY2ssXHJcbiAgICAgICAgcnVubmluZztcclxuICBcclxuICAgICAgc2V0VGltZW91dChtb3ZlRWxlbWVudCwgdGljayk7XHJcbiAgICAgIGZ1bmN0aW9uIG1vdmVFbGVtZW50KCkge1xyXG4gICAgICAgIGR1cmF0aW9uIC09IHRpY2s7XHJcbiAgICAgICAgZnJvbSArPSBwb3NpdGlvblRpY2s7XHJcbiAgICAgICAgZWxlbWVudC5zdHlsZVthdHRyXSA9IHByZWZpeCArIGZyb20gKyB1bml0ICsgcG9zdGZpeDtcclxuICAgICAgICBpZiAoZHVyYXRpb24gPiAwKSB7XHJcbiAgICAgICAgICBzZXRUaW1lb3V0KG1vdmVFbGVtZW50LCB0aWNrKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICBcclxuICAgIHZhciB0bnMgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcbiAgICAgIG9wdGlvbnMgPSBleHRlbmQoe1xyXG4gICAgICAgIGNvbnRhaW5lcjogJy5zbGlkZXInLFxyXG4gICAgICAgIG1vZGU6ICdjYXJvdXNlbCcsXHJcbiAgICAgICAgYXhpczogJ2hvcml6b250YWwnLFxyXG4gICAgICAgIGl0ZW1zOiAxLFxyXG4gICAgICAgIGd1dHRlcjogMCxcclxuICAgICAgICBlZGdlUGFkZGluZzogMCxcclxuICAgICAgICBmaXhlZFdpZHRoOiBmYWxzZSxcclxuICAgICAgICBhdXRvV2lkdGg6IGZhbHNlLFxyXG4gICAgICAgIHZpZXdwb3J0TWF4OiBmYWxzZSxcclxuICAgICAgICBzbGlkZUJ5OiAxLFxyXG4gICAgICAgIGNlbnRlcjogZmFsc2UsXHJcbiAgICAgICAgY29udHJvbHM6IHRydWUsXHJcbiAgICAgICAgY29udHJvbHNQb3NpdGlvbjogJ3RvcCcsXHJcbiAgICAgICAgY29udHJvbHNUZXh0OiBbJ3ByZXYnLCAnbmV4dCddLFxyXG4gICAgICAgIGNvbnRyb2xzQ29udGFpbmVyOiBmYWxzZSxcclxuICAgICAgICBwcmV2QnV0dG9uOiBmYWxzZSxcclxuICAgICAgICBuZXh0QnV0dG9uOiBmYWxzZSxcclxuICAgICAgICBuYXY6IHRydWUsXHJcbiAgICAgICAgbmF2UG9zaXRpb246ICd0b3AnLFxyXG4gICAgICAgIG5hdkNvbnRhaW5lcjogZmFsc2UsXHJcbiAgICAgICAgbmF2QXNUaHVtYm5haWxzOiBmYWxzZSxcclxuICAgICAgICBhcnJvd0tleXM6IGZhbHNlLFxyXG4gICAgICAgIHNwZWVkOiAzMDAsXHJcbiAgICAgICAgYXV0b3BsYXk6IGZhbHNlLFxyXG4gICAgICAgIGF1dG9wbGF5UG9zaXRpb246ICd0b3AnLFxyXG4gICAgICAgIGF1dG9wbGF5VGltZW91dDogNTAwMCxcclxuICAgICAgICBhdXRvcGxheURpcmVjdGlvbjogJ2ZvcndhcmQnLFxyXG4gICAgICAgIGF1dG9wbGF5VGV4dDogWydzdGFydCcsICdzdG9wJ10sXHJcbiAgICAgICAgYXV0b3BsYXlIb3ZlclBhdXNlOiBmYWxzZSxcclxuICAgICAgICBhdXRvcGxheUJ1dHRvbjogZmFsc2UsXHJcbiAgICAgICAgYXV0b3BsYXlCdXR0b25PdXRwdXQ6IHRydWUsXHJcbiAgICAgICAgYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eTogdHJ1ZSxcclxuICAgICAgICBhbmltYXRlSW46ICd0bnMtZmFkZUluJyxcclxuICAgICAgICBhbmltYXRlT3V0OiAndG5zLWZhZGVPdXQnLFxyXG4gICAgICAgIGFuaW1hdGVOb3JtYWw6ICd0bnMtbm9ybWFsJyxcclxuICAgICAgICBhbmltYXRlRGVsYXk6IGZhbHNlLFxyXG4gICAgICAgIGxvb3A6IHRydWUsXHJcbiAgICAgICAgcmV3aW5kOiBmYWxzZSxcclxuICAgICAgICBhdXRvSGVpZ2h0OiBmYWxzZSxcclxuICAgICAgICByZXNwb25zaXZlOiBmYWxzZSxcclxuICAgICAgICBsYXp5bG9hZDogZmFsc2UsXHJcbiAgICAgICAgbGF6eWxvYWRTZWxlY3RvcjogJy50bnMtbGF6eS1pbWcnLFxyXG4gICAgICAgIHRvdWNoOiB0cnVlLFxyXG4gICAgICAgIG1vdXNlRHJhZzogZmFsc2UsXHJcbiAgICAgICAgc3dpcGVBbmdsZTogMTUsXHJcbiAgICAgICAgbmVzdGVkOiBmYWxzZSxcclxuICAgICAgICBwcmV2ZW50QWN0aW9uV2hlblJ1bm5pbmc6IGZhbHNlLFxyXG4gICAgICAgIHByZXZlbnRTY3JvbGxPblRvdWNoOiBmYWxzZSxcclxuICAgICAgICBmcmVlemFibGU6IHRydWUsXHJcbiAgICAgICAgb25Jbml0OiBmYWxzZSxcclxuICAgICAgICB1c2VMb2NhbFN0b3JhZ2U6IHRydWVcclxuICAgICAgfSwgb3B0aW9ucyB8fCB7fSk7XHJcbiAgXHJcbiAgICAgIHZhciBkb2MgPSBkb2N1bWVudCxcclxuICAgICAgICB3aW4gPSB3aW5kb3csXHJcbiAgICAgICAgS0VZUyA9IHtcclxuICAgICAgICAgIEVOVEVSOiAxMyxcclxuICAgICAgICAgIFNQQUNFOiAzMixcclxuICAgICAgICAgIExFRlQ6IDM3LFxyXG4gICAgICAgICAgUklHSFQ6IDM5XHJcbiAgICAgICAgfSxcclxuICAgICAgICB0bnNTdG9yYWdlID0ge30sXHJcbiAgICAgICAgbG9jYWxTdG9yYWdlQWNjZXNzID0gb3B0aW9ucy51c2VMb2NhbFN0b3JhZ2U7XHJcbiAgXHJcbiAgICAgIGlmIChsb2NhbFN0b3JhZ2VBY2Nlc3MpIHtcclxuICAgICAgICAvLyBjaGVjayBicm93c2VyIHZlcnNpb24gYW5kIGxvY2FsIHN0b3JhZ2UgYWNjZXNzXHJcbiAgICAgICAgdmFyIGJyb3dzZXJJbmZvID0gbmF2aWdhdG9yLnVzZXJBZ2VudDtcclxuICAgICAgICB2YXIgdWlkID0gbmV3IERhdGU7XHJcbiAgXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIHRuc1N0b3JhZ2UgPSB3aW4ubG9jYWxTdG9yYWdlO1xyXG4gICAgICAgICAgaWYgKHRuc1N0b3JhZ2UpIHtcclxuICAgICAgICAgICAgdG5zU3RvcmFnZS5zZXRJdGVtKHVpZCwgdWlkKTtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlQWNjZXNzID0gdG5zU3RvcmFnZS5nZXRJdGVtKHVpZCkgPT0gdWlkO1xyXG4gICAgICAgICAgICB0bnNTdG9yYWdlLnJlbW92ZUl0ZW0odWlkKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZUFjY2VzcyA9IGZhbHNlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKCFsb2NhbFN0b3JhZ2VBY2Nlc3MpIHsgdG5zU3RvcmFnZSA9IHt9OyB9XHJcbiAgICAgICAgfSBjYXRjaChlKSB7XHJcbiAgICAgICAgICBsb2NhbFN0b3JhZ2VBY2Nlc3MgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgaWYgKGxvY2FsU3RvcmFnZUFjY2Vzcykge1xyXG4gICAgICAgICAgLy8gcmVtb3ZlIHN0b3JhZ2Ugd2hlbiBicm93c2VyIHZlcnNpb24gY2hhbmdlc1xyXG4gICAgICAgICAgaWYgKHRuc1N0b3JhZ2VbJ3Ruc0FwcCddICYmIHRuc1N0b3JhZ2VbJ3Ruc0FwcCddICE9PSBicm93c2VySW5mbykge1xyXG4gICAgICAgICAgICBbJ3RDJywgJ3RQTCcsICd0TVEnLCAndFRmJywgJ3QzRCcsICd0VER1JywgJ3RURGUnLCAndEFEdScsICd0QURlJywgJ3RURScsICd0QUUnXS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHsgdG5zU3RvcmFnZS5yZW1vdmVJdGVtKGl0ZW0pOyB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC8vIHVwZGF0ZSBicm93c2VySW5mb1xyXG4gICAgICAgICAgbG9jYWxTdG9yYWdlWyd0bnNBcHAnXSA9IGJyb3dzZXJJbmZvO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gIFxyXG4gICAgICB2YXIgQ0FMQyA9IHRuc1N0b3JhZ2VbJ3RDJ10gPyBjaGVja1N0b3JhZ2VWYWx1ZSh0bnNTdG9yYWdlWyd0QyddKSA6IHNldExvY2FsU3RvcmFnZSh0bnNTdG9yYWdlLCAndEMnLCBjYWxjKCksIGxvY2FsU3RvcmFnZUFjY2VzcyksXHJcbiAgICAgICAgUEVSQ0VOVEFHRUxBWU9VVCA9IHRuc1N0b3JhZ2VbJ3RQTCddID8gY2hlY2tTdG9yYWdlVmFsdWUodG5zU3RvcmFnZVsndFBMJ10pIDogc2V0TG9jYWxTdG9yYWdlKHRuc1N0b3JhZ2UsICd0UEwnLCBwZXJjZW50YWdlTGF5b3V0KCksIGxvY2FsU3RvcmFnZUFjY2VzcyksXHJcbiAgICAgICAgQ1NTTVEgPSB0bnNTdG9yYWdlWyd0TVEnXSA/IGNoZWNrU3RvcmFnZVZhbHVlKHRuc1N0b3JhZ2VbJ3RNUSddKSA6IHNldExvY2FsU3RvcmFnZSh0bnNTdG9yYWdlLCAndE1RJywgbWVkaWFxdWVyeVN1cHBvcnQoKSwgbG9jYWxTdG9yYWdlQWNjZXNzKSxcclxuICAgICAgICBUUkFOU0ZPUk0gPSB0bnNTdG9yYWdlWyd0VGYnXSA/IGNoZWNrU3RvcmFnZVZhbHVlKHRuc1N0b3JhZ2VbJ3RUZiddKSA6IHNldExvY2FsU3RvcmFnZSh0bnNTdG9yYWdlLCAndFRmJywgd2hpY2hQcm9wZXJ0eSgndHJhbnNmb3JtJyksIGxvY2FsU3RvcmFnZUFjY2VzcyksXHJcbiAgICAgICAgSEFTM0RUUkFOU0ZPUk1TID0gdG5zU3RvcmFnZVsndDNEJ10gPyBjaGVja1N0b3JhZ2VWYWx1ZSh0bnNTdG9yYWdlWyd0M0QnXSkgOiBzZXRMb2NhbFN0b3JhZ2UodG5zU3RvcmFnZSwgJ3QzRCcsIGhhczNEVHJhbnNmb3JtcyhUUkFOU0ZPUk0pLCBsb2NhbFN0b3JhZ2VBY2Nlc3MpLFxyXG4gICAgICAgIFRSQU5TSVRJT05EVVJBVElPTiA9IHRuc1N0b3JhZ2VbJ3RURHUnXSA/IGNoZWNrU3RvcmFnZVZhbHVlKHRuc1N0b3JhZ2VbJ3RURHUnXSkgOiBzZXRMb2NhbFN0b3JhZ2UodG5zU3RvcmFnZSwgJ3RURHUnLCB3aGljaFByb3BlcnR5KCd0cmFuc2l0aW9uRHVyYXRpb24nKSwgbG9jYWxTdG9yYWdlQWNjZXNzKSxcclxuICAgICAgICBUUkFOU0lUSU9OREVMQVkgPSB0bnNTdG9yYWdlWyd0VERlJ10gPyBjaGVja1N0b3JhZ2VWYWx1ZSh0bnNTdG9yYWdlWyd0VERlJ10pIDogc2V0TG9jYWxTdG9yYWdlKHRuc1N0b3JhZ2UsICd0VERlJywgd2hpY2hQcm9wZXJ0eSgndHJhbnNpdGlvbkRlbGF5JyksIGxvY2FsU3RvcmFnZUFjY2VzcyksXHJcbiAgICAgICAgQU5JTUFUSU9ORFVSQVRJT04gPSB0bnNTdG9yYWdlWyd0QUR1J10gPyBjaGVja1N0b3JhZ2VWYWx1ZSh0bnNTdG9yYWdlWyd0QUR1J10pIDogc2V0TG9jYWxTdG9yYWdlKHRuc1N0b3JhZ2UsICd0QUR1Jywgd2hpY2hQcm9wZXJ0eSgnYW5pbWF0aW9uRHVyYXRpb24nKSwgbG9jYWxTdG9yYWdlQWNjZXNzKSxcclxuICAgICAgICBBTklNQVRJT05ERUxBWSA9IHRuc1N0b3JhZ2VbJ3RBRGUnXSA/IGNoZWNrU3RvcmFnZVZhbHVlKHRuc1N0b3JhZ2VbJ3RBRGUnXSkgOiBzZXRMb2NhbFN0b3JhZ2UodG5zU3RvcmFnZSwgJ3RBRGUnLCB3aGljaFByb3BlcnR5KCdhbmltYXRpb25EZWxheScpLCBsb2NhbFN0b3JhZ2VBY2Nlc3MpLFxyXG4gICAgICAgIFRSQU5TSVRJT05FTkQgPSB0bnNTdG9yYWdlWyd0VEUnXSA/IGNoZWNrU3RvcmFnZVZhbHVlKHRuc1N0b3JhZ2VbJ3RURSddKSA6IHNldExvY2FsU3RvcmFnZSh0bnNTdG9yYWdlLCAndFRFJywgZ2V0RW5kUHJvcGVydHkoVFJBTlNJVElPTkRVUkFUSU9OLCAnVHJhbnNpdGlvbicpLCBsb2NhbFN0b3JhZ2VBY2Nlc3MpLFxyXG4gICAgICAgIEFOSU1BVElPTkVORCA9IHRuc1N0b3JhZ2VbJ3RBRSddID8gY2hlY2tTdG9yYWdlVmFsdWUodG5zU3RvcmFnZVsndEFFJ10pIDogc2V0TG9jYWxTdG9yYWdlKHRuc1N0b3JhZ2UsICd0QUUnLCBnZXRFbmRQcm9wZXJ0eShBTklNQVRJT05EVVJBVElPTiwgJ0FuaW1hdGlvbicpLCBsb2NhbFN0b3JhZ2VBY2Nlc3MpO1xyXG4gIFxyXG4gICAgICAvLyBnZXQgZWxlbWVudCBub2RlcyBmcm9tIHNlbGVjdG9yc1xyXG4gICAgICB2YXIgc3VwcG9ydENvbnNvbGVXYXJuID0gd2luLmNvbnNvbGUgJiYgdHlwZW9mIHdpbi5jb25zb2xlLndhcm4gPT09IFwiZnVuY3Rpb25cIixcclxuICAgICAgICB0bnNMaXN0ID0gWydjb250YWluZXInLCAnY29udHJvbHNDb250YWluZXInLCAncHJldkJ1dHRvbicsICduZXh0QnV0dG9uJywgJ25hdkNvbnRhaW5lcicsICdhdXRvcGxheUJ1dHRvbiddLFxyXG4gICAgICAgIG9wdGlvbnNFbGVtZW50cyA9IHt9O1xyXG4gIFxyXG4gICAgICB0bnNMaXN0LmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9uc1tpdGVtXSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgIHZhciBzdHIgPSBvcHRpb25zW2l0ZW1dLFxyXG4gICAgICAgICAgICBlbCA9IGRvYy5xdWVyeVNlbGVjdG9yKHN0cik7XHJcbiAgICAgICAgICBvcHRpb25zRWxlbWVudHNbaXRlbV0gPSBzdHI7XHJcbiAgXHJcbiAgICAgICAgICBpZiAoZWwgJiYgZWwubm9kZU5hbWUpIHtcclxuICAgICAgICAgICAgb3B0aW9uc1tpdGVtXSA9IGVsO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHN1cHBvcnRDb25zb2xlV2FybikgeyBjb25zb2xlLndhcm4oJ0NhblxcJ3QgZmluZCcsIG9wdGlvbnNbaXRlbV0pOyB9XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gIFxyXG4gICAgICAvLyBtYWtlIHN1cmUgYXQgbGVhc3QgMSBzbGlkZVxyXG4gICAgICBpZiAob3B0aW9ucy5jb250YWluZXIuY2hpbGRyZW4ubGVuZ3RoIDwgMSkge1xyXG4gICAgICAgIGlmIChzdXBwb3J0Q29uc29sZVdhcm4pIHsgY29uc29sZS53YXJuKCdObyBzbGlkZXMgZm91bmQgaW4nLCBvcHRpb25zLmNvbnRhaW5lcik7IH1cclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgLy8gdXBkYXRlIG9wdGlvbnNcclxuICAgICAgdmFyIHJlc3BvbnNpdmUgPSBvcHRpb25zLnJlc3BvbnNpdmUsXHJcbiAgICAgICAgbmVzdGVkID0gb3B0aW9ucy5uZXN0ZWQsXHJcbiAgICAgICAgY2Fyb3VzZWwgPSBvcHRpb25zLm1vZGUgPT09ICdjYXJvdXNlbCcgPyB0cnVlIDogZmFsc2U7XHJcbiAgXHJcbiAgICAgIGlmIChyZXNwb25zaXZlKSB7XHJcbiAgICAgICAgLy8gYXBwbHkgcmVzcG9uc2l2ZVswXSB0byBvcHRpb25zIGFuZCByZW1vdmUgaXRcclxuICAgICAgICBpZiAoMCBpbiByZXNwb25zaXZlKSB7XHJcbiAgICAgICAgICBvcHRpb25zID0gZXh0ZW5kKG9wdGlvbnMsIHJlc3BvbnNpdmVbMF0pO1xyXG4gICAgICAgICAgZGVsZXRlIHJlc3BvbnNpdmVbMF07XHJcbiAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgIHZhciByZXNwb25zaXZlVGVtID0ge307XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHJlc3BvbnNpdmUpIHtcclxuICAgICAgICAgIHZhciB2YWwgPSByZXNwb25zaXZlW2tleV07XHJcbiAgICAgICAgICAvLyB1cGRhdGUgcmVzcG9uc2l2ZVxyXG4gICAgICAgICAgLy8gZnJvbTogMzAwOiAyXHJcbiAgICAgICAgICAvLyB0bzpcclxuICAgICAgICAgIC8vICAgMzAwOiB7XHJcbiAgICAgICAgICAvLyAgICAgaXRlbXM6IDJcclxuICAgICAgICAgIC8vICAgfVxyXG4gICAgICAgICAgdmFsID0gdHlwZW9mIHZhbCA9PT0gJ251bWJlcicgPyB7aXRlbXM6IHZhbH0gOiB2YWw7XHJcbiAgICAgICAgICByZXNwb25zaXZlVGVtW2tleV0gPSB2YWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlc3BvbnNpdmUgPSByZXNwb25zaXZlVGVtO1xyXG4gICAgICAgIHJlc3BvbnNpdmVUZW0gPSBudWxsO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIC8vIHVwZGF0ZSBvcHRpb25zXHJcbiAgICAgIGZ1bmN0aW9uIHVwZGF0ZU9wdGlvbnMgKG9iaikge1xyXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcclxuICAgICAgICAgIGlmICghY2Fyb3VzZWwpIHtcclxuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ3NsaWRlQnknKSB7IG9ialtrZXldID0gJ3BhZ2UnOyB9XHJcbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdlZGdlUGFkZGluZycpIHsgb2JqW2tleV0gPSBmYWxzZTsgfVxyXG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnYXV0b0hlaWdodCcpIHsgb2JqW2tleV0gPSBmYWxzZTsgfVxyXG4gICAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgICAgLy8gdXBkYXRlIHJlc3BvbnNpdmUgb3B0aW9uc1xyXG4gICAgICAgICAgaWYgKGtleSA9PT0gJ3Jlc3BvbnNpdmUnKSB7IHVwZGF0ZU9wdGlvbnMob2JqW2tleV0pOyB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmICghY2Fyb3VzZWwpIHsgdXBkYXRlT3B0aW9ucyhvcHRpb25zKTsgfVxyXG4gIFxyXG4gIFxyXG4gICAgICAvLyA9PT0gZGVmaW5lIGFuZCBzZXQgdmFyaWFibGVzID09PVxyXG4gICAgICBpZiAoIWNhcm91c2VsKSB7XHJcbiAgICAgICAgb3B0aW9ucy5heGlzID0gJ2hvcml6b250YWwnO1xyXG4gICAgICAgIG9wdGlvbnMuc2xpZGVCeSA9ICdwYWdlJztcclxuICAgICAgICBvcHRpb25zLmVkZ2VQYWRkaW5nID0gZmFsc2U7XHJcbiAgXHJcbiAgICAgICAgdmFyIGFuaW1hdGVJbiA9IG9wdGlvbnMuYW5pbWF0ZUluLFxyXG4gICAgICAgICAgYW5pbWF0ZU91dCA9IG9wdGlvbnMuYW5pbWF0ZU91dCxcclxuICAgICAgICAgIGFuaW1hdGVEZWxheSA9IG9wdGlvbnMuYW5pbWF0ZURlbGF5LFxyXG4gICAgICAgICAgYW5pbWF0ZU5vcm1hbCA9IG9wdGlvbnMuYW5pbWF0ZU5vcm1hbDtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICB2YXIgaG9yaXpvbnRhbCA9IG9wdGlvbnMuYXhpcyA9PT0gJ2hvcml6b250YWwnID8gdHJ1ZSA6IGZhbHNlLFxyXG4gICAgICAgIG91dGVyV3JhcHBlciA9IGRvYy5jcmVhdGVFbGVtZW50KCdkaXYnKSxcclxuICAgICAgICBpbm5lcldyYXBwZXIgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2JyksXHJcbiAgICAgICAgbWlkZGxlV3JhcHBlcixcclxuICAgICAgICBjb250YWluZXIgPSBvcHRpb25zLmNvbnRhaW5lcixcclxuICAgICAgICBjb250YWluZXJQYXJlbnQgPSBjb250YWluZXIucGFyZW50Tm9kZSxcclxuICAgICAgICBjb250YWluZXJIVE1MID0gY29udGFpbmVyLm91dGVySFRNTCxcclxuICAgICAgICBzbGlkZUl0ZW1zID0gY29udGFpbmVyLmNoaWxkcmVuLFxyXG4gICAgICAgIHNsaWRlQ291bnQgPSBzbGlkZUl0ZW1zLmxlbmd0aCxcclxuICAgICAgICBicmVha3BvaW50Wm9uZSxcclxuICAgICAgICB3aW5kb3dXaWR0aCA9IGdldFdpbmRvd1dpZHRoKCksXHJcbiAgICAgICAgaXNPbiA9IGZhbHNlO1xyXG4gICAgICBpZiAocmVzcG9uc2l2ZSkgeyBzZXRCcmVha3BvaW50Wm9uZSgpOyB9XHJcbiAgICAgIGlmIChjYXJvdXNlbCkgeyBjb250YWluZXIuY2xhc3NOYW1lICs9ICcgdG5zLXZwZml4JzsgfVxyXG4gIFxyXG4gICAgICAvLyBmaXhlZFdpZHRoOiB2aWV3cG9ydCA+IHJpZ2h0Qm91bmRhcnkgPiBpbmRleE1heFxyXG4gICAgICB2YXIgYXV0b1dpZHRoID0gb3B0aW9ucy5hdXRvV2lkdGgsXHJcbiAgICAgICAgZml4ZWRXaWR0aCA9IGdldE9wdGlvbignZml4ZWRXaWR0aCcpLFxyXG4gICAgICAgIGVkZ2VQYWRkaW5nID0gZ2V0T3B0aW9uKCdlZGdlUGFkZGluZycpLFxyXG4gICAgICAgIGd1dHRlciA9IGdldE9wdGlvbignZ3V0dGVyJyksXHJcbiAgICAgICAgdmlld3BvcnQgPSBnZXRWaWV3cG9ydFdpZHRoKCksXHJcbiAgICAgICAgY2VudGVyID0gZ2V0T3B0aW9uKCdjZW50ZXInKSxcclxuICAgICAgICBpdGVtcyA9ICFhdXRvV2lkdGggPyBNYXRoLmZsb29yKGdldE9wdGlvbignaXRlbXMnKSkgOiAxLFxyXG4gICAgICAgIHNsaWRlQnkgPSBnZXRPcHRpb24oJ3NsaWRlQnknKSxcclxuICAgICAgICB2aWV3cG9ydE1heCA9IG9wdGlvbnMudmlld3BvcnRNYXggfHwgb3B0aW9ucy5maXhlZFdpZHRoVmlld3BvcnRXaWR0aCxcclxuICAgICAgICBhcnJvd0tleXMgPSBnZXRPcHRpb24oJ2Fycm93S2V5cycpLFxyXG4gICAgICAgIHNwZWVkID0gZ2V0T3B0aW9uKCdzcGVlZCcpLFxyXG4gICAgICAgIHJld2luZCA9IG9wdGlvbnMucmV3aW5kLFxyXG4gICAgICAgIGxvb3AgPSByZXdpbmQgPyBmYWxzZSA6IG9wdGlvbnMubG9vcCxcclxuICAgICAgICBhdXRvSGVpZ2h0ID0gZ2V0T3B0aW9uKCdhdXRvSGVpZ2h0JyksXHJcbiAgICAgICAgY29udHJvbHMgPSBnZXRPcHRpb24oJ2NvbnRyb2xzJyksXHJcbiAgICAgICAgY29udHJvbHNUZXh0ID0gZ2V0T3B0aW9uKCdjb250cm9sc1RleHQnKSxcclxuICAgICAgICBuYXYgPSBnZXRPcHRpb24oJ25hdicpLFxyXG4gICAgICAgIHRvdWNoID0gZ2V0T3B0aW9uKCd0b3VjaCcpLFxyXG4gICAgICAgIG1vdXNlRHJhZyA9IGdldE9wdGlvbignbW91c2VEcmFnJyksXHJcbiAgICAgICAgYXV0b3BsYXkgPSBnZXRPcHRpb24oJ2F1dG9wbGF5JyksXHJcbiAgICAgICAgYXV0b3BsYXlUaW1lb3V0ID0gZ2V0T3B0aW9uKCdhdXRvcGxheVRpbWVvdXQnKSxcclxuICAgICAgICBhdXRvcGxheVRleHQgPSBnZXRPcHRpb24oJ2F1dG9wbGF5VGV4dCcpLFxyXG4gICAgICAgIGF1dG9wbGF5SG92ZXJQYXVzZSA9IGdldE9wdGlvbignYXV0b3BsYXlIb3ZlclBhdXNlJyksXHJcbiAgICAgICAgYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eSA9IGdldE9wdGlvbignYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eScpLFxyXG4gICAgICAgIHNoZWV0ID0gY3JlYXRlU3R5bGVTaGVldCgpLFxyXG4gICAgICAgIGxhenlsb2FkID0gb3B0aW9ucy5sYXp5bG9hZCxcclxuICAgICAgICBsYXp5bG9hZFNlbGVjdG9yID0gb3B0aW9ucy5sYXp5bG9hZFNlbGVjdG9yLFxyXG4gICAgICAgIHNsaWRlUG9zaXRpb25zLCAvLyBjb2xsZWN0aW9uIG9mIHNsaWRlIHBvc2l0aW9uc1xyXG4gICAgICAgIHNsaWRlSXRlbXNPdXQgPSBbXSxcclxuICAgICAgICBjbG9uZUNvdW50ID0gbG9vcCA/IGdldENsb25lQ291bnRGb3JMb29wKCkgOiAwLFxyXG4gICAgICAgIHNsaWRlQ291bnROZXcgPSAhY2Fyb3VzZWwgPyBzbGlkZUNvdW50ICsgY2xvbmVDb3VudCA6IHNsaWRlQ291bnQgKyBjbG9uZUNvdW50ICogMixcclxuICAgICAgICBoYXNSaWdodERlYWRab25lID0gKGZpeGVkV2lkdGggfHwgYXV0b1dpZHRoKSAmJiAhbG9vcCA/IHRydWUgOiBmYWxzZSxcclxuICAgICAgICByaWdodEJvdW5kYXJ5ID0gZml4ZWRXaWR0aCA/IGdldFJpZ2h0Qm91bmRhcnkoKSA6IG51bGwsXHJcbiAgICAgICAgdXBkYXRlSW5kZXhCZWZvcmVUcmFuc2Zvcm0gPSAoIWNhcm91c2VsIHx8ICFsb29wKSA/IHRydWUgOiBmYWxzZSxcclxuICAgICAgICAvLyB0cmFuc2Zvcm1cclxuICAgICAgICB0cmFuc2Zvcm1BdHRyID0gaG9yaXpvbnRhbCA/ICdsZWZ0JyA6ICd0b3AnLFxyXG4gICAgICAgIHRyYW5zZm9ybVByZWZpeCA9ICcnLFxyXG4gICAgICAgIHRyYW5zZm9ybVBvc3RmaXggPSAnJyxcclxuICAgICAgICAvLyBpbmRleFxyXG4gICAgICAgIGdldEluZGV4TWF4ID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIGlmIChmaXhlZFdpZHRoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHsgcmV0dXJuIGNlbnRlciAmJiAhbG9vcCA/IHNsaWRlQ291bnQgLSAxIDogTWF0aC5jZWlsKC0gcmlnaHRCb3VuZGFyeSAvIChmaXhlZFdpZHRoICsgZ3V0dGVyKSk7IH07XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGF1dG9XaWR0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IHNsaWRlQ291bnROZXc7IGktLTspIHtcclxuICAgICAgICAgICAgICAgIGlmIChzbGlkZVBvc2l0aW9uc1tpXSA+PSAtIHJpZ2h0Qm91bmRhcnkpIHsgcmV0dXJuIGk7IH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGNlbnRlciAmJiBjYXJvdXNlbCAmJiAhbG9vcCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNsaWRlQ291bnQgLSAxO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbG9vcCB8fCBjYXJvdXNlbCA/IE1hdGgubWF4KDAsIHNsaWRlQ291bnROZXcgLSBNYXRoLmNlaWwoaXRlbXMpKSA6IHNsaWRlQ291bnROZXcgLSAxO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KSgpLFxyXG4gICAgICAgIGluZGV4ID0gZ2V0U3RhcnRJbmRleChnZXRPcHRpb24oJ3N0YXJ0SW5kZXgnKSksXHJcbiAgICAgICAgaW5kZXhDYWNoZWQgPSBpbmRleCxcclxuICAgICAgICBkaXNwbGF5SW5kZXggPSBnZXRDdXJyZW50U2xpZGUoKSxcclxuICAgICAgICBpbmRleE1pbiA9IDAsXHJcbiAgICAgICAgaW5kZXhNYXggPSAhYXV0b1dpZHRoID8gZ2V0SW5kZXhNYXgoKSA6IG51bGwsXHJcbiAgICAgICAgLy8gcmVzaXplXHJcbiAgICAgICAgcmVzaXplVGltZXIsXHJcbiAgICAgICAgcHJldmVudEFjdGlvbldoZW5SdW5uaW5nID0gb3B0aW9ucy5wcmV2ZW50QWN0aW9uV2hlblJ1bm5pbmcsXHJcbiAgICAgICAgc3dpcGVBbmdsZSA9IG9wdGlvbnMuc3dpcGVBbmdsZSxcclxuICAgICAgICBtb3ZlRGlyZWN0aW9uRXhwZWN0ZWQgPSBzd2lwZUFuZ2xlID8gJz8nIDogdHJ1ZSxcclxuICAgICAgICBydW5uaW5nID0gZmFsc2UsXHJcbiAgICAgICAgb25Jbml0ID0gb3B0aW9ucy5vbkluaXQsXHJcbiAgICAgICAgZXZlbnRzID0gbmV3IEV2ZW50cygpLFxyXG4gICAgICAgIC8vIGlkLCBjbGFzc1xyXG4gICAgICAgIG5ld0NvbnRhaW5lckNsYXNzZXMgPSAnIHRucy1zbGlkZXIgdG5zLScgKyBvcHRpb25zLm1vZGUsXHJcbiAgICAgICAgc2xpZGVJZCA9IGNvbnRhaW5lci5pZCB8fCBnZXRTbGlkZUlkKCksXHJcbiAgICAgICAgZGlzYWJsZSA9IGdldE9wdGlvbignZGlzYWJsZScpLFxyXG4gICAgICAgIGRpc2FibGVkID0gZmFsc2UsXHJcbiAgICAgICAgZnJlZXphYmxlID0gb3B0aW9ucy5mcmVlemFibGUsXHJcbiAgICAgICAgZnJlZXplID0gZnJlZXphYmxlICYmICFhdXRvV2lkdGggPyBnZXRGcmVlemUoKSA6IGZhbHNlLFxyXG4gICAgICAgIGZyb3plbiA9IGZhbHNlLFxyXG4gICAgICAgIGNvbnRyb2xzRXZlbnRzID0ge1xyXG4gICAgICAgICAgJ2NsaWNrJzogb25Db250cm9sc0NsaWNrLFxyXG4gICAgICAgICAgJ2tleWRvd24nOiBvbkNvbnRyb2xzS2V5ZG93blxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbmF2RXZlbnRzID0ge1xyXG4gICAgICAgICAgJ2NsaWNrJzogb25OYXZDbGljayxcclxuICAgICAgICAgICdrZXlkb3duJzogb25OYXZLZXlkb3duXHJcbiAgICAgICAgfSxcclxuICAgICAgICBob3ZlckV2ZW50cyA9IHtcclxuICAgICAgICAgICdtb3VzZW92ZXInOiBtb3VzZW92ZXJQYXVzZSxcclxuICAgICAgICAgICdtb3VzZW91dCc6IG1vdXNlb3V0UmVzdGFydFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdmlzaWJpbGl0eUV2ZW50ID0geyd2aXNpYmlsaXR5Y2hhbmdlJzogb25WaXNpYmlsaXR5Q2hhbmdlfSxcclxuICAgICAgICBkb2NtZW50S2V5ZG93bkV2ZW50ID0geydrZXlkb3duJzogb25Eb2N1bWVudEtleWRvd259LFxyXG4gICAgICAgIHRvdWNoRXZlbnRzID0ge1xyXG4gICAgICAgICAgJ3RvdWNoc3RhcnQnOiBvblBhblN0YXJ0LFxyXG4gICAgICAgICAgJ3RvdWNobW92ZSc6IG9uUGFuTW92ZSxcclxuICAgICAgICAgICd0b3VjaGVuZCc6IG9uUGFuRW5kLFxyXG4gICAgICAgICAgJ3RvdWNoY2FuY2VsJzogb25QYW5FbmRcclxuICAgICAgICB9LCBkcmFnRXZlbnRzID0ge1xyXG4gICAgICAgICAgJ21vdXNlZG93bic6IG9uUGFuU3RhcnQsXHJcbiAgICAgICAgICAnbW91c2Vtb3ZlJzogb25QYW5Nb3ZlLFxyXG4gICAgICAgICAgJ21vdXNldXAnOiBvblBhbkVuZCxcclxuICAgICAgICAgICdtb3VzZWxlYXZlJzogb25QYW5FbmRcclxuICAgICAgICB9LFxyXG4gICAgICAgIGhhc0NvbnRyb2xzID0gaGFzT3B0aW9uKCdjb250cm9scycpLFxyXG4gICAgICAgIGhhc05hdiA9IGhhc09wdGlvbignbmF2JyksXHJcbiAgICAgICAgbmF2QXNUaHVtYm5haWxzID0gYXV0b1dpZHRoID8gdHJ1ZSA6IG9wdGlvbnMubmF2QXNUaHVtYm5haWxzLFxyXG4gICAgICAgIGhhc0F1dG9wbGF5ID0gaGFzT3B0aW9uKCdhdXRvcGxheScpLFxyXG4gICAgICAgIGhhc1RvdWNoID0gaGFzT3B0aW9uKCd0b3VjaCcpLFxyXG4gICAgICAgIGhhc01vdXNlRHJhZyA9IGhhc09wdGlvbignbW91c2VEcmFnJyksXHJcbiAgICAgICAgc2xpZGVBY3RpdmVDbGFzcyA9ICd0bnMtc2xpZGUtYWN0aXZlJyxcclxuICAgICAgICBpbWdDb21wbGV0ZUNsYXNzID0gJ3Rucy1jb21wbGV0ZScsXHJcbiAgICAgICAgaW1nRXZlbnRzID0ge1xyXG4gICAgICAgICAgJ2xvYWQnOiBvbkltZ0xvYWRlZCxcclxuICAgICAgICAgICdlcnJvcic6IG9uSW1nRmFpbGVkXHJcbiAgICAgICAgfSxcclxuICAgICAgICBpbWdzQ29tcGxldGUsXHJcbiAgICAgICAgbGl2ZXJlZ2lvbkN1cnJlbnQsXHJcbiAgICAgICAgcHJldmVudFNjcm9sbCA9IG9wdGlvbnMucHJldmVudFNjcm9sbE9uVG91Y2ggPT09ICdmb3JjZScgPyB0cnVlIDogZmFsc2U7XHJcbiAgXHJcbiAgICAgIC8vIGNvbnRyb2xzXHJcbiAgICAgIGlmIChoYXNDb250cm9scykge1xyXG4gICAgICAgIHZhciBjb250cm9sc0NvbnRhaW5lciA9IG9wdGlvbnMuY29udHJvbHNDb250YWluZXIsXHJcbiAgICAgICAgICBjb250cm9sc0NvbnRhaW5lckhUTUwgPSBvcHRpb25zLmNvbnRyb2xzQ29udGFpbmVyID8gb3B0aW9ucy5jb250cm9sc0NvbnRhaW5lci5vdXRlckhUTUwgOiAnJyxcclxuICAgICAgICAgIHByZXZCdXR0b24gPSBvcHRpb25zLnByZXZCdXR0b24sXHJcbiAgICAgICAgICBuZXh0QnV0dG9uID0gb3B0aW9ucy5uZXh0QnV0dG9uLFxyXG4gICAgICAgICAgcHJldkJ1dHRvbkhUTUwgPSBvcHRpb25zLnByZXZCdXR0b24gPyBvcHRpb25zLnByZXZCdXR0b24ub3V0ZXJIVE1MIDogJycsXHJcbiAgICAgICAgICBuZXh0QnV0dG9uSFRNTCA9IG9wdGlvbnMubmV4dEJ1dHRvbiA/IG9wdGlvbnMubmV4dEJ1dHRvbi5vdXRlckhUTUwgOiAnJyxcclxuICAgICAgICAgIHByZXZJc0J1dHRvbixcclxuICAgICAgICAgIG5leHRJc0J1dHRvbjtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICAvLyBuYXZcclxuICAgICAgaWYgKGhhc05hdikge1xyXG4gICAgICAgIHZhciBuYXZDb250YWluZXIgPSBvcHRpb25zLm5hdkNvbnRhaW5lcixcclxuICAgICAgICAgIG5hdkNvbnRhaW5lckhUTUwgPSBvcHRpb25zLm5hdkNvbnRhaW5lciA/IG9wdGlvbnMubmF2Q29udGFpbmVyLm91dGVySFRNTCA6ICcnLFxyXG4gICAgICAgICAgbmF2SXRlbXMsXHJcbiAgICAgICAgICBwYWdlcyA9IGF1dG9XaWR0aCA/IHNsaWRlQ291bnQgOiBnZXRQYWdlcygpLFxyXG4gICAgICAgICAgcGFnZXNDYWNoZWQgPSAwLFxyXG4gICAgICAgICAgbmF2Q2xpY2tlZCA9IC0xLFxyXG4gICAgICAgICAgbmF2Q3VycmVudEluZGV4ID0gZ2V0Q3VycmVudE5hdkluZGV4KCksXHJcbiAgICAgICAgICBuYXZDdXJyZW50SW5kZXhDYWNoZWQgPSBuYXZDdXJyZW50SW5kZXgsXHJcbiAgICAgICAgICBuYXZBY3RpdmVDbGFzcyA9ICd0bnMtbmF2LWFjdGl2ZScsXHJcbiAgICAgICAgICBuYXZTdHIgPSAnQ2Fyb3VzZWwgUGFnZSAnLFxyXG4gICAgICAgICAgbmF2U3RyQ3VycmVudCA9ICcgKEN1cnJlbnQgU2xpZGUpJztcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICAvLyBhdXRvcGxheVxyXG4gICAgICBpZiAoaGFzQXV0b3BsYXkpIHtcclxuICAgICAgICB2YXIgYXV0b3BsYXlEaXJlY3Rpb24gPSBvcHRpb25zLmF1dG9wbGF5RGlyZWN0aW9uID09PSAnZm9yd2FyZCcgPyAxIDogLTEsXHJcbiAgICAgICAgICBhdXRvcGxheUJ1dHRvbiA9IG9wdGlvbnMuYXV0b3BsYXlCdXR0b24sXHJcbiAgICAgICAgICBhdXRvcGxheUJ1dHRvbkhUTUwgPSBvcHRpb25zLmF1dG9wbGF5QnV0dG9uID8gb3B0aW9ucy5hdXRvcGxheUJ1dHRvbi5vdXRlckhUTUwgOiAnJyxcclxuICAgICAgICAgIGF1dG9wbGF5SHRtbFN0cmluZ3MgPSBbJzxzcGFuIGNsYXNzPVxcJ3Rucy12aXN1YWxseS1oaWRkZW5cXCc+JywgJyBhbmltYXRpb248L3NwYW4+J10sXHJcbiAgICAgICAgICBhdXRvcGxheVRpbWVyLFxyXG4gICAgICAgICAgYW5pbWF0aW5nLFxyXG4gICAgICAgICAgYXV0b3BsYXlIb3ZlclBhdXNlZCxcclxuICAgICAgICAgIGF1dG9wbGF5VXNlclBhdXNlZCxcclxuICAgICAgICAgIGF1dG9wbGF5VmlzaWJpbGl0eVBhdXNlZDtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBpZiAoaGFzVG91Y2ggfHwgaGFzTW91c2VEcmFnKSB7XHJcbiAgICAgICAgdmFyIGluaXRQb3NpdGlvbiA9IHt9LFxyXG4gICAgICAgICAgbGFzdFBvc2l0aW9uID0ge30sXHJcbiAgICAgICAgICB0cmFuc2xhdGVJbml0LFxyXG4gICAgICAgICAgZGlzWCxcclxuICAgICAgICAgIGRpc1ksXHJcbiAgICAgICAgICBwYW5TdGFydCA9IGZhbHNlLFxyXG4gICAgICAgICAgcmFmSW5kZXgsXHJcbiAgICAgICAgICBnZXREaXN0ID0gaG9yaXpvbnRhbCA/XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIGEueCAtIGIueDsgfSA6XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIGEueSAtIGIueTsgfTtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICAvLyBkaXNhYmxlIHNsaWRlciB3aGVuIHNsaWRlY291bnQgPD0gaXRlbXNcclxuICAgICAgaWYgKCFhdXRvV2lkdGgpIHsgcmVzZXRWYXJpYmxlc1doZW5EaXNhYmxlKGRpc2FibGUgfHwgZnJlZXplKTsgfVxyXG4gIFxyXG4gICAgICBpZiAoVFJBTlNGT1JNKSB7XHJcbiAgICAgICAgdHJhbnNmb3JtQXR0ciA9IFRSQU5TRk9STTtcclxuICAgICAgICB0cmFuc2Zvcm1QcmVmaXggPSAndHJhbnNsYXRlJztcclxuICBcclxuICAgICAgICBpZiAoSEFTM0RUUkFOU0ZPUk1TKSB7XHJcbiAgICAgICAgICB0cmFuc2Zvcm1QcmVmaXggKz0gaG9yaXpvbnRhbCA/ICczZCgnIDogJzNkKDBweCwgJztcclxuICAgICAgICAgIHRyYW5zZm9ybVBvc3RmaXggPSBob3Jpem9udGFsID8gJywgMHB4LCAwcHgpJyA6ICcsIDBweCknO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0cmFuc2Zvcm1QcmVmaXggKz0gaG9yaXpvbnRhbCA/ICdYKCcgOiAnWSgnO1xyXG4gICAgICAgICAgdHJhbnNmb3JtUG9zdGZpeCA9ICcpJztcclxuICAgICAgICB9XHJcbiAgXHJcbiAgICAgIH1cclxuICBcclxuICAgICAgaWYgKGNhcm91c2VsKSB7IGNvbnRhaW5lci5jbGFzc05hbWUgPSBjb250YWluZXIuY2xhc3NOYW1lLnJlcGxhY2UoJ3Rucy12cGZpeCcsICcnKTsgfVxyXG4gICAgICBpbml0U3RydWN0dXJlKCk7XHJcbiAgICAgIGluaXRTaGVldCgpO1xyXG4gICAgICBpbml0U2xpZGVyVHJhbnNmb3JtKCk7XHJcbiAgXHJcbiAgICAgIC8vID09PSBDT01NT04gRlVOQ1RJT05TID09PSAvL1xyXG4gICAgICBmdW5jdGlvbiByZXNldFZhcmlibGVzV2hlbkRpc2FibGUgKGNvbmRpdGlvbikge1xyXG4gICAgICAgIGlmIChjb25kaXRpb24pIHtcclxuICAgICAgICAgIGNvbnRyb2xzID0gbmF2ID0gdG91Y2ggPSBtb3VzZURyYWcgPSBhcnJvd0tleXMgPSBhdXRvcGxheSA9IGF1dG9wbGF5SG92ZXJQYXVzZSA9IGF1dG9wbGF5UmVzZXRPblZpc2liaWxpdHkgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgZnVuY3Rpb24gZ2V0Q3VycmVudFNsaWRlICgpIHtcclxuICAgICAgICB2YXIgdGVtID0gY2Fyb3VzZWwgPyBpbmRleCAtIGNsb25lQ291bnQgOiBpbmRleDtcclxuICAgICAgICB3aGlsZSAodGVtIDwgMCkgeyB0ZW0gKz0gc2xpZGVDb3VudDsgfVxyXG4gICAgICAgIHJldHVybiB0ZW0lc2xpZGVDb3VudCArIDE7XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgZnVuY3Rpb24gZ2V0U3RhcnRJbmRleCAoaW5kKSB7XHJcbiAgICAgICAgaW5kID0gaW5kID8gTWF0aC5tYXgoMCwgTWF0aC5taW4obG9vcCA/IHNsaWRlQ291bnQgLSAxIDogc2xpZGVDb3VudCAtIGl0ZW1zLCBpbmQpKSA6IDA7XHJcbiAgICAgICAgcmV0dXJuIGNhcm91c2VsID8gaW5kICsgY2xvbmVDb3VudCA6IGluZDtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBmdW5jdGlvbiBnZXRBYnNJbmRleCAoaSkge1xyXG4gICAgICAgIGlmIChpID09IG51bGwpIHsgaSA9IGluZGV4OyB9XHJcbiAgXHJcbiAgICAgICAgaWYgKGNhcm91c2VsKSB7IGkgLT0gY2xvbmVDb3VudDsgfVxyXG4gICAgICAgIHdoaWxlIChpIDwgMCkgeyBpICs9IHNsaWRlQ291bnQ7IH1cclxuICBcclxuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihpJXNsaWRlQ291bnQpO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIGZ1bmN0aW9uIGdldEN1cnJlbnROYXZJbmRleCAoKSB7XHJcbiAgICAgICAgdmFyIGFic0luZGV4ID0gZ2V0QWJzSW5kZXgoKSxcclxuICAgICAgICAgIHJlc3VsdDtcclxuICBcclxuICAgICAgICByZXN1bHQgPSBuYXZBc1RodW1ibmFpbHMgPyBhYnNJbmRleCA6XHJcbiAgICAgICAgICBmaXhlZFdpZHRoIHx8IGF1dG9XaWR0aCA/IE1hdGguY2VpbCgoYWJzSW5kZXggKyAxKSAqIHBhZ2VzIC8gc2xpZGVDb3VudCAtIDEpIDpcclxuICAgICAgICAgICAgTWF0aC5mbG9vcihhYnNJbmRleCAvIGl0ZW1zKTtcclxuICBcclxuICAgICAgICAvLyBzZXQgYWN0aXZlIG5hdiB0byB0aGUgbGFzdCBvbmUgd2hlbiByZWFjaGVzIHRoZSByaWdodCBlZGdlXHJcbiAgICAgICAgaWYgKCFsb29wICYmIGNhcm91c2VsICYmIGluZGV4ID09PSBpbmRleE1heCkgeyByZXN1bHQgPSBwYWdlcyAtIDE7IH1cclxuICBcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIGZ1bmN0aW9uIGdldEl0ZW1zTWF4ICgpIHtcclxuICAgICAgICAvLyBmaXhlZFdpZHRoIG9yIGF1dG9XaWR0aCB3aGlsZSB2aWV3cG9ydE1heCBpcyBub3QgYXZhaWxhYmxlXHJcbiAgICAgICAgaWYgKGF1dG9XaWR0aCB8fCAoZml4ZWRXaWR0aCAmJiAhdmlld3BvcnRNYXgpKSB7XHJcbiAgICAgICAgICByZXR1cm4gc2xpZGVDb3VudCAtIDE7XHJcbiAgICAgICAgICAvLyBtb3N0IGNhc2VzXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHZhciBzdHIgPSBmaXhlZFdpZHRoID8gJ2ZpeGVkV2lkdGgnIDogJ2l0ZW1zJyxcclxuICAgICAgICAgICAgYXJyID0gW107XHJcbiAgXHJcbiAgICAgICAgICBpZiAoZml4ZWRXaWR0aCB8fCBvcHRpb25zW3N0cl0gPCBzbGlkZUNvdW50KSB7IGFyci5wdXNoKG9wdGlvbnNbc3RyXSk7IH1cclxuICBcclxuICAgICAgICAgIGlmIChyZXNwb25zaXZlKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGJwIGluIHJlc3BvbnNpdmUpIHtcclxuICAgICAgICAgICAgICB2YXIgdGVtID0gcmVzcG9uc2l2ZVticF1bc3RyXTtcclxuICAgICAgICAgICAgICBpZiAodGVtICYmIChmaXhlZFdpZHRoIHx8IHRlbSA8IHNsaWRlQ291bnQpKSB7IGFyci5wdXNoKHRlbSk7IH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgICAgaWYgKCFhcnIubGVuZ3RoKSB7IGFyci5wdXNoKDApOyB9XHJcbiAgXHJcbiAgICAgICAgICByZXR1cm4gTWF0aC5jZWlsKGZpeGVkV2lkdGggPyB2aWV3cG9ydE1heCAvIE1hdGgubWluLmFwcGx5KG51bGwsIGFycikgOiBNYXRoLm1heC5hcHBseShudWxsLCBhcnIpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgZnVuY3Rpb24gZ2V0Q2xvbmVDb3VudEZvckxvb3AgKCkge1xyXG4gICAgICAgIHZhciBpdGVtc01heCA9IGdldEl0ZW1zTWF4KCksXHJcbiAgICAgICAgICByZXN1bHQgPSBjYXJvdXNlbCA/IE1hdGguY2VpbCgoaXRlbXNNYXggKiA1IC0gc2xpZGVDb3VudCkvMikgOiAoaXRlbXNNYXggKiA0IC0gc2xpZGVDb3VudCk7XHJcbiAgICAgICAgcmVzdWx0ID0gTWF0aC5tYXgoaXRlbXNNYXgsIHJlc3VsdCk7XHJcbiAgXHJcbiAgICAgICAgcmV0dXJuIGhhc09wdGlvbignZWRnZVBhZGRpbmcnKSA/IHJlc3VsdCArIDEgOiByZXN1bHQ7XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgZnVuY3Rpb24gZ2V0V2luZG93V2lkdGggKCkge1xyXG4gICAgICAgIHJldHVybiB3aW4uaW5uZXJXaWR0aCB8fCBkb2MuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIHx8IGRvYy5ib2R5LmNsaWVudFdpZHRoO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIGZ1bmN0aW9uIGdldEluc2VydFBvc2l0aW9uIChwb3MpIHtcclxuICAgICAgICByZXR1cm4gcG9zID09PSAndG9wJyA/ICdhZnRlcmJlZ2luJyA6ICdiZWZvcmVlbmQnO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIGZ1bmN0aW9uIGdldENsaWVudFdpZHRoIChlbCkge1xyXG4gICAgICAgIHZhciBkaXYgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2JyksIHJlY3QsIHdpZHRoO1xyXG4gICAgICAgIGVsLmFwcGVuZENoaWxkKGRpdik7XHJcbiAgICAgICAgcmVjdCA9IGRpdi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICB3aWR0aCA9IHJlY3QucmlnaHQgLSByZWN0LmxlZnQ7XHJcbiAgICAgICAgZGl2LnJlbW92ZSgpO1xyXG4gICAgICAgIHJldHVybiB3aWR0aCB8fCBnZXRDbGllbnRXaWR0aChlbC5wYXJlbnROb2RlKTtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBmdW5jdGlvbiBnZXRWaWV3cG9ydFdpZHRoICgpIHtcclxuICAgICAgICB2YXIgZ2FwID0gZWRnZVBhZGRpbmcgPyBlZGdlUGFkZGluZyAqIDIgLSBndXR0ZXIgOiAwO1xyXG4gICAgICAgIHJldHVybiBnZXRDbGllbnRXaWR0aChjb250YWluZXJQYXJlbnQpIC0gZ2FwO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIGZ1bmN0aW9uIGhhc09wdGlvbiAoaXRlbSkge1xyXG4gICAgICAgIGlmIChvcHRpb25zW2l0ZW1dKSB7XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKHJlc3BvbnNpdmUpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgYnAgaW4gcmVzcG9uc2l2ZSkge1xyXG4gICAgICAgICAgICAgIGlmIChyZXNwb25zaXZlW2JwXVtpdGVtXSkgeyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIC8vIGdldCBvcHRpb246XHJcbiAgICAgIC8vIGZpeGVkIHdpZHRoOiB2aWV3cG9ydCwgZml4ZWRXaWR0aCwgZ3V0dGVyID0+IGl0ZW1zXHJcbiAgICAgIC8vIG90aGVyczogd2luZG93IHdpZHRoID0+IGFsbCB2YXJpYWJsZXNcclxuICAgICAgLy8gYWxsOiBpdGVtcyA9PiBzbGlkZUJ5XHJcbiAgICAgIGZ1bmN0aW9uIGdldE9wdGlvbiAoaXRlbSwgd3cpIHtcclxuICAgICAgICBpZiAod3cgPT0gbnVsbCkgeyB3dyA9IHdpbmRvd1dpZHRoOyB9XHJcbiAgXHJcbiAgICAgICAgaWYgKGl0ZW0gPT09ICdpdGVtcycgJiYgZml4ZWRXaWR0aCkge1xyXG4gICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoKHZpZXdwb3J0ICsgZ3V0dGVyKSAvIChmaXhlZFdpZHRoICsgZ3V0dGVyKSkgfHwgMTtcclxuICBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdmFyIHJlc3VsdCA9IG9wdGlvbnNbaXRlbV07XHJcbiAgXHJcbiAgICAgICAgICBpZiAocmVzcG9uc2l2ZSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBicCBpbiByZXNwb25zaXZlKSB7XHJcbiAgICAgICAgICAgICAgLy8gYnA6IGNvbnZlcnQgc3RyaW5nIHRvIG51bWJlclxyXG4gICAgICAgICAgICAgIGlmICh3dyA+PSBwYXJzZUludChicCkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtIGluIHJlc3BvbnNpdmVbYnBdKSB7IHJlc3VsdCA9IHJlc3BvbnNpdmVbYnBdW2l0ZW1dOyB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgICBpZiAoaXRlbSA9PT0gJ3NsaWRlQnknICYmIHJlc3VsdCA9PT0gJ3BhZ2UnKSB7IHJlc3VsdCA9IGdldE9wdGlvbignaXRlbXMnKTsgfVxyXG4gICAgICAgICAgaWYgKCFjYXJvdXNlbCAmJiAoaXRlbSA9PT0gJ3NsaWRlQnknIHx8IGl0ZW0gPT09ICdpdGVtcycpKSB7IHJlc3VsdCA9IE1hdGguZmxvb3IocmVzdWx0KTsgfVxyXG4gIFxyXG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgZnVuY3Rpb24gZ2V0U2xpZGVNYXJnaW5MZWZ0IChpKSB7XHJcbiAgICAgICAgcmV0dXJuIENBTEMgP1xyXG4gICAgICAgICAgQ0FMQyArICcoJyArIGkgKiAxMDAgKyAnJSAvICcgKyBzbGlkZUNvdW50TmV3ICsgJyknIDpcclxuICAgICAgICAgIGkgKiAxMDAgLyBzbGlkZUNvdW50TmV3ICsgJyUnO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIGZ1bmN0aW9uIGdldElubmVyV3JhcHBlclN0eWxlcyAoZWRnZVBhZGRpbmdUZW0sIGd1dHRlclRlbSwgZml4ZWRXaWR0aFRlbSwgc3BlZWRUZW0sIGF1dG9IZWlnaHRCUCkge1xyXG4gICAgICAgIHZhciBzdHIgPSAnJztcclxuICBcclxuICAgICAgICBpZiAoZWRnZVBhZGRpbmdUZW0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgdmFyIGdhcCA9IGVkZ2VQYWRkaW5nVGVtO1xyXG4gICAgICAgICAgaWYgKGd1dHRlclRlbSkgeyBnYXAgLT0gZ3V0dGVyVGVtOyB9XHJcbiAgICAgICAgICBzdHIgPSBob3Jpem9udGFsID9cclxuICAgICAgICAgICAgJ21hcmdpbjogMCAnICsgZ2FwICsgJ3B4IDAgJyArIGVkZ2VQYWRkaW5nVGVtICsgJ3B4OycgOlxyXG4gICAgICAgICAgICAnbWFyZ2luOiAnICsgZWRnZVBhZGRpbmdUZW0gKyAncHggMCAnICsgZ2FwICsgJ3B4IDA7JztcclxuICAgICAgICB9IGVsc2UgaWYgKGd1dHRlclRlbSAmJiAhZml4ZWRXaWR0aFRlbSkge1xyXG4gICAgICAgICAgdmFyIGd1dHRlclRlbVVuaXQgPSAnLScgKyBndXR0ZXJUZW0gKyAncHgnLFxyXG4gICAgICAgICAgICBkaXIgPSBob3Jpem9udGFsID8gZ3V0dGVyVGVtVW5pdCArICcgMCAwJyA6ICcwICcgKyBndXR0ZXJUZW1Vbml0ICsgJyAwJztcclxuICAgICAgICAgIHN0ciA9ICdtYXJnaW46IDAgJyArIGRpciArICc7JztcclxuICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgaWYgKCFjYXJvdXNlbCAmJiBhdXRvSGVpZ2h0QlAgJiYgVFJBTlNJVElPTkRVUkFUSU9OICYmIHNwZWVkVGVtKSB7IHN0ciArPSBnZXRUcmFuc2l0aW9uRHVyYXRpb25TdHlsZShzcGVlZFRlbSk7IH1cclxuICAgICAgICByZXR1cm4gc3RyO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIGZ1bmN0aW9uIGdldENvbnRhaW5lcldpZHRoIChmaXhlZFdpZHRoVGVtLCBndXR0ZXJUZW0sIGl0ZW1zVGVtKSB7XHJcbiAgICAgICAgaWYgKGZpeGVkV2lkdGhUZW0pIHtcclxuICAgICAgICAgIHJldHVybiAoZml4ZWRXaWR0aFRlbSArIGd1dHRlclRlbSkgKiBzbGlkZUNvdW50TmV3ICsgJ3B4JztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuIENBTEMgP1xyXG4gICAgICAgICAgICBDQUxDICsgJygnICsgc2xpZGVDb3VudE5ldyAqIDEwMCArICclIC8gJyArIGl0ZW1zVGVtICsgJyknIDpcclxuICAgICAgICAgICAgc2xpZGVDb3VudE5ldyAqIDEwMCAvIGl0ZW1zVGVtICsgJyUnO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBmdW5jdGlvbiBnZXRTbGlkZVdpZHRoU3R5bGUgKGZpeGVkV2lkdGhUZW0sIGd1dHRlclRlbSwgaXRlbXNUZW0pIHtcclxuICAgICAgICB2YXIgd2lkdGg7XHJcbiAgXHJcbiAgICAgICAgaWYgKGZpeGVkV2lkdGhUZW0pIHtcclxuICAgICAgICAgIHdpZHRoID0gKGZpeGVkV2lkdGhUZW0gKyBndXR0ZXJUZW0pICsgJ3B4JztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKCFjYXJvdXNlbCkgeyBpdGVtc1RlbSA9IE1hdGguZmxvb3IoaXRlbXNUZW0pOyB9XHJcbiAgICAgICAgICB2YXIgZGl2aWRlbmQgPSBjYXJvdXNlbCA/IHNsaWRlQ291bnROZXcgOiBpdGVtc1RlbTtcclxuICAgICAgICAgIHdpZHRoID0gQ0FMQyA/XHJcbiAgICAgICAgICAgIENBTEMgKyAnKDEwMCUgLyAnICsgZGl2aWRlbmQgKyAnKScgOlxyXG4gICAgICAgICAgICAxMDAgLyBkaXZpZGVuZCArICclJztcclxuICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgd2lkdGggPSAnd2lkdGg6JyArIHdpZHRoO1xyXG4gIFxyXG4gICAgICAgIC8vIGlubmVyIHNsaWRlcjogb3ZlcndyaXRlIG91dGVyIHNsaWRlciBzdHlsZXNcclxuICAgICAgICByZXR1cm4gbmVzdGVkICE9PSAnaW5uZXInID8gd2lkdGggKyAnOycgOiB3aWR0aCArICcgIWltcG9ydGFudDsnO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIGZ1bmN0aW9uIGdldFNsaWRlR3V0dGVyU3R5bGUgKGd1dHRlclRlbSkge1xyXG4gICAgICAgIHZhciBzdHIgPSAnJztcclxuICBcclxuICAgICAgICAvLyBndXR0ZXIgbWF5YmUgaW50ZXJnZXIgfHwgMFxyXG4gICAgICAgIC8vIHNvIGNhbid0IHVzZSAnaWYgKGd1dHRlciknXHJcbiAgICAgICAgaWYgKGd1dHRlclRlbSAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgIHZhciBwcm9wID0gaG9yaXpvbnRhbCA/ICdwYWRkaW5nLScgOiAnbWFyZ2luLScsXHJcbiAgICAgICAgICAgIGRpciA9IGhvcml6b250YWwgPyAncmlnaHQnIDogJ2JvdHRvbSc7XHJcbiAgICAgICAgICBzdHIgPSBwcm9wICsgIGRpciArICc6ICcgKyBndXR0ZXJUZW0gKyAncHg7JztcclxuICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgcmV0dXJuIHN0cjtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBmdW5jdGlvbiBnZXRDU1NQcmVmaXggKG5hbWUsIG51bSkge1xyXG4gICAgICAgIHZhciBwcmVmaXggPSBuYW1lLnN1YnN0cmluZygwLCBuYW1lLmxlbmd0aCAtIG51bSkudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICBpZiAocHJlZml4KSB7IHByZWZpeCA9ICctJyArIHByZWZpeCArICctJzsgfVxyXG4gIFxyXG4gICAgICAgIHJldHVybiBwcmVmaXg7XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgZnVuY3Rpb24gZ2V0VHJhbnNpdGlvbkR1cmF0aW9uU3R5bGUgKHNwZWVkKSB7XHJcbiAgICAgICAgcmV0dXJuIGdldENTU1ByZWZpeChUUkFOU0lUSU9ORFVSQVRJT04sIDE4KSArICd0cmFuc2l0aW9uLWR1cmF0aW9uOicgKyBzcGVlZCAvIDEwMDAgKyAnczsnO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIGZ1bmN0aW9uIGdldEFuaW1hdGlvbkR1cmF0aW9uU3R5bGUgKHNwZWVkKSB7XHJcbiAgICAgICAgcmV0dXJuIGdldENTU1ByZWZpeChBTklNQVRJT05EVVJBVElPTiwgMTcpICsgJ2FuaW1hdGlvbi1kdXJhdGlvbjonICsgc3BlZWQgLyAxMDAwICsgJ3M7JztcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBmdW5jdGlvbiBpbml0U3RydWN0dXJlICgpIHtcclxuICAgICAgICB2YXIgY2xhc3NPdXRlciA9ICd0bnMtb3V0ZXInLFxyXG4gICAgICAgICAgY2xhc3NJbm5lciA9ICd0bnMtaW5uZXInLFxyXG4gICAgICAgICAgaGFzR3V0dGVyID0gaGFzT3B0aW9uKCdndXR0ZXInKTtcclxuICBcclxuICAgICAgICBvdXRlcldyYXBwZXIuY2xhc3NOYW1lID0gY2xhc3NPdXRlcjtcclxuICAgICAgICBpbm5lcldyYXBwZXIuY2xhc3NOYW1lID0gY2xhc3NJbm5lcjtcclxuICAgICAgICBvdXRlcldyYXBwZXIuaWQgPSBzbGlkZUlkICsgJy1vdyc7XHJcbiAgICAgICAgaW5uZXJXcmFwcGVyLmlkID0gc2xpZGVJZCArICctaXcnO1xyXG4gIFxyXG4gICAgICAgIC8vIHNldCBjb250YWluZXIgcHJvcGVydGllc1xyXG4gICAgICAgIGlmIChjb250YWluZXIuaWQgPT09ICcnKSB7IGNvbnRhaW5lci5pZCA9IHNsaWRlSWQ7IH1cclxuICAgICAgICBuZXdDb250YWluZXJDbGFzc2VzICs9IFBFUkNFTlRBR0VMQVlPVVQgfHwgYXV0b1dpZHRoID8gJyB0bnMtc3VicGl4ZWwnIDogJyB0bnMtbm8tc3VicGl4ZWwnO1xyXG4gICAgICAgIG5ld0NvbnRhaW5lckNsYXNzZXMgKz0gQ0FMQyA/ICcgdG5zLWNhbGMnIDogJyB0bnMtbm8tY2FsYyc7XHJcbiAgICAgICAgaWYgKGF1dG9XaWR0aCkgeyBuZXdDb250YWluZXJDbGFzc2VzICs9ICcgdG5zLWF1dG93aWR0aCc7IH1cclxuICAgICAgICBuZXdDb250YWluZXJDbGFzc2VzICs9ICcgdG5zLScgKyBvcHRpb25zLmF4aXM7XHJcbiAgICAgICAgY29udGFpbmVyLmNsYXNzTmFtZSArPSBuZXdDb250YWluZXJDbGFzc2VzO1xyXG4gIFxyXG4gICAgICAgIC8vIGFkZCBjb25zdHJhaW4gbGF5ZXIgZm9yIGNhcm91c2VsXHJcbiAgICAgICAgaWYgKGNhcm91c2VsKSB7XHJcbiAgICAgICAgICBtaWRkbGVXcmFwcGVyID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgbWlkZGxlV3JhcHBlci5pZCA9IHNsaWRlSWQgKyAnLW13JztcclxuICAgICAgICAgIG1pZGRsZVdyYXBwZXIuY2xhc3NOYW1lID0gJ3Rucy1vdmgnO1xyXG4gIFxyXG4gICAgICAgICAgb3V0ZXJXcmFwcGVyLmFwcGVuZENoaWxkKG1pZGRsZVdyYXBwZXIpO1xyXG4gICAgICAgICAgbWlkZGxlV3JhcHBlci5hcHBlbmRDaGlsZChpbm5lcldyYXBwZXIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBvdXRlcldyYXBwZXIuYXBwZW5kQ2hpbGQoaW5uZXJXcmFwcGVyKTtcclxuICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgaWYgKGF1dG9IZWlnaHQpIHtcclxuICAgICAgICAgIHZhciB3cCA9IG1pZGRsZVdyYXBwZXIgPyBtaWRkbGVXcmFwcGVyIDogaW5uZXJXcmFwcGVyO1xyXG4gICAgICAgICAgd3AuY2xhc3NOYW1lICs9ICcgdG5zLWFoJztcclxuICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgY29udGFpbmVyUGFyZW50Lmluc2VydEJlZm9yZShvdXRlcldyYXBwZXIsIGNvbnRhaW5lcik7XHJcbiAgICAgICAgaW5uZXJXcmFwcGVyLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XHJcbiAgXHJcbiAgICAgICAgLy8gYWRkIGlkLCBjbGFzcywgYXJpYSBhdHRyaWJ1dGVzXHJcbiAgICAgICAgLy8gYmVmb3JlIGNsb25lIHNsaWRlc1xyXG4gICAgICAgIGZvckVhY2goc2xpZGVJdGVtcywgZnVuY3Rpb24oaXRlbSwgaSkge1xyXG4gICAgICAgICAgYWRkQ2xhc3MoaXRlbSwgJ3Rucy1pdGVtJyk7XHJcbiAgICAgICAgICBpZiAoIWl0ZW0uaWQpIHsgaXRlbS5pZCA9IHNsaWRlSWQgKyAnLWl0ZW0nICsgaTsgfVxyXG4gICAgICAgICAgaWYgKCFjYXJvdXNlbCAmJiBhbmltYXRlTm9ybWFsKSB7IGFkZENsYXNzKGl0ZW0sIGFuaW1hdGVOb3JtYWwpOyB9XHJcbiAgICAgICAgICBzZXRBdHRycyhpdGVtLCB7XHJcbiAgICAgICAgICAgICdhcmlhLWhpZGRlbic6ICd0cnVlJyxcclxuICAgICAgICAgICAgJ3RhYmluZGV4JzogJy0xJ1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgXHJcbiAgICAgICAgLy8gIyMgY2xvbmUgc2xpZGVzXHJcbiAgICAgICAgLy8gY2Fyb3VzZWw6IG4gKyBzbGlkZXMgKyBuXHJcbiAgICAgICAgLy8gZ2FsbGVyeTogICAgICBzbGlkZXMgKyBuXHJcbiAgICAgICAgaWYgKGNsb25lQ291bnQpIHtcclxuICAgICAgICAgIHZhciBmcmFnbWVudEJlZm9yZSA9IGRvYy5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCksXHJcbiAgICAgICAgICAgIGZyYWdtZW50QWZ0ZXIgPSBkb2MuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xyXG4gIFxyXG4gICAgICAgICAgZm9yICh2YXIgaiA9IGNsb25lQ291bnQ7IGotLTspIHtcclxuICAgICAgICAgICAgdmFyIG51bSA9IGolc2xpZGVDb3VudCxcclxuICAgICAgICAgICAgICBjbG9uZUZpcnN0ID0gc2xpZGVJdGVtc1tudW1dLmNsb25lTm9kZSh0cnVlKTtcclxuICAgICAgICAgICAgcmVtb3ZlQXR0cnMoY2xvbmVGaXJzdCwgJ2lkJyk7XHJcbiAgICAgICAgICAgIGZyYWdtZW50QWZ0ZXIuaW5zZXJ0QmVmb3JlKGNsb25lRmlyc3QsIGZyYWdtZW50QWZ0ZXIuZmlyc3RDaGlsZCk7XHJcbiAgXHJcbiAgICAgICAgICAgIGlmIChjYXJvdXNlbCkge1xyXG4gICAgICAgICAgICAgIHZhciBjbG9uZUxhc3QgPSBzbGlkZUl0ZW1zW3NsaWRlQ291bnQgLSAxIC0gbnVtXS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgcmVtb3ZlQXR0cnMoY2xvbmVMYXN0LCAnaWQnKTtcclxuICAgICAgICAgICAgICBmcmFnbWVudEJlZm9yZS5hcHBlbmRDaGlsZChjbG9uZUxhc3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgICBjb250YWluZXIuaW5zZXJ0QmVmb3JlKGZyYWdtZW50QmVmb3JlLCBjb250YWluZXIuZmlyc3RDaGlsZCk7XHJcbiAgICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZnJhZ21lbnRBZnRlcik7XHJcbiAgICAgICAgICBzbGlkZUl0ZW1zID0gY29udGFpbmVyLmNoaWxkcmVuO1xyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBmdW5jdGlvbiBpbml0U2xpZGVyVHJhbnNmb3JtICgpIHtcclxuICAgICAgICAvLyAjIyBpbWFnZXMgbG9hZGVkL2ZhaWxlZFxyXG4gICAgICAgIGlmIChoYXNPcHRpb24oJ2F1dG9IZWlnaHQnKSB8fCBhdXRvV2lkdGggfHwgIWhvcml6b250YWwpIHtcclxuICAgICAgICAgIHZhciBpbWdzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ2ltZycpO1xyXG4gIFxyXG4gICAgICAgICAgLy8gYWRkIGNvbXBsZXRlIGNsYXNzIGlmIGFsbCBpbWFnZXMgYXJlIGxvYWRlZC9mYWlsZWRcclxuICAgICAgICAgIGZvckVhY2goaW1ncywgZnVuY3Rpb24oaW1nKSB7XHJcbiAgICAgICAgICAgIHZhciBzcmMgPSBpbWcuc3JjO1xyXG4gIFxyXG4gICAgICAgICAgICBpZiAoc3JjICYmIHNyYy5pbmRleE9mKCdkYXRhOmltYWdlJykgPCAwKSB7XHJcbiAgICAgICAgICAgICAgYWRkRXZlbnRzKGltZywgaW1nRXZlbnRzKTtcclxuICAgICAgICAgICAgICBpbWcuc3JjID0gJyc7XHJcbiAgICAgICAgICAgICAgaW1nLnNyYyA9IHNyYztcclxuICAgICAgICAgICAgICBhZGRDbGFzcyhpbWcsICdsb2FkaW5nJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWxhenlsb2FkKSB7XHJcbiAgICAgICAgICAgICAgaW1nTG9hZGVkKGltZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gIFxyXG4gICAgICAgICAgLy8gQWxsIGltZ3MgYXJlIGNvbXBsZXRlZFxyXG4gICAgICAgICAgcmFmKGZ1bmN0aW9uKCl7IGltZ3NMb2FkZWRDaGVjayhhcnJheUZyb21Ob2RlTGlzdChpbWdzKSwgZnVuY3Rpb24oKSB7IGltZ3NDb21wbGV0ZSA9IHRydWU7IH0pOyB9KTtcclxuICBcclxuICAgICAgICAgIC8vIENoZWNrIGltZ3MgaW4gd2luZG93IG9ubHkgZm9yIGF1dG8gaGVpZ2h0XHJcbiAgICAgICAgICBpZiAoIWF1dG9XaWR0aCAmJiBob3Jpem9udGFsKSB7IGltZ3MgPSBnZXRJbWFnZUFycmF5KGluZGV4LCBNYXRoLm1pbihpbmRleCArIGl0ZW1zIC0gMSwgc2xpZGVDb3VudE5ldyAtIDEpKTsgfVxyXG4gIFxyXG4gICAgICAgICAgbGF6eWxvYWQgPyBpbml0U2xpZGVyVHJhbnNmb3JtU3R5bGVDaGVjaygpIDogcmFmKGZ1bmN0aW9uKCl7IGltZ3NMb2FkZWRDaGVjayhhcnJheUZyb21Ob2RlTGlzdChpbWdzKSwgaW5pdFNsaWRlclRyYW5zZm9ybVN0eWxlQ2hlY2spOyB9KTtcclxuICBcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy8gc2V0IGNvbnRhaW5lciB0cmFuc2Zvcm0gcHJvcGVydHlcclxuICAgICAgICAgIGlmIChjYXJvdXNlbCkgeyBkb0NvbnRhaW5lclRyYW5zZm9ybVNpbGVudCgpOyB9XHJcbiAgXHJcbiAgICAgICAgICAvLyB1cGRhdGUgc2xpZGVyIHRvb2xzIGFuZCBldmVudHNcclxuICAgICAgICAgIGluaXRUb29scygpO1xyXG4gICAgICAgICAgaW5pdEV2ZW50cygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBmdW5jdGlvbiBpbml0U2xpZGVyVHJhbnNmb3JtU3R5bGVDaGVjayAoKSB7XHJcbiAgICAgICAgaWYgKGF1dG9XaWR0aCkge1xyXG4gICAgICAgICAgLy8gY2hlY2sgc3R5bGVzIGFwcGxpY2F0aW9uXHJcbiAgICAgICAgICB2YXIgbnVtID0gbG9vcCA/IGluZGV4IDogc2xpZGVDb3VudCAtIDE7XHJcbiAgICAgICAgICAoZnVuY3Rpb24gc3R5bGVzQXBwbGljYXRpb25DaGVjaygpIHtcclxuICAgICAgICAgICAgc2xpZGVJdGVtc1tudW0gLSAxXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5yaWdodC50b0ZpeGVkKDIpID09PSBzbGlkZUl0ZW1zW251bV0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdC50b0ZpeGVkKDIpID9cclxuICAgICAgICAgICAgICBpbml0U2xpZGVyVHJhbnNmb3JtQ29yZSgpIDpcclxuICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7IHN0eWxlc0FwcGxpY2F0aW9uQ2hlY2soKTsgfSwgMTYpO1xyXG4gICAgICAgICAgfSkoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaW5pdFNsaWRlclRyYW5zZm9ybUNvcmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICBcclxuICBcclxuICAgICAgZnVuY3Rpb24gaW5pdFNsaWRlclRyYW5zZm9ybUNvcmUgKCkge1xyXG4gICAgICAgIC8vIHJ1biBGbigpcyB3aGljaCBhcmUgcmVseSBvbiBpbWFnZSBsb2FkaW5nXHJcbiAgICAgICAgaWYgKCFob3Jpem9udGFsIHx8IGF1dG9XaWR0aCkge1xyXG4gICAgICAgICAgc2V0U2xpZGVQb3NpdGlvbnMoKTtcclxuICBcclxuICAgICAgICAgIGlmIChhdXRvV2lkdGgpIHtcclxuICAgICAgICAgICAgcmlnaHRCb3VuZGFyeSA9IGdldFJpZ2h0Qm91bmRhcnkoKTtcclxuICAgICAgICAgICAgaWYgKGZyZWV6YWJsZSkgeyBmcmVlemUgPSBnZXRGcmVlemUoKTsgfVxyXG4gICAgICAgICAgICBpbmRleE1heCA9IGdldEluZGV4TWF4KCk7IC8vIDw9IHNsaWRlUG9zaXRpb25zLCByaWdodEJvdW5kYXJ5IDw9XHJcbiAgICAgICAgICAgIHJlc2V0VmFyaWJsZXNXaGVuRGlzYWJsZShkaXNhYmxlIHx8IGZyZWV6ZSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB1cGRhdGVDb250ZW50V3JhcHBlckhlaWdodCgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICAvLyBzZXQgY29udGFpbmVyIHRyYW5zZm9ybSBwcm9wZXJ0eVxyXG4gICAgICAgIGlmIChjYXJvdXNlbCkgeyBkb0NvbnRhaW5lclRyYW5zZm9ybVNpbGVudCgpOyB9XHJcbiAgXHJcbiAgICAgICAgLy8gdXBkYXRlIHNsaWRlciB0b29scyBhbmQgZXZlbnRzXHJcbiAgICAgICAgaW5pdFRvb2xzKCk7XHJcbiAgICAgICAgaW5pdEV2ZW50cygpO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIGZ1bmN0aW9uIGluaXRTaGVldCAoKSB7XHJcbiAgICAgICAgLy8gZ2FsbGVyeTpcclxuICAgICAgICAvLyBzZXQgYW5pbWF0aW9uIGNsYXNzZXMgYW5kIGxlZnQgdmFsdWUgZm9yIGdhbGxlcnkgc2xpZGVyXHJcbiAgICAgICAgaWYgKCFjYXJvdXNlbCkge1xyXG4gICAgICAgICAgZm9yICh2YXIgaSA9IGluZGV4LCBsID0gaW5kZXggKyBNYXRoLm1pbihzbGlkZUNvdW50LCBpdGVtcyk7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSBzbGlkZUl0ZW1zW2ldO1xyXG4gICAgICAgICAgICBpdGVtLnN0eWxlLmxlZnQgPSAoaSAtIGluZGV4KSAqIDEwMCAvIGl0ZW1zICsgJyUnO1xyXG4gICAgICAgICAgICBhZGRDbGFzcyhpdGVtLCBhbmltYXRlSW4pO1xyXG4gICAgICAgICAgICByZW1vdmVDbGFzcyhpdGVtLCBhbmltYXRlTm9ybWFsKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgLy8gIyMjIyBMQVlPVVRcclxuICBcclxuICAgICAgICAvLyAjIyBJTkxJTkUtQkxPQ0sgVlMgRkxPQVRcclxuICBcclxuICAgICAgICAvLyAjIyBQZXJjZW50YWdlTGF5b3V0OlxyXG4gICAgICAgIC8vIHNsaWRlczogaW5saW5lLWJsb2NrXHJcbiAgICAgICAgLy8gcmVtb3ZlIGJsYW5rIHNwYWNlIGJldHdlZW4gc2xpZGVzIGJ5IHNldCBmb250LXNpemU6IDBcclxuICBcclxuICAgICAgICAvLyAjIyBOb24gUGVyY2VudGFnZUxheW91dDpcclxuICAgICAgICAvLyBzbGlkZXM6IGZsb2F0XHJcbiAgICAgICAgLy8gICAgICAgICBtYXJnaW4tcmlnaHQ6IC0xMDAlXHJcbiAgICAgICAgLy8gICAgICAgICBtYXJnaW4tbGVmdDogflxyXG4gIFxyXG4gICAgICAgIC8vIFJlc291cmNlOiBodHRwczovL2RvY3MuZ29vZ2xlLmNvbS9zcHJlYWRzaGVldHMvZC8xNDd1cDI0NXd3VFhlUVl2ZTNCUlNBRDRvVmN2UW11R3NGdGVKT2VBNXhOUS9lZGl0P3VzcD1zaGFyaW5nXHJcbiAgICAgICAgaWYgKGhvcml6b250YWwpIHtcclxuICAgICAgICAgIGlmIChQRVJDRU5UQUdFTEFZT1VUIHx8IGF1dG9XaWR0aCkge1xyXG4gICAgICAgICAgICBhZGRDU1NSdWxlKHNoZWV0LCAnIycgKyBzbGlkZUlkICsgJyA+IC50bnMtaXRlbScsICdmb250LXNpemU6JyArIHdpbi5nZXRDb21wdXRlZFN0eWxlKHNsaWRlSXRlbXNbMF0pLmZvbnRTaXplICsgJzsnLCBnZXRDc3NSdWxlc0xlbmd0aChzaGVldCkpO1xyXG4gICAgICAgICAgICBhZGRDU1NSdWxlKHNoZWV0LCAnIycgKyBzbGlkZUlkLCAnZm9udC1zaXplOjA7JywgZ2V0Q3NzUnVsZXNMZW5ndGgoc2hlZXQpKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoY2Fyb3VzZWwpIHtcclxuICAgICAgICAgICAgZm9yRWFjaChzbGlkZUl0ZW1zLCBmdW5jdGlvbiAoc2xpZGUsIGkpIHtcclxuICAgICAgICAgICAgICBzbGlkZS5zdHlsZS5tYXJnaW5MZWZ0ID0gZ2V0U2xpZGVNYXJnaW5MZWZ0KGkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgXHJcbiAgXHJcbiAgICAgICAgLy8gIyMgQkFTSUMgU1RZTEVTXHJcbiAgICAgICAgaWYgKENTU01RKSB7XHJcbiAgICAgICAgICAvLyBtaWRkbGUgd3JhcHBlciBzdHlsZVxyXG4gICAgICAgICAgaWYgKFRSQU5TSVRJT05EVVJBVElPTikge1xyXG4gICAgICAgICAgICB2YXIgc3RyID0gbWlkZGxlV3JhcHBlciAmJiBvcHRpb25zLmF1dG9IZWlnaHQgPyBnZXRUcmFuc2l0aW9uRHVyYXRpb25TdHlsZShvcHRpb25zLnNwZWVkKSA6ICcnO1xyXG4gICAgICAgICAgICBhZGRDU1NSdWxlKHNoZWV0LCAnIycgKyBzbGlkZUlkICsgJy1tdycsIHN0ciwgZ2V0Q3NzUnVsZXNMZW5ndGgoc2hlZXQpKTtcclxuICAgICAgICAgIH1cclxuICBcclxuICAgICAgICAgIC8vIGlubmVyIHdyYXBwZXIgc3R5bGVzXHJcbiAgICAgICAgICBzdHIgPSBnZXRJbm5lcldyYXBwZXJTdHlsZXMob3B0aW9ucy5lZGdlUGFkZGluZywgb3B0aW9ucy5ndXR0ZXIsIG9wdGlvbnMuZml4ZWRXaWR0aCwgb3B0aW9ucy5zcGVlZCwgb3B0aW9ucy5hdXRvSGVpZ2h0KTtcclxuICAgICAgICAgIGFkZENTU1J1bGUoc2hlZXQsICcjJyArIHNsaWRlSWQgKyAnLWl3Jywgc3RyLCBnZXRDc3NSdWxlc0xlbmd0aChzaGVldCkpO1xyXG4gIFxyXG4gICAgICAgICAgLy8gY29udGFpbmVyIHN0eWxlc1xyXG4gICAgICAgICAgaWYgKGNhcm91c2VsKSB7XHJcbiAgICAgICAgICAgIHN0ciA9IGhvcml6b250YWwgJiYgIWF1dG9XaWR0aCA/ICd3aWR0aDonICsgZ2V0Q29udGFpbmVyV2lkdGgob3B0aW9ucy5maXhlZFdpZHRoLCBvcHRpb25zLmd1dHRlciwgb3B0aW9ucy5pdGVtcykgKyAnOycgOiAnJztcclxuICAgICAgICAgICAgaWYgKFRSQU5TSVRJT05EVVJBVElPTikgeyBzdHIgKz0gZ2V0VHJhbnNpdGlvbkR1cmF0aW9uU3R5bGUoc3BlZWQpOyB9XHJcbiAgICAgICAgICAgIGFkZENTU1J1bGUoc2hlZXQsICcjJyArIHNsaWRlSWQsIHN0ciwgZ2V0Q3NzUnVsZXNMZW5ndGgoc2hlZXQpKTtcclxuICAgICAgICAgIH1cclxuICBcclxuICAgICAgICAgIC8vIHNsaWRlIHN0eWxlc1xyXG4gICAgICAgICAgc3RyID0gaG9yaXpvbnRhbCAmJiAhYXV0b1dpZHRoID8gZ2V0U2xpZGVXaWR0aFN0eWxlKG9wdGlvbnMuZml4ZWRXaWR0aCwgb3B0aW9ucy5ndXR0ZXIsIG9wdGlvbnMuaXRlbXMpIDogJyc7XHJcbiAgICAgICAgICBpZiAob3B0aW9ucy5ndXR0ZXIpIHsgc3RyICs9IGdldFNsaWRlR3V0dGVyU3R5bGUob3B0aW9ucy5ndXR0ZXIpOyB9XHJcbiAgICAgICAgICAvLyBzZXQgZ2FsbGVyeSBpdGVtcyB0cmFuc2l0aW9uLWR1cmF0aW9uXHJcbiAgICAgICAgICBpZiAoIWNhcm91c2VsKSB7XHJcbiAgICAgICAgICAgIGlmIChUUkFOU0lUSU9ORFVSQVRJT04pIHsgc3RyICs9IGdldFRyYW5zaXRpb25EdXJhdGlvblN0eWxlKHNwZWVkKTsgfVxyXG4gICAgICAgICAgICBpZiAoQU5JTUFUSU9ORFVSQVRJT04pIHsgc3RyICs9IGdldEFuaW1hdGlvbkR1cmF0aW9uU3R5bGUoc3BlZWQpOyB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoc3RyKSB7IGFkZENTU1J1bGUoc2hlZXQsICcjJyArIHNsaWRlSWQgKyAnID4gLnRucy1pdGVtJywgc3RyLCBnZXRDc3NSdWxlc0xlbmd0aChzaGVldCkpOyB9XHJcbiAgXHJcbiAgICAgICAgICAvLyBub24gQ1NTIG1lZGlhcXVlcmllczogSUU4XHJcbiAgICAgICAgICAvLyAjIyB1cGRhdGUgaW5uZXIgd3JhcHBlciwgY29udGFpbmVyLCBzbGlkZXMgaWYgbmVlZGVkXHJcbiAgICAgICAgICAvLyBzZXQgaW5saW5lIHN0eWxlcyBmb3IgaW5uZXIgd3JhcHBlciAmIGNvbnRhaW5lclxyXG4gICAgICAgICAgLy8gaW5zZXJ0IHN0eWxlc2hlZXQgKG9uZSBsaW5lKSBmb3Igc2xpZGVzIG9ubHkgKHNpbmNlIHNsaWRlcyBhcmUgbWFueSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy8gbWlkZGxlIHdyYXBwZXIgc3R5bGVzXHJcbiAgICAgICAgICB1cGRhdGVfY2Fyb3VzZWxfdHJhbnNpdGlvbl9kdXJhdGlvbigpO1xyXG4gIFxyXG4gICAgICAgICAgLy8gaW5uZXIgd3JhcHBlciBzdHlsZXNcclxuICAgICAgICAgIGlubmVyV3JhcHBlci5zdHlsZS5jc3NUZXh0ID0gZ2V0SW5uZXJXcmFwcGVyU3R5bGVzKGVkZ2VQYWRkaW5nLCBndXR0ZXIsIGZpeGVkV2lkdGgsIGF1dG9IZWlnaHQpO1xyXG4gIFxyXG4gICAgICAgICAgLy8gY29udGFpbmVyIHN0eWxlc1xyXG4gICAgICAgICAgaWYgKGNhcm91c2VsICYmIGhvcml6b250YWwgJiYgIWF1dG9XaWR0aCkge1xyXG4gICAgICAgICAgICBjb250YWluZXIuc3R5bGUud2lkdGggPSBnZXRDb250YWluZXJXaWR0aChmaXhlZFdpZHRoLCBndXR0ZXIsIGl0ZW1zKTtcclxuICAgICAgICAgIH1cclxuICBcclxuICAgICAgICAgIC8vIHNsaWRlIHN0eWxlc1xyXG4gICAgICAgICAgdmFyIHN0ciA9IGhvcml6b250YWwgJiYgIWF1dG9XaWR0aCA/IGdldFNsaWRlV2lkdGhTdHlsZShmaXhlZFdpZHRoLCBndXR0ZXIsIGl0ZW1zKSA6ICcnO1xyXG4gICAgICAgICAgaWYgKGd1dHRlcikgeyBzdHIgKz0gZ2V0U2xpZGVHdXR0ZXJTdHlsZShndXR0ZXIpOyB9XHJcbiAgXHJcbiAgICAgICAgICAvLyBhcHBlbmQgdG8gdGhlIGxhc3QgbGluZVxyXG4gICAgICAgICAgaWYgKHN0cikgeyBhZGRDU1NSdWxlKHNoZWV0LCAnIycgKyBzbGlkZUlkICsgJyA+IC50bnMtaXRlbScsIHN0ciwgZ2V0Q3NzUnVsZXNMZW5ndGgoc2hlZXQpKTsgfVxyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICAvLyAjIyBNRURJQVFVRVJJRVNcclxuICAgICAgICBpZiAocmVzcG9uc2l2ZSAmJiBDU1NNUSkge1xyXG4gICAgICAgICAgZm9yICh2YXIgYnAgaW4gcmVzcG9uc2l2ZSkge1xyXG4gICAgICAgICAgICAvLyBicDogY29udmVydCBzdHJpbmcgdG8gbnVtYmVyXHJcbiAgICAgICAgICAgIGJwID0gcGFyc2VJbnQoYnApO1xyXG4gIFxyXG4gICAgICAgICAgICB2YXIgb3B0cyA9IHJlc3BvbnNpdmVbYnBdLFxyXG4gICAgICAgICAgICAgIHN0ciA9ICcnLFxyXG4gICAgICAgICAgICAgIG1pZGRsZVdyYXBwZXJTdHIgPSAnJyxcclxuICAgICAgICAgICAgICBpbm5lcldyYXBwZXJTdHIgPSAnJyxcclxuICAgICAgICAgICAgICBjb250YWluZXJTdHIgPSAnJyxcclxuICAgICAgICAgICAgICBzbGlkZVN0ciA9ICcnLFxyXG4gICAgICAgICAgICAgIGl0ZW1zQlAgPSAhYXV0b1dpZHRoID8gZ2V0T3B0aW9uKCdpdGVtcycsIGJwKSA6IG51bGwsXHJcbiAgICAgICAgICAgICAgZml4ZWRXaWR0aEJQID0gZ2V0T3B0aW9uKCdmaXhlZFdpZHRoJywgYnApLFxyXG4gICAgICAgICAgICAgIHNwZWVkQlAgPSBnZXRPcHRpb24oJ3NwZWVkJywgYnApLFxyXG4gICAgICAgICAgICAgIGVkZ2VQYWRkaW5nQlAgPSBnZXRPcHRpb24oJ2VkZ2VQYWRkaW5nJywgYnApLFxyXG4gICAgICAgICAgICAgIGF1dG9IZWlnaHRCUCA9IGdldE9wdGlvbignYXV0b0hlaWdodCcsIGJwKSxcclxuICAgICAgICAgICAgICBndXR0ZXJCUCA9IGdldE9wdGlvbignZ3V0dGVyJywgYnApO1xyXG4gIFxyXG4gICAgICAgICAgICAvLyBtaWRkbGUgd3JhcHBlciBzdHJpbmdcclxuICAgICAgICAgICAgaWYgKFRSQU5TSVRJT05EVVJBVElPTiAmJiBtaWRkbGVXcmFwcGVyICYmIGdldE9wdGlvbignYXV0b0hlaWdodCcsIGJwKSAmJiAnc3BlZWQnIGluIG9wdHMpIHtcclxuICAgICAgICAgICAgICBtaWRkbGVXcmFwcGVyU3RyID0gJyMnICsgc2xpZGVJZCArICctbXd7JyArIGdldFRyYW5zaXRpb25EdXJhdGlvblN0eWxlKHNwZWVkQlApICsgJ30nO1xyXG4gICAgICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgICAgIC8vIGlubmVyIHdyYXBwZXIgc3RyaW5nXHJcbiAgICAgICAgICAgIGlmICgnZWRnZVBhZGRpbmcnIGluIG9wdHMgfHwgJ2d1dHRlcicgaW4gb3B0cykge1xyXG4gICAgICAgICAgICAgIGlubmVyV3JhcHBlclN0ciA9ICcjJyArIHNsaWRlSWQgKyAnLWl3eycgKyBnZXRJbm5lcldyYXBwZXJTdHlsZXMoZWRnZVBhZGRpbmdCUCwgZ3V0dGVyQlAsIGZpeGVkV2lkdGhCUCwgc3BlZWRCUCwgYXV0b0hlaWdodEJQKSArICd9JztcclxuICAgICAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgICAgICAvLyBjb250YWluZXIgc3RyaW5nXHJcbiAgICAgICAgICAgIGlmIChjYXJvdXNlbCAmJiBob3Jpem9udGFsICYmICFhdXRvV2lkdGggJiYgKCdmaXhlZFdpZHRoJyBpbiBvcHRzIHx8ICdpdGVtcycgaW4gb3B0cyB8fCAoZml4ZWRXaWR0aCAmJiAnZ3V0dGVyJyBpbiBvcHRzKSkpIHtcclxuICAgICAgICAgICAgICBjb250YWluZXJTdHIgPSAnd2lkdGg6JyArIGdldENvbnRhaW5lcldpZHRoKGZpeGVkV2lkdGhCUCwgZ3V0dGVyQlAsIGl0ZW1zQlApICsgJzsnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChUUkFOU0lUSU9ORFVSQVRJT04gJiYgJ3NwZWVkJyBpbiBvcHRzKSB7XHJcbiAgICAgICAgICAgICAgY29udGFpbmVyU3RyICs9IGdldFRyYW5zaXRpb25EdXJhdGlvblN0eWxlKHNwZWVkQlApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjb250YWluZXJTdHIpIHtcclxuICAgICAgICAgICAgICBjb250YWluZXJTdHIgPSAnIycgKyBzbGlkZUlkICsgJ3snICsgY29udGFpbmVyU3RyICsgJ30nO1xyXG4gICAgICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgICAgIC8vIHNsaWRlIHN0cmluZ1xyXG4gICAgICAgICAgICBpZiAoJ2ZpeGVkV2lkdGgnIGluIG9wdHMgfHwgKGZpeGVkV2lkdGggJiYgJ2d1dHRlcicgaW4gb3B0cykgfHwgIWNhcm91c2VsICYmICdpdGVtcycgaW4gb3B0cykge1xyXG4gICAgICAgICAgICAgIHNsaWRlU3RyICs9IGdldFNsaWRlV2lkdGhTdHlsZShmaXhlZFdpZHRoQlAsIGd1dHRlckJQLCBpdGVtc0JQKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoJ2d1dHRlcicgaW4gb3B0cykge1xyXG4gICAgICAgICAgICAgIHNsaWRlU3RyICs9IGdldFNsaWRlR3V0dGVyU3R5bGUoZ3V0dGVyQlApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIHNldCBnYWxsZXJ5IGl0ZW1zIHRyYW5zaXRpb24tZHVyYXRpb25cclxuICAgICAgICAgICAgaWYgKCFjYXJvdXNlbCAmJiAnc3BlZWQnIGluIG9wdHMpIHtcclxuICAgICAgICAgICAgICBpZiAoVFJBTlNJVElPTkRVUkFUSU9OKSB7IHNsaWRlU3RyICs9IGdldFRyYW5zaXRpb25EdXJhdGlvblN0eWxlKHNwZWVkQlApOyB9XHJcbiAgICAgICAgICAgICAgaWYgKEFOSU1BVElPTkRVUkFUSU9OKSB7IHNsaWRlU3RyICs9IGdldEFuaW1hdGlvbkR1cmF0aW9uU3R5bGUoc3BlZWRCUCk7IH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoc2xpZGVTdHIpIHsgc2xpZGVTdHIgPSAnIycgKyBzbGlkZUlkICsgJyA+IC50bnMtaXRlbXsnICsgc2xpZGVTdHIgKyAnfSc7IH1cclxuICBcclxuICAgICAgICAgICAgLy8gYWRkIHVwXHJcbiAgICAgICAgICAgIHN0ciA9IG1pZGRsZVdyYXBwZXJTdHIgKyBpbm5lcldyYXBwZXJTdHIgKyBjb250YWluZXJTdHIgKyBzbGlkZVN0cjtcclxuICBcclxuICAgICAgICAgICAgaWYgKHN0cikge1xyXG4gICAgICAgICAgICAgIHNoZWV0Lmluc2VydFJ1bGUoJ0BtZWRpYSAobWluLXdpZHRoOiAnICsgYnAgLyAxNiArICdlbSkgeycgKyBzdHIgKyAnfScsIHNoZWV0LmNzc1J1bGVzLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgZnVuY3Rpb24gaW5pdFRvb2xzICgpIHtcclxuICAgICAgICAvLyA9PSBzbGlkZXMgPT1cclxuICAgICAgICB1cGRhdGVTbGlkZVN0YXR1cygpO1xyXG4gIFxyXG4gICAgICAgIC8vID09IGxpdmUgcmVnaW9uID09XHJcbiAgICAgICAgb3V0ZXJXcmFwcGVyLmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJiZWdpbicsICc8ZGl2IGNsYXNzPVwidG5zLWxpdmVyZWdpb24gdG5zLXZpc3VhbGx5LWhpZGRlblwiIGFyaWEtbGl2ZT1cInBvbGl0ZVwiIGFyaWEtYXRvbWljPVwidHJ1ZVwiPnNsaWRlIDxzcGFuIGNsYXNzPVwiY3VycmVudFwiPicgKyBnZXRMaXZlUmVnaW9uU3RyKCkgKyAnPC9zcGFuPiAgb2YgJyArIHNsaWRlQ291bnQgKyAnPC9kaXY+Jyk7XHJcbiAgICAgICAgbGl2ZXJlZ2lvbkN1cnJlbnQgPSBvdXRlcldyYXBwZXIucXVlcnlTZWxlY3RvcignLnRucy1saXZlcmVnaW9uIC5jdXJyZW50Jyk7XHJcbiAgXHJcbiAgICAgICAgLy8gPT0gYXV0b3BsYXlJbml0ID09XHJcbiAgICAgICAgaWYgKGhhc0F1dG9wbGF5KSB7XHJcbiAgICAgICAgICB2YXIgdHh0ID0gYXV0b3BsYXkgPyAnc3RvcCcgOiAnc3RhcnQnO1xyXG4gICAgICAgICAgaWYgKGF1dG9wbGF5QnV0dG9uKSB7XHJcbiAgICAgICAgICAgIHNldEF0dHJzKGF1dG9wbGF5QnV0dG9uLCB7J2RhdGEtYWN0aW9uJzogdHh0fSk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMuYXV0b3BsYXlCdXR0b25PdXRwdXQpIHtcclxuICAgICAgICAgICAgb3V0ZXJXcmFwcGVyLmluc2VydEFkamFjZW50SFRNTChnZXRJbnNlcnRQb3NpdGlvbihvcHRpb25zLmF1dG9wbGF5UG9zaXRpb24pLCAnPGJ1dHRvbiBkYXRhLWFjdGlvbj1cIicgKyB0eHQgKyAnXCI+JyArIGF1dG9wbGF5SHRtbFN0cmluZ3NbMF0gKyB0eHQgKyBhdXRvcGxheUh0bWxTdHJpbmdzWzFdICsgYXV0b3BsYXlUZXh0WzBdICsgJzwvYnV0dG9uPicpO1xyXG4gICAgICAgICAgICBhdXRvcGxheUJ1dHRvbiA9IG91dGVyV3JhcHBlci5xdWVyeVNlbGVjdG9yKCdbZGF0YS1hY3Rpb25dJyk7XHJcbiAgICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgICAvLyBhZGQgZXZlbnRcclxuICAgICAgICAgIGlmIChhdXRvcGxheUJ1dHRvbikge1xyXG4gICAgICAgICAgICBhZGRFdmVudHMoYXV0b3BsYXlCdXR0b24sIHsnY2xpY2snOiB0b2dnbGVBdXRvcGxheX0pO1xyXG4gICAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgICAgaWYgKGF1dG9wbGF5KSB7XHJcbiAgICAgICAgICAgIHN0YXJ0QXV0b3BsYXkoKTtcclxuICAgICAgICAgICAgaWYgKGF1dG9wbGF5SG92ZXJQYXVzZSkgeyBhZGRFdmVudHMoY29udGFpbmVyLCBob3ZlckV2ZW50cyk7IH1cclxuICAgICAgICAgICAgaWYgKGF1dG9wbGF5UmVzZXRPblZpc2liaWxpdHkpIHsgYWRkRXZlbnRzKGNvbnRhaW5lciwgdmlzaWJpbGl0eUV2ZW50KTsgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICAvLyA9PSBuYXZJbml0ID09XHJcbiAgICAgICAgaWYgKGhhc05hdikge1xyXG4gICAgICAgICAgdmFyIGluaXRJbmRleCA9ICFjYXJvdXNlbCA/IDAgOiBjbG9uZUNvdW50O1xyXG4gICAgICAgICAgLy8gY3VzdG9taXplZCBuYXZcclxuICAgICAgICAgIC8vIHdpbGwgbm90IGhpZGUgdGhlIG5hdnMgaW4gY2FzZSB0aGV5J3JlIHRodW1ibmFpbHNcclxuICAgICAgICAgIGlmIChuYXZDb250YWluZXIpIHtcclxuICAgICAgICAgICAgc2V0QXR0cnMobmF2Q29udGFpbmVyLCB7J2FyaWEtbGFiZWwnOiAnQ2Fyb3VzZWwgUGFnaW5hdGlvbid9KTtcclxuICAgICAgICAgICAgbmF2SXRlbXMgPSBuYXZDb250YWluZXIuY2hpbGRyZW47XHJcbiAgICAgICAgICAgIGZvckVhY2gobmF2SXRlbXMsIGZ1bmN0aW9uKGl0ZW0sIGkpIHtcclxuICAgICAgICAgICAgICBzZXRBdHRycyhpdGVtLCB7XHJcbiAgICAgICAgICAgICAgICAnZGF0YS1uYXYnOiBpLFxyXG4gICAgICAgICAgICAgICAgJ3RhYmluZGV4JzogJy0xJyxcclxuICAgICAgICAgICAgICAgICdhcmlhLWxhYmVsJzogbmF2U3RyICsgKGkgKyAxKSxcclxuICAgICAgICAgICAgICAgICdhcmlhLWNvbnRyb2xzJzogc2xpZGVJZCxcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgXHJcbiAgICAgICAgICAgIC8vIGdlbmVyYXRlZCBuYXZcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBuYXZIdG1sID0gJycsXHJcbiAgICAgICAgICAgICAgaGlkZGVuU3RyID0gbmF2QXNUaHVtYm5haWxzID8gJycgOiAnc3R5bGU9XCJkaXNwbGF5Om5vbmVcIic7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpZGVDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgLy8gaGlkZSBuYXYgaXRlbXMgYnkgZGVmYXVsdFxyXG4gICAgICAgICAgICAgIG5hdkh0bWwgKz0gJzxidXR0b24gZGF0YS1uYXY9XCInICsgaSArJ1wiIHRhYmluZGV4PVwiLTFcIiBhcmlhLWNvbnRyb2xzPVwiJyArIHNsaWRlSWQgKyAnXCIgJyArIGhpZGRlblN0ciArICcgYXJpYS1sYWJlbD1cIicgKyBuYXZTdHIgKyAoaSArIDEpICsnXCI+PC9idXR0b24+JztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBuYXZIdG1sID0gJzxkaXYgY2xhc3M9XCJ0bnMtbmF2XCIgYXJpYS1sYWJlbD1cIkNhcm91c2VsIFBhZ2luYXRpb25cIj4nICsgbmF2SHRtbCArICc8L2Rpdj4nO1xyXG4gICAgICAgICAgICBvdXRlcldyYXBwZXIuaW5zZXJ0QWRqYWNlbnRIVE1MKGdldEluc2VydFBvc2l0aW9uKG9wdGlvbnMubmF2UG9zaXRpb24pLCBuYXZIdG1sKTtcclxuICBcclxuICAgICAgICAgICAgbmF2Q29udGFpbmVyID0gb3V0ZXJXcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJy50bnMtbmF2Jyk7XHJcbiAgICAgICAgICAgIG5hdkl0ZW1zID0gbmF2Q29udGFpbmVyLmNoaWxkcmVuO1xyXG4gICAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgICAgdXBkYXRlTmF2VmlzaWJpbGl0eSgpO1xyXG4gIFxyXG4gICAgICAgICAgLy8gYWRkIHRyYW5zaXRpb25cclxuICAgICAgICAgIGlmIChUUkFOU0lUSU9ORFVSQVRJT04pIHtcclxuICAgICAgICAgICAgdmFyIHByZWZpeCA9IFRSQU5TSVRJT05EVVJBVElPTi5zdWJzdHJpbmcoMCwgVFJBTlNJVElPTkRVUkFUSU9OLmxlbmd0aCAtIDE4KS50b0xvd2VyQ2FzZSgpLFxyXG4gICAgICAgICAgICAgIHN0ciA9ICd0cmFuc2l0aW9uOiBhbGwgJyArIHNwZWVkIC8gMTAwMCArICdzJztcclxuICBcclxuICAgICAgICAgICAgaWYgKHByZWZpeCkge1xyXG4gICAgICAgICAgICAgIHN0ciA9ICctJyArIHByZWZpeCArICctJyArIHN0cjtcclxuICAgICAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgICAgICBhZGRDU1NSdWxlKHNoZWV0LCAnW2FyaWEtY29udHJvbHNePScgKyBzbGlkZUlkICsgJy1pdGVtXScsIHN0ciwgZ2V0Q3NzUnVsZXNMZW5ndGgoc2hlZXQpKTtcclxuICAgICAgICAgIH1cclxuICBcclxuICAgICAgICAgIHNldEF0dHJzKG5hdkl0ZW1zW25hdkN1cnJlbnRJbmRleF0sIHsnYXJpYS1sYWJlbCc6IG5hdlN0ciArIChuYXZDdXJyZW50SW5kZXggKyAxKSArIG5hdlN0ckN1cnJlbnR9KTtcclxuICAgICAgICAgIHJlbW92ZUF0dHJzKG5hdkl0ZW1zW25hdkN1cnJlbnRJbmRleF0sICd0YWJpbmRleCcpO1xyXG4gICAgICAgICAgYWRkQ2xhc3MobmF2SXRlbXNbbmF2Q3VycmVudEluZGV4XSwgbmF2QWN0aXZlQ2xhc3MpO1xyXG4gIFxyXG4gICAgICAgICAgLy8gYWRkIGV2ZW50c1xyXG4gICAgICAgICAgYWRkRXZlbnRzKG5hdkNvbnRhaW5lciwgbmF2RXZlbnRzKTtcclxuICAgICAgICB9XHJcbiAgXHJcbiAgXHJcbiAgXHJcbiAgICAgICAgLy8gPT0gY29udHJvbHNJbml0ID09XHJcbiAgICAgICAgaWYgKGhhc0NvbnRyb2xzKSB7XHJcbiAgICAgICAgICBpZiAoIWNvbnRyb2xzQ29udGFpbmVyICYmICghcHJldkJ1dHRvbiB8fCAhbmV4dEJ1dHRvbikpIHtcclxuICAgICAgICAgICAgb3V0ZXJXcmFwcGVyLmluc2VydEFkamFjZW50SFRNTChnZXRJbnNlcnRQb3NpdGlvbihvcHRpb25zLmNvbnRyb2xzUG9zaXRpb24pLCAnPGRpdiBjbGFzcz1cInRucy1jb250cm9sc1wiIGFyaWEtbGFiZWw9XCJDYXJvdXNlbCBOYXZpZ2F0aW9uXCIgdGFiaW5kZXg9XCIwXCI+PGJ1dHRvbiBkYXRhLWNvbnRyb2xzPVwicHJldlwiIGFyaWEtbGFiZWw9XCJwcmV2IHNsaWRlXCIgdGFiaW5kZXg9XCItMVwiIGFyaWEtY29udHJvbHM9XCInICsgc2xpZGVJZCArJ1wiPicgKyBjb250cm9sc1RleHRbMF0gKyAnPC9idXR0b24+PGJ1dHRvbiBkYXRhLWNvbnRyb2xzPVwibmV4dFwiIGFyaWEtbGFiZWw9XCJuZXh0IHNsaWRlXCIgdGFiaW5kZXg9XCItMVwiIGFyaWEtY29udHJvbHM9XCInICsgc2xpZGVJZCArJ1wiPicgKyBjb250cm9sc1RleHRbMV0gKyAnPC9idXR0b24+PC9kaXY+Jyk7XHJcbiAgXHJcbiAgICAgICAgICAgIGNvbnRyb2xzQ29udGFpbmVyID0gb3V0ZXJXcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJy50bnMtY29udHJvbHMnKTtcclxuICAgICAgICAgIH1cclxuICBcclxuICAgICAgICAgIGlmICghcHJldkJ1dHRvbiB8fCAhbmV4dEJ1dHRvbikge1xyXG4gICAgICAgICAgICBwcmV2QnV0dG9uID0gY29udHJvbHNDb250YWluZXIuY2hpbGRyZW5bMF07XHJcbiAgICAgICAgICAgIG5leHRCdXR0b24gPSBjb250cm9sc0NvbnRhaW5lci5jaGlsZHJlblsxXTtcclxuICAgICAgICAgIH1cclxuICBcclxuICAgICAgICAgIGlmIChvcHRpb25zLmNvbnRyb2xzQ29udGFpbmVyKSB7XHJcbiAgICAgICAgICAgIHNldEF0dHJzKGNvbnRyb2xzQ29udGFpbmVyLCB7XHJcbiAgICAgICAgICAgICAgJ2FyaWEtbGFiZWwnOiAnQ2Fyb3VzZWwgTmF2aWdhdGlvbicsXHJcbiAgICAgICAgICAgICAgJ3RhYmluZGV4JzogJzAnXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgICAgaWYgKG9wdGlvbnMuY29udHJvbHNDb250YWluZXIgfHwgKG9wdGlvbnMucHJldkJ1dHRvbiAmJiBvcHRpb25zLm5leHRCdXR0b24pKSB7XHJcbiAgICAgICAgICAgIHNldEF0dHJzKFtwcmV2QnV0dG9uLCBuZXh0QnV0dG9uXSwge1xyXG4gICAgICAgICAgICAgICdhcmlhLWNvbnRyb2xzJzogc2xpZGVJZCxcclxuICAgICAgICAgICAgICAndGFiaW5kZXgnOiAnLTEnLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICBcclxuICAgICAgICAgIGlmIChvcHRpb25zLmNvbnRyb2xzQ29udGFpbmVyIHx8IChvcHRpb25zLnByZXZCdXR0b24gJiYgb3B0aW9ucy5uZXh0QnV0dG9uKSkge1xyXG4gICAgICAgICAgICBzZXRBdHRycyhwcmV2QnV0dG9uLCB7J2RhdGEtY29udHJvbHMnIDogJ3ByZXYnfSk7XHJcbiAgICAgICAgICAgIHNldEF0dHJzKG5leHRCdXR0b24sIHsnZGF0YS1jb250cm9scycgOiAnbmV4dCd9KTtcclxuICAgICAgICAgIH1cclxuICBcclxuICAgICAgICAgIHByZXZJc0J1dHRvbiA9IGlzQnV0dG9uKHByZXZCdXR0b24pO1xyXG4gICAgICAgICAgbmV4dElzQnV0dG9uID0gaXNCdXR0b24obmV4dEJ1dHRvbik7XHJcbiAgXHJcbiAgICAgICAgICB1cGRhdGVDb250cm9sc1N0YXR1cygpO1xyXG4gIFxyXG4gICAgICAgICAgLy8gYWRkIGV2ZW50c1xyXG4gICAgICAgICAgaWYgKGNvbnRyb2xzQ29udGFpbmVyKSB7XHJcbiAgICAgICAgICAgIGFkZEV2ZW50cyhjb250cm9sc0NvbnRhaW5lciwgY29udHJvbHNFdmVudHMpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYWRkRXZlbnRzKHByZXZCdXR0b24sIGNvbnRyb2xzRXZlbnRzKTtcclxuICAgICAgICAgICAgYWRkRXZlbnRzKG5leHRCdXR0b24sIGNvbnRyb2xzRXZlbnRzKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgLy8gaGlkZSB0b29scyBpZiBuZWVkZWRcclxuICAgICAgICBkaXNhYmxlVUkoKTtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBmdW5jdGlvbiBpbml0RXZlbnRzICgpIHtcclxuICAgICAgICAvLyBhZGQgZXZlbnRzXHJcbiAgICAgICAgaWYgKGNhcm91c2VsICYmIFRSQU5TSVRJT05FTkQpIHtcclxuICAgICAgICAgIHZhciBldmUgPSB7fTtcclxuICAgICAgICAgIGV2ZVtUUkFOU0lUSU9ORU5EXSA9IG9uVHJhbnNpdGlvbkVuZDtcclxuICAgICAgICAgIGFkZEV2ZW50cyhjb250YWluZXIsIGV2ZSk7XHJcbiAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgIGlmICh0b3VjaCkgeyBhZGRFdmVudHMoY29udGFpbmVyLCB0b3VjaEV2ZW50cywgb3B0aW9ucy5wcmV2ZW50U2Nyb2xsT25Ub3VjaCk7IH1cclxuICAgICAgICBpZiAobW91c2VEcmFnKSB7IGFkZEV2ZW50cyhjb250YWluZXIsIGRyYWdFdmVudHMpOyB9XHJcbiAgICAgICAgaWYgKGFycm93S2V5cykgeyBhZGRFdmVudHMoZG9jLCBkb2NtZW50S2V5ZG93bkV2ZW50KTsgfVxyXG4gIFxyXG4gICAgICAgIGlmIChuZXN0ZWQgPT09ICdpbm5lcicpIHtcclxuICAgICAgICAgIGV2ZW50cy5vbignb3V0ZXJSZXNpemVkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXNpemVUYXNrcygpO1xyXG4gICAgICAgICAgICBldmVudHMuZW1pdCgnaW5uZXJMb2FkZWQnLCBpbmZvKCkpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChyZXNwb25zaXZlIHx8IGZpeGVkV2lkdGggfHwgYXV0b1dpZHRoIHx8IGF1dG9IZWlnaHQgfHwgIWhvcml6b250YWwpIHtcclxuICAgICAgICAgIGFkZEV2ZW50cyh3aW4sIHsncmVzaXplJzogb25SZXNpemV9KTtcclxuICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgaWYgKGF1dG9IZWlnaHQpIHtcclxuICAgICAgICAgIGlmIChuZXN0ZWQgPT09ICdvdXRlcicpIHtcclxuICAgICAgICAgICAgZXZlbnRzLm9uKCdpbm5lckxvYWRlZCcsIGRvQXV0b0hlaWdodCk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKCFkaXNhYmxlKSB7IGRvQXV0b0hlaWdodCgpOyB9XHJcbiAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgIGRvTGF6eUxvYWQoKTtcclxuICAgICAgICBpZiAoZGlzYWJsZSkgeyBkaXNhYmxlU2xpZGVyKCk7IH0gZWxzZSBpZiAoZnJlZXplKSB7IGZyZWV6ZVNsaWRlcigpOyB9XHJcbiAgXHJcbiAgICAgICAgZXZlbnRzLm9uKCdpbmRleENoYW5nZWQnLCBhZGRpdGlvbmFsVXBkYXRlcyk7XHJcbiAgICAgICAgaWYgKG5lc3RlZCA9PT0gJ2lubmVyJykgeyBldmVudHMuZW1pdCgnaW5uZXJMb2FkZWQnLCBpbmZvKCkpOyB9XHJcbiAgICAgICAgaWYgKHR5cGVvZiBvbkluaXQgPT09ICdmdW5jdGlvbicpIHsgb25Jbml0KGluZm8oKSk7IH1cclxuICAgICAgICBpc09uID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBmdW5jdGlvbiBkZXN0cm95ICgpIHtcclxuICAgICAgICAvLyBzaGVldFxyXG4gICAgICAgIHNoZWV0LmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICBpZiAoc2hlZXQub3duZXJOb2RlKSB7IHNoZWV0Lm93bmVyTm9kZS5yZW1vdmUoKTsgfVxyXG4gIFxyXG4gICAgICAgIC8vIHJlbW92ZSB3aW4gZXZlbnQgbGlzdGVuZXJzXHJcbiAgICAgICAgcmVtb3ZlRXZlbnRzKHdpbiwgeydyZXNpemUnOiBvblJlc2l6ZX0pO1xyXG4gIFxyXG4gICAgICAgIC8vIGFycm93S2V5cywgY29udHJvbHMsIG5hdlxyXG4gICAgICAgIGlmIChhcnJvd0tleXMpIHsgcmVtb3ZlRXZlbnRzKGRvYywgZG9jbWVudEtleWRvd25FdmVudCk7IH1cclxuICAgICAgICBpZiAoY29udHJvbHNDb250YWluZXIpIHsgcmVtb3ZlRXZlbnRzKGNvbnRyb2xzQ29udGFpbmVyLCBjb250cm9sc0V2ZW50cyk7IH1cclxuICAgICAgICBpZiAobmF2Q29udGFpbmVyKSB7IHJlbW92ZUV2ZW50cyhuYXZDb250YWluZXIsIG5hdkV2ZW50cyk7IH1cclxuICBcclxuICAgICAgICAvLyBhdXRvcGxheVxyXG4gICAgICAgIHJlbW92ZUV2ZW50cyhjb250YWluZXIsIGhvdmVyRXZlbnRzKTtcclxuICAgICAgICByZW1vdmVFdmVudHMoY29udGFpbmVyLCB2aXNpYmlsaXR5RXZlbnQpO1xyXG4gICAgICAgIGlmIChhdXRvcGxheUJ1dHRvbikgeyByZW1vdmVFdmVudHMoYXV0b3BsYXlCdXR0b24sIHsnY2xpY2snOiB0b2dnbGVBdXRvcGxheX0pOyB9XHJcbiAgICAgICAgaWYgKGF1dG9wbGF5KSB7IGNsZWFySW50ZXJ2YWwoYXV0b3BsYXlUaW1lcik7IH1cclxuICBcclxuICAgICAgICAvLyBjb250YWluZXJcclxuICAgICAgICBpZiAoY2Fyb3VzZWwgJiYgVFJBTlNJVElPTkVORCkge1xyXG4gICAgICAgICAgdmFyIGV2ZSA9IHt9O1xyXG4gICAgICAgICAgZXZlW1RSQU5TSVRJT05FTkRdID0gb25UcmFuc2l0aW9uRW5kO1xyXG4gICAgICAgICAgcmVtb3ZlRXZlbnRzKGNvbnRhaW5lciwgZXZlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRvdWNoKSB7IHJlbW92ZUV2ZW50cyhjb250YWluZXIsIHRvdWNoRXZlbnRzKTsgfVxyXG4gICAgICAgIGlmIChtb3VzZURyYWcpIHsgcmVtb3ZlRXZlbnRzKGNvbnRhaW5lciwgZHJhZ0V2ZW50cyk7IH1cclxuICBcclxuICAgICAgICAvLyBjYWNoZSBPYmplY3QgdmFsdWVzIGluIG9wdGlvbnMgJiYgcmVzZXQgSFRNTFxyXG4gICAgICAgIHZhciBodG1sTGlzdCA9IFtjb250YWluZXJIVE1MLCBjb250cm9sc0NvbnRhaW5lckhUTUwsIHByZXZCdXR0b25IVE1MLCBuZXh0QnV0dG9uSFRNTCwgbmF2Q29udGFpbmVySFRNTCwgYXV0b3BsYXlCdXR0b25IVE1MXTtcclxuICBcclxuICAgICAgICB0bnNMaXN0LmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaSkge1xyXG4gICAgICAgICAgdmFyIGVsID0gaXRlbSA9PT0gJ2NvbnRhaW5lcicgPyBvdXRlcldyYXBwZXIgOiBvcHRpb25zW2l0ZW1dO1xyXG4gIFxyXG4gICAgICAgICAgaWYgKHR5cGVvZiBlbCA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgdmFyIHByZXZFbCA9IGVsLnByZXZpb3VzRWxlbWVudFNpYmxpbmcgPyBlbC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nIDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgcGFyZW50RWwgPSBlbC5wYXJlbnROb2RlO1xyXG4gICAgICAgICAgICBlbC5vdXRlckhUTUwgPSBodG1sTGlzdFtpXTtcclxuICAgICAgICAgICAgb3B0aW9uc1tpdGVtXSA9IHByZXZFbCA/IHByZXZFbC5uZXh0RWxlbWVudFNpYmxpbmcgOiBwYXJlbnRFbC5maXJzdEVsZW1lbnRDaGlsZDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICBcclxuICBcclxuICAgICAgICAvLyByZXNldCB2YXJpYWJsZXNcclxuICAgICAgICB0bnNMaXN0ID0gYW5pbWF0ZUluID0gYW5pbWF0ZU91dCA9IGFuaW1hdGVEZWxheSA9IGFuaW1hdGVOb3JtYWwgPSBob3Jpem9udGFsID0gb3V0ZXJXcmFwcGVyID0gaW5uZXJXcmFwcGVyID0gY29udGFpbmVyID0gY29udGFpbmVyUGFyZW50ID0gY29udGFpbmVySFRNTCA9IHNsaWRlSXRlbXMgPSBzbGlkZUNvdW50ID0gYnJlYWtwb2ludFpvbmUgPSB3aW5kb3dXaWR0aCA9IGF1dG9XaWR0aCA9IGZpeGVkV2lkdGggPSBlZGdlUGFkZGluZyA9IGd1dHRlciA9IHZpZXdwb3J0ID0gaXRlbXMgPSBzbGlkZUJ5ID0gdmlld3BvcnRNYXggPSBhcnJvd0tleXMgPSBzcGVlZCA9IHJld2luZCA9IGxvb3AgPSBhdXRvSGVpZ2h0ID0gc2hlZXQgPSBsYXp5bG9hZCA9IHNsaWRlUG9zaXRpb25zID0gc2xpZGVJdGVtc091dCA9IGNsb25lQ291bnQgPSBzbGlkZUNvdW50TmV3ID0gaGFzUmlnaHREZWFkWm9uZSA9IHJpZ2h0Qm91bmRhcnkgPSB1cGRhdGVJbmRleEJlZm9yZVRyYW5zZm9ybSA9IHRyYW5zZm9ybUF0dHIgPSB0cmFuc2Zvcm1QcmVmaXggPSB0cmFuc2Zvcm1Qb3N0Zml4ID0gZ2V0SW5kZXhNYXggPSBpbmRleCA9IGluZGV4Q2FjaGVkID0gaW5kZXhNaW4gPSBpbmRleE1heCA9IHJlc2l6ZVRpbWVyID0gc3dpcGVBbmdsZSA9IG1vdmVEaXJlY3Rpb25FeHBlY3RlZCA9IHJ1bm5pbmcgPSBvbkluaXQgPSBldmVudHMgPSBuZXdDb250YWluZXJDbGFzc2VzID0gc2xpZGVJZCA9IGRpc2FibGUgPSBkaXNhYmxlZCA9IGZyZWV6YWJsZSA9IGZyZWV6ZSA9IGZyb3plbiA9IGNvbnRyb2xzRXZlbnRzID0gbmF2RXZlbnRzID0gaG92ZXJFdmVudHMgPSB2aXNpYmlsaXR5RXZlbnQgPSBkb2NtZW50S2V5ZG93bkV2ZW50ID0gdG91Y2hFdmVudHMgPSBkcmFnRXZlbnRzID0gaGFzQ29udHJvbHMgPSBoYXNOYXYgPSBuYXZBc1RodW1ibmFpbHMgPSBoYXNBdXRvcGxheSA9IGhhc1RvdWNoID0gaGFzTW91c2VEcmFnID0gc2xpZGVBY3RpdmVDbGFzcyA9IGltZ0NvbXBsZXRlQ2xhc3MgPSBpbWdFdmVudHMgPSBpbWdzQ29tcGxldGUgPSBjb250cm9scyA9IGNvbnRyb2xzVGV4dCA9IGNvbnRyb2xzQ29udGFpbmVyID0gY29udHJvbHNDb250YWluZXJIVE1MID0gcHJldkJ1dHRvbiA9IG5leHRCdXR0b24gPSBwcmV2SXNCdXR0b24gPSBuZXh0SXNCdXR0b24gPSBuYXYgPSBuYXZDb250YWluZXIgPSBuYXZDb250YWluZXJIVE1MID0gbmF2SXRlbXMgPSBwYWdlcyA9IHBhZ2VzQ2FjaGVkID0gbmF2Q2xpY2tlZCA9IG5hdkN1cnJlbnRJbmRleCA9IG5hdkN1cnJlbnRJbmRleENhY2hlZCA9IG5hdkFjdGl2ZUNsYXNzID0gbmF2U3RyID0gbmF2U3RyQ3VycmVudCA9IGF1dG9wbGF5ID0gYXV0b3BsYXlUaW1lb3V0ID0gYXV0b3BsYXlEaXJlY3Rpb24gPSBhdXRvcGxheVRleHQgPSBhdXRvcGxheUhvdmVyUGF1c2UgPSBhdXRvcGxheUJ1dHRvbiA9IGF1dG9wbGF5QnV0dG9uSFRNTCA9IGF1dG9wbGF5UmVzZXRPblZpc2liaWxpdHkgPSBhdXRvcGxheUh0bWxTdHJpbmdzID0gYXV0b3BsYXlUaW1lciA9IGFuaW1hdGluZyA9IGF1dG9wbGF5SG92ZXJQYXVzZWQgPSBhdXRvcGxheVVzZXJQYXVzZWQgPSBhdXRvcGxheVZpc2liaWxpdHlQYXVzZWQgPSBpbml0UG9zaXRpb24gPSBsYXN0UG9zaXRpb24gPSB0cmFuc2xhdGVJbml0ID0gZGlzWCA9IGRpc1kgPSBwYW5TdGFydCA9IHJhZkluZGV4ID0gZ2V0RGlzdCA9IHRvdWNoID0gbW91c2VEcmFnID0gbnVsbDtcclxuICAgICAgICAvLyBjaGVjayB2YXJpYWJsZXNcclxuICAgICAgICAvLyBbYW5pbWF0ZUluLCBhbmltYXRlT3V0LCBhbmltYXRlRGVsYXksIGFuaW1hdGVOb3JtYWwsIGhvcml6b250YWwsIG91dGVyV3JhcHBlciwgaW5uZXJXcmFwcGVyLCBjb250YWluZXIsIGNvbnRhaW5lclBhcmVudCwgY29udGFpbmVySFRNTCwgc2xpZGVJdGVtcywgc2xpZGVDb3VudCwgYnJlYWtwb2ludFpvbmUsIHdpbmRvd1dpZHRoLCBhdXRvV2lkdGgsIGZpeGVkV2lkdGgsIGVkZ2VQYWRkaW5nLCBndXR0ZXIsIHZpZXdwb3J0LCBpdGVtcywgc2xpZGVCeSwgdmlld3BvcnRNYXgsIGFycm93S2V5cywgc3BlZWQsIHJld2luZCwgbG9vcCwgYXV0b0hlaWdodCwgc2hlZXQsIGxhenlsb2FkLCBzbGlkZVBvc2l0aW9ucywgc2xpZGVJdGVtc091dCwgY2xvbmVDb3VudCwgc2xpZGVDb3VudE5ldywgaGFzUmlnaHREZWFkWm9uZSwgcmlnaHRCb3VuZGFyeSwgdXBkYXRlSW5kZXhCZWZvcmVUcmFuc2Zvcm0sIHRyYW5zZm9ybUF0dHIsIHRyYW5zZm9ybVByZWZpeCwgdHJhbnNmb3JtUG9zdGZpeCwgZ2V0SW5kZXhNYXgsIGluZGV4LCBpbmRleENhY2hlZCwgaW5kZXhNaW4sIGluZGV4TWF4LCByZXNpemVUaW1lciwgc3dpcGVBbmdsZSwgbW92ZURpcmVjdGlvbkV4cGVjdGVkLCBydW5uaW5nLCBvbkluaXQsIGV2ZW50cywgbmV3Q29udGFpbmVyQ2xhc3Nlcywgc2xpZGVJZCwgZGlzYWJsZSwgZGlzYWJsZWQsIGZyZWV6YWJsZSwgZnJlZXplLCBmcm96ZW4sIGNvbnRyb2xzRXZlbnRzLCBuYXZFdmVudHMsIGhvdmVyRXZlbnRzLCB2aXNpYmlsaXR5RXZlbnQsIGRvY21lbnRLZXlkb3duRXZlbnQsIHRvdWNoRXZlbnRzLCBkcmFnRXZlbnRzLCBoYXNDb250cm9scywgaGFzTmF2LCBuYXZBc1RodW1ibmFpbHMsIGhhc0F1dG9wbGF5LCBoYXNUb3VjaCwgaGFzTW91c2VEcmFnLCBzbGlkZUFjdGl2ZUNsYXNzLCBpbWdDb21wbGV0ZUNsYXNzLCBpbWdFdmVudHMsIGltZ3NDb21wbGV0ZSwgY29udHJvbHMsIGNvbnRyb2xzVGV4dCwgY29udHJvbHNDb250YWluZXIsIGNvbnRyb2xzQ29udGFpbmVySFRNTCwgcHJldkJ1dHRvbiwgbmV4dEJ1dHRvbiwgcHJldklzQnV0dG9uLCBuZXh0SXNCdXR0b24sIG5hdiwgbmF2Q29udGFpbmVyLCBuYXZDb250YWluZXJIVE1MLCBuYXZJdGVtcywgcGFnZXMsIHBhZ2VzQ2FjaGVkLCBuYXZDbGlja2VkLCBuYXZDdXJyZW50SW5kZXgsIG5hdkN1cnJlbnRJbmRleENhY2hlZCwgbmF2QWN0aXZlQ2xhc3MsIG5hdlN0ciwgbmF2U3RyQ3VycmVudCwgYXV0b3BsYXksIGF1dG9wbGF5VGltZW91dCwgYXV0b3BsYXlEaXJlY3Rpb24sIGF1dG9wbGF5VGV4dCwgYXV0b3BsYXlIb3ZlclBhdXNlLCBhdXRvcGxheUJ1dHRvbiwgYXV0b3BsYXlCdXR0b25IVE1MLCBhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5LCBhdXRvcGxheUh0bWxTdHJpbmdzLCBhdXRvcGxheVRpbWVyLCBhbmltYXRpbmcsIGF1dG9wbGF5SG92ZXJQYXVzZWQsIGF1dG9wbGF5VXNlclBhdXNlZCwgYXV0b3BsYXlWaXNpYmlsaXR5UGF1c2VkLCBpbml0UG9zaXRpb24sIGxhc3RQb3NpdGlvbiwgdHJhbnNsYXRlSW5pdCwgZGlzWCwgZGlzWSwgcGFuU3RhcnQsIHJhZkluZGV4LCBnZXREaXN0LCB0b3VjaCwgbW91c2VEcmFnIF0uZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7IGlmIChpdGVtICE9PSBudWxsKSB7IGNvbnNvbGUubG9nKGl0ZW0pOyB9IH0pO1xyXG4gIFxyXG4gICAgICAgIGZvciAodmFyIGEgaW4gdGhpcykge1xyXG4gICAgICAgICAgaWYgKGEgIT09ICdyZWJ1aWxkJykgeyB0aGlzW2FdID0gbnVsbDsgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpc09uID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICBcclxuICAvLyA9PT0gT04gUkVTSVpFID09PVxyXG4gICAgICAvLyByZXNwb25zaXZlIHx8IGZpeGVkV2lkdGggfHwgYXV0b1dpZHRoIHx8ICFob3Jpem9udGFsXHJcbiAgICAgIGZ1bmN0aW9uIG9uUmVzaXplIChlKSB7XHJcbiAgICAgICAgcmFmKGZ1bmN0aW9uKCl7IHJlc2l6ZVRhc2tzKGdldEV2ZW50KGUpKTsgfSk7XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgZnVuY3Rpb24gcmVzaXplVGFza3MgKGUpIHtcclxuICAgICAgICBpZiAoIWlzT24pIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgaWYgKG5lc3RlZCA9PT0gJ291dGVyJykgeyBldmVudHMuZW1pdCgnb3V0ZXJSZXNpemVkJywgaW5mbyhlKSk7IH1cclxuICAgICAgICB3aW5kb3dXaWR0aCA9IGdldFdpbmRvd1dpZHRoKCk7XHJcbiAgICAgICAgdmFyIGJwQ2hhbmdlZCxcclxuICAgICAgICAgIGJyZWFrcG9pbnRab25lVGVtID0gYnJlYWtwb2ludFpvbmUsXHJcbiAgICAgICAgICBuZWVkQ29udGFpbmVyVHJhbnNmb3JtID0gZmFsc2U7XHJcbiAgXHJcbiAgICAgICAgaWYgKHJlc3BvbnNpdmUpIHtcclxuICAgICAgICAgIHNldEJyZWFrcG9pbnRab25lKCk7XHJcbiAgICAgICAgICBicENoYW5nZWQgPSBicmVha3BvaW50Wm9uZVRlbSAhPT0gYnJlYWtwb2ludFpvbmU7XHJcbiAgICAgICAgICAvLyBpZiAoaGFzUmlnaHREZWFkWm9uZSkgeyBuZWVkQ29udGFpbmVyVHJhbnNmb3JtID0gdHJ1ZTsgfSAvLyAqP1xyXG4gICAgICAgICAgaWYgKGJwQ2hhbmdlZCkgeyBldmVudHMuZW1pdCgnbmV3QnJlYWtwb2ludFN0YXJ0JywgaW5mbyhlKSk7IH1cclxuICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgdmFyIGluZENoYW5nZWQsXHJcbiAgICAgICAgICBpdGVtc0NoYW5nZWQsXHJcbiAgICAgICAgICBpdGVtc1RlbSA9IGl0ZW1zLFxyXG4gICAgICAgICAgZGlzYWJsZVRlbSA9IGRpc2FibGUsXHJcbiAgICAgICAgICBmcmVlemVUZW0gPSBmcmVlemUsXHJcbiAgICAgICAgICBhcnJvd0tleXNUZW0gPSBhcnJvd0tleXMsXHJcbiAgICAgICAgICBjb250cm9sc1RlbSA9IGNvbnRyb2xzLFxyXG4gICAgICAgICAgbmF2VGVtID0gbmF2LFxyXG4gICAgICAgICAgdG91Y2hUZW0gPSB0b3VjaCxcclxuICAgICAgICAgIG1vdXNlRHJhZ1RlbSA9IG1vdXNlRHJhZyxcclxuICAgICAgICAgIGF1dG9wbGF5VGVtID0gYXV0b3BsYXksXHJcbiAgICAgICAgICBhdXRvcGxheUhvdmVyUGF1c2VUZW0gPSBhdXRvcGxheUhvdmVyUGF1c2UsXHJcbiAgICAgICAgICBhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5VGVtID0gYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eSxcclxuICAgICAgICAgIGluZGV4VGVtID0gaW5kZXg7XHJcbiAgXHJcbiAgICAgICAgaWYgKGJwQ2hhbmdlZCkge1xyXG4gICAgICAgICAgdmFyIGZpeGVkV2lkdGhUZW0gPSBmaXhlZFdpZHRoLFxyXG4gICAgICAgICAgICBhdXRvSGVpZ2h0VGVtID0gYXV0b0hlaWdodCxcclxuICAgICAgICAgICAgY29udHJvbHNUZXh0VGVtID0gY29udHJvbHNUZXh0LFxyXG4gICAgICAgICAgICBjZW50ZXJUZW0gPSBjZW50ZXIsXHJcbiAgICAgICAgICAgIGF1dG9wbGF5VGV4dFRlbSA9IGF1dG9wbGF5VGV4dDtcclxuICBcclxuICAgICAgICAgIGlmICghQ1NTTVEpIHtcclxuICAgICAgICAgICAgdmFyIGd1dHRlclRlbSA9IGd1dHRlcixcclxuICAgICAgICAgICAgICBlZGdlUGFkZGluZ1RlbSA9IGVkZ2VQYWRkaW5nO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICAvLyBnZXQgb3B0aW9uOlxyXG4gICAgICAgIC8vIGZpeGVkIHdpZHRoOiB2aWV3cG9ydCwgZml4ZWRXaWR0aCwgZ3V0dGVyID0+IGl0ZW1zXHJcbiAgICAgICAgLy8gb3RoZXJzOiB3aW5kb3cgd2lkdGggPT4gYWxsIHZhcmlhYmxlc1xyXG4gICAgICAgIC8vIGFsbDogaXRlbXMgPT4gc2xpZGVCeVxyXG4gICAgICAgIGFycm93S2V5cyA9IGdldE9wdGlvbignYXJyb3dLZXlzJyk7XHJcbiAgICAgICAgY29udHJvbHMgPSBnZXRPcHRpb24oJ2NvbnRyb2xzJyk7XHJcbiAgICAgICAgbmF2ID0gZ2V0T3B0aW9uKCduYXYnKTtcclxuICAgICAgICB0b3VjaCA9IGdldE9wdGlvbigndG91Y2gnKTtcclxuICAgICAgICBjZW50ZXIgPSBnZXRPcHRpb24oJ2NlbnRlcicpO1xyXG4gICAgICAgIG1vdXNlRHJhZyA9IGdldE9wdGlvbignbW91c2VEcmFnJyk7XHJcbiAgICAgICAgYXV0b3BsYXkgPSBnZXRPcHRpb24oJ2F1dG9wbGF5Jyk7XHJcbiAgICAgICAgYXV0b3BsYXlIb3ZlclBhdXNlID0gZ2V0T3B0aW9uKCdhdXRvcGxheUhvdmVyUGF1c2UnKTtcclxuICAgICAgICBhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5ID0gZ2V0T3B0aW9uKCdhdXRvcGxheVJlc2V0T25WaXNpYmlsaXR5Jyk7XHJcbiAgXHJcbiAgICAgICAgaWYgKGJwQ2hhbmdlZCkge1xyXG4gICAgICAgICAgZGlzYWJsZSA9IGdldE9wdGlvbignZGlzYWJsZScpO1xyXG4gICAgICAgICAgZml4ZWRXaWR0aCA9IGdldE9wdGlvbignZml4ZWRXaWR0aCcpO1xyXG4gICAgICAgICAgc3BlZWQgPSBnZXRPcHRpb24oJ3NwZWVkJyk7XHJcbiAgICAgICAgICBhdXRvSGVpZ2h0ID0gZ2V0T3B0aW9uKCdhdXRvSGVpZ2h0Jyk7XHJcbiAgICAgICAgICBjb250cm9sc1RleHQgPSBnZXRPcHRpb24oJ2NvbnRyb2xzVGV4dCcpO1xyXG4gICAgICAgICAgYXV0b3BsYXlUZXh0ID0gZ2V0T3B0aW9uKCdhdXRvcGxheVRleHQnKTtcclxuICAgICAgICAgIGF1dG9wbGF5VGltZW91dCA9IGdldE9wdGlvbignYXV0b3BsYXlUaW1lb3V0Jyk7XHJcbiAgXHJcbiAgICAgICAgICBpZiAoIUNTU01RKSB7XHJcbiAgICAgICAgICAgIGVkZ2VQYWRkaW5nID0gZ2V0T3B0aW9uKCdlZGdlUGFkZGluZycpO1xyXG4gICAgICAgICAgICBndXR0ZXIgPSBnZXRPcHRpb24oJ2d1dHRlcicpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB1cGRhdGUgb3B0aW9uc1xyXG4gICAgICAgIHJlc2V0VmFyaWJsZXNXaGVuRGlzYWJsZShkaXNhYmxlKTtcclxuICBcclxuICAgICAgICB2aWV3cG9ydCA9IGdldFZpZXdwb3J0V2lkdGgoKTsgLy8gPD0gZWRnZVBhZGRpbmcsIGd1dHRlclxyXG4gICAgICAgIGlmICgoIWhvcml6b250YWwgfHwgYXV0b1dpZHRoKSAmJiAhZGlzYWJsZSkge1xyXG4gICAgICAgICAgc2V0U2xpZGVQb3NpdGlvbnMoKTtcclxuICAgICAgICAgIGlmICghaG9yaXpvbnRhbCkge1xyXG4gICAgICAgICAgICB1cGRhdGVDb250ZW50V3JhcHBlckhlaWdodCgpOyAvLyA8PSBzZXRTbGlkZVBvc2l0aW9uc1xyXG4gICAgICAgICAgICBuZWVkQ29udGFpbmVyVHJhbnNmb3JtID0gdHJ1ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGZpeGVkV2lkdGggfHwgYXV0b1dpZHRoKSB7XHJcbiAgICAgICAgICByaWdodEJvdW5kYXJ5ID0gZ2V0UmlnaHRCb3VuZGFyeSgpOyAvLyBhdXRvV2lkdGg6IDw9IHZpZXdwb3J0LCBzbGlkZVBvc2l0aW9ucywgZ3V0dGVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBmaXhlZFdpZHRoOiA8PSB2aWV3cG9ydCwgZml4ZWRXaWR0aCwgZ3V0dGVyXHJcbiAgICAgICAgICBpbmRleE1heCA9IGdldEluZGV4TWF4KCk7IC8vIGF1dG9XaWR0aDogPD0gcmlnaHRCb3VuZGFyeSwgc2xpZGVQb3NpdGlvbnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZml4ZWRXaWR0aDogPD0gcmlnaHRCb3VuZGFyeSwgZml4ZWRXaWR0aCwgZ3V0dGVyXHJcbiAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgIGlmIChicENoYW5nZWQgfHwgZml4ZWRXaWR0aCkge1xyXG4gICAgICAgICAgaXRlbXMgPSBnZXRPcHRpb24oJ2l0ZW1zJyk7XHJcbiAgICAgICAgICBzbGlkZUJ5ID0gZ2V0T3B0aW9uKCdzbGlkZUJ5Jyk7XHJcbiAgICAgICAgICBpdGVtc0NoYW5nZWQgPSBpdGVtcyAhPT0gaXRlbXNUZW07XHJcbiAgXHJcbiAgICAgICAgICBpZiAoaXRlbXNDaGFuZ2VkKSB7XHJcbiAgICAgICAgICAgIGlmICghZml4ZWRXaWR0aCAmJiAhYXV0b1dpZHRoKSB7IGluZGV4TWF4ID0gZ2V0SW5kZXhNYXgoKTsgfSAvLyA8PSBpdGVtc1xyXG4gICAgICAgICAgICAvLyBjaGVjayBpbmRleCBiZWZvcmUgdHJhbnNmb3JtIGluIGNhc2VcclxuICAgICAgICAgICAgLy8gc2xpZGVyIHJlYWNoIHRoZSByaWdodCBlZGdlIHRoZW4gaXRlbXMgYmVjb21lIGJpZ2dlclxyXG4gICAgICAgICAgICB1cGRhdGVJbmRleCgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICBpZiAoYnBDaGFuZ2VkKSB7XHJcbiAgICAgICAgICBpZiAoZGlzYWJsZSAhPT0gZGlzYWJsZVRlbSkge1xyXG4gICAgICAgICAgICBpZiAoZGlzYWJsZSkge1xyXG4gICAgICAgICAgICAgIGRpc2FibGVTbGlkZXIoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBlbmFibGVTbGlkZXIoKTsgLy8gPD0gc2xpZGVQb3NpdGlvbnMsIHJpZ2h0Qm91bmRhcnksIGluZGV4TWF4XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgaWYgKGZyZWV6YWJsZSAmJiAoYnBDaGFuZ2VkIHx8IGZpeGVkV2lkdGggfHwgYXV0b1dpZHRoKSkge1xyXG4gICAgICAgICAgZnJlZXplID0gZ2V0RnJlZXplKCk7IC8vIDw9IGF1dG9XaWR0aDogc2xpZGVQb3NpdGlvbnMsIGd1dHRlciwgdmlld3BvcnQsIHJpZ2h0Qm91bmRhcnlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8PSBmaXhlZFdpZHRoOiBmaXhlZFdpZHRoLCBndXR0ZXIsIHJpZ2h0Qm91bmRhcnlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8PSBvdGhlcnM6IGl0ZW1zXHJcbiAgXHJcbiAgICAgICAgICBpZiAoZnJlZXplICE9PSBmcmVlemVUZW0pIHtcclxuICAgICAgICAgICAgaWYgKGZyZWV6ZSkge1xyXG4gICAgICAgICAgICAgIGRvQ29udGFpbmVyVHJhbnNmb3JtKGdldENvbnRhaW5lclRyYW5zZm9ybVZhbHVlKGdldFN0YXJ0SW5kZXgoMCkpKTtcclxuICAgICAgICAgICAgICBmcmVlemVTbGlkZXIoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB1bmZyZWV6ZVNsaWRlcigpO1xyXG4gICAgICAgICAgICAgIG5lZWRDb250YWluZXJUcmFuc2Zvcm0gPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgIHJlc2V0VmFyaWJsZXNXaGVuRGlzYWJsZShkaXNhYmxlIHx8IGZyZWV6ZSk7IC8vIGNvbnRyb2xzLCBuYXYsIHRvdWNoLCBtb3VzZURyYWcsIGFycm93S2V5cywgYXV0b3BsYXksIGF1dG9wbGF5SG92ZXJQYXVzZSwgYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eVxyXG4gICAgICAgIGlmICghYXV0b3BsYXkpIHsgYXV0b3BsYXlIb3ZlclBhdXNlID0gYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eSA9IGZhbHNlOyB9XHJcbiAgXHJcbiAgICAgICAgaWYgKGFycm93S2V5cyAhPT0gYXJyb3dLZXlzVGVtKSB7XHJcbiAgICAgICAgICBhcnJvd0tleXMgP1xyXG4gICAgICAgICAgICBhZGRFdmVudHMoZG9jLCBkb2NtZW50S2V5ZG93bkV2ZW50KSA6XHJcbiAgICAgICAgICAgIHJlbW92ZUV2ZW50cyhkb2MsIGRvY21lbnRLZXlkb3duRXZlbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY29udHJvbHMgIT09IGNvbnRyb2xzVGVtKSB7XHJcbiAgICAgICAgICBpZiAoY29udHJvbHMpIHtcclxuICAgICAgICAgICAgaWYgKGNvbnRyb2xzQ29udGFpbmVyKSB7XHJcbiAgICAgICAgICAgICAgc2hvd0VsZW1lbnQoY29udHJvbHNDb250YWluZXIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGlmIChwcmV2QnV0dG9uKSB7IHNob3dFbGVtZW50KHByZXZCdXR0b24pOyB9XHJcbiAgICAgICAgICAgICAgaWYgKG5leHRCdXR0b24pIHsgc2hvd0VsZW1lbnQobmV4dEJ1dHRvbik7IH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKGNvbnRyb2xzQ29udGFpbmVyKSB7XHJcbiAgICAgICAgICAgICAgaGlkZUVsZW1lbnQoY29udHJvbHNDb250YWluZXIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGlmIChwcmV2QnV0dG9uKSB7IGhpZGVFbGVtZW50KHByZXZCdXR0b24pOyB9XHJcbiAgICAgICAgICAgICAgaWYgKG5leHRCdXR0b24pIHsgaGlkZUVsZW1lbnQobmV4dEJ1dHRvbik7IH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobmF2ICE9PSBuYXZUZW0pIHtcclxuICAgICAgICAgIG5hdiA/XHJcbiAgICAgICAgICAgIHNob3dFbGVtZW50KG5hdkNvbnRhaW5lcikgOlxyXG4gICAgICAgICAgICBoaWRlRWxlbWVudChuYXZDb250YWluZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodG91Y2ggIT09IHRvdWNoVGVtKSB7XHJcbiAgICAgICAgICB0b3VjaCA/XHJcbiAgICAgICAgICAgIGFkZEV2ZW50cyhjb250YWluZXIsIHRvdWNoRXZlbnRzLCBvcHRpb25zLnByZXZlbnRTY3JvbGxPblRvdWNoKSA6XHJcbiAgICAgICAgICAgIHJlbW92ZUV2ZW50cyhjb250YWluZXIsIHRvdWNoRXZlbnRzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG1vdXNlRHJhZyAhPT0gbW91c2VEcmFnVGVtKSB7XHJcbiAgICAgICAgICBtb3VzZURyYWcgP1xyXG4gICAgICAgICAgICBhZGRFdmVudHMoY29udGFpbmVyLCBkcmFnRXZlbnRzKSA6XHJcbiAgICAgICAgICAgIHJlbW92ZUV2ZW50cyhjb250YWluZXIsIGRyYWdFdmVudHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYXV0b3BsYXkgIT09IGF1dG9wbGF5VGVtKSB7XHJcbiAgICAgICAgICBpZiAoYXV0b3BsYXkpIHtcclxuICAgICAgICAgICAgaWYgKGF1dG9wbGF5QnV0dG9uKSB7IHNob3dFbGVtZW50KGF1dG9wbGF5QnV0dG9uKTsgfVxyXG4gICAgICAgICAgICBpZiAoIWFuaW1hdGluZyAmJiAhYXV0b3BsYXlVc2VyUGF1c2VkKSB7IHN0YXJ0QXV0b3BsYXkoKTsgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKGF1dG9wbGF5QnV0dG9uKSB7IGhpZGVFbGVtZW50KGF1dG9wbGF5QnV0dG9uKTsgfVxyXG4gICAgICAgICAgICBpZiAoYW5pbWF0aW5nKSB7IHN0b3BBdXRvcGxheSgpOyB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChhdXRvcGxheUhvdmVyUGF1c2UgIT09IGF1dG9wbGF5SG92ZXJQYXVzZVRlbSkge1xyXG4gICAgICAgICAgYXV0b3BsYXlIb3ZlclBhdXNlID9cclxuICAgICAgICAgICAgYWRkRXZlbnRzKGNvbnRhaW5lciwgaG92ZXJFdmVudHMpIDpcclxuICAgICAgICAgICAgcmVtb3ZlRXZlbnRzKGNvbnRhaW5lciwgaG92ZXJFdmVudHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eSAhPT0gYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eVRlbSkge1xyXG4gICAgICAgICAgYXV0b3BsYXlSZXNldE9uVmlzaWJpbGl0eSA/XHJcbiAgICAgICAgICAgIGFkZEV2ZW50cyhkb2MsIHZpc2liaWxpdHlFdmVudCkgOlxyXG4gICAgICAgICAgICByZW1vdmVFdmVudHMoZG9jLCB2aXNpYmlsaXR5RXZlbnQpO1xyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICBpZiAoYnBDaGFuZ2VkKSB7XHJcbiAgICAgICAgICBpZiAoZml4ZWRXaWR0aCAhPT0gZml4ZWRXaWR0aFRlbSB8fCBjZW50ZXIgIT09IGNlbnRlclRlbSkgeyBuZWVkQ29udGFpbmVyVHJhbnNmb3JtID0gdHJ1ZTsgfVxyXG4gIFxyXG4gICAgICAgICAgaWYgKGF1dG9IZWlnaHQgIT09IGF1dG9IZWlnaHRUZW0pIHtcclxuICAgICAgICAgICAgaWYgKCFhdXRvSGVpZ2h0KSB7IGlubmVyV3JhcHBlci5zdHlsZS5oZWlnaHQgPSAnJzsgfVxyXG4gICAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgICAgaWYgKGNvbnRyb2xzICYmIGNvbnRyb2xzVGV4dCAhPT0gY29udHJvbHNUZXh0VGVtKSB7XHJcbiAgICAgICAgICAgIHByZXZCdXR0b24uaW5uZXJIVE1MID0gY29udHJvbHNUZXh0WzBdO1xyXG4gICAgICAgICAgICBuZXh0QnV0dG9uLmlubmVySFRNTCA9IGNvbnRyb2xzVGV4dFsxXTtcclxuICAgICAgICAgIH1cclxuICBcclxuICAgICAgICAgIGlmIChhdXRvcGxheUJ1dHRvbiAmJiBhdXRvcGxheVRleHQgIT09IGF1dG9wbGF5VGV4dFRlbSkge1xyXG4gICAgICAgICAgICB2YXIgaSA9IGF1dG9wbGF5ID8gMSA6IDAsXHJcbiAgICAgICAgICAgICAgaHRtbCA9IGF1dG9wbGF5QnV0dG9uLmlubmVySFRNTCxcclxuICAgICAgICAgICAgICBsZW4gPSBodG1sLmxlbmd0aCAtIGF1dG9wbGF5VGV4dFRlbVtpXS5sZW5ndGg7XHJcbiAgICAgICAgICAgIGlmIChodG1sLnN1YnN0cmluZyhsZW4pID09PSBhdXRvcGxheVRleHRUZW1baV0pIHtcclxuICAgICAgICAgICAgICBhdXRvcGxheUJ1dHRvbi5pbm5lckhUTUwgPSBodG1sLnN1YnN0cmluZygwLCBsZW4pICsgYXV0b3BsYXlUZXh0W2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmIChjZW50ZXIgJiYgKGZpeGVkV2lkdGggfHwgYXV0b1dpZHRoKSkgeyBuZWVkQ29udGFpbmVyVHJhbnNmb3JtID0gdHJ1ZTsgfVxyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICBpZiAoaXRlbXNDaGFuZ2VkIHx8IGZpeGVkV2lkdGggJiYgIWF1dG9XaWR0aCkge1xyXG4gICAgICAgICAgcGFnZXMgPSBnZXRQYWdlcygpO1xyXG4gICAgICAgICAgdXBkYXRlTmF2VmlzaWJpbGl0eSgpO1xyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICBpbmRDaGFuZ2VkID0gaW5kZXggIT09IGluZGV4VGVtO1xyXG4gICAgICAgIGlmIChpbmRDaGFuZ2VkKSB7XHJcbiAgICAgICAgICBldmVudHMuZW1pdCgnaW5kZXhDaGFuZ2VkJywgaW5mbygpKTtcclxuICAgICAgICAgIG5lZWRDb250YWluZXJUcmFuc2Zvcm0gPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoaXRlbXNDaGFuZ2VkKSB7XHJcbiAgICAgICAgICBpZiAoIWluZENoYW5nZWQpIHsgYWRkaXRpb25hbFVwZGF0ZXMoKTsgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoZml4ZWRXaWR0aCB8fCBhdXRvV2lkdGgpIHtcclxuICAgICAgICAgIGRvTGF6eUxvYWQoKTtcclxuICAgICAgICAgIHVwZGF0ZVNsaWRlU3RhdHVzKCk7XHJcbiAgICAgICAgICB1cGRhdGVMaXZlUmVnaW9uKCk7XHJcbiAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgIGlmIChpdGVtc0NoYW5nZWQgJiYgIWNhcm91c2VsKSB7IHVwZGF0ZUdhbGxlcnlTbGlkZVBvc2l0aW9ucygpOyB9XHJcbiAgXHJcbiAgICAgICAgaWYgKCFkaXNhYmxlICYmICFmcmVlemUpIHtcclxuICAgICAgICAgIC8vIG5vbi1tZWR1YXF1ZXJpZXM6IElFOFxyXG4gICAgICAgICAgaWYgKGJwQ2hhbmdlZCAmJiAhQ1NTTVEpIHtcclxuICAgICAgICAgICAgLy8gbWlkZGxlIHdyYXBwZXIgc3R5bGVzXHJcbiAgICAgICAgICAgIGlmIChhdXRvSGVpZ2h0ICE9PSBhdXRvaGVpZ2h0VGVtIHx8IHNwZWVkICE9PSBzcGVlZFRlbSkge1xyXG4gICAgICAgICAgICAgIHVwZGF0ZV9jYXJvdXNlbF90cmFuc2l0aW9uX2R1cmF0aW9uKCk7XHJcbiAgICAgICAgICAgIH1cclxuICBcclxuICAgICAgICAgICAgLy8gaW5uZXIgd3JhcHBlciBzdHlsZXNcclxuICAgICAgICAgICAgaWYgKGVkZ2VQYWRkaW5nICE9PSBlZGdlUGFkZGluZ1RlbSB8fCBndXR0ZXIgIT09IGd1dHRlclRlbSkge1xyXG4gICAgICAgICAgICAgIGlubmVyV3JhcHBlci5zdHlsZS5jc3NUZXh0ID0gZ2V0SW5uZXJXcmFwcGVyU3R5bGVzKGVkZ2VQYWRkaW5nLCBndXR0ZXIsIGZpeGVkV2lkdGgsIHNwZWVkLCBhdXRvSGVpZ2h0KTtcclxuICAgICAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgICAgICBpZiAoaG9yaXpvbnRhbCkge1xyXG4gICAgICAgICAgICAgIC8vIGNvbnRhaW5lciBzdHlsZXNcclxuICAgICAgICAgICAgICBpZiAoY2Fyb3VzZWwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5zdHlsZS53aWR0aCA9IGdldENvbnRhaW5lcldpZHRoKGZpeGVkV2lkdGgsIGd1dHRlciwgaXRlbXMpO1xyXG4gICAgICAgICAgICAgIH1cclxuICBcclxuICAgICAgICAgICAgICAvLyBzbGlkZSBzdHlsZXNcclxuICAgICAgICAgICAgICB2YXIgc3RyID0gZ2V0U2xpZGVXaWR0aFN0eWxlKGZpeGVkV2lkdGgsIGd1dHRlciwgaXRlbXMpICtcclxuICAgICAgICAgICAgICAgIGdldFNsaWRlR3V0dGVyU3R5bGUoZ3V0dGVyKTtcclxuICBcclxuICAgICAgICAgICAgICAvLyByZW1vdmUgdGhlIGxhc3QgbGluZSBhbmRcclxuICAgICAgICAgICAgICAvLyBhZGQgbmV3IHN0eWxlc1xyXG4gICAgICAgICAgICAgIHJlbW92ZUNTU1J1bGUoc2hlZXQsIGdldENzc1J1bGVzTGVuZ3RoKHNoZWV0KSAtIDEpO1xyXG4gICAgICAgICAgICAgIGFkZENTU1J1bGUoc2hlZXQsICcjJyArIHNsaWRlSWQgKyAnID4gLnRucy1pdGVtJywgc3RyLCBnZXRDc3NSdWxlc0xlbmd0aChzaGVldCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgICAvLyBhdXRvIGhlaWdodFxyXG4gICAgICAgICAgaWYgKGF1dG9IZWlnaHQpIHsgZG9BdXRvSGVpZ2h0KCk7IH1cclxuICBcclxuICAgICAgICAgIGlmIChuZWVkQ29udGFpbmVyVHJhbnNmb3JtKSB7XHJcbiAgICAgICAgICAgIGRvQ29udGFpbmVyVHJhbnNmb3JtU2lsZW50KCk7XHJcbiAgICAgICAgICAgIGluZGV4Q2FjaGVkID0gaW5kZXg7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgIGlmIChicENoYW5nZWQpIHsgZXZlbnRzLmVtaXQoJ25ld0JyZWFrcG9pbnRFbmQnLCBpbmZvKGUpKTsgfVxyXG4gICAgICB9XHJcbiAgXHJcbiAgXHJcbiAgXHJcbiAgXHJcbiAgXHJcbiAgICAgIC8vID09PSBJTklUSUFMSVpBVElPTiBGVU5DVElPTlMgPT09IC8vXHJcbiAgICAgIGZ1bmN0aW9uIGdldEZyZWV6ZSAoKSB7XHJcbiAgICAgICAgaWYgKCFmaXhlZFdpZHRoICYmICFhdXRvV2lkdGgpIHtcclxuICAgICAgICAgIHZhciBhID0gY2VudGVyID8gaXRlbXMgLSAoaXRlbXMgLSAxKSAvIDIgOiBpdGVtcztcclxuICAgICAgICAgIHJldHVybiAgc2xpZGVDb3VudCA8PSBhO1xyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICB2YXIgd2lkdGggPSBmaXhlZFdpZHRoID8gKGZpeGVkV2lkdGggKyBndXR0ZXIpICogc2xpZGVDb3VudCA6IHNsaWRlUG9zaXRpb25zW3NsaWRlQ291bnRdLFxyXG4gICAgICAgICAgdnAgPSBlZGdlUGFkZGluZyA/IHZpZXdwb3J0ICsgZWRnZVBhZGRpbmcgKiAyIDogdmlld3BvcnQgKyBndXR0ZXI7XHJcbiAgXHJcbiAgICAgICAgaWYgKGNlbnRlcikge1xyXG4gICAgICAgICAgdnAgLT0gZml4ZWRXaWR0aCA/ICh2aWV3cG9ydCAtIGZpeGVkV2lkdGgpIC8gMiA6ICh2aWV3cG9ydCAtIChzbGlkZVBvc2l0aW9uc1tpbmRleCArIDFdIC0gc2xpZGVQb3NpdGlvbnNbaW5kZXhdIC0gZ3V0dGVyKSkgLyAyO1xyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICByZXR1cm4gd2lkdGggPD0gdnA7XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgZnVuY3Rpb24gc2V0QnJlYWtwb2ludFpvbmUgKCkge1xyXG4gICAgICAgIGJyZWFrcG9pbnRab25lID0gMDtcclxuICAgICAgICBmb3IgKHZhciBicCBpbiByZXNwb25zaXZlKSB7XHJcbiAgICAgICAgICBicCA9IHBhcnNlSW50KGJwKTsgLy8gY29udmVydCBzdHJpbmcgdG8gbnVtYmVyXHJcbiAgICAgICAgICBpZiAod2luZG93V2lkdGggPj0gYnApIHsgYnJlYWtwb2ludFpvbmUgPSBicDsgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gIFxyXG4gICAgICAvLyAoc2xpZGVCeSwgaW5kZXhNaW4sIGluZGV4TWF4KSA9PiBpbmRleFxyXG4gICAgICB2YXIgdXBkYXRlSW5kZXggPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBsb29wID9cclxuICAgICAgICAgIGNhcm91c2VsID9cclxuICAgICAgICAgICAgLy8gbG9vcCArIGNhcm91c2VsXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICB2YXIgbGVmdEVkZ2UgPSBpbmRleE1pbixcclxuICAgICAgICAgICAgICAgIHJpZ2h0RWRnZSA9IGluZGV4TWF4O1xyXG4gIFxyXG4gICAgICAgICAgICAgIGxlZnRFZGdlICs9IHNsaWRlQnk7XHJcbiAgICAgICAgICAgICAgcmlnaHRFZGdlIC09IHNsaWRlQnk7XHJcbiAgXHJcbiAgICAgICAgICAgICAgLy8gYWRqdXN0IGVkZ2VzIHdoZW4gaGFzIGVkZ2UgcGFkZGluZ3NcclxuICAgICAgICAgICAgICAvLyBvciBmaXhlZC13aWR0aCBzbGlkZXIgd2l0aCBleHRyYSBzcGFjZSBvbiB0aGUgcmlnaHQgc2lkZVxyXG4gICAgICAgICAgICAgIGlmIChlZGdlUGFkZGluZykge1xyXG4gICAgICAgICAgICAgICAgbGVmdEVkZ2UgKz0gMTtcclxuICAgICAgICAgICAgICAgIHJpZ2h0RWRnZSAtPSAxO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoZml4ZWRXaWR0aCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCh2aWV3cG9ydCArIGd1dHRlciklKGZpeGVkV2lkdGggKyBndXR0ZXIpKSB7IHJpZ2h0RWRnZSAtPSAxOyB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgICAgICAgIGlmIChjbG9uZUNvdW50KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiByaWdodEVkZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgaW5kZXggLT0gc2xpZGVDb3VudDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5kZXggPCBsZWZ0RWRnZSkge1xyXG4gICAgICAgICAgICAgICAgICBpbmRleCArPSBzbGlkZUNvdW50O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSA6XHJcbiAgICAgICAgICAgIC8vIGxvb3AgKyBnYWxsZXJ5XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgIGlmIChpbmRleCA+IGluZGV4TWF4KSB7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoaW5kZXggPj0gaW5kZXhNaW4gKyBzbGlkZUNvdW50KSB7IGluZGV4IC09IHNsaWRlQ291bnQ7IH1cclxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGluZGV4IDwgaW5kZXhNaW4pIHtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChpbmRleCA8PSBpbmRleE1heCAtIHNsaWRlQ291bnQpIHsgaW5kZXggKz0gc2xpZGVDb3VudDsgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSA6XHJcbiAgICAgICAgICAvLyBub24tbG9vcFxyXG4gICAgICAgICAgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGluZGV4ID0gTWF0aC5tYXgoaW5kZXhNaW4sIE1hdGgubWluKGluZGV4TWF4LCBpbmRleCkpO1xyXG4gICAgICAgICAgfTtcclxuICAgICAgfSkoKTtcclxuICBcclxuICAgICAgZnVuY3Rpb24gZGlzYWJsZVVJICgpIHtcclxuICAgICAgICBpZiAoIWF1dG9wbGF5ICYmIGF1dG9wbGF5QnV0dG9uKSB7IGhpZGVFbGVtZW50KGF1dG9wbGF5QnV0dG9uKTsgfVxyXG4gICAgICAgIGlmICghbmF2ICYmIG5hdkNvbnRhaW5lcikgeyBoaWRlRWxlbWVudChuYXZDb250YWluZXIpOyB9XHJcbiAgICAgICAgaWYgKCFjb250cm9scykge1xyXG4gICAgICAgICAgaWYgKGNvbnRyb2xzQ29udGFpbmVyKSB7XHJcbiAgICAgICAgICAgIGhpZGVFbGVtZW50KGNvbnRyb2xzQ29udGFpbmVyKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChwcmV2QnV0dG9uKSB7IGhpZGVFbGVtZW50KHByZXZCdXR0b24pOyB9XHJcbiAgICAgICAgICAgIGlmIChuZXh0QnV0dG9uKSB7IGhpZGVFbGVtZW50KG5leHRCdXR0b24pOyB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIGZ1bmN0aW9uIGVuYWJsZVVJICgpIHtcclxuICAgICAgICBpZiAoYXV0b3BsYXkgJiYgYXV0b3BsYXlCdXR0b24pIHsgc2hvd0VsZW1lbnQoYXV0b3BsYXlCdXR0b24pOyB9XHJcbiAgICAgICAgaWYgKG5hdiAmJiBuYXZDb250YWluZXIpIHsgc2hvd0VsZW1lbnQobmF2Q29udGFpbmVyKTsgfVxyXG4gICAgICAgIGlmIChjb250cm9scykge1xyXG4gICAgICAgICAgaWYgKGNvbnRyb2xzQ29udGFpbmVyKSB7XHJcbiAgICAgICAgICAgIHNob3dFbGVtZW50KGNvbnRyb2xzQ29udGFpbmVyKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChwcmV2QnV0dG9uKSB7IHNob3dFbGVtZW50KHByZXZCdXR0b24pOyB9XHJcbiAgICAgICAgICAgIGlmIChuZXh0QnV0dG9uKSB7IHNob3dFbGVtZW50KG5leHRCdXR0b24pOyB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIGZ1bmN0aW9uIGZyZWV6ZVNsaWRlciAoKSB7XHJcbiAgICAgICAgaWYgKGZyb3plbikgeyByZXR1cm47IH1cclxuICBcclxuICAgICAgICAvLyByZW1vdmUgZWRnZSBwYWRkaW5nIGZyb20gaW5uZXIgd3JhcHBlclxyXG4gICAgICAgIGlmIChlZGdlUGFkZGluZykgeyBpbm5lcldyYXBwZXIuc3R5bGUubWFyZ2luID0gJzBweCc7IH1cclxuICBcclxuICAgICAgICAvLyBhZGQgY2xhc3MgdG5zLXRyYW5zcGFyZW50IHRvIGNsb25lZCBzbGlkZXNcclxuICAgICAgICBpZiAoY2xvbmVDb3VudCkge1xyXG4gICAgICAgICAgdmFyIHN0ciA9ICd0bnMtdHJhbnNwYXJlbnQnO1xyXG4gICAgICAgICAgZm9yICh2YXIgaSA9IGNsb25lQ291bnQ7IGktLTspIHtcclxuICAgICAgICAgICAgaWYgKGNhcm91c2VsKSB7IGFkZENsYXNzKHNsaWRlSXRlbXNbaV0sIHN0cik7IH1cclxuICAgICAgICAgICAgYWRkQ2xhc3Moc2xpZGVJdGVtc1tzbGlkZUNvdW50TmV3IC0gaSAtIDFdLCBzdHIpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICAvLyB1cGRhdGUgdG9vbHNcclxuICAgICAgICBkaXNhYmxlVUkoKTtcclxuICBcclxuICAgICAgICBmcm96ZW4gPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIGZ1bmN0aW9uIHVuZnJlZXplU2xpZGVyICgpIHtcclxuICAgICAgICBpZiAoIWZyb3plbikgeyByZXR1cm47IH1cclxuICBcclxuICAgICAgICAvLyByZXN0b3JlIGVkZ2UgcGFkZGluZyBmb3IgaW5uZXIgd3JhcHBlclxyXG4gICAgICAgIC8vIGZvciBtb3JkZXJuIGJyb3dzZXJzXHJcbiAgICAgICAgaWYgKGVkZ2VQYWRkaW5nICYmIENTU01RKSB7IGlubmVyV3JhcHBlci5zdHlsZS5tYXJnaW4gPSAnJzsgfVxyXG4gIFxyXG4gICAgICAgIC8vIHJlbW92ZSBjbGFzcyB0bnMtdHJhbnNwYXJlbnQgdG8gY2xvbmVkIHNsaWRlc1xyXG4gICAgICAgIGlmIChjbG9uZUNvdW50KSB7XHJcbiAgICAgICAgICB2YXIgc3RyID0gJ3Rucy10cmFuc3BhcmVudCc7XHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gY2xvbmVDb3VudDsgaS0tOykge1xyXG4gICAgICAgICAgICBpZiAoY2Fyb3VzZWwpIHsgcmVtb3ZlQ2xhc3Moc2xpZGVJdGVtc1tpXSwgc3RyKTsgfVxyXG4gICAgICAgICAgICByZW1vdmVDbGFzcyhzbGlkZUl0ZW1zW3NsaWRlQ291bnROZXcgLSBpIC0gMV0sIHN0cik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgIC8vIHVwZGF0ZSB0b29sc1xyXG4gICAgICAgIGVuYWJsZVVJKCk7XHJcbiAgXHJcbiAgICAgICAgZnJvemVuID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgZnVuY3Rpb24gZGlzYWJsZVNsaWRlciAoKSB7XHJcbiAgICAgICAgaWYgKGRpc2FibGVkKSB7IHJldHVybjsgfVxyXG4gIFxyXG4gICAgICAgIHNoZWV0LmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICBjb250YWluZXIuY2xhc3NOYW1lID0gY29udGFpbmVyLmNsYXNzTmFtZS5yZXBsYWNlKG5ld0NvbnRhaW5lckNsYXNzZXMuc3Vic3RyaW5nKDEpLCAnJyk7XHJcbiAgICAgICAgcmVtb3ZlQXR0cnMoY29udGFpbmVyLCBbJ3N0eWxlJ10pO1xyXG4gICAgICAgIGlmIChsb29wKSB7XHJcbiAgICAgICAgICBmb3IgKHZhciBqID0gY2xvbmVDb3VudDsgai0tOykge1xyXG4gICAgICAgICAgICBpZiAoY2Fyb3VzZWwpIHsgaGlkZUVsZW1lbnQoc2xpZGVJdGVtc1tqXSk7IH1cclxuICAgICAgICAgICAgaGlkZUVsZW1lbnQoc2xpZGVJdGVtc1tzbGlkZUNvdW50TmV3IC0gaiAtIDFdKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgLy8gdmVydGljYWwgc2xpZGVyXHJcbiAgICAgICAgaWYgKCFob3Jpem9udGFsIHx8ICFjYXJvdXNlbCkgeyByZW1vdmVBdHRycyhpbm5lcldyYXBwZXIsIFsnc3R5bGUnXSk7IH1cclxuICBcclxuICAgICAgICAvLyBnYWxsZXJ5XHJcbiAgICAgICAgaWYgKCFjYXJvdXNlbCkge1xyXG4gICAgICAgICAgZm9yICh2YXIgaSA9IGluZGV4LCBsID0gaW5kZXggKyBzbGlkZUNvdW50OyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gc2xpZGVJdGVtc1tpXTtcclxuICAgICAgICAgICAgcmVtb3ZlQXR0cnMoaXRlbSwgWydzdHlsZSddKTtcclxuICAgICAgICAgICAgcmVtb3ZlQ2xhc3MoaXRlbSwgYW5pbWF0ZUluKTtcclxuICAgICAgICAgICAgcmVtb3ZlQ2xhc3MoaXRlbSwgYW5pbWF0ZU5vcm1hbCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgIC8vIHVwZGF0ZSB0b29sc1xyXG4gICAgICAgIGRpc2FibGVVSSgpO1xyXG4gIFxyXG4gICAgICAgIGRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBmdW5jdGlvbiBlbmFibGVTbGlkZXIgKCkge1xyXG4gICAgICAgIGlmICghZGlzYWJsZWQpIHsgcmV0dXJuOyB9XHJcbiAgXHJcbiAgICAgICAgc2hlZXQuZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICBjb250YWluZXIuY2xhc3NOYW1lICs9IG5ld0NvbnRhaW5lckNsYXNzZXM7XHJcbiAgICAgICAgZG9Db250YWluZXJUcmFuc2Zvcm1TaWxlbnQoKTtcclxuICBcclxuICAgICAgICBpZiAobG9vcCkge1xyXG4gICAgICAgICAgZm9yICh2YXIgaiA9IGNsb25lQ291bnQ7IGotLTspIHtcclxuICAgICAgICAgICAgaWYgKGNhcm91c2VsKSB7IHNob3dFbGVtZW50KHNsaWRlSXRlbXNbal0pOyB9XHJcbiAgICAgICAgICAgIHNob3dFbGVtZW50KHNsaWRlSXRlbXNbc2xpZGVDb3VudE5ldyAtIGogLSAxXSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgIC8vIGdhbGxlcnlcclxuICAgICAgICBpZiAoIWNhcm91c2VsKSB7XHJcbiAgICAgICAgICBmb3IgKHZhciBpID0gaW5kZXgsIGwgPSBpbmRleCArIHNsaWRlQ291bnQ7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSBzbGlkZUl0ZW1zW2ldLFxyXG4gICAgICAgICAgICAgIGNsYXNzTiA9IGkgPCBpbmRleCArIGl0ZW1zID8gYW5pbWF0ZUluIDogYW5pbWF0ZU5vcm1hbDtcclxuICAgICAgICAgICAgaXRlbS5zdHlsZS5sZWZ0ID0gKGkgLSBpbmRleCkgKiAxMDAgLyBpdGVtcyArICclJztcclxuICAgICAgICAgICAgYWRkQ2xhc3MoaXRlbSwgY2xhc3NOKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgLy8gdXBkYXRlIHRvb2xzXHJcbiAgICAgICAgZW5hYmxlVUkoKTtcclxuICBcclxuICAgICAgICBkaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIGZ1bmN0aW9uIHVwZGF0ZUxpdmVSZWdpb24gKCkge1xyXG4gICAgICAgIHZhciBzdHIgPSBnZXRMaXZlUmVnaW9uU3RyKCk7XHJcbiAgICAgICAgaWYgKGxpdmVyZWdpb25DdXJyZW50LmlubmVySFRNTCAhPT0gc3RyKSB7IGxpdmVyZWdpb25DdXJyZW50LmlubmVySFRNTCA9IHN0cjsgfVxyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIGZ1bmN0aW9uIGdldExpdmVSZWdpb25TdHIgKCkge1xyXG4gICAgICAgIHZhciBhcnIgPSBnZXRWaXNpYmxlU2xpZGVSYW5nZSgpLFxyXG4gICAgICAgICAgc3RhcnQgPSBhcnJbMF0gKyAxLFxyXG4gICAgICAgICAgZW5kID0gYXJyWzFdICsgMTtcclxuICAgICAgICByZXR1cm4gc3RhcnQgPT09IGVuZCA/IHN0YXJ0ICsgJycgOiBzdGFydCArICcgdG8gJyArIGVuZDtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBmdW5jdGlvbiBnZXRWaXNpYmxlU2xpZGVSYW5nZSAodmFsKSB7XHJcbiAgICAgICAgaWYgKHZhbCA9PSBudWxsKSB7IHZhbCA9IGdldENvbnRhaW5lclRyYW5zZm9ybVZhbHVlKCk7IH1cclxuICAgICAgICB2YXIgc3RhcnQgPSBpbmRleCwgZW5kLCByYW5nZXN0YXJ0LCByYW5nZWVuZDtcclxuICBcclxuICAgICAgICAvLyBnZXQgcmFuZ2Ugc3RhcnQsIHJhbmdlIGVuZCBmb3IgYXV0b1dpZHRoIGFuZCBmaXhlZFdpZHRoXHJcbiAgICAgICAgaWYgKGNlbnRlciB8fCBlZGdlUGFkZGluZykge1xyXG4gICAgICAgICAgaWYgKGF1dG9XaWR0aCB8fCBmaXhlZFdpZHRoKSB7XHJcbiAgICAgICAgICAgIHJhbmdlc3RhcnQgPSAtIChwYXJzZUZsb2F0KHZhbCkgKyBlZGdlUGFkZGluZyk7XHJcbiAgICAgICAgICAgIHJhbmdlZW5kID0gcmFuZ2VzdGFydCArIHZpZXdwb3J0ICsgZWRnZVBhZGRpbmcgKiAyO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAoYXV0b1dpZHRoKSB7XHJcbiAgICAgICAgICAgIHJhbmdlc3RhcnQgPSBzbGlkZVBvc2l0aW9uc1tpbmRleF07XHJcbiAgICAgICAgICAgIHJhbmdlZW5kID0gcmFuZ2VzdGFydCArIHZpZXdwb3J0O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICAvLyBnZXQgc3RhcnQsIGVuZFxyXG4gICAgICAgIC8vIC0gY2hlY2sgYXV0byB3aWR0aFxyXG4gICAgICAgIGlmIChhdXRvV2lkdGgpIHtcclxuICAgICAgICAgIHNsaWRlUG9zaXRpb25zLmZvckVhY2goZnVuY3Rpb24ocG9pbnQsIGkpIHtcclxuICAgICAgICAgICAgaWYgKGkgPCBzbGlkZUNvdW50TmV3KSB7XHJcbiAgICAgICAgICAgICAgaWYgKChjZW50ZXIgfHwgZWRnZVBhZGRpbmcpICYmIHBvaW50IDw9IHJhbmdlc3RhcnQgKyAwLjUpIHsgc3RhcnQgPSBpOyB9XHJcbiAgICAgICAgICAgICAgaWYgKHJhbmdlZW5kIC0gcG9pbnQgPj0gMC41KSB7IGVuZCA9IGk7IH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgXHJcbiAgICAgICAgICAvLyAtIGNoZWNrIHBlcmNlbnRhZ2Ugd2lkdGgsIGZpeGVkIHdpZHRoXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICBcclxuICAgICAgICAgIGlmIChmaXhlZFdpZHRoKSB7XHJcbiAgICAgICAgICAgIHZhciBjZWxsID0gZml4ZWRXaWR0aCArIGd1dHRlcjtcclxuICAgICAgICAgICAgaWYgKGNlbnRlciB8fCBlZGdlUGFkZGluZykge1xyXG4gICAgICAgICAgICAgIHN0YXJ0ID0gTWF0aC5mbG9vcihyYW5nZXN0YXJ0L2NlbGwpO1xyXG4gICAgICAgICAgICAgIGVuZCA9IE1hdGguY2VpbChyYW5nZWVuZC9jZWxsIC0gMSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgZW5kID0gc3RhcnQgKyBNYXRoLmNlaWwodmlld3BvcnQvY2VsbCkgLSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoY2VudGVyIHx8IGVkZ2VQYWRkaW5nKSB7XHJcbiAgICAgICAgICAgICAgdmFyIGEgPSBpdGVtcyAtIDE7XHJcbiAgICAgICAgICAgICAgaWYgKGNlbnRlcikge1xyXG4gICAgICAgICAgICAgICAgc3RhcnQgLT0gYSAvIDI7XHJcbiAgICAgICAgICAgICAgICBlbmQgPSBpbmRleCArIGEgLyAyO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBlbmQgPSBpbmRleCArIGE7XHJcbiAgICAgICAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgICAgICAgIGlmIChlZGdlUGFkZGluZykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGIgPSBlZGdlUGFkZGluZyAqIGl0ZW1zIC8gdmlld3BvcnQ7XHJcbiAgICAgICAgICAgICAgICBzdGFydCAtPSBiO1xyXG4gICAgICAgICAgICAgICAgZW5kICs9IGI7XHJcbiAgICAgICAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgICAgICAgIHN0YXJ0ID0gTWF0aC5mbG9vcihzdGFydCk7XHJcbiAgICAgICAgICAgICAgZW5kID0gTWF0aC5jZWlsKGVuZCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgZW5kID0gc3RhcnQgKyBpdGVtcyAtIDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICBcclxuICAgICAgICAgIHN0YXJ0ID0gTWF0aC5tYXgoc3RhcnQsIDApO1xyXG4gICAgICAgICAgZW5kID0gTWF0aC5taW4oZW5kLCBzbGlkZUNvdW50TmV3IC0gMSk7XHJcbiAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgIHJldHVybiBbc3RhcnQsIGVuZF07XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgZnVuY3Rpb24gZG9MYXp5TG9hZCAoKSB7XHJcbiAgICAgICAgaWYgKGxhenlsb2FkICYmICFkaXNhYmxlKSB7XHJcbiAgICAgICAgICBnZXRJbWFnZUFycmF5LmFwcGx5KG51bGwsIGdldFZpc2libGVTbGlkZVJhbmdlKCkpLmZvckVhY2goZnVuY3Rpb24gKGltZykge1xyXG4gICAgICAgICAgICBpZiAoIWhhc0NsYXNzKGltZywgaW1nQ29tcGxldGVDbGFzcykpIHtcclxuICAgICAgICAgICAgICAvLyBzdG9wIHByb3BhZ2F0aW9uIHRyYW5zaXRpb25lbmQgZXZlbnQgdG8gY29udGFpbmVyXHJcbiAgICAgICAgICAgICAgdmFyIGV2ZSA9IHt9O1xyXG4gICAgICAgICAgICAgIGV2ZVtUUkFOU0lUSU9ORU5EXSA9IGZ1bmN0aW9uIChlKSB7IGUuc3RvcFByb3BhZ2F0aW9uKCk7IH07XHJcbiAgICAgICAgICAgICAgYWRkRXZlbnRzKGltZywgZXZlKTtcclxuICBcclxuICAgICAgICAgICAgICBhZGRFdmVudHMoaW1nLCBpbWdFdmVudHMpO1xyXG4gIFxyXG4gICAgICAgICAgICAgIC8vIHVwZGF0ZSBzcmNcclxuICAgICAgICAgICAgICBpbWcuc3JjID0gZ2V0QXR0cihpbWcsICdkYXRhLXNyYycpO1xyXG4gIFxyXG4gICAgICAgICAgICAgIC8vIHVwZGF0ZSBzcmNzZXRcclxuICAgICAgICAgICAgICB2YXIgc3Jjc2V0ID0gZ2V0QXR0cihpbWcsICdkYXRhLXNyY3NldCcpO1xyXG4gICAgICAgICAgICAgIGlmIChzcmNzZXQpIHsgaW1nLnNyY3NldCA9IHNyY3NldDsgfVxyXG4gIFxyXG4gICAgICAgICAgICAgIGFkZENsYXNzKGltZywgJ2xvYWRpbmcnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIGZ1bmN0aW9uIG9uSW1nTG9hZGVkIChlKSB7XHJcbiAgICAgICAgaW1nTG9hZGVkKGdldFRhcmdldChlKSk7XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgZnVuY3Rpb24gb25JbWdGYWlsZWQgKGUpIHtcclxuICAgICAgICBpbWdGYWlsZWQoZ2V0VGFyZ2V0KGUpKTtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBmdW5jdGlvbiBpbWdMb2FkZWQgKGltZykge1xyXG4gICAgICAgIGFkZENsYXNzKGltZywgJ2xvYWRlZCcpO1xyXG4gICAgICAgIGltZ0NvbXBsZXRlZChpbWcpO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIGZ1bmN0aW9uIGltZ0ZhaWxlZCAoaW1nKSB7XHJcbiAgICAgICAgYWRkQ2xhc3MoaW1nLCAnZmFpbGVkJyk7XHJcbiAgICAgICAgaW1nQ29tcGxldGVkKGltZyk7XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgZnVuY3Rpb24gaW1nQ29tcGxldGVkIChpbWcpIHtcclxuICAgICAgICBhZGRDbGFzcyhpbWcsICd0bnMtY29tcGxldGUnKTtcclxuICAgICAgICByZW1vdmVDbGFzcyhpbWcsICdsb2FkaW5nJyk7XHJcbiAgICAgICAgcmVtb3ZlRXZlbnRzKGltZywgaW1nRXZlbnRzKTtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBmdW5jdGlvbiBnZXRJbWFnZUFycmF5IChzdGFydCwgZW5kKSB7XHJcbiAgICAgICAgdmFyIGltZ3MgPSBbXTtcclxuICAgICAgICB3aGlsZSAoc3RhcnQgPD0gZW5kKSB7XHJcbiAgICAgICAgICBmb3JFYWNoKHNsaWRlSXRlbXNbc3RhcnRdLnF1ZXJ5U2VsZWN0b3JBbGwoJ2ltZycpLCBmdW5jdGlvbiAoaW1nKSB7IGltZ3MucHVzaChpbWcpOyB9KTtcclxuICAgICAgICAgIHN0YXJ0Kys7XHJcbiAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgIHJldHVybiBpbWdzO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIC8vIGNoZWNrIGlmIGFsbCB2aXNpYmxlIGltYWdlcyBhcmUgbG9hZGVkXHJcbiAgICAgIC8vIGFuZCB1cGRhdGUgY29udGFpbmVyIGhlaWdodCBpZiBpdCdzIGRvbmVcclxuICAgICAgZnVuY3Rpb24gZG9BdXRvSGVpZ2h0ICgpIHtcclxuICAgICAgICB2YXIgaW1ncyA9IGdldEltYWdlQXJyYXkuYXBwbHkobnVsbCwgZ2V0VmlzaWJsZVNsaWRlUmFuZ2UoKSk7XHJcbiAgICAgICAgcmFmKGZ1bmN0aW9uKCl7IGltZ3NMb2FkZWRDaGVjayhpbWdzLCB1cGRhdGVJbm5lcldyYXBwZXJIZWlnaHQpOyB9KTtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBmdW5jdGlvbiBpbWdzTG9hZGVkQ2hlY2sgKGltZ3MsIGNiKSB7XHJcbiAgICAgICAgLy8gZGlyZWN0bHkgZXhlY3V0ZSBjYWxsYmFjayBmdW5jdGlvbiBpZiBhbGwgaW1hZ2VzIGFyZSBjb21wbGV0ZVxyXG4gICAgICAgIGlmIChpbWdzQ29tcGxldGUpIHsgcmV0dXJuIGNiKCk7IH1cclxuICBcclxuICAgICAgICAvLyBjaGVjayBzZWxlY3RlZCBpbWFnZSBjbGFzc2VzIG90aGVyd2lzZVxyXG4gICAgICAgIGltZ3MuZm9yRWFjaChmdW5jdGlvbiAoaW1nLCBpbmRleCkge1xyXG4gICAgICAgICAgaWYgKGhhc0NsYXNzKGltZywgaW1nQ29tcGxldGVDbGFzcykpIHsgaW1ncy5zcGxpY2UoaW5kZXgsIDEpOyB9XHJcbiAgICAgICAgfSk7XHJcbiAgXHJcbiAgICAgICAgLy8gZXhlY3V0ZSBjYWxsYmFjayBmdW5jdGlvbiBpZiBzZWxlY3RlZCBpbWFnZXMgYXJlIGFsbCBjb21wbGV0ZVxyXG4gICAgICAgIGlmICghaW1ncy5sZW5ndGgpIHsgcmV0dXJuIGNiKCk7IH1cclxuICBcclxuICAgICAgICAvLyBvdGhlcndpc2UgZXhlY3V0ZSB0aGlzIGZ1bmN0aW9uYSBhZ2FpblxyXG4gICAgICAgIHJhZihmdW5jdGlvbigpeyBpbWdzTG9hZGVkQ2hlY2soaW1ncywgY2IpOyB9KTtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBmdW5jdGlvbiBhZGRpdGlvbmFsVXBkYXRlcyAoKSB7XHJcbiAgICAgICAgZG9MYXp5TG9hZCgpO1xyXG4gICAgICAgIHVwZGF0ZVNsaWRlU3RhdHVzKCk7XHJcbiAgICAgICAgdXBkYXRlTGl2ZVJlZ2lvbigpO1xyXG4gICAgICAgIHVwZGF0ZUNvbnRyb2xzU3RhdHVzKCk7XHJcbiAgICAgICAgdXBkYXRlTmF2U3RhdHVzKCk7XHJcbiAgICAgIH1cclxuICBcclxuICBcclxuICAgICAgZnVuY3Rpb24gdXBkYXRlX2Nhcm91c2VsX3RyYW5zaXRpb25fZHVyYXRpb24gKCkge1xyXG4gICAgICAgIGlmIChjYXJvdXNlbCAmJiBhdXRvSGVpZ2h0KSB7XHJcbiAgICAgICAgICBtaWRkbGVXcmFwcGVyLnN0eWxlW1RSQU5TSVRJT05EVVJBVElPTl0gPSBzcGVlZCAvIDEwMDAgKyAncyc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIGZ1bmN0aW9uIGdldE1heFNsaWRlSGVpZ2h0IChzbGlkZVN0YXJ0LCBzbGlkZVJhbmdlKSB7XHJcbiAgICAgICAgdmFyIGhlaWdodHMgPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gc2xpZGVTdGFydCwgbCA9IE1hdGgubWluKHNsaWRlU3RhcnQgKyBzbGlkZVJhbmdlLCBzbGlkZUNvdW50TmV3KTsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgaGVpZ2h0cy5wdXNoKHNsaWRlSXRlbXNbaV0ub2Zmc2V0SGVpZ2h0KTtcclxuICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgcmV0dXJuIE1hdGgubWF4LmFwcGx5KG51bGwsIGhlaWdodHMpO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIC8vIHVwZGF0ZSBpbm5lciB3cmFwcGVyIGhlaWdodFxyXG4gICAgICAvLyAxLiBnZXQgdGhlIG1heC1oZWlnaHQgb2YgdGhlIHZpc2libGUgc2xpZGVzXHJcbiAgICAgIC8vIDIuIHNldCB0cmFuc2l0aW9uRHVyYXRpb24gdG8gc3BlZWRcclxuICAgICAgLy8gMy4gdXBkYXRlIGlubmVyIHdyYXBwZXIgaGVpZ2h0IHRvIG1heC1oZWlnaHRcclxuICAgICAgLy8gNC4gc2V0IHRyYW5zaXRpb25EdXJhdGlvbiB0byAwcyBhZnRlciB0cmFuc2l0aW9uIGRvbmVcclxuICAgICAgZnVuY3Rpb24gdXBkYXRlSW5uZXJXcmFwcGVySGVpZ2h0ICgpIHtcclxuICAgICAgICB2YXIgbWF4SGVpZ2h0ID0gYXV0b0hlaWdodCA/IGdldE1heFNsaWRlSGVpZ2h0KGluZGV4LCBpdGVtcykgOiBnZXRNYXhTbGlkZUhlaWdodChjbG9uZUNvdW50LCBzbGlkZUNvdW50KSxcclxuICAgICAgICAgIHdwID0gbWlkZGxlV3JhcHBlciA/IG1pZGRsZVdyYXBwZXIgOiBpbm5lcldyYXBwZXI7XHJcbiAgXHJcbiAgICAgICAgaWYgKHdwLnN0eWxlLmhlaWdodCAhPT0gbWF4SGVpZ2h0KSB7IHdwLnN0eWxlLmhlaWdodCA9IG1heEhlaWdodCArICdweCc7IH1cclxuICAgICAgfVxyXG4gIFxyXG4gICAgICAvLyBnZXQgdGhlIGRpc3RhbmNlIGZyb20gdGhlIHRvcCBlZGdlIG9mIHRoZSBmaXJzdCBzbGlkZSB0byBlYWNoIHNsaWRlXHJcbiAgICAgIC8vIChpbml0KSA9PiBzbGlkZVBvc2l0aW9uc1xyXG4gICAgICBmdW5jdGlvbiBzZXRTbGlkZVBvc2l0aW9ucyAoKSB7XHJcbiAgICAgICAgc2xpZGVQb3NpdGlvbnMgPSBbMF07XHJcbiAgICAgICAgdmFyIGF0dHIgPSBob3Jpem9udGFsID8gJ2xlZnQnIDogJ3RvcCcsXHJcbiAgICAgICAgICBhdHRyMiA9IGhvcml6b250YWwgPyAncmlnaHQnIDogJ2JvdHRvbScsXHJcbiAgICAgICAgICBiYXNlID0gc2xpZGVJdGVtc1swXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVthdHRyXTtcclxuICBcclxuICAgICAgICBmb3JFYWNoKHNsaWRlSXRlbXMsIGZ1bmN0aW9uKGl0ZW0sIGkpIHtcclxuICAgICAgICAgIC8vIHNraXAgdGhlIGZpcnN0IHNsaWRlXHJcbiAgICAgICAgICBpZiAoaSkgeyBzbGlkZVBvc2l0aW9ucy5wdXNoKGl0ZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClbYXR0cl0gLSBiYXNlKTsgfVxyXG4gICAgICAgICAgLy8gYWRkIHRoZSBlbmQgZWRnZVxyXG4gICAgICAgICAgaWYgKGkgPT09IHNsaWRlQ291bnROZXcgLSAxKSB7IHNsaWRlUG9zaXRpb25zLnB1c2goaXRlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVthdHRyMl0gLSBiYXNlKTsgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIC8vIHVwZGF0ZSBzbGlkZVxyXG4gICAgICBmdW5jdGlvbiB1cGRhdGVTbGlkZVN0YXR1cyAoKSB7XHJcbiAgICAgICAgdmFyIHJhbmdlID0gZ2V0VmlzaWJsZVNsaWRlUmFuZ2UoKSxcclxuICAgICAgICAgIHN0YXJ0ID0gcmFuZ2VbMF0sXHJcbiAgICAgICAgICBlbmQgPSByYW5nZVsxXTtcclxuICBcclxuICAgICAgICBmb3JFYWNoKHNsaWRlSXRlbXMsIGZ1bmN0aW9uKGl0ZW0sIGkpIHtcclxuICAgICAgICAgIC8vIHNob3cgc2xpZGVzXHJcbiAgICAgICAgICBpZiAoaSA+PSBzdGFydCAmJiBpIDw9IGVuZCkge1xyXG4gICAgICAgICAgICBpZiAoaGFzQXR0cihpdGVtLCAnYXJpYS1oaWRkZW4nKSkge1xyXG4gICAgICAgICAgICAgIHJlbW92ZUF0dHJzKGl0ZW0sIFsnYXJpYS1oaWRkZW4nLCAndGFiaW5kZXgnXSk7XHJcbiAgICAgICAgICAgICAgYWRkQ2xhc3MoaXRlbSwgc2xpZGVBY3RpdmVDbGFzcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gaGlkZSBzbGlkZXNcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICghaGFzQXR0cihpdGVtLCAnYXJpYS1oaWRkZW4nKSkge1xyXG4gICAgICAgICAgICAgIHNldEF0dHJzKGl0ZW0sIHtcclxuICAgICAgICAgICAgICAgICdhcmlhLWhpZGRlbic6ICd0cnVlJyxcclxuICAgICAgICAgICAgICAgICd0YWJpbmRleCc6ICctMSdcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICByZW1vdmVDbGFzcyhpdGVtLCBzbGlkZUFjdGl2ZUNsYXNzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIC8vIGdhbGxlcnk6IHVwZGF0ZSBzbGlkZSBwb3NpdGlvblxyXG4gICAgICBmdW5jdGlvbiB1cGRhdGVHYWxsZXJ5U2xpZGVQb3NpdGlvbnMgKCkge1xyXG4gICAgICAgIHZhciBsID0gaW5kZXggKyBNYXRoLm1pbihzbGlkZUNvdW50LCBpdGVtcyk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IHNsaWRlQ291bnROZXc7IGktLTspIHtcclxuICAgICAgICAgIHZhciBpdGVtID0gc2xpZGVJdGVtc1tpXTtcclxuICBcclxuICAgICAgICAgIGlmIChpID49IGluZGV4ICYmIGkgPCBsKSB7XHJcbiAgICAgICAgICAgIC8vIGFkZCB0cmFuc2l0aW9ucyB0byB2aXNpYmxlIHNsaWRlcyB3aGVuIGFkanVzdGluZyB0aGVpciBwb3NpdGlvbnNcclxuICAgICAgICAgICAgYWRkQ2xhc3MoaXRlbSwgJ3Rucy1tb3ZpbmcnKTtcclxuICBcclxuICAgICAgICAgICAgaXRlbS5zdHlsZS5sZWZ0ID0gKGkgLSBpbmRleCkgKiAxMDAgLyBpdGVtcyArICclJztcclxuICAgICAgICAgICAgYWRkQ2xhc3MoaXRlbSwgYW5pbWF0ZUluKTtcclxuICAgICAgICAgICAgcmVtb3ZlQ2xhc3MoaXRlbSwgYW5pbWF0ZU5vcm1hbCk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0uc3R5bGUubGVmdCkge1xyXG4gICAgICAgICAgICBpdGVtLnN0eWxlLmxlZnQgPSAnJztcclxuICAgICAgICAgICAgYWRkQ2xhc3MoaXRlbSwgYW5pbWF0ZU5vcm1hbCk7XHJcbiAgICAgICAgICAgIHJlbW92ZUNsYXNzKGl0ZW0sIGFuaW1hdGVJbik7XHJcbiAgICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgICAvLyByZW1vdmUgb3V0bGV0IGFuaW1hdGlvblxyXG4gICAgICAgICAgcmVtb3ZlQ2xhc3MoaXRlbSwgYW5pbWF0ZU91dCk7XHJcbiAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgIC8vIHJlbW92aW5nICcudG5zLW1vdmluZydcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgZm9yRWFjaChzbGlkZUl0ZW1zLCBmdW5jdGlvbihlbCkge1xyXG4gICAgICAgICAgICByZW1vdmVDbGFzcyhlbCwgJ3Rucy1tb3ZpbmcnKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sIDMwMCk7XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgLy8gc2V0IHRhYmluZGV4IG9uIE5hdlxyXG4gICAgICBmdW5jdGlvbiB1cGRhdGVOYXZTdGF0dXMgKCkge1xyXG4gICAgICAgIC8vIGdldCBjdXJyZW50IG5hdlxyXG4gICAgICAgIGlmIChuYXYpIHtcclxuICAgICAgICAgIG5hdkN1cnJlbnRJbmRleCA9IG5hdkNsaWNrZWQgPj0gMCA/IG5hdkNsaWNrZWQgOiBnZXRDdXJyZW50TmF2SW5kZXgoKTtcclxuICAgICAgICAgIG5hdkNsaWNrZWQgPSAtMTtcclxuICBcclxuICAgICAgICAgIGlmIChuYXZDdXJyZW50SW5kZXggIT09IG5hdkN1cnJlbnRJbmRleENhY2hlZCkge1xyXG4gICAgICAgICAgICB2YXIgbmF2UHJldiA9IG5hdkl0ZW1zW25hdkN1cnJlbnRJbmRleENhY2hlZF0sXHJcbiAgICAgICAgICAgICAgbmF2Q3VycmVudCA9IG5hdkl0ZW1zW25hdkN1cnJlbnRJbmRleF07XHJcbiAgXHJcbiAgICAgICAgICAgIHNldEF0dHJzKG5hdlByZXYsIHtcclxuICAgICAgICAgICAgICAndGFiaW5kZXgnOiAnLTEnLFxyXG4gICAgICAgICAgICAgICdhcmlhLWxhYmVsJzogbmF2U3RyICsgKG5hdkN1cnJlbnRJbmRleENhY2hlZCArIDEpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZW1vdmVDbGFzcyhuYXZQcmV2LCBuYXZBY3RpdmVDbGFzcyk7XHJcbiAgXHJcbiAgICAgICAgICAgIHNldEF0dHJzKG5hdkN1cnJlbnQsIHsnYXJpYS1sYWJlbCc6IG5hdlN0ciArIChuYXZDdXJyZW50SW5kZXggKyAxKSArIG5hdlN0ckN1cnJlbnR9KTtcclxuICAgICAgICAgICAgcmVtb3ZlQXR0cnMobmF2Q3VycmVudCwgJ3RhYmluZGV4Jyk7XHJcbiAgICAgICAgICAgIGFkZENsYXNzKG5hdkN1cnJlbnQsIG5hdkFjdGl2ZUNsYXNzKTtcclxuICBcclxuICAgICAgICAgICAgbmF2Q3VycmVudEluZGV4Q2FjaGVkID0gbmF2Q3VycmVudEluZGV4O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBmdW5jdGlvbiBnZXRMb3dlckNhc2VOb2RlTmFtZSAoZWwpIHtcclxuICAgICAgICByZXR1cm4gZWwubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBmdW5jdGlvbiBpc0J1dHRvbiAoZWwpIHtcclxuICAgICAgICByZXR1cm4gZ2V0TG93ZXJDYXNlTm9kZU5hbWUoZWwpID09PSAnYnV0dG9uJztcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBmdW5jdGlvbiBpc0FyaWFEaXNhYmxlZCAoZWwpIHtcclxuICAgICAgICByZXR1cm4gZWwuZ2V0QXR0cmlidXRlKCdhcmlhLWRpc2FibGVkJykgPT09ICd0cnVlJztcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBmdW5jdGlvbiBkaXNFbmFibGVFbGVtZW50IChpc0J1dHRvbiwgZWwsIHZhbCkge1xyXG4gICAgICAgIGlmIChpc0J1dHRvbikge1xyXG4gICAgICAgICAgZWwuZGlzYWJsZWQgPSB2YWw7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnYXJpYS1kaXNhYmxlZCcsIHZhbC50b1N0cmluZygpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgLy8gc2V0ICdkaXNhYmxlZCcgdG8gdHJ1ZSBvbiBjb250cm9scyB3aGVuIHJlYWNoIHRoZSBlZGdlc1xyXG4gICAgICBmdW5jdGlvbiB1cGRhdGVDb250cm9sc1N0YXR1cyAoKSB7XHJcbiAgICAgICAgaWYgKCFjb250cm9scyB8fCByZXdpbmQgfHwgbG9vcCkgeyByZXR1cm47IH1cclxuICBcclxuICAgICAgICB2YXIgcHJldkRpc2FibGVkID0gKHByZXZJc0J1dHRvbikgPyBwcmV2QnV0dG9uLmRpc2FibGVkIDogaXNBcmlhRGlzYWJsZWQocHJldkJ1dHRvbiksXHJcbiAgICAgICAgICBuZXh0RGlzYWJsZWQgPSAobmV4dElzQnV0dG9uKSA/IG5leHRCdXR0b24uZGlzYWJsZWQgOiBpc0FyaWFEaXNhYmxlZChuZXh0QnV0dG9uKSxcclxuICAgICAgICAgIGRpc2FibGVQcmV2ID0gKGluZGV4IDw9IGluZGV4TWluKSA/IHRydWUgOiBmYWxzZSxcclxuICAgICAgICAgIGRpc2FibGVOZXh0ID0gKCFyZXdpbmQgJiYgaW5kZXggPj0gaW5kZXhNYXgpID8gdHJ1ZSA6IGZhbHNlO1xyXG4gIFxyXG4gICAgICAgIGlmIChkaXNhYmxlUHJldiAmJiAhcHJldkRpc2FibGVkKSB7XHJcbiAgICAgICAgICBkaXNFbmFibGVFbGVtZW50KHByZXZJc0J1dHRvbiwgcHJldkJ1dHRvbiwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghZGlzYWJsZVByZXYgJiYgcHJldkRpc2FibGVkKSB7XHJcbiAgICAgICAgICBkaXNFbmFibGVFbGVtZW50KHByZXZJc0J1dHRvbiwgcHJldkJ1dHRvbiwgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZGlzYWJsZU5leHQgJiYgIW5leHREaXNhYmxlZCkge1xyXG4gICAgICAgICAgZGlzRW5hYmxlRWxlbWVudChuZXh0SXNCdXR0b24sIG5leHRCdXR0b24sIHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIWRpc2FibGVOZXh0ICYmIG5leHREaXNhYmxlZCkge1xyXG4gICAgICAgICAgZGlzRW5hYmxlRWxlbWVudChuZXh0SXNCdXR0b24sIG5leHRCdXR0b24sIGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgLy8gc2V0IGR1cmF0aW9uXHJcbiAgICAgIGZ1bmN0aW9uIHJlc2V0RHVyYXRpb24gKGVsLCBzdHIpIHtcclxuICAgICAgICBpZiAoVFJBTlNJVElPTkRVUkFUSU9OKSB7IGVsLnN0eWxlW1RSQU5TSVRJT05EVVJBVElPTl0gPSBzdHI7IH1cclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBmdW5jdGlvbiBnZXRTbGlkZXJXaWR0aCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIGZpeGVkV2lkdGggPyAoZml4ZWRXaWR0aCArIGd1dHRlcikgKiBzbGlkZUNvdW50TmV3IDogc2xpZGVQb3NpdGlvbnNbc2xpZGVDb3VudE5ld107XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgZnVuY3Rpb24gZ2V0Q2VudGVyR2FwIChudW0pIHtcclxuICAgICAgICBpZiAobnVtID09IG51bGwpIHsgbnVtID0gaW5kZXg7IH1cclxuICBcclxuICAgICAgICB2YXIgZ2FwID0gZWRnZVBhZGRpbmcgPyBndXR0ZXIgOiAwO1xyXG4gICAgICAgIHJldHVybiBhdXRvV2lkdGggPyAoKHZpZXdwb3J0IC0gZ2FwKSAtIChzbGlkZVBvc2l0aW9uc1tudW0gKyAxXSAtIHNsaWRlUG9zaXRpb25zW251bV0gLSBndXR0ZXIpKS8yIDpcclxuICAgICAgICAgIGZpeGVkV2lkdGggPyAodmlld3BvcnQgLSBmaXhlZFdpZHRoKSAvIDIgOlxyXG4gICAgICAgICAgICAoaXRlbXMgLSAxKSAvIDI7XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgZnVuY3Rpb24gZ2V0UmlnaHRCb3VuZGFyeSAoKSB7XHJcbiAgICAgICAgdmFyIGdhcCA9IGVkZ2VQYWRkaW5nID8gZ3V0dGVyIDogMCxcclxuICAgICAgICAgIHJlc3VsdCA9ICh2aWV3cG9ydCArIGdhcCkgLSBnZXRTbGlkZXJXaWR0aCgpO1xyXG4gIFxyXG4gICAgICAgIGlmIChjZW50ZXIgJiYgIWxvb3ApIHtcclxuICAgICAgICAgIHJlc3VsdCA9IGZpeGVkV2lkdGggPyAtIChmaXhlZFdpZHRoICsgZ3V0dGVyKSAqIChzbGlkZUNvdW50TmV3IC0gMSkgLSBnZXRDZW50ZXJHYXAoKSA6XHJcbiAgICAgICAgICAgIGdldENlbnRlckdhcChzbGlkZUNvdW50TmV3IC0gMSkgLSBzbGlkZVBvc2l0aW9uc1tzbGlkZUNvdW50TmV3IC0gMV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZXN1bHQgPiAwKSB7IHJlc3VsdCA9IDA7IH1cclxuICBcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIGZ1bmN0aW9uIGdldENvbnRhaW5lclRyYW5zZm9ybVZhbHVlIChudW0pIHtcclxuICAgICAgICBpZiAobnVtID09IG51bGwpIHsgbnVtID0gaW5kZXg7IH1cclxuICBcclxuICAgICAgICB2YXIgdmFsO1xyXG4gICAgICAgIGlmIChob3Jpem9udGFsICYmICFhdXRvV2lkdGgpIHtcclxuICAgICAgICAgIGlmIChmaXhlZFdpZHRoKSB7XHJcbiAgICAgICAgICAgIHZhbCA9IC0gKGZpeGVkV2lkdGggKyBndXR0ZXIpICogbnVtO1xyXG4gICAgICAgICAgICBpZiAoY2VudGVyKSB7IHZhbCArPSBnZXRDZW50ZXJHYXAoKTsgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIGRlbm9taW5hdG9yID0gVFJBTlNGT1JNID8gc2xpZGVDb3VudE5ldyA6IGl0ZW1zO1xyXG4gICAgICAgICAgICBpZiAoY2VudGVyKSB7IG51bSAtPSBnZXRDZW50ZXJHYXAoKTsgfVxyXG4gICAgICAgICAgICB2YWwgPSAtIG51bSAqIDEwMCAvIGRlbm9taW5hdG9yO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB2YWwgPSAtIHNsaWRlUG9zaXRpb25zW251bV07XHJcbiAgICAgICAgICBpZiAoY2VudGVyICYmIGF1dG9XaWR0aCkge1xyXG4gICAgICAgICAgICB2YWwgKz0gZ2V0Q2VudGVyR2FwKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgIGlmIChoYXNSaWdodERlYWRab25lKSB7IHZhbCA9IE1hdGgubWF4KHZhbCwgcmlnaHRCb3VuZGFyeSk7IH1cclxuICBcclxuICAgICAgICB2YWwgKz0gKGhvcml6b250YWwgJiYgIWF1dG9XaWR0aCAmJiAhZml4ZWRXaWR0aCkgPyAnJScgOiAncHgnO1xyXG4gIFxyXG4gICAgICAgIHJldHVybiB2YWw7XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgZnVuY3Rpb24gZG9Db250YWluZXJUcmFuc2Zvcm1TaWxlbnQgKHZhbCkge1xyXG4gICAgICAgIHJlc2V0RHVyYXRpb24oY29udGFpbmVyLCAnMHMnKTtcclxuICAgICAgICBkb0NvbnRhaW5lclRyYW5zZm9ybSh2YWwpO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIGZ1bmN0aW9uIGRvQ29udGFpbmVyVHJhbnNmb3JtICh2YWwpIHtcclxuICAgICAgICBpZiAodmFsID09IG51bGwpIHsgdmFsID0gZ2V0Q29udGFpbmVyVHJhbnNmb3JtVmFsdWUoKTsgfVxyXG4gICAgICAgIGNvbnRhaW5lci5zdHlsZVt0cmFuc2Zvcm1BdHRyXSA9IHRyYW5zZm9ybVByZWZpeCArIHZhbCArIHRyYW5zZm9ybVBvc3RmaXg7XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgZnVuY3Rpb24gYW5pbWF0ZVNsaWRlIChudW1iZXIsIGNsYXNzT3V0LCBjbGFzc0luLCBpc091dCkge1xyXG4gICAgICAgIHZhciBsID0gbnVtYmVyICsgaXRlbXM7XHJcbiAgICAgICAgaWYgKCFsb29wKSB7IGwgPSBNYXRoLm1pbihsLCBzbGlkZUNvdW50TmV3KTsgfVxyXG4gIFxyXG4gICAgICAgIGZvciAodmFyIGkgPSBudW1iZXI7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICAgIHZhciBpdGVtID0gc2xpZGVJdGVtc1tpXTtcclxuICBcclxuICAgICAgICAgIC8vIHNldCBpdGVtIHBvc2l0aW9uc1xyXG4gICAgICAgICAgaWYgKCFpc091dCkgeyBpdGVtLnN0eWxlLmxlZnQgPSAoaSAtIGluZGV4KSAqIDEwMCAvIGl0ZW1zICsgJyUnOyB9XHJcbiAgXHJcbiAgICAgICAgICBpZiAoYW5pbWF0ZURlbGF5ICYmIFRSQU5TSVRJT05ERUxBWSkge1xyXG4gICAgICAgICAgICBpdGVtLnN0eWxlW1RSQU5TSVRJT05ERUxBWV0gPSBpdGVtLnN0eWxlW0FOSU1BVElPTkRFTEFZXSA9IGFuaW1hdGVEZWxheSAqIChpIC0gbnVtYmVyKSAvIDEwMDAgKyAncyc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZW1vdmVDbGFzcyhpdGVtLCBjbGFzc091dCk7XHJcbiAgICAgICAgICBhZGRDbGFzcyhpdGVtLCBjbGFzc0luKTtcclxuICBcclxuICAgICAgICAgIGlmIChpc091dCkgeyBzbGlkZUl0ZW1zT3V0LnB1c2goaXRlbSk7IH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgLy8gbWFrZSB0cmFuc2ZlciBhZnRlciBjbGljay9kcmFnOlxyXG4gICAgICAvLyAxLiBjaGFuZ2UgJ3RyYW5zZm9ybScgcHJvcGVydHkgZm9yIG1vcmRlcm4gYnJvd3NlcnNcclxuICAgICAgLy8gMi4gY2hhbmdlICdsZWZ0JyBwcm9wZXJ0eSBmb3IgbGVnYWN5IGJyb3dzZXJzXHJcbiAgICAgIHZhciB0cmFuc2Zvcm1Db3JlID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gY2Fyb3VzZWwgP1xyXG4gICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXNldER1cmF0aW9uKGNvbnRhaW5lciwgJycpO1xyXG4gICAgICAgICAgICBpZiAoVFJBTlNJVElPTkRVUkFUSU9OIHx8ICFzcGVlZCkge1xyXG4gICAgICAgICAgICAgIC8vIGZvciBtb3JkZW4gYnJvd3NlcnMgd2l0aCBub24temVybyBkdXJhdGlvbiBvclxyXG4gICAgICAgICAgICAgIC8vIHplcm8gZHVyYXRpb24gZm9yIGFsbCBicm93c2Vyc1xyXG4gICAgICAgICAgICAgIGRvQ29udGFpbmVyVHJhbnNmb3JtKCk7XHJcbiAgICAgICAgICAgICAgLy8gcnVuIGZhbGxiYWNrIGZ1bmN0aW9uIG1hbnVhbGx5XHJcbiAgICAgICAgICAgICAgLy8gd2hlbiBkdXJhdGlvbiBpcyAwIC8gY29udGFpbmVyIGlzIGhpZGRlblxyXG4gICAgICAgICAgICAgIGlmICghc3BlZWQgfHwgIWlzVmlzaWJsZShjb250YWluZXIpKSB7IG9uVHJhbnNpdGlvbkVuZCgpOyB9XHJcbiAgXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgLy8gZm9yIG9sZCBicm93c2VyIHdpdGggbm9uLXplcm8gZHVyYXRpb25cclxuICAgICAgICAgICAgICBqc1RyYW5zZm9ybShjb250YWluZXIsIHRyYW5zZm9ybUF0dHIsIHRyYW5zZm9ybVByZWZpeCwgdHJhbnNmb3JtUG9zdGZpeCwgZ2V0Q29udGFpbmVyVHJhbnNmb3JtVmFsdWUoKSwgc3BlZWQsIG9uVHJhbnNpdGlvbkVuZCk7XHJcbiAgICAgICAgICAgIH1cclxuICBcclxuICAgICAgICAgICAgaWYgKCFob3Jpem9udGFsKSB7IHVwZGF0ZUNvbnRlbnRXcmFwcGVySGVpZ2h0KCk7IH1cclxuICAgICAgICAgIH0gOlxyXG4gICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBzbGlkZUl0ZW1zT3V0ID0gW107XHJcbiAgXHJcbiAgICAgICAgICAgIHZhciBldmUgPSB7fTtcclxuICAgICAgICAgICAgZXZlW1RSQU5TSVRJT05FTkRdID0gZXZlW0FOSU1BVElPTkVORF0gPSBvblRyYW5zaXRpb25FbmQ7XHJcbiAgICAgICAgICAgIHJlbW92ZUV2ZW50cyhzbGlkZUl0ZW1zW2luZGV4Q2FjaGVkXSwgZXZlKTtcclxuICAgICAgICAgICAgYWRkRXZlbnRzKHNsaWRlSXRlbXNbaW5kZXhdLCBldmUpO1xyXG4gIFxyXG4gICAgICAgICAgICBhbmltYXRlU2xpZGUoaW5kZXhDYWNoZWQsIGFuaW1hdGVJbiwgYW5pbWF0ZU91dCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGFuaW1hdGVTbGlkZShpbmRleCwgYW5pbWF0ZU5vcm1hbCwgYW5pbWF0ZUluKTtcclxuICBcclxuICAgICAgICAgICAgLy8gcnVuIGZhbGxiYWNrIGZ1bmN0aW9uIG1hbnVhbGx5XHJcbiAgICAgICAgICAgIC8vIHdoZW4gdHJhbnNpdGlvbiBvciBhbmltYXRpb24gbm90IHN1cHBvcnRlZCAvIGR1cmF0aW9uIGlzIDBcclxuICAgICAgICAgICAgaWYgKCFUUkFOU0lUSU9ORU5EIHx8ICFBTklNQVRJT05FTkQgfHwgIXNwZWVkIHx8ICFpc1Zpc2libGUoY29udGFpbmVyKSkgeyBvblRyYW5zaXRpb25FbmQoKTsgfVxyXG4gICAgICAgICAgfTtcclxuICAgICAgfSkoKTtcclxuICBcclxuICAgICAgZnVuY3Rpb24gcmVuZGVyIChlLCBzbGlkZXJNb3ZlZCkge1xyXG4gICAgICAgIGlmICh1cGRhdGVJbmRleEJlZm9yZVRyYW5zZm9ybSkgeyB1cGRhdGVJbmRleCgpOyB9XHJcbiAgXHJcbiAgICAgICAgLy8gcmVuZGVyIHdoZW4gc2xpZGVyIHdhcyBtb3ZlZCAodG91Y2ggb3IgZHJhZykgZXZlbiB0aG91Z2ggaW5kZXggbWF5IG5vdCBjaGFuZ2VcclxuICAgICAgICBpZiAoaW5kZXggIT09IGluZGV4Q2FjaGVkIHx8IHNsaWRlck1vdmVkKSB7XHJcbiAgICAgICAgICAvLyBldmVudHNcclxuICAgICAgICAgIGV2ZW50cy5lbWl0KCdpbmRleENoYW5nZWQnLCBpbmZvKCkpO1xyXG4gICAgICAgICAgZXZlbnRzLmVtaXQoJ3RyYW5zaXRpb25TdGFydCcsIGluZm8oKSk7XHJcbiAgICAgICAgICBpZiAoYXV0b0hlaWdodCkgeyBkb0F1dG9IZWlnaHQoKTsgfVxyXG4gIFxyXG4gICAgICAgICAgLy8gcGF1c2UgYXV0b3BsYXkgd2hlbiBjbGljayBvciBrZXlkb3duIGZyb20gdXNlclxyXG4gICAgICAgICAgaWYgKGFuaW1hdGluZyAmJiBlICYmIFsnY2xpY2snLCAna2V5ZG93biddLmluZGV4T2YoZS50eXBlKSA+PSAwKSB7IHN0b3BBdXRvcGxheSgpOyB9XHJcbiAgXHJcbiAgICAgICAgICBydW5uaW5nID0gdHJ1ZTtcclxuICAgICAgICAgIHRyYW5zZm9ybUNvcmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgLypcclxuICAgICAgICogVHJhbnNmZXIgcHJlZml4ZWQgcHJvcGVydGllcyB0byB0aGUgc2FtZSBmb3JtYXRcclxuICAgICAgICogQ1NTOiAtV2Via2l0LVRyYW5zZm9ybSA9PiB3ZWJraXR0cmFuc2Zvcm1cclxuICAgICAgICogSlM6IFdlYmtpdFRyYW5zZm9ybSA9PiB3ZWJraXR0cmFuc2Zvcm1cclxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHN0ciAtIHByb3BlcnR5XHJcbiAgICAgICAqXHJcbiAgICAgICAqL1xyXG4gICAgICBmdW5jdGlvbiBzdHJUcmFucyAoc3RyKSB7XHJcbiAgICAgICAgcmV0dXJuIHN0ci50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoLy0vZywgJycpO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIC8vIEFGVEVSIFRSQU5TRk9STVxyXG4gICAgICAvLyBUaGluZ3MgbmVlZCB0byBiZSBkb25lIGFmdGVyIGEgdHJhbnNmZXI6XHJcbiAgICAgIC8vIDEuIGNoZWNrIGluZGV4XHJcbiAgICAgIC8vIDIuIGFkZCBjbGFzc2VzIHRvIHZpc2libGUgc2xpZGVcclxuICAgICAgLy8gMy4gZGlzYWJsZSBjb250cm9scyBidXR0b25zIHdoZW4gcmVhY2ggdGhlIGZpcnN0L2xhc3Qgc2xpZGUgaW4gbm9uLWxvb3Agc2xpZGVyXHJcbiAgICAgIC8vIDQuIHVwZGF0ZSBuYXYgc3RhdHVzXHJcbiAgICAgIC8vIDUuIGxhenlsb2FkIGltYWdlc1xyXG4gICAgICAvLyA2LiB1cGRhdGUgY29udGFpbmVyIGhlaWdodFxyXG4gICAgICBmdW5jdGlvbiBvblRyYW5zaXRpb25FbmQgKGV2ZW50KSB7XHJcbiAgICAgICAgLy8gY2hlY2sgcnVubmluZyBvbiBnYWxsZXJ5IG1vZGVcclxuICAgICAgICAvLyBtYWtlIHN1cmUgdHJhbnRpb25lbmQvYW5pbWF0aW9uZW5kIGV2ZW50cyBydW4gb25seSBvbmNlXHJcbiAgICAgICAgaWYgKGNhcm91c2VsIHx8IHJ1bm5pbmcpIHtcclxuICAgICAgICAgIGV2ZW50cy5lbWl0KCd0cmFuc2l0aW9uRW5kJywgaW5mbyhldmVudCkpO1xyXG4gIFxyXG4gICAgICAgICAgaWYgKCFjYXJvdXNlbCAmJiBzbGlkZUl0ZW1zT3V0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGlkZUl0ZW1zT3V0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBzbGlkZUl0ZW1zT3V0W2ldO1xyXG4gICAgICAgICAgICAgIC8vIHNldCBpdGVtIHBvc2l0aW9uc1xyXG4gICAgICAgICAgICAgIGl0ZW0uc3R5bGUubGVmdCA9ICcnO1xyXG4gIFxyXG4gICAgICAgICAgICAgIGlmIChBTklNQVRJT05ERUxBWSAmJiBUUkFOU0lUSU9OREVMQVkpIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uc3R5bGVbQU5JTUFUSU9OREVMQVldID0gJyc7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnN0eWxlW1RSQU5TSVRJT05ERUxBWV0gPSAnJztcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgcmVtb3ZlQ2xhc3MoaXRlbSwgYW5pbWF0ZU91dCk7XHJcbiAgICAgICAgICAgICAgYWRkQ2xhc3MoaXRlbSwgYW5pbWF0ZU5vcm1hbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICBcclxuICAgICAgICAgIC8qIHVwZGF0ZSBzbGlkZXMsIG5hdiwgY29udHJvbHMgYWZ0ZXIgY2hlY2tpbmcgLi4uXHJcbiAgICAgICAgICAgKiA9PiBsZWdhY3kgYnJvd3NlcnMgd2hvIGRvbid0IHN1cHBvcnQgJ2V2ZW50J1xyXG4gICAgICAgICAgICogICAgaGF2ZSB0byBjaGVjayBldmVudCBmaXJzdCwgb3RoZXJ3aXNlIGV2ZW50LnRhcmdldCB3aWxsIGNhdXNlIGFuIGVycm9yXHJcbiAgICAgICAgICAgKiA9PiBvciAnZ2FsbGVyeScgbW9kZTpcclxuICAgICAgICAgICAqICAgKyBldmVudCB0YXJnZXQgaXMgc2xpZGUgaXRlbVxyXG4gICAgICAgICAgICogPT4gb3IgJ2Nhcm91c2VsJyBtb2RlOlxyXG4gICAgICAgICAgICogICArIGV2ZW50IHRhcmdldCBpcyBjb250YWluZXIsXHJcbiAgICAgICAgICAgKiAgICsgZXZlbnQucHJvcGVydHkgaXMgdGhlIHNhbWUgd2l0aCB0cmFuc2Zvcm0gYXR0cmlidXRlXHJcbiAgICAgICAgICAgKi9cclxuICAgICAgICAgIGlmICghZXZlbnQgfHxcclxuICAgICAgICAgICAgIWNhcm91c2VsICYmIGV2ZW50LnRhcmdldC5wYXJlbnROb2RlID09PSBjb250YWluZXIgfHxcclxuICAgICAgICAgICAgZXZlbnQudGFyZ2V0ID09PSBjb250YWluZXIgJiYgc3RyVHJhbnMoZXZlbnQucHJvcGVydHlOYW1lKSA9PT0gc3RyVHJhbnModHJhbnNmb3JtQXR0cikpIHtcclxuICBcclxuICAgICAgICAgICAgaWYgKCF1cGRhdGVJbmRleEJlZm9yZVRyYW5zZm9ybSkge1xyXG4gICAgICAgICAgICAgIHZhciBpbmRleFRlbSA9IGluZGV4O1xyXG4gICAgICAgICAgICAgIHVwZGF0ZUluZGV4KCk7XHJcbiAgICAgICAgICAgICAgaWYgKGluZGV4ICE9PSBpbmRleFRlbSkge1xyXG4gICAgICAgICAgICAgICAgZXZlbnRzLmVtaXQoJ2luZGV4Q2hhbmdlZCcsIGluZm8oKSk7XHJcbiAgXHJcbiAgICAgICAgICAgICAgICBkb0NvbnRhaW5lclRyYW5zZm9ybVNpbGVudCgpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgICAgICBpZiAobmVzdGVkID09PSAnaW5uZXInKSB7IGV2ZW50cy5lbWl0KCdpbm5lckxvYWRlZCcsIGluZm8oKSk7IH1cclxuICAgICAgICAgICAgcnVubmluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpbmRleENhY2hlZCA9IGluZGV4O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICAvLyAjIEFDVElPTlNcclxuICAgICAgZnVuY3Rpb24gZ29UbyAodGFyZ2V0SW5kZXgsIGUpIHtcclxuICAgICAgICBpZiAoZnJlZXplKSB7IHJldHVybjsgfVxyXG4gIFxyXG4gICAgICAgIC8vIHByZXYgc2xpZGVCeVxyXG4gICAgICAgIGlmICh0YXJnZXRJbmRleCA9PT0gJ3ByZXYnKSB7XHJcbiAgICAgICAgICBvbkNvbnRyb2xzQ2xpY2soZSwgLTEpO1xyXG4gIFxyXG4gICAgICAgICAgLy8gbmV4dCBzbGlkZUJ5XHJcbiAgICAgICAgfSBlbHNlIGlmICh0YXJnZXRJbmRleCA9PT0gJ25leHQnKSB7XHJcbiAgICAgICAgICBvbkNvbnRyb2xzQ2xpY2soZSwgMSk7XHJcbiAgXHJcbiAgICAgICAgICAvLyBnbyB0byBleGFjdCBzbGlkZVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAocnVubmluZykge1xyXG4gICAgICAgICAgICBpZiAocHJldmVudEFjdGlvbldoZW5SdW5uaW5nKSB7IHJldHVybjsgfSBlbHNlIHsgb25UcmFuc2l0aW9uRW5kKCk7IH1cclxuICAgICAgICAgIH1cclxuICBcclxuICAgICAgICAgIHZhciBhYnNJbmRleCA9IGdldEFic0luZGV4KCksXHJcbiAgICAgICAgICAgIGluZGV4R2FwID0gMDtcclxuICBcclxuICAgICAgICAgIGlmICh0YXJnZXRJbmRleCA9PT0gJ2ZpcnN0Jykge1xyXG4gICAgICAgICAgICBpbmRleEdhcCA9IC0gYWJzSW5kZXg7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHRhcmdldEluZGV4ID09PSAnbGFzdCcpIHtcclxuICAgICAgICAgICAgaW5kZXhHYXAgPSBjYXJvdXNlbCA/IHNsaWRlQ291bnQgLSBpdGVtcyAtIGFic0luZGV4IDogc2xpZGVDb3VudCAtIDEgLSBhYnNJbmRleDtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0SW5kZXggIT09ICdudW1iZXInKSB7IHRhcmdldEluZGV4ID0gcGFyc2VJbnQodGFyZ2V0SW5kZXgpOyB9XHJcbiAgXHJcbiAgICAgICAgICAgIGlmICghaXNOYU4odGFyZ2V0SW5kZXgpKSB7XHJcbiAgICAgICAgICAgICAgLy8gZnJvbSBkaXJlY3RseSBjYWxsZWQgZ29UbyBmdW5jdGlvblxyXG4gICAgICAgICAgICAgIGlmICghZSkgeyB0YXJnZXRJbmRleCA9IE1hdGgubWF4KDAsIE1hdGgubWluKHNsaWRlQ291bnQgLSAxLCB0YXJnZXRJbmRleCkpOyB9XHJcbiAgXHJcbiAgICAgICAgICAgICAgaW5kZXhHYXAgPSB0YXJnZXRJbmRleCAtIGFic0luZGV4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgICAvLyBnYWxsZXJ5OiBtYWtlIHN1cmUgbmV3IHBhZ2Ugd29uJ3Qgb3ZlcmxhcCB3aXRoIGN1cnJlbnQgcGFnZVxyXG4gICAgICAgICAgaWYgKCFjYXJvdXNlbCAmJiBpbmRleEdhcCAmJiBNYXRoLmFicyhpbmRleEdhcCkgPCBpdGVtcykge1xyXG4gICAgICAgICAgICB2YXIgZmFjdG9yID0gaW5kZXhHYXAgPiAwID8gMSA6IC0xO1xyXG4gICAgICAgICAgICBpbmRleEdhcCArPSAoaW5kZXggKyBpbmRleEdhcCAtIHNsaWRlQ291bnQpID49IGluZGV4TWluID8gc2xpZGVDb3VudCAqIGZhY3RvciA6IHNsaWRlQ291bnQgKiAyICogZmFjdG9yICogLTE7XHJcbiAgICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgICBpbmRleCArPSBpbmRleEdhcDtcclxuICBcclxuICAgICAgICAgIC8vIG1ha2Ugc3VyZSBpbmRleCBpcyBpbiByYW5nZVxyXG4gICAgICAgICAgaWYgKGNhcm91c2VsICYmIGxvb3ApIHtcclxuICAgICAgICAgICAgaWYgKGluZGV4IDwgaW5kZXhNaW4pIHsgaW5kZXggKz0gc2xpZGVDb3VudDsgfVxyXG4gICAgICAgICAgICBpZiAoaW5kZXggPiBpbmRleE1heCkgeyBpbmRleCAtPSBzbGlkZUNvdW50OyB9XHJcbiAgICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgICAvLyBpZiBpbmRleCBpcyBjaGFuZ2VkLCBzdGFydCByZW5kZXJpbmdcclxuICAgICAgICAgIGlmIChnZXRBYnNJbmRleChpbmRleCkgIT09IGdldEFic0luZGV4KGluZGV4Q2FjaGVkKSkge1xyXG4gICAgICAgICAgICByZW5kZXIoZSk7XHJcbiAgICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIC8vIG9uIGNvbnRyb2xzIGNsaWNrXHJcbiAgICAgIGZ1bmN0aW9uIG9uQ29udHJvbHNDbGljayAoZSwgZGlyKSB7XHJcbiAgICAgICAgaWYgKHJ1bm5pbmcpIHtcclxuICAgICAgICAgIGlmIChwcmV2ZW50QWN0aW9uV2hlblJ1bm5pbmcpIHsgcmV0dXJuOyB9IGVsc2UgeyBvblRyYW5zaXRpb25FbmQoKTsgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcGFzc0V2ZW50T2JqZWN0O1xyXG4gIFxyXG4gICAgICAgIGlmICghZGlyKSB7XHJcbiAgICAgICAgICBlID0gZ2V0RXZlbnQoZSk7XHJcbiAgICAgICAgICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGUpO1xyXG4gIFxyXG4gICAgICAgICAgd2hpbGUgKHRhcmdldCAhPT0gY29udHJvbHNDb250YWluZXIgJiYgW3ByZXZCdXR0b24sIG5leHRCdXR0b25dLmluZGV4T2YodGFyZ2V0KSA8IDApIHsgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGU7IH1cclxuICBcclxuICAgICAgICAgIHZhciB0YXJnZXRJbiA9IFtwcmV2QnV0dG9uLCBuZXh0QnV0dG9uXS5pbmRleE9mKHRhcmdldCk7XHJcbiAgICAgICAgICBpZiAodGFyZ2V0SW4gPj0gMCkge1xyXG4gICAgICAgICAgICBwYXNzRXZlbnRPYmplY3QgPSB0cnVlO1xyXG4gICAgICAgICAgICBkaXIgPSB0YXJnZXRJbiA9PT0gMCA/IC0xIDogMTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgaWYgKHJld2luZCkge1xyXG4gICAgICAgICAgaWYgKGluZGV4ID09PSBpbmRleE1pbiAmJiBkaXIgPT09IC0xKSB7XHJcbiAgICAgICAgICAgIGdvVG8oJ2xhc3QnLCBlKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChpbmRleCA9PT0gaW5kZXhNYXggJiYgZGlyID09PSAxKSB7XHJcbiAgICAgICAgICAgIGdvVG8oJ2ZpcnN0JywgZSk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgaWYgKGRpcikge1xyXG4gICAgICAgICAgaW5kZXggKz0gc2xpZGVCeSAqIGRpcjtcclxuICAgICAgICAgIGlmIChhdXRvV2lkdGgpIHsgaW5kZXggPSBNYXRoLmZsb29yKGluZGV4KTsgfVxyXG4gICAgICAgICAgLy8gcGFzcyBlIHdoZW4gY2xpY2sgY29udHJvbCBidXR0b25zIG9yIGtleWRvd25cclxuICAgICAgICAgIHJlbmRlcigocGFzc0V2ZW50T2JqZWN0IHx8IChlICYmIGUudHlwZSA9PT0gJ2tleWRvd24nKSkgPyBlIDogbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIC8vIG9uIG5hdiBjbGlja1xyXG4gICAgICBmdW5jdGlvbiBvbk5hdkNsaWNrIChlKSB7XHJcbiAgICAgICAgaWYgKHJ1bm5pbmcpIHtcclxuICAgICAgICAgIGlmIChwcmV2ZW50QWN0aW9uV2hlblJ1bm5pbmcpIHsgcmV0dXJuOyB9IGVsc2UgeyBvblRyYW5zaXRpb25FbmQoKTsgfVxyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICBlID0gZ2V0RXZlbnQoZSk7XHJcbiAgICAgICAgdmFyIHRhcmdldCA9IGdldFRhcmdldChlKSwgbmF2SW5kZXg7XHJcbiAgXHJcbiAgICAgICAgLy8gZmluZCB0aGUgY2xpY2tlZCBuYXYgaXRlbVxyXG4gICAgICAgIHdoaWxlICh0YXJnZXQgIT09IG5hdkNvbnRhaW5lciAmJiAhaGFzQXR0cih0YXJnZXQsICdkYXRhLW5hdicpKSB7IHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlOyB9XHJcbiAgICAgICAgaWYgKGhhc0F0dHIodGFyZ2V0LCAnZGF0YS1uYXYnKSkge1xyXG4gICAgICAgICAgdmFyIG5hdkluZGV4ID0gbmF2Q2xpY2tlZCA9IE51bWJlcihnZXRBdHRyKHRhcmdldCwgJ2RhdGEtbmF2JykpLFxyXG4gICAgICAgICAgICB0YXJnZXRJbmRleEJhc2UgPSBmaXhlZFdpZHRoIHx8IGF1dG9XaWR0aCA/IG5hdkluZGV4ICogc2xpZGVDb3VudCAvIHBhZ2VzIDogbmF2SW5kZXggKiBpdGVtcyxcclxuICAgICAgICAgICAgdGFyZ2V0SW5kZXggPSBuYXZBc1RodW1ibmFpbHMgPyBuYXZJbmRleCA6IE1hdGgubWluKE1hdGguY2VpbCh0YXJnZXRJbmRleEJhc2UpLCBzbGlkZUNvdW50IC0gMSk7XHJcbiAgICAgICAgICBnb1RvKHRhcmdldEluZGV4LCBlKTtcclxuICBcclxuICAgICAgICAgIGlmIChuYXZDdXJyZW50SW5kZXggPT09IG5hdkluZGV4KSB7XHJcbiAgICAgICAgICAgIGlmIChhbmltYXRpbmcpIHsgc3RvcEF1dG9wbGF5KCk7IH1cclxuICAgICAgICAgICAgbmF2Q2xpY2tlZCA9IC0xOyAvLyByZXNldCBuYXZDbGlja2VkXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIC8vIGF1dG9wbGF5IGZ1bmN0aW9uc1xyXG4gICAgICBmdW5jdGlvbiBzZXRBdXRvcGxheVRpbWVyICgpIHtcclxuICAgICAgICBhdXRvcGxheVRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgb25Db250cm9sc0NsaWNrKG51bGwsIGF1dG9wbGF5RGlyZWN0aW9uKTtcclxuICAgICAgICB9LCBhdXRvcGxheVRpbWVvdXQpO1xyXG4gIFxyXG4gICAgICAgIGFuaW1hdGluZyA9IHRydWU7XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgZnVuY3Rpb24gc3RvcEF1dG9wbGF5VGltZXIgKCkge1xyXG4gICAgICAgIGNsZWFySW50ZXJ2YWwoYXV0b3BsYXlUaW1lcik7XHJcbiAgICAgICAgYW5pbWF0aW5nID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgZnVuY3Rpb24gdXBkYXRlQXV0b3BsYXlCdXR0b24gKGFjdGlvbiwgdHh0KSB7XHJcbiAgICAgICAgc2V0QXR0cnMoYXV0b3BsYXlCdXR0b24sIHsnZGF0YS1hY3Rpb24nOiBhY3Rpb259KTtcclxuICAgICAgICBhdXRvcGxheUJ1dHRvbi5pbm5lckhUTUwgPSBhdXRvcGxheUh0bWxTdHJpbmdzWzBdICsgYWN0aW9uICsgYXV0b3BsYXlIdG1sU3RyaW5nc1sxXSArIHR4dDtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBmdW5jdGlvbiBzdGFydEF1dG9wbGF5ICgpIHtcclxuICAgICAgICBzZXRBdXRvcGxheVRpbWVyKCk7XHJcbiAgICAgICAgaWYgKGF1dG9wbGF5QnV0dG9uKSB7IHVwZGF0ZUF1dG9wbGF5QnV0dG9uKCdzdG9wJywgYXV0b3BsYXlUZXh0WzFdKTsgfVxyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIGZ1bmN0aW9uIHN0b3BBdXRvcGxheSAoKSB7XHJcbiAgICAgICAgc3RvcEF1dG9wbGF5VGltZXIoKTtcclxuICAgICAgICBpZiAoYXV0b3BsYXlCdXR0b24pIHsgdXBkYXRlQXV0b3BsYXlCdXR0b24oJ3N0YXJ0JywgYXV0b3BsYXlUZXh0WzBdKTsgfVxyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIC8vIHByb2dyYW1haXRjYWxseSBwbGF5L3BhdXNlIHRoZSBzbGlkZXJcclxuICAgICAgZnVuY3Rpb24gcGxheSAoKSB7XHJcbiAgICAgICAgaWYgKGF1dG9wbGF5ICYmICFhbmltYXRpbmcpIHtcclxuICAgICAgICAgIHN0YXJ0QXV0b3BsYXkoKTtcclxuICAgICAgICAgIGF1dG9wbGF5VXNlclBhdXNlZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBmdW5jdGlvbiBwYXVzZSAoKSB7XHJcbiAgICAgICAgaWYgKGFuaW1hdGluZykge1xyXG4gICAgICAgICAgc3RvcEF1dG9wbGF5KCk7XHJcbiAgICAgICAgICBhdXRvcGxheVVzZXJQYXVzZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBmdW5jdGlvbiB0b2dnbGVBdXRvcGxheSAoKSB7XHJcbiAgICAgICAgaWYgKGFuaW1hdGluZykge1xyXG4gICAgICAgICAgc3RvcEF1dG9wbGF5KCk7XHJcbiAgICAgICAgICBhdXRvcGxheVVzZXJQYXVzZWQgPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzdGFydEF1dG9wbGF5KCk7XHJcbiAgICAgICAgICBhdXRvcGxheVVzZXJQYXVzZWQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgZnVuY3Rpb24gb25WaXNpYmlsaXR5Q2hhbmdlICgpIHtcclxuICAgICAgICBpZiAoZG9jLmhpZGRlbikge1xyXG4gICAgICAgICAgaWYgKGFuaW1hdGluZykge1xyXG4gICAgICAgICAgICBzdG9wQXV0b3BsYXlUaW1lcigpO1xyXG4gICAgICAgICAgICBhdXRvcGxheVZpc2liaWxpdHlQYXVzZWQgPSB0cnVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoYXV0b3BsYXlWaXNpYmlsaXR5UGF1c2VkKSB7XHJcbiAgICAgICAgICBzZXRBdXRvcGxheVRpbWVyKCk7XHJcbiAgICAgICAgICBhdXRvcGxheVZpc2liaWxpdHlQYXVzZWQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgZnVuY3Rpb24gbW91c2VvdmVyUGF1c2UgKCkge1xyXG4gICAgICAgIGlmIChhbmltYXRpbmcpIHtcclxuICAgICAgICAgIHN0b3BBdXRvcGxheVRpbWVyKCk7XHJcbiAgICAgICAgICBhdXRvcGxheUhvdmVyUGF1c2VkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgZnVuY3Rpb24gbW91c2VvdXRSZXN0YXJ0ICgpIHtcclxuICAgICAgICBpZiAoYXV0b3BsYXlIb3ZlclBhdXNlZCkge1xyXG4gICAgICAgICAgc2V0QXV0b3BsYXlUaW1lcigpO1xyXG4gICAgICAgICAgYXV0b3BsYXlIb3ZlclBhdXNlZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gIFxyXG4gICAgICAvLyBrZXlkb3duIGV2ZW50cyBvbiBkb2N1bWVudFxyXG4gICAgICBmdW5jdGlvbiBvbkRvY3VtZW50S2V5ZG93biAoZSkge1xyXG4gICAgICAgIGUgPSBnZXRFdmVudChlKTtcclxuICAgICAgICB2YXIga2V5SW5kZXggPSBbS0VZUy5MRUZULCBLRVlTLlJJR0hUXS5pbmRleE9mKGUua2V5Q29kZSk7XHJcbiAgXHJcbiAgICAgICAgaWYgKGtleUluZGV4ID49IDApIHtcclxuICAgICAgICAgIG9uQ29udHJvbHNDbGljayhlLCBrZXlJbmRleCA9PT0gMCA/IC0xIDogMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIC8vIG9uIGtleSBjb250cm9sXHJcbiAgICAgIGZ1bmN0aW9uIG9uQ29udHJvbHNLZXlkb3duIChlKSB7XHJcbiAgICAgICAgZSA9IGdldEV2ZW50KGUpO1xyXG4gICAgICAgIHZhciBrZXlJbmRleCA9IFtLRVlTLkxFRlQsIEtFWVMuUklHSFRdLmluZGV4T2YoZS5rZXlDb2RlKTtcclxuICBcclxuICAgICAgICBpZiAoa2V5SW5kZXggPj0gMCkge1xyXG4gICAgICAgICAgaWYgKGtleUluZGV4ID09PSAwKSB7XHJcbiAgICAgICAgICAgIGlmICghcHJldkJ1dHRvbi5kaXNhYmxlZCkgeyBvbkNvbnRyb2xzQ2xpY2soZSwgLTEpOyB9XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKCFuZXh0QnV0dG9uLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgIG9uQ29udHJvbHNDbGljayhlLCAxKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgLy8gc2V0IGZvY3VzXHJcbiAgICAgIGZ1bmN0aW9uIHNldEZvY3VzIChlbCkge1xyXG4gICAgICAgIGVsLmZvY3VzKCk7XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgLy8gb24ga2V5IG5hdlxyXG4gICAgICBmdW5jdGlvbiBvbk5hdktleWRvd24gKGUpIHtcclxuICAgICAgICBlID0gZ2V0RXZlbnQoZSk7XHJcbiAgICAgICAgdmFyIGN1ckVsZW1lbnQgPSBkb2MuYWN0aXZlRWxlbWVudDtcclxuICAgICAgICBpZiAoIWhhc0F0dHIoY3VyRWxlbWVudCwgJ2RhdGEtbmF2JykpIHsgcmV0dXJuOyB9XHJcbiAgXHJcbiAgICAgICAgLy8gdmFyIGNvZGUgPSBlLmtleUNvZGUsXHJcbiAgICAgICAgdmFyIGtleUluZGV4ID0gW0tFWVMuTEVGVCwgS0VZUy5SSUdIVCwgS0VZUy5FTlRFUiwgS0VZUy5TUEFDRV0uaW5kZXhPZihlLmtleUNvZGUpLFxyXG4gICAgICAgICAgbmF2SW5kZXggPSBOdW1iZXIoZ2V0QXR0cihjdXJFbGVtZW50LCAnZGF0YS1uYXYnKSk7XHJcbiAgXHJcbiAgICAgICAgaWYgKGtleUluZGV4ID49IDApIHtcclxuICAgICAgICAgIGlmIChrZXlJbmRleCA9PT0gMCkge1xyXG4gICAgICAgICAgICBpZiAobmF2SW5kZXggPiAwKSB7IHNldEZvY3VzKG5hdkl0ZW1zW25hdkluZGV4IC0gMV0pOyB9XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGtleUluZGV4ID09PSAxKSB7XHJcbiAgICAgICAgICAgIGlmIChuYXZJbmRleCA8IHBhZ2VzIC0gMSkgeyBzZXRGb2N1cyhuYXZJdGVtc1tuYXZJbmRleCArIDFdKTsgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbmF2Q2xpY2tlZCA9IG5hdkluZGV4O1xyXG4gICAgICAgICAgICBnb1RvKG5hdkluZGV4LCBlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgZnVuY3Rpb24gZ2V0RXZlbnQgKGUpIHtcclxuICAgICAgICBlID0gZSB8fCB3aW4uZXZlbnQ7XHJcbiAgICAgICAgcmV0dXJuIGlzVG91Y2hFdmVudChlKSA/IGUuY2hhbmdlZFRvdWNoZXNbMF0gOiBlO1xyXG4gICAgICB9XHJcbiAgICAgIGZ1bmN0aW9uIGdldFRhcmdldCAoZSkge1xyXG4gICAgICAgIHJldHVybiBlLnRhcmdldCB8fCB3aW4uZXZlbnQuc3JjRWxlbWVudDtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBmdW5jdGlvbiBpc1RvdWNoRXZlbnQgKGUpIHtcclxuICAgICAgICByZXR1cm4gZS50eXBlLmluZGV4T2YoJ3RvdWNoJykgPj0gMDtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBmdW5jdGlvbiBwcmV2ZW50RGVmYXVsdEJlaGF2aW9yIChlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCA/IGUucHJldmVudERlZmF1bHQoKSA6IGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBmdW5jdGlvbiBnZXRNb3ZlRGlyZWN0aW9uRXhwZWN0ZWQgKCkge1xyXG4gICAgICAgIHJldHVybiBnZXRUb3VjaERpcmVjdGlvbih0b0RlZ3JlZShsYXN0UG9zaXRpb24ueSAtIGluaXRQb3NpdGlvbi55LCBsYXN0UG9zaXRpb24ueCAtIGluaXRQb3NpdGlvbi54KSwgc3dpcGVBbmdsZSkgPT09IG9wdGlvbnMuYXhpcztcclxuICAgICAgfVxyXG4gIFxyXG4gICAgICBmdW5jdGlvbiBvblBhblN0YXJ0IChlKSB7XHJcbiAgICAgICAgaWYgKHJ1bm5pbmcpIHtcclxuICAgICAgICAgIGlmIChwcmV2ZW50QWN0aW9uV2hlblJ1bm5pbmcpIHsgcmV0dXJuOyB9IGVsc2UgeyBvblRyYW5zaXRpb25FbmQoKTsgfVxyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICBpZiAoYXV0b3BsYXkgJiYgYW5pbWF0aW5nKSB7IHN0b3BBdXRvcGxheVRpbWVyKCk7IH1cclxuICBcclxuICAgICAgICBwYW5TdGFydCA9IHRydWU7XHJcbiAgICAgICAgaWYgKHJhZkluZGV4KSB7XHJcbiAgICAgICAgICBjYWYocmFmSW5kZXgpO1xyXG4gICAgICAgICAgcmFmSW5kZXggPSBudWxsO1xyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICB2YXIgJCA9IGdldEV2ZW50KGUpO1xyXG4gICAgICAgIGV2ZW50cy5lbWl0KGlzVG91Y2hFdmVudChlKSA/ICd0b3VjaFN0YXJ0JyA6ICdkcmFnU3RhcnQnLCBpbmZvKGUpKTtcclxuICBcclxuICAgICAgICBpZiAoIWlzVG91Y2hFdmVudChlKSAmJiBbJ2ltZycsICdhJ10uaW5kZXhPZihnZXRMb3dlckNhc2VOb2RlTmFtZShnZXRUYXJnZXQoZSkpKSA+PSAwKSB7XHJcbiAgICAgICAgICBwcmV2ZW50RGVmYXVsdEJlaGF2aW9yKGUpO1xyXG4gICAgICAgIH1cclxuICBcclxuICAgICAgICBsYXN0UG9zaXRpb24ueCA9IGluaXRQb3NpdGlvbi54ID0gJC5jbGllbnRYO1xyXG4gICAgICAgIGxhc3RQb3NpdGlvbi55ID0gaW5pdFBvc2l0aW9uLnkgPSAkLmNsaWVudFk7XHJcbiAgICAgICAgaWYgKGNhcm91c2VsKSB7XHJcbiAgICAgICAgICB0cmFuc2xhdGVJbml0ID0gcGFyc2VGbG9hdChjb250YWluZXIuc3R5bGVbdHJhbnNmb3JtQXR0cl0ucmVwbGFjZSh0cmFuc2Zvcm1QcmVmaXgsICcnKSk7XHJcbiAgICAgICAgICByZXNldER1cmF0aW9uKGNvbnRhaW5lciwgJzBzJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIGZ1bmN0aW9uIG9uUGFuTW92ZSAoZSkge1xyXG4gICAgICAgIGlmIChwYW5TdGFydCkge1xyXG4gICAgICAgICAgdmFyICQgPSBnZXRFdmVudChlKTtcclxuICAgICAgICAgIGxhc3RQb3NpdGlvbi54ID0gJC5jbGllbnRYO1xyXG4gICAgICAgICAgbGFzdFBvc2l0aW9uLnkgPSAkLmNsaWVudFk7XHJcbiAgXHJcbiAgICAgICAgICBpZiAoY2Fyb3VzZWwpIHtcclxuICAgICAgICAgICAgaWYgKCFyYWZJbmRleCkgeyByYWZJbmRleCA9IHJhZihmdW5jdGlvbigpeyBwYW5VcGRhdGUoZSk7IH0pOyB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAobW92ZURpcmVjdGlvbkV4cGVjdGVkID09PSAnPycpIHsgbW92ZURpcmVjdGlvbkV4cGVjdGVkID0gZ2V0TW92ZURpcmVjdGlvbkV4cGVjdGVkKCk7IH1cclxuICAgICAgICAgICAgaWYgKG1vdmVEaXJlY3Rpb25FeHBlY3RlZCkgeyBwcmV2ZW50U2Nyb2xsID0gdHJ1ZTsgfVxyXG4gICAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgICAgaWYgKHByZXZlbnRTY3JvbGwpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIGZ1bmN0aW9uIHBhblVwZGF0ZSAoZSkge1xyXG4gICAgICAgIGlmICghbW92ZURpcmVjdGlvbkV4cGVjdGVkKSB7XHJcbiAgICAgICAgICBwYW5TdGFydCA9IGZhbHNlO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYWYocmFmSW5kZXgpO1xyXG4gICAgICAgIGlmIChwYW5TdGFydCkgeyByYWZJbmRleCA9IHJhZihmdW5jdGlvbigpeyBwYW5VcGRhdGUoZSk7IH0pOyB9XHJcbiAgXHJcbiAgICAgICAgaWYgKG1vdmVEaXJlY3Rpb25FeHBlY3RlZCA9PT0gJz8nKSB7IG1vdmVEaXJlY3Rpb25FeHBlY3RlZCA9IGdldE1vdmVEaXJlY3Rpb25FeHBlY3RlZCgpOyB9XHJcbiAgICAgICAgaWYgKG1vdmVEaXJlY3Rpb25FeHBlY3RlZCkge1xyXG4gICAgICAgICAgaWYgKCFwcmV2ZW50U2Nyb2xsICYmIGlzVG91Y2hFdmVudChlKSkgeyBwcmV2ZW50U2Nyb2xsID0gdHJ1ZTsgfVxyXG4gIFxyXG4gICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGUudHlwZSkgeyBldmVudHMuZW1pdChpc1RvdWNoRXZlbnQoZSkgPyAndG91Y2hNb3ZlJyA6ICdkcmFnTW92ZScsIGluZm8oZSkpOyB9XHJcbiAgICAgICAgICB9IGNhdGNoKGVycikge31cclxuICBcclxuICAgICAgICAgIHZhciB4ID0gdHJhbnNsYXRlSW5pdCxcclxuICAgICAgICAgICAgZGlzdCA9IGdldERpc3QobGFzdFBvc2l0aW9uLCBpbml0UG9zaXRpb24pO1xyXG4gICAgICAgICAgaWYgKCFob3Jpem9udGFsIHx8IGZpeGVkV2lkdGggfHwgYXV0b1dpZHRoKSB7XHJcbiAgICAgICAgICAgIHggKz0gZGlzdDtcclxuICAgICAgICAgICAgeCArPSAncHgnO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHBlcmNlbnRhZ2VYID0gVFJBTlNGT1JNID8gZGlzdCAqIGl0ZW1zICogMTAwIC8gKCh2aWV3cG9ydCArIGd1dHRlcikgKiBzbGlkZUNvdW50TmV3KTogZGlzdCAqIDEwMCAvICh2aWV3cG9ydCArIGd1dHRlcik7XHJcbiAgICAgICAgICAgIHggKz0gcGVyY2VudGFnZVg7XHJcbiAgICAgICAgICAgIHggKz0gJyUnO1xyXG4gICAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgICAgY29udGFpbmVyLnN0eWxlW3RyYW5zZm9ybUF0dHJdID0gdHJhbnNmb3JtUHJlZml4ICsgeCArIHRyYW5zZm9ybVBvc3RmaXg7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIGZ1bmN0aW9uIG9uUGFuRW5kIChlKSB7XHJcbiAgICAgICAgaWYgKHBhblN0YXJ0KSB7XHJcbiAgICAgICAgICBpZiAocmFmSW5kZXgpIHtcclxuICAgICAgICAgICAgY2FmKHJhZkluZGV4KTtcclxuICAgICAgICAgICAgcmFmSW5kZXggPSBudWxsO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGNhcm91c2VsKSB7IHJlc2V0RHVyYXRpb24oY29udGFpbmVyLCAnJyk7IH1cclxuICAgICAgICAgIHBhblN0YXJ0ID0gZmFsc2U7XHJcbiAgXHJcbiAgICAgICAgICB2YXIgJCA9IGdldEV2ZW50KGUpO1xyXG4gICAgICAgICAgbGFzdFBvc2l0aW9uLnggPSAkLmNsaWVudFg7XHJcbiAgICAgICAgICBsYXN0UG9zaXRpb24ueSA9ICQuY2xpZW50WTtcclxuICAgICAgICAgIHZhciBkaXN0ID0gZ2V0RGlzdChsYXN0UG9zaXRpb24sIGluaXRQb3NpdGlvbik7XHJcbiAgXHJcbiAgICAgICAgICBpZiAoTWF0aC5hYnMoZGlzdCkpIHtcclxuICAgICAgICAgICAgLy8gZHJhZyB2cyBjbGlja1xyXG4gICAgICAgICAgICBpZiAoIWlzVG91Y2hFdmVudChlKSkge1xyXG4gICAgICAgICAgICAgIC8vIHByZXZlbnQgXCJjbGlja1wiXHJcbiAgICAgICAgICAgICAgdmFyIHRhcmdldCA9IGdldFRhcmdldChlKTtcclxuICAgICAgICAgICAgICBhZGRFdmVudHModGFyZ2V0LCB7J2NsaWNrJzogZnVuY3Rpb24gcHJldmVudENsaWNrIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgIHByZXZlbnREZWZhdWx0QmVoYXZpb3IoZSk7XHJcbiAgICAgICAgICAgICAgICAgIHJlbW92ZUV2ZW50cyh0YXJnZXQsIHsnY2xpY2snOiBwcmV2ZW50Q2xpY2t9KTtcclxuICAgICAgICAgICAgICAgIH19KTtcclxuICAgICAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgICAgICBpZiAoY2Fyb3VzZWwpIHtcclxuICAgICAgICAgICAgICByYWZJbmRleCA9IHJhZihmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGlmIChob3Jpem9udGFsICYmICFhdXRvV2lkdGgpIHtcclxuICAgICAgICAgICAgICAgICAgdmFyIGluZGV4TW92ZWQgPSAtIGRpc3QgKiBpdGVtcyAvICh2aWV3cG9ydCArIGd1dHRlcik7XHJcbiAgICAgICAgICAgICAgICAgIGluZGV4TW92ZWQgPSBkaXN0ID4gMCA/IE1hdGguZmxvb3IoaW5kZXhNb3ZlZCkgOiBNYXRoLmNlaWwoaW5kZXhNb3ZlZCk7XHJcbiAgICAgICAgICAgICAgICAgIGluZGV4ICs9IGluZGV4TW92ZWQ7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICB2YXIgbW92ZWQgPSAtICh0cmFuc2xhdGVJbml0ICsgZGlzdCk7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChtb3ZlZCA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBpbmRleE1pbjtcclxuICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChtb3ZlZCA+PSBzbGlkZVBvc2l0aW9uc1tzbGlkZUNvdW50TmV3IC0gMV0pIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGluZGV4TWF4O1xyXG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoaSA8IHNsaWRlQ291bnROZXcgJiYgbW92ZWQgPj0gc2xpZGVQb3NpdGlvbnNbaV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgICAgIGlmIChtb3ZlZCA+IHNsaWRlUG9zaXRpb25zW2ldICYmIGRpc3QgPCAwKSB7IGluZGV4ICs9IDE7IH1cclxuICAgICAgICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICBcclxuICAgICAgICAgICAgICAgIHJlbmRlcihlLCBkaXN0KTtcclxuICAgICAgICAgICAgICAgIGV2ZW50cy5lbWl0KGlzVG91Y2hFdmVudChlKSA/ICd0b3VjaEVuZCcgOiAnZHJhZ0VuZCcsIGluZm8oZSkpO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGlmIChtb3ZlRGlyZWN0aW9uRXhwZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgIG9uQ29udHJvbHNDbGljayhlLCBkaXN0ID4gMCA/IC0xIDogMSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgIC8vIHJlc2V0XHJcbiAgICAgICAgaWYgKG9wdGlvbnMucHJldmVudFNjcm9sbE9uVG91Y2ggPT09ICdhdXRvJykgeyBwcmV2ZW50U2Nyb2xsID0gZmFsc2U7IH1cclxuICAgICAgICBpZiAoc3dpcGVBbmdsZSkgeyBtb3ZlRGlyZWN0aW9uRXhwZWN0ZWQgPSAnPyc7IH1cclxuICAgICAgICBpZiAoYXV0b3BsYXkgJiYgIWFuaW1hdGluZykgeyBzZXRBdXRvcGxheVRpbWVyKCk7IH1cclxuICAgICAgfVxyXG4gIFxyXG4gICAgICAvLyA9PT0gUkVTSVpFIEZVTkNUSU9OUyA9PT0gLy9cclxuICAgICAgLy8gKHNsaWRlUG9zaXRpb25zLCBpbmRleCwgaXRlbXMpID0+IHZlcnRpY2FsX2NvbmVudFdyYXBwZXIuaGVpZ2h0XHJcbiAgICAgIGZ1bmN0aW9uIHVwZGF0ZUNvbnRlbnRXcmFwcGVySGVpZ2h0ICgpIHtcclxuICAgICAgICB2YXIgd3AgPSBtaWRkbGVXcmFwcGVyID8gbWlkZGxlV3JhcHBlciA6IGlubmVyV3JhcHBlcjtcclxuICAgICAgICB3cC5zdHlsZS5oZWlnaHQgPSBzbGlkZVBvc2l0aW9uc1tpbmRleCArIGl0ZW1zXSAtIHNsaWRlUG9zaXRpb25zW2luZGV4XSArICdweCc7XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgZnVuY3Rpb24gZ2V0UGFnZXMgKCkge1xyXG4gICAgICAgIHZhciByb3VnaCA9IGZpeGVkV2lkdGggPyAoZml4ZWRXaWR0aCArIGd1dHRlcikgKiBzbGlkZUNvdW50IC8gdmlld3BvcnQgOiBzbGlkZUNvdW50IC8gaXRlbXM7XHJcbiAgICAgICAgcmV0dXJuIE1hdGgubWluKE1hdGguY2VpbChyb3VnaCksIHNsaWRlQ291bnQpO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICAgIC8qXHJcbiAgICAgICAqIDEuIHVwZGF0ZSB2aXNpYmxlIG5hdiBpdGVtcyBsaXN0XHJcbiAgICAgICAqIDIuIGFkZCBcImhpZGRlblwiIGF0dHJpYnV0ZXMgdG8gcHJldmlvdXMgdmlzaWJsZSBuYXYgaXRlbXNcclxuICAgICAgICogMy4gcmVtb3ZlIFwiaGlkZGVuXCIgYXR0cnVidXRlcyB0byBuZXcgdmlzaWJsZSBuYXYgaXRlbXNcclxuICAgICAgICovXHJcbiAgICAgIGZ1bmN0aW9uIHVwZGF0ZU5hdlZpc2liaWxpdHkgKCkge1xyXG4gICAgICAgIGlmICghbmF2IHx8IG5hdkFzVGh1bWJuYWlscykgeyByZXR1cm47IH1cclxuICBcclxuICAgICAgICBpZiAocGFnZXMgIT09IHBhZ2VzQ2FjaGVkKSB7XHJcbiAgICAgICAgICB2YXIgbWluID0gcGFnZXNDYWNoZWQsXHJcbiAgICAgICAgICAgIG1heCA9IHBhZ2VzLFxyXG4gICAgICAgICAgICBmbiA9IHNob3dFbGVtZW50O1xyXG4gIFxyXG4gICAgICAgICAgaWYgKHBhZ2VzQ2FjaGVkID4gcGFnZXMpIHtcclxuICAgICAgICAgICAgbWluID0gcGFnZXM7XHJcbiAgICAgICAgICAgIG1heCA9IHBhZ2VzQ2FjaGVkO1xyXG4gICAgICAgICAgICBmbiA9IGhpZGVFbGVtZW50O1xyXG4gICAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgICAgd2hpbGUgKG1pbiA8IG1heCkge1xyXG4gICAgICAgICAgICBmbihuYXZJdGVtc1ttaW5dKTtcclxuICAgICAgICAgICAgbWluKys7XHJcbiAgICAgICAgICB9XHJcbiAgXHJcbiAgICAgICAgICAvLyBjYWNoZSBwYWdlc1xyXG4gICAgICAgICAgcGFnZXNDYWNoZWQgPSBwYWdlcztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgZnVuY3Rpb24gaW5mbyAoZSkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBjb250YWluZXI6IGNvbnRhaW5lcixcclxuICAgICAgICAgIHNsaWRlSXRlbXM6IHNsaWRlSXRlbXMsXHJcbiAgICAgICAgICBuYXZDb250YWluZXI6IG5hdkNvbnRhaW5lcixcclxuICAgICAgICAgIG5hdkl0ZW1zOiBuYXZJdGVtcyxcclxuICAgICAgICAgIGNvbnRyb2xzQ29udGFpbmVyOiBjb250cm9sc0NvbnRhaW5lcixcclxuICAgICAgICAgIGhhc0NvbnRyb2xzOiBoYXNDb250cm9scyxcclxuICAgICAgICAgIHByZXZCdXR0b246IHByZXZCdXR0b24sXHJcbiAgICAgICAgICBuZXh0QnV0dG9uOiBuZXh0QnV0dG9uLFxyXG4gICAgICAgICAgaXRlbXM6IGl0ZW1zLFxyXG4gICAgICAgICAgc2xpZGVCeTogc2xpZGVCeSxcclxuICAgICAgICAgIGNsb25lQ291bnQ6IGNsb25lQ291bnQsXHJcbiAgICAgICAgICBzbGlkZUNvdW50OiBzbGlkZUNvdW50LFxyXG4gICAgICAgICAgc2xpZGVDb3VudE5ldzogc2xpZGVDb3VudE5ldyxcclxuICAgICAgICAgIGluZGV4OiBpbmRleCxcclxuICAgICAgICAgIGluZGV4Q2FjaGVkOiBpbmRleENhY2hlZCxcclxuICAgICAgICAgIGRpc3BsYXlJbmRleDogZ2V0Q3VycmVudFNsaWRlKCksXHJcbiAgICAgICAgICBuYXZDdXJyZW50SW5kZXg6IG5hdkN1cnJlbnRJbmRleCxcclxuICAgICAgICAgIG5hdkN1cnJlbnRJbmRleENhY2hlZDogbmF2Q3VycmVudEluZGV4Q2FjaGVkLFxyXG4gICAgICAgICAgcGFnZXM6IHBhZ2VzLFxyXG4gICAgICAgICAgcGFnZXNDYWNoZWQ6IHBhZ2VzQ2FjaGVkLFxyXG4gICAgICAgICAgc2hlZXQ6IHNoZWV0LFxyXG4gICAgICAgICAgaXNPbjogaXNPbixcclxuICAgICAgICAgIGV2ZW50OiBlIHx8IHt9LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICBcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB2ZXJzaW9uOiAnMi45LjEnLFxyXG4gICAgICAgIGdldEluZm86IGluZm8sXHJcbiAgICAgICAgZXZlbnRzOiBldmVudHMsXHJcbiAgICAgICAgZ29UbzogZ29UbyxcclxuICAgICAgICBwbGF5OiBwbGF5LFxyXG4gICAgICAgIHBhdXNlOiBwYXVzZSxcclxuICAgICAgICBpc09uOiBpc09uLFxyXG4gICAgICAgIHVwZGF0ZVNsaWRlckhlaWdodDogdXBkYXRlSW5uZXJXcmFwcGVySGVpZ2h0LFxyXG4gICAgICAgIHJlZnJlc2g6IGluaXRTbGlkZXJUcmFuc2Zvcm0sXHJcbiAgICAgICAgZGVzdHJveTogZGVzdHJveSxcclxuICAgICAgICByZWJ1aWxkOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHJldHVybiB0bnMoZXh0ZW5kKG9wdGlvbnMsIG9wdGlvbnNFbGVtZW50cykpO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuICAgIH07XHJcbiAgXHJcbiAgICByZXR1cm4gdG5zO1xyXG4gIH0pKCk7Il0sImZpbGUiOiJ0aW55LXNsaWRlci5qcyJ9