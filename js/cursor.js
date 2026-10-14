/* ============================================================
   STACKLY — cursor.js
   Custom cursor: dot + trailing ring, hover expansion,
   magnetic pull on [data-magnetic] elements. Desktop only.
   ============================================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;

    var dot = document.createElement('div');
    var ring = document.createElement('div');
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    var mx = -100, my = -100, rx = -100, ry = -100;
    var visible = false;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (!visible) { visible = true; dot.style.opacity = 1; ring.style.opacity = 1; rx = mx; ry = my; }
      dot.style.transform = 'translate(' + (mx - 3.5) + 'px,' + (my - 3.5) + 'px)';
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      visible = false; dot.style.opacity = 0; ring.style.opacity = 0;
    });

    (function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      var s = ring.offsetWidth / 2;
      ring.style.transform = 'translate(' + (rx - s) + 'px,' + (ry - s) + 'px)';
      requestAnimationFrame(loop);
    })();

    /* hover states via delegation */
    var HOVER_SEL = 'a,button,[data-cursor],input,select,textarea,label.check';
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(HOVER_SEL)) ring.classList.add('is-hover');
      if (e.target.closest('.site-footer,.workflow-sec,.testi-sec,.cta-box,.mobile-nav,.dash-sidebar,.nf-page')) {
        ring.classList.add('is-dark'); dot.classList.add('is-dark');
      } else {
        ring.classList.remove('is-dark'); dot.classList.remove('is-dark');
      }
    }, { passive: true });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(HOVER_SEL)) ring.classList.remove('is-hover');
    }, { passive: true });

    /* magnetic elements */
    document.querySelectorAll('.btn,[data-magnetic]').forEach(function (el) {
      var strength = 22;
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        el.style.transform = 'translate(' + (x / r.width) * strength + 'px,' + (y / r.height) * strength + 'px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transition = 'transform .5s cubic-bezier(.22,.61,.21,1)';
        el.style.transform = 'translate(0,0)';
        setTimeout(function () { el.style.transition = ''; }, 500);
      });
    });
  });
})();
