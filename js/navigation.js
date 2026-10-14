/* ============================================================
   STACKLY — navigation.js
   Sticky glass header, scroll progress, mobile menu,
   active-link state, footer year.
   ============================================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var header = document.querySelector('.site-header');
    var progress = document.querySelector('.scroll-progress span');

    function onScroll() {
      var y = window.scrollY || window.pageYOffset;
      if (header) header.classList.toggle('scrolled', y > 24);
      if (progress) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
      }
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    if (location.hash === '#story' || location.hash === '#team') {
      var section = document.getElementById(location.hash.slice(1));
      if (section) window.requestAnimationFrame(function () { section.scrollIntoView({ block: 'start' }); });
    }

    /* mobile menu */
    var burger = document.querySelector('.burger');
    var mnav = document.querySelector('.mobile-nav');
    if (burger && mnav) {
      var links = mnav.querySelectorAll('.mn-link');
      var pageLinks = document.querySelectorAll('.main-nav a, .mobile-nav .mn-link');
      var currentPath = location.pathname.replace(/\/$/, '/index.html');
      pageLinks.forEach(function (link) {
        var linkUrl = new URL(link.getAttribute('href'), location.href);
        var linkPath = linkUrl.pathname.replace(/\/$/, '/index.html');
        var isCurrentPage = linkPath === currentPath &&
          (!linkUrl.hash || linkUrl.hash === (location.hash || '#story'));
        link.classList.toggle('active', isCurrentPage);
        if (isCurrentPage) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
      burger.addEventListener('click', function () {
        var open = mnav.classList.toggle('open');
        burger.classList.toggle('open', open);
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        document.body.style.overflow = open ? 'hidden' : '';
        document.body.classList.toggle('nav-open', open);
        links.forEach(function (l, i) {
          l.style.transitionDelay = open ? (0.18 + i * 0.06) + 's' : '0s';
        });
      });
      links.forEach(function (l) {
        l.addEventListener('click', function () {
          mnav.classList.remove('open');
          burger.classList.remove('open');
          burger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
          document.body.classList.remove('nav-open');
        });
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mnav.classList.contains('open')) burger.click();
      });
    }

    /* footer year */
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });

    /* subtle page transitions — quick fade on internal navigation */
    var reduceMotion = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    window.addEventListener('pageshow', function () { document.body.style.opacity = ''; });
    if (!reduceMotion) {
      document.addEventListener('click', function (e) {
        var a = e.target.closest('a[href]');
        if (!a) return;
        var href = a.getAttribute('href');
        if (!href || href.charAt(0) === '#' || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (!/\.html(\?|#|$)/.test(href)) return;
        if (a.hasAttribute('download') || a.getAttribute('onclick')) return;
        var url = new URL(href, location.href);
        if (url.origin !== location.origin) return;
        if (url.pathname === location.pathname && url.hash) return; /* same-page anchor */
        e.preventDefault();
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity .22s ease';
        setTimeout(function () { location.href = url.href; }, 210);
      });
    }

    /* newsletter */
    document.querySelectorAll('.news-form').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = form.querySelector('input[type="email"]');
        if (!input || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
          form.style.borderColor = '#C05A3A';
          if (input) input.focus();
          return;
        }
        form.style.borderColor = '';
        var redirect = form.getAttribute('data-redirect');
        if (redirect) {
          location.href = redirect;
          return;
        }
        form.innerHTML = '<p style="padding:12px 20px;color:#D8C86A;font-size:.88rem;font-weight:600;">Subscribed — welcome to the stack.</p>';
      });
    });
  });
})();
