/* ============================================================
   STACKLY — preloader.js
   Cinematic launch sequence: mark reveal → word letters →
   progress bar → gold line → curtain fade.
   ============================================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var pre = document.querySelector('.preloader');
    if (!pre) return;

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var hasGsap = typeof window.gsap !== 'undefined';

    function finish() {
      pre.classList.add('done');
      document.body.classList.add('loaded');
      window.dispatchEvent(new CustomEvent('stackly:ready'));
      setTimeout(function () { if (pre.parentNode) pre.parentNode.removeChild(pre); }, 900);
    }

    if (reduce || !hasGsap) {
      setTimeout(finish, 350);
      return;
    }

    var mark = pre.querySelector('.pl-mark');
    var letters = pre.querySelectorAll('.pl-word span');
    var bar = pre.querySelector('.pl-bar i');
    var num = pre.querySelector('.pl-num');
    var progress = { v: 0 };

    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to(mark, { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.6)' })
      .to(letters, { y: 0, duration: 0.65, stagger: 0.055 }, '-=0.25')
      .to(progress, {
        v: 100, duration: 0.9, ease: 'power2.inOut',
        onUpdate: function () {
          var v = Math.round(progress.v);
          if (bar) bar.style.width = v + '%';
          if (num) num.textContent = String(v).padStart(3, '0') + ' / 100';
        }
      }, '-=0.35')
      .to([mark, pre.querySelector('.pl-word'), pre.querySelector('.pl-bar'), num],
        { opacity: 0, y: -18, duration: 0.4, stagger: 0.05, ease: 'power2.in' }, '+=0.1')
      .add(finish);
  });
})();
