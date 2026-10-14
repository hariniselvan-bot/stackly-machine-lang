/* ============================================================
   STACKLY — main.js
   Shared UI logic: pricing toggle, blog filter/search,
   FAQ category filter, misc interactions.
   ============================================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    /* ---------- pricing monthly/yearly toggle ---------- */
    var toggle = document.querySelector('.price-toggle');
    if (toggle) {
      var btns = toggle.querySelectorAll('button');
      btns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          btns.forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
          var yearly = btn.getAttribute('data-cycle') === 'yearly';
          toggle.classList.toggle('yearly', yearly);
          document.querySelectorAll('.pc-price .pc-amount').forEach(function (el) {
            var m = el.getAttribute('data-monthly');
            var y = el.getAttribute('data-yearly');
            var target = yearly ? y : m;
            /* animated number swap */
            if (typeof gsap !== 'undefined') {
              var obj = { v: parseFloat(el.textContent.replace(/[^0-9.]/g, '')) || 0 };
              gsap.to(obj, {
                v: parseFloat(target), duration: 0.55, ease: 'power2.out',
                onUpdate: function () { el.textContent = '$' + Math.round(obj.v); }
              });
            } else {
              el.textContent = '$' + target;
            }
          });
          document.querySelectorAll('.pc-cycle:not([data-static])').forEach(function (el) {
            el.textContent = yearly ? 'per month · billed yearly' : 'per month · billed monthly';
          });
        });
      });
    }

    /* ---------- blog category filter + search ---------- */
    var blogGrid = document.querySelector('.blog-grid');
    if (blogGrid) {
      var cards = Array.prototype.slice.call(blogGrid.querySelectorAll('.blog-card'));
      var catBtns = document.querySelectorAll('.blog-cats button');
      var searchInput = document.querySelector('.blog-search input');
      var empty = document.querySelector('.blog-empty');
      var activeCat = 'all';
      var query = '';

      function applyFilter() {
        var shown = 0;
        cards.forEach(function (card) {
          var cat = card.getAttribute('data-cat');
          var text = card.textContent.toLowerCase();
          var ok = (activeCat === 'all' || cat === activeCat) && (!query || text.indexOf(query) !== -1);
          card.style.display = ok ? '' : 'none';
          if (ok) shown++;
        });
        if (empty) empty.classList.toggle('show', shown === 0);
      }
      catBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          catBtns.forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
          activeCat = btn.getAttribute('data-cat');
          applyFilter();
        });
      });
      if (searchInput) {
        searchInput.addEventListener('input', function () {
          query = searchInput.value.trim().toLowerCase();
          applyFilter();
        });
      }
    }

    /* ---------- FAQ category filter (faq page) ---------- */
    var faqCats = document.querySelectorAll('.faq-cats button');
    if (faqCats.length) {
      faqCats.forEach(function (btn) {
        btn.addEventListener('click', function () {
          faqCats.forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
          var cat = btn.getAttribute('data-cat');
          document.querySelectorAll('.faq-item[data-cat]').forEach(function (item) {
            var show = cat === 'all' || item.getAttribute('data-cat') === cat;
            item.classList.toggle('hidden', !show);
            if (!show && item.classList.contains('open')) {
              item.classList.remove('open');
              item.querySelector('.faq-a').style.maxHeight = '0px';
            }
          });
        });
      });
    }

    /* ---------- watch demo button (scrolls to dashboard preview) ---------- */
    document.querySelectorAll('[data-scroll-to]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        var target = document.querySelector(el.getAttribute('data-scroll-to'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  });
})();
