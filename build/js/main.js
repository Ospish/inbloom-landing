function getCoords(e){var t=e.getBoundingClientRect();return{top:t.top+pageYOffset,left:t.left+pageXOffset}}!function(e){e.matches=e.matches||e.mozMatchesSelector||e.msMatchesSelector||e.oMatchesSelector||e.webkitMatchesSelector,e.closest=e.closest||function(e){return this?this.matches(e)?this:this.parentElement?this.parentElement.closest(e):null:null}}(Element.prototype),document.querySelectorAll('a[href^="#"]').forEach(function(e){e.addEventListener("click",function(e){e.preventDefault();var t=document.querySelector(this.getAttribute("href"));window.scroll({top:getCoords(t).top,behavior:"smooth"})})}),function(e,t){var A=[],r=[],n={_version:"3.6.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,t){var n=this;setTimeout(function(){t(n[e])},0)},addTest:function(e,t,n){r.push({name:e,fn:t,options:n})},addAsyncTest:function(e){r.push({name:null,fn:e})}},l=function(){};function c(e,t){return typeof e===t}l.prototype=n,l=new l;var i,o,s=t.documentElement,a="svg"===s.nodeName.toLowerCase();function f(e){var t=s.className,n=l._config.classPrefix||"";if(a&&(t=t.baseVal),l._config.enableJSClass){var o=new RegExp("(^|\\s)"+n+"no-js(\\s|$)");t=t.replace(o,"$1"+n+"js$2")}l._config.enableClasses&&(t+=" "+n+e.join(" "+n),a?s.className.baseVal=t:s.className=t)}function u(e,t){if("object"==typeof e)for(var n in e)i(e,n)&&u(n,e[n]);else{var o=(e=e.toLowerCase()).split("."),s=l[o[0]];if(2==o.length&&(s=s[o[1]]),void 0!==s)return l;t="function"==typeof t?t():t,1==o.length?l[o[0]]=t:(!l[o[0]]||l[o[0]]instanceof Boolean||(l[o[0]]=new Boolean(l[o[0]])),l[o[0]][o[1]]=t),f([(t&&0!=t?"":"no-")+o.join("-")]),l._trigger(e,t)}return l}i=c(o={}.hasOwnProperty,"undefined")||c(o.call,"undefined")?function(e,t){return t in e&&c(e.constructor.prototype[t],"undefined")}:function(e,t){return o.call(e,t)},n._l={},n.on=function(e,t){this._l[e]||(this._l[e]=[]),this._l[e].push(t),l.hasOwnProperty(e)&&setTimeout(function(){l._trigger(e,l[e])},0)},n._trigger=function(e,t){if(this._l[e]){var n=this._l[e];setTimeout(function(){var e;for(e=0;e<n.length;e++)(0,n[e])(t)},0),delete this._l[e]}},l._q.push(function(){n.addTest=u}),l.addAsyncTest(function(){var n=[{uri:"data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=",name:"webp"},{uri:"data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA==",name:"webp.alpha"},{uri:"data:image/webp;base64,UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA",name:"webp.animation"},{uri:"data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=",name:"webp.lossless"}],e=n.shift();function o(n,e,o){var s=new Image;function t(e){var t=!(!e||"load"!==e.type)&&1==s.width;u(n,"webp"===n&&t?new Boolean(t):t),o&&o(e)}s.onerror=t,s.onload=t,s.src=e}o(e.name,e.uri,function(e){if(e&&"load"===e.type)for(var t=0;t<n.length;t++)o(n[t].name,n[t].uri)})}),function(){var e,t,n,o,s,i;for(var a in r)if(r.hasOwnProperty(a)){if(e=[],(t=r[a]).name&&(e.push(t.name.toLowerCase()),t.options&&t.options.aliases&&t.options.aliases.length))for(n=0;n<t.options.aliases.length;n++)e.push(t.options.aliases[n].toLowerCase());for(o=c(t.fn,"function")?t.fn():t.fn,s=0;s<e.length;s++)1===(i=(void 0).split(".")).length?l[i[0]]=o:(!l[i[0]]||l[i[0]]instanceof Boolean||(l[i[0]]=new Boolean(l[i[0]])),l[i[0]][i[1]]=o),A.push((o?"":"no-")+i.join("-"))}}(),f(A),delete n.addTest,delete n.addAsyncTest;for(var d=0;d<l._q.length;d++)l._q[d]();e.Modernizr=l}(window,document);var btnBurger=document.getElementById("btn-burger"),nav=document.getElementById("nav");btnBurger.onclick=function(){nav.classList.toggle("is-visible")},Modernizr.on("webp"),AOS.init({duration:1e3});var selectSizeList=document.getElementById("select-size-list");if(selectSizeList)var selectSizeListSlider=tns({container:selectSizeList,items:1,controls:!1,nav:!1,pages:!1,gutter:30,responsive:{767:{items:3}}});var portfolioSliderElement=document.getElementById("portfolio-slider");if(portfolioSliderElement)var portfolioSlider=tns({container:portfolioSliderElement,items:1,controls:!1,disable:!1,nav:!1,pages:!1,autoHeight:!0,gutter:30});window.matchMedia("( min-width: 568px )").matches&&portfolioSlider.destroy(),document.onclick=function(e){console.log(e.target),e.target.classList.contains("js-open-size-card")&&e.target.closest(".js-size-card").classList.add("is-active"),e.target.classList.contains("js-close-size-card")&&e.target.closest(".js-size-card").classList.remove("is-active")};