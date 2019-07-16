var btnBurger = document.getElementById('btn-burger');
var nav = document.getElementById('nav');
btnBurger.onclick = function() {
  nav.classList.toggle('is-visible');
};