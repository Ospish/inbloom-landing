/*
 * classList.js: Cross-browser full element.classList implementation.
 * 1.1.20170427
 *
 * By Eli Grey, http://eligrey.com
 * License: Dedicated to the public domain.
 *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

if ('document' in window.self) {

  // Full polyfill for browsers with no classList support
  // Including IE < Edge missing SVGElement.classList
  if (!('classList' in document.createElement('_')) 
    || document.createElementNS && !('classList' in document.createElementNS('http://www.w3.org/2000/svg','g'))) {
  
    (function (view) {
  
      'use strict';
  
      if (!('Element' in view)) return;
  
      var
        classListProp = 'classList'
        , protoProp = 'prototype'
        , elemCtrProto = view.Element[protoProp]
        , objCtr = Object
        , strTrim = String[protoProp].trim || function () {
          return this.replace(/^\s+|\s+$/g, '');
        }
        , arrIndexOf = Array[protoProp].indexOf || function (item) {
          var
            i = 0
            , len = this.length
      ;
          for (; i < len; i++) {
            if (i in this && this[i] === item) {
              return i;
            }
          }
          return -1;
        }
        // Vendors: please allow content code to instantiate DOMExceptions
        , DOMEx = function (type, message) {
          this.name = type;
          this.code = DOMException[type];
          this.message = message;
        }
        , checkTokenAndGetIndex = function (classList, token) {
          if (token === '') {
            throw new DOMEx(
              'SYNTAX_ERR'
              , 'An invalid or illegal string was specified'
            );
          }
          if (/\s/.test(token)) {
            throw new DOMEx(
              'INVALID_CHARACTER_ERR'
              , 'String contains an invalid character'
            );
          }
          return arrIndexOf.call(classList, token);
        }
        , ClassList = function (elem) {
          var
            trimmedClasses = strTrim.call(elem.getAttribute('class') || '')
            , classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
            , i = 0
            , len = classes.length
      ;
          for (; i < len; i++) {
            this.push(classes[i]);
          }
          this._updateClassName = function () {
            elem.setAttribute('class', this.toString());
          };
        }
        , classListProto = ClassList[protoProp] = []
        , classListGetter = function () {
          return new ClassList(this);
        }
  ;
  // Most DOMException implementations don't allow calling DOMException's toString()
  // on non-DOMExceptions. Error's toString() is sufficient here.
      DOMEx[protoProp] = Error[protoProp];
      classListProto.item = function (i) {
        return this[i] || null;
      };
      classListProto.contains = function (token) {
        token += '';
        return checkTokenAndGetIndex(this, token) !== -1;
      };
      classListProto.add = function () {
        var
          tokens = arguments
          , i = 0
          , l = tokens.length
          , token
          , updated = false
    ;
        do {
          token = tokens[i] + '';
          if (checkTokenAndGetIndex(this, token) === -1) {
            this.push(token);
            updated = true;
          }
        }
        while (++i < l);
  
        if (updated) {
          this._updateClassName();
        }
      };
      classListProto.remove = function () {
        var
          tokens = arguments
          , i = 0
          , l = tokens.length
          , token
          , updated = false
          , index
    ;
        do {
          token = tokens[i] + '';
          index = checkTokenAndGetIndex(this, token);
          while (index !== -1) {
            this.splice(index, 1);
            updated = true;
            index = checkTokenAndGetIndex(this, token);
          }
        }
        while (++i < l);
  
        if (updated) {
          this._updateClassName();
        }
      };
      classListProto.toggle = function (token, force) {
        token += '';
  
        var
          result = this.contains(token)
          , method = result ?
            force !== true && 'remove'
            :
            force !== false && 'add'
    ;
  
        if (method) {
          this[method](token);
        }
  
        if (force === true || force === false) {
          return force;
        } else {
          return !result;
        }
      };
      classListProto.toString = function () {
        return this.join(' ');
      };
  
      if (objCtr.defineProperty) {
        var classListPropDesc = {
          get: classListGetter
          , enumerable: true
          , configurable: true
        };
        try {
          objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
        } catch (ex) { // IE 8 doesn't support enumerable:true
          // adding undefined to fight this issue https://github.com/eligrey/classList.js/issues/36
          // modernie IE8-MSW7 machine has IE8 8.0.6001.18702 and is affected
          if (ex.number === undefined || ex.number === -0x7FF5EC54) {
            classListPropDesc.enumerable = false;
            objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
          }
        }
      } else if (objCtr[protoProp].__defineGetter__) {
        elemCtrProto.__defineGetter__(classListProp, classListGetter);
      }
  
    }(window.self));
  
  }
  
  // There is full or partial native classList support, so just check if we need
  // to normalize the add/remove and toggle APIs.
  
  (function () {
    'use strict';
  
    var testElement = document.createElement('_');
  
    testElement.classList.add('c1', 'c2');
  
    // Polyfill for IE 10/11 and Firefox <26, where classList.add and
    // classList.remove exist but support only one argument at a time.
    if (!testElement.classList.contains('c2')) {
      var createMethod = function(method) {
        var original = DOMTokenList.prototype[method];
  
        DOMTokenList.prototype[method] = function(token) {
          var i, len = arguments.length;
  
          for (i = 0; i < len; i++) {
            token = arguments[i];
            original.call(this, token);
          }
        };
      };
      createMethod('add');
      createMethod('remove');
    }
  
    testElement.classList.toggle('c3', false);
  
    // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
    // support the second argument.
    if (testElement.classList.contains('c3')) {
      var _toggle = DOMTokenList.prototype.toggle;
  
      DOMTokenList.prototype.toggle = function(token, force) {
        if (1 in arguments && !this.contains(token) === !force) {
          return force;
        } else {
          return _toggle.call(this, token);
        }
      };
  
    }
  
    testElement = null;
  }());
  
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjbGFzc0xpc3QuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLypcclxuICogY2xhc3NMaXN0LmpzOiBDcm9zcy1icm93c2VyIGZ1bGwgZWxlbWVudC5jbGFzc0xpc3QgaW1wbGVtZW50YXRpb24uXHJcbiAqIDEuMS4yMDE3MDQyN1xyXG4gKlxyXG4gKiBCeSBFbGkgR3JleSwgaHR0cDovL2VsaWdyZXkuY29tXHJcbiAqIExpY2Vuc2U6IERlZGljYXRlZCB0byB0aGUgcHVibGljIGRvbWFpbi5cclxuICogICBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2VsaWdyZXkvY2xhc3NMaXN0LmpzL2Jsb2IvbWFzdGVyL0xJQ0VOU0UubWRcclxuICovXHJcblxyXG4vKmdsb2JhbCBzZWxmLCBkb2N1bWVudCwgRE9NRXhjZXB0aW9uICovXHJcblxyXG4vKiEgQHNvdXJjZSBodHRwOi8vcHVybC5lbGlncmV5LmNvbS9naXRodWIvY2xhc3NMaXN0LmpzL2Jsb2IvbWFzdGVyL2NsYXNzTGlzdC5qcyAqL1xyXG5cclxuaWYgKCdkb2N1bWVudCcgaW4gd2luZG93LnNlbGYpIHtcclxuXHJcbiAgLy8gRnVsbCBwb2x5ZmlsbCBmb3IgYnJvd3NlcnMgd2l0aCBubyBjbGFzc0xpc3Qgc3VwcG9ydFxyXG4gIC8vIEluY2x1ZGluZyBJRSA8IEVkZ2UgbWlzc2luZyBTVkdFbGVtZW50LmNsYXNzTGlzdFxyXG4gIGlmICghKCdjbGFzc0xpc3QnIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ18nKSkgXHJcbiAgICB8fCBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMgJiYgISgnY2xhc3NMaXN0JyBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywnZycpKSkge1xyXG4gIFxyXG4gICAgKGZ1bmN0aW9uICh2aWV3KSB7XHJcbiAgXHJcbiAgICAgICd1c2Ugc3RyaWN0JztcclxuICBcclxuICAgICAgaWYgKCEoJ0VsZW1lbnQnIGluIHZpZXcpKSByZXR1cm47XHJcbiAgXHJcbiAgICAgIHZhclxyXG4gICAgICAgIGNsYXNzTGlzdFByb3AgPSAnY2xhc3NMaXN0J1xyXG4gICAgICAgICwgcHJvdG9Qcm9wID0gJ3Byb3RvdHlwZSdcclxuICAgICAgICAsIGVsZW1DdHJQcm90byA9IHZpZXcuRWxlbWVudFtwcm90b1Byb3BdXHJcbiAgICAgICAgLCBvYmpDdHIgPSBPYmplY3RcclxuICAgICAgICAsIHN0clRyaW0gPSBTdHJpbmdbcHJvdG9Qcm9wXS50cmltIHx8IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLCBhcnJJbmRleE9mID0gQXJyYXlbcHJvdG9Qcm9wXS5pbmRleE9mIHx8IGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgICB2YXJcclxuICAgICAgICAgICAgaSA9IDBcclxuICAgICAgICAgICAgLCBsZW4gPSB0aGlzLmxlbmd0aFxyXG4gICAgICA7XHJcbiAgICAgICAgICBmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gaXRlbSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFZlbmRvcnM6IHBsZWFzZSBhbGxvdyBjb250ZW50IGNvZGUgdG8gaW5zdGFudGlhdGUgRE9NRXhjZXB0aW9uc1xyXG4gICAgICAgICwgRE9NRXggPSBmdW5jdGlvbiAodHlwZSwgbWVzc2FnZSkge1xyXG4gICAgICAgICAgdGhpcy5uYW1lID0gdHlwZTtcclxuICAgICAgICAgIHRoaXMuY29kZSA9IERPTUV4Y2VwdGlvblt0eXBlXTtcclxuICAgICAgICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICwgY2hlY2tUb2tlbkFuZEdldEluZGV4ID0gZnVuY3Rpb24gKGNsYXNzTGlzdCwgdG9rZW4pIHtcclxuICAgICAgICAgIGlmICh0b2tlbiA9PT0gJycpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IERPTUV4KFxyXG4gICAgICAgICAgICAgICdTWU5UQVhfRVJSJ1xyXG4gICAgICAgICAgICAgICwgJ0FuIGludmFsaWQgb3IgaWxsZWdhbCBzdHJpbmcgd2FzIHNwZWNpZmllZCdcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmICgvXFxzLy50ZXN0KHRva2VuKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRE9NRXgoXHJcbiAgICAgICAgICAgICAgJ0lOVkFMSURfQ0hBUkFDVEVSX0VSUidcclxuICAgICAgICAgICAgICAsICdTdHJpbmcgY29udGFpbnMgYW4gaW52YWxpZCBjaGFyYWN0ZXInXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gYXJySW5kZXhPZi5jYWxsKGNsYXNzTGlzdCwgdG9rZW4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAsIENsYXNzTGlzdCA9IGZ1bmN0aW9uIChlbGVtKSB7XHJcbiAgICAgICAgICB2YXJcclxuICAgICAgICAgICAgdHJpbW1lZENsYXNzZXMgPSBzdHJUcmltLmNhbGwoZWxlbS5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykgfHwgJycpXHJcbiAgICAgICAgICAgICwgY2xhc3NlcyA9IHRyaW1tZWRDbGFzc2VzID8gdHJpbW1lZENsYXNzZXMuc3BsaXQoL1xccysvKSA6IFtdXHJcbiAgICAgICAgICAgICwgaSA9IDBcclxuICAgICAgICAgICAgLCBsZW4gPSBjbGFzc2VzLmxlbmd0aFxyXG4gICAgICA7XHJcbiAgICAgICAgICBmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHVzaChjbGFzc2VzW2ldKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuX3VwZGF0ZUNsYXNzTmFtZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgdGhpcy50b1N0cmluZygpKTtcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgICwgY2xhc3NMaXN0UHJvdG8gPSBDbGFzc0xpc3RbcHJvdG9Qcm9wXSA9IFtdXHJcbiAgICAgICAgLCBjbGFzc0xpc3RHZXR0ZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICByZXR1cm4gbmV3IENsYXNzTGlzdCh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgO1xyXG4gIC8vIE1vc3QgRE9NRXhjZXB0aW9uIGltcGxlbWVudGF0aW9ucyBkb24ndCBhbGxvdyBjYWxsaW5nIERPTUV4Y2VwdGlvbidzIHRvU3RyaW5nKClcclxuICAvLyBvbiBub24tRE9NRXhjZXB0aW9ucy4gRXJyb3IncyB0b1N0cmluZygpIGlzIHN1ZmZpY2llbnQgaGVyZS5cclxuICAgICAgRE9NRXhbcHJvdG9Qcm9wXSA9IEVycm9yW3Byb3RvUHJvcF07XHJcbiAgICAgIGNsYXNzTGlzdFByb3RvLml0ZW0gPSBmdW5jdGlvbiAoaSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzW2ldIHx8IG51bGw7XHJcbiAgICAgIH07XHJcbiAgICAgIGNsYXNzTGlzdFByb3RvLmNvbnRhaW5zID0gZnVuY3Rpb24gKHRva2VuKSB7XHJcbiAgICAgICAgdG9rZW4gKz0gJyc7XHJcbiAgICAgICAgcmV0dXJuIGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbikgIT09IC0xO1xyXG4gICAgICB9O1xyXG4gICAgICBjbGFzc0xpc3RQcm90by5hZGQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyXHJcbiAgICAgICAgICB0b2tlbnMgPSBhcmd1bWVudHNcclxuICAgICAgICAgICwgaSA9IDBcclxuICAgICAgICAgICwgbCA9IHRva2Vucy5sZW5ndGhcclxuICAgICAgICAgICwgdG9rZW5cclxuICAgICAgICAgICwgdXBkYXRlZCA9IGZhbHNlXHJcbiAgICA7XHJcbiAgICAgICAgZG8ge1xyXG4gICAgICAgICAgdG9rZW4gPSB0b2tlbnNbaV0gKyAnJztcclxuICAgICAgICAgIGlmIChjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pID09PSAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLnB1c2godG9rZW4pO1xyXG4gICAgICAgICAgICB1cGRhdGVkID0gdHJ1ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgd2hpbGUgKCsraSA8IGwpO1xyXG4gIFxyXG4gICAgICAgIGlmICh1cGRhdGVkKSB7XHJcbiAgICAgICAgICB0aGlzLl91cGRhdGVDbGFzc05hbWUoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcbiAgICAgIGNsYXNzTGlzdFByb3RvLnJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXJcclxuICAgICAgICAgIHRva2VucyA9IGFyZ3VtZW50c1xyXG4gICAgICAgICAgLCBpID0gMFxyXG4gICAgICAgICAgLCBsID0gdG9rZW5zLmxlbmd0aFxyXG4gICAgICAgICAgLCB0b2tlblxyXG4gICAgICAgICAgLCB1cGRhdGVkID0gZmFsc2VcclxuICAgICAgICAgICwgaW5kZXhcclxuICAgIDtcclxuICAgICAgICBkbyB7XHJcbiAgICAgICAgICB0b2tlbiA9IHRva2Vuc1tpXSArICcnO1xyXG4gICAgICAgICAgaW5kZXggPSBjaGVja1Rva2VuQW5kR2V0SW5kZXgodGhpcywgdG9rZW4pO1xyXG4gICAgICAgICAgd2hpbGUgKGluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIHVwZGF0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBpbmRleCA9IGNoZWNrVG9rZW5BbmRHZXRJbmRleCh0aGlzLCB0b2tlbik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdoaWxlICgrK2kgPCBsKTtcclxuICBcclxuICAgICAgICBpZiAodXBkYXRlZCkge1xyXG4gICAgICAgICAgdGhpcy5fdXBkYXRlQ2xhc3NOYW1lKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG4gICAgICBjbGFzc0xpc3RQcm90by50b2dnbGUgPSBmdW5jdGlvbiAodG9rZW4sIGZvcmNlKSB7XHJcbiAgICAgICAgdG9rZW4gKz0gJyc7XHJcbiAgXHJcbiAgICAgICAgdmFyXHJcbiAgICAgICAgICByZXN1bHQgPSB0aGlzLmNvbnRhaW5zKHRva2VuKVxyXG4gICAgICAgICAgLCBtZXRob2QgPSByZXN1bHQgP1xyXG4gICAgICAgICAgICBmb3JjZSAhPT0gdHJ1ZSAmJiAncmVtb3ZlJ1xyXG4gICAgICAgICAgICA6XHJcbiAgICAgICAgICAgIGZvcmNlICE9PSBmYWxzZSAmJiAnYWRkJ1xyXG4gICAgO1xyXG4gIFxyXG4gICAgICAgIGlmIChtZXRob2QpIHtcclxuICAgICAgICAgIHRoaXNbbWV0aG9kXSh0b2tlbik7XHJcbiAgICAgICAgfVxyXG4gIFxyXG4gICAgICAgIGlmIChmb3JjZSA9PT0gdHJ1ZSB8fCBmb3JjZSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIHJldHVybiBmb3JjZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmV0dXJuICFyZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG4gICAgICBjbGFzc0xpc3RQcm90by50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5qb2luKCcgJyk7XHJcbiAgICAgIH07XHJcbiAgXHJcbiAgICAgIGlmIChvYmpDdHIuZGVmaW5lUHJvcGVydHkpIHtcclxuICAgICAgICB2YXIgY2xhc3NMaXN0UHJvcERlc2MgPSB7XHJcbiAgICAgICAgICBnZXQ6IGNsYXNzTGlzdEdldHRlclxyXG4gICAgICAgICAgLCBlbnVtZXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAsIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIG9iakN0ci5kZWZpbmVQcm9wZXJ0eShlbGVtQ3RyUHJvdG8sIGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdFByb3BEZXNjKTtcclxuICAgICAgICB9IGNhdGNoIChleCkgeyAvLyBJRSA4IGRvZXNuJ3Qgc3VwcG9ydCBlbnVtZXJhYmxlOnRydWVcclxuICAgICAgICAgIC8vIGFkZGluZyB1bmRlZmluZWQgdG8gZmlnaHQgdGhpcyBpc3N1ZSBodHRwczovL2dpdGh1Yi5jb20vZWxpZ3JleS9jbGFzc0xpc3QuanMvaXNzdWVzLzM2XHJcbiAgICAgICAgICAvLyBtb2Rlcm5pZSBJRTgtTVNXNyBtYWNoaW5lIGhhcyBJRTggOC4wLjYwMDEuMTg3MDIgYW5kIGlzIGFmZmVjdGVkXHJcbiAgICAgICAgICBpZiAoZXgubnVtYmVyID09PSB1bmRlZmluZWQgfHwgZXgubnVtYmVyID09PSAtMHg3RkY1RUM1NCkge1xyXG4gICAgICAgICAgICBjbGFzc0xpc3RQcm9wRGVzYy5lbnVtZXJhYmxlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIG9iakN0ci5kZWZpbmVQcm9wZXJ0eShlbGVtQ3RyUHJvdG8sIGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdFByb3BEZXNjKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAob2JqQ3RyW3Byb3RvUHJvcF0uX19kZWZpbmVHZXR0ZXJfXykge1xyXG4gICAgICAgIGVsZW1DdHJQcm90by5fX2RlZmluZUdldHRlcl9fKGNsYXNzTGlzdFByb3AsIGNsYXNzTGlzdEdldHRlcik7XHJcbiAgICAgIH1cclxuICBcclxuICAgIH0od2luZG93LnNlbGYpKTtcclxuICBcclxuICB9XHJcbiAgXHJcbiAgLy8gVGhlcmUgaXMgZnVsbCBvciBwYXJ0aWFsIG5hdGl2ZSBjbGFzc0xpc3Qgc3VwcG9ydCwgc28ganVzdCBjaGVjayBpZiB3ZSBuZWVkXHJcbiAgLy8gdG8gbm9ybWFsaXplIHRoZSBhZGQvcmVtb3ZlIGFuZCB0b2dnbGUgQVBJcy5cclxuICBcclxuICAoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gIFxyXG4gICAgdmFyIHRlc3RFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnXycpO1xyXG4gIFxyXG4gICAgdGVzdEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYzEnLCAnYzInKTtcclxuICBcclxuICAgIC8vIFBvbHlmaWxsIGZvciBJRSAxMC8xMSBhbmQgRmlyZWZveCA8MjYsIHdoZXJlIGNsYXNzTGlzdC5hZGQgYW5kXHJcbiAgICAvLyBjbGFzc0xpc3QucmVtb3ZlIGV4aXN0IGJ1dCBzdXBwb3J0IG9ubHkgb25lIGFyZ3VtZW50IGF0IGEgdGltZS5cclxuICAgIGlmICghdGVzdEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjMicpKSB7XHJcbiAgICAgIHZhciBjcmVhdGVNZXRob2QgPSBmdW5jdGlvbihtZXRob2QpIHtcclxuICAgICAgICB2YXIgb3JpZ2luYWwgPSBET01Ub2tlbkxpc3QucHJvdG90eXBlW21ldGhvZF07XHJcbiAgXHJcbiAgICAgICAgRE9NVG9rZW5MaXN0LnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odG9rZW4pIHtcclxuICAgICAgICAgIHZhciBpLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xyXG4gIFxyXG4gICAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRva2VuID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBvcmlnaW5hbC5jYWxsKHRoaXMsIHRva2VuKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICB9O1xyXG4gICAgICBjcmVhdGVNZXRob2QoJ2FkZCcpO1xyXG4gICAgICBjcmVhdGVNZXRob2QoJ3JlbW92ZScpO1xyXG4gICAgfVxyXG4gIFxyXG4gICAgdGVzdEVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZSgnYzMnLCBmYWxzZSk7XHJcbiAgXHJcbiAgICAvLyBQb2x5ZmlsbCBmb3IgSUUgMTAgYW5kIEZpcmVmb3ggPDI0LCB3aGVyZSBjbGFzc0xpc3QudG9nZ2xlIGRvZXMgbm90XHJcbiAgICAvLyBzdXBwb3J0IHRoZSBzZWNvbmQgYXJndW1lbnQuXHJcbiAgICBpZiAodGVzdEVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjMycpKSB7XHJcbiAgICAgIHZhciBfdG9nZ2xlID0gRE9NVG9rZW5MaXN0LnByb3RvdHlwZS50b2dnbGU7XHJcbiAgXHJcbiAgICAgIERPTVRva2VuTGlzdC5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24odG9rZW4sIGZvcmNlKSB7XHJcbiAgICAgICAgaWYgKDEgaW4gYXJndW1lbnRzICYmICF0aGlzLmNvbnRhaW5zKHRva2VuKSA9PT0gIWZvcmNlKSB7XHJcbiAgICAgICAgICByZXR1cm4gZm9yY2U7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJldHVybiBfdG9nZ2xlLmNhbGwodGhpcywgdG9rZW4pO1xyXG4gICAgICAgIH1cclxuICAgICAgfTtcclxuICBcclxuICAgIH1cclxuICBcclxuICAgIHRlc3RFbGVtZW50ID0gbnVsbDtcclxuICB9KCkpO1xyXG4gIFxyXG59Il0sImZpbGUiOiJjbGFzc0xpc3QuanMifQ==