(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = document.querySelectorAll('.reveal');

  /* Apparition au scroll : fade + translation, sans rebond */
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    items.forEach(function (el, i) {
      // léger échelonnement pour les lignes de la tracklist
      if (el.parentElement && el.parentElement.classList.contains('tracklist')) {
        el.style.transitionDelay = (i % 3) * 60 + 'ms';
      }
      io.observe(el);
    });
  }

  /* Parallaxe discrète sur les formes de fond */
  if (reduce) return;

  var shapes = Array.prototype.slice.call(document.querySelectorAll('.shape'));
  var ticking = false;

  function update() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    shapes.forEach(function (s) {
      var speed = parseFloat(s.getAttribute('data-speed')) || 0;
      s.style.setProperty('--py', (y * speed).toFixed(1) + 'px');
    });
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }, { passive: true });

  update();
})();
