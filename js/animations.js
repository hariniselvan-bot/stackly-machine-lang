/* ============================================================
   STACKLY — animations.js
   GSAP + ScrollTrigger choreography: hero entrance, split text,
   counters, parallax, card tilt, bento spotlight, workflow fill,
   testimonials slider, AOS init.
   ============================================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var hasGsap = typeof window.gsap !== 'undefined';

    /* ---------- AOS ---------- */
    if (typeof window.AOS !== 'undefined') {
      AOS.init({ duration: 850, easing: 'ease-out-cubic', once: true, offset: 90, disable: reduce });
    }

    /* ---------- generic reveal fallback (no GSAP) ---------- */
    var revealEls = document.querySelectorAll('[data-reveal]');
    if (revealEls.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('revealed'); io.unobserve(en.target); }
        });
      }, { threshold: 0.12 });
      revealEls.forEach(function (el) { io.observe(el); });
    }

    if (reduce || !hasGsap) {
      /* still fill counters instantly */
      document.querySelectorAll('[data-count]').forEach(function (el) {
        el.textContent = el.getAttribute('data-count');
      });
      return;
    }

    if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

    /* ---------- split words into animated units ---------- */
    document.querySelectorAll('[data-split]').forEach(function (el) {
      var words = el.textContent.trim().split(/\s+/);
      el.textContent = '';
      words.forEach(function (w, i) {
        var wrap = document.createElement('span');
        wrap.className = 'sw';
        var inner = document.createElement('i');
        inner.textContent = w;
        wrap.appendChild(inner);
        el.appendChild(wrap);
        if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      });
    });

    function playSplit(el) {
      gsap.to(el.querySelectorAll('.sw>i'), { y: 0, duration: 0.9, stagger: 0.05, ease: 'power3.out' });
    }

    /* ---------- hero entrance (runs after preloader) ---------- */
    var hero = document.querySelector('.hero');
    if (hero) {
      var heroTl = function () {
        var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.from('.site-header', { y: -30, opacity: 0, duration: 0.7 })
          .from('.hero-tag', { y: 22, opacity: 0, duration: 0.55 }, '-=0.35')
          .from('.hero-feature-card', { y: 30, opacity: 0, duration: 0.6 }, '-=0.3')
          .from('.hero-steps li', { x: -26, opacity: 0, duration: 0.5, stagger: 0.12 }, '-=0.3')
          .from('.hero h1 .h-line>span', { yPercent: 108, duration: 0.85, stagger: 0.09, ease: 'power4.out' }, '-=0.35')
          .from('.hero-sub', { y: 24, opacity: 0, duration: 0.55 }, '-=0.45')
          .from('.hero-cta > *', { y: 20, opacity: 0, duration: 0.5, stagger: 0.1 }, '-=0.3')
          .from('.hv-stage', { scale: 0.9, opacity: 0, duration: 1, ease: 'power4.out' }, '-=0.9')
          .from('.hv-glow', { opacity: 0, scale: 0.8, duration: 1.3 }, '-=0.75')
          .from('.hv-orbit', { opacity: 0, rotate: -8, scale: 0.92, duration: 1.1 }, '-=1.15')
          .from('.hv-streams', { opacity: 0, duration: 1.1 }, '-=0.9')
          .from('.hv-node', { scale: 0, opacity: 0, duration: 0.45, stagger: 0.08, ease: 'back.out(2.2)' }, '-=0.75')
          .from('.hv-card,.hv-chip', { scale: 0.6, opacity: 0, duration: 0.65, stagger: 0.1, ease: 'back.out(1.8)' }, '-=0.5');
        hero.querySelectorAll('[data-split]').forEach(playSplit);
      };
      if (document.body.classList.contains('loaded')) heroTl();
      else window.addEventListener('stackly:ready', heroTl, { once: true });

      /* hero 3D tilt + layered parallax */
      var stage = hero.querySelector('.hv-stage');
      var layers = hero.querySelectorAll('[data-depth]');
      var fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
      if (stage && fine) {
        hero.addEventListener('mousemove', function (e) {
          var r = hero.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width - 0.5;
          var y = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(stage, { rotateY: x * 7, rotateX: -y * 6, duration: 0.9, ease: 'power2.out' });
          layers.forEach(function (l) {
            var d = parseFloat(l.getAttribute('data-depth')) || 0;
            gsap.to(l, { x: -x * d, y: -y * d, duration: 1.1, ease: 'power2.out' });
          });
        });
        hero.addEventListener('mouseleave', function () {
          gsap.to(stage, { rotateX: 0, rotateY: 0, duration: 1, ease: 'power2.out' });
          layers.forEach(function (l) { gsap.to(l, { x: 0, y: 0, duration: 1.2, ease: 'power2.out' }); });
        });
      }
    }

    /* inner page heroes */
    document.querySelectorAll('.page-hero [data-split]').forEach(function (el) {
      var go = function () { playSplit(el); };
      if (document.body.classList.contains('loaded')) go();
      else window.addEventListener('stackly:ready', go, { once: true });
    });

    /* ---------- scroll-triggered splits ---------- */
    if (typeof ScrollTrigger !== 'undefined') {
      document.querySelectorAll('[data-split]').forEach(function (el) {
        if (el.closest('.hero') || el.closest('.page-hero')) return;
        ScrollTrigger.create({
          trigger: el, start: 'top 86%', once: true,
          onEnter: function () { playSplit(el); }
        });
      });

      /* ---------- counters ---------- */
      document.querySelectorAll('[data-count]').forEach(function (el) {
        var target = parseFloat(el.getAttribute('data-count'));
        var decimals = (el.getAttribute('data-count').split('.')[1] || '').length;
        var suffix = el.getAttribute('data-suffix') || '';
        ScrollTrigger.create({
          trigger: el, start: 'top 88%', once: true,
          onEnter: function () {
            var obj = { v: 0 };
            gsap.to(obj, {
              v: target, duration: 1.8, ease: 'power2.out',
              onUpdate: function () {
                el.textContent = obj.v.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
              },
              onComplete: function () { el.classList.add('count-pop'); }
            });
          }
        });
      });

      /* ---------- workflow line fill + step activation ---------- */
      var wfSec = document.querySelector('.workflow-sec');
      if (wfSec) {
        var steps = wfSec.querySelectorAll('.wf-step');
        var lineFill = wfSec.querySelector('.wf-line i');
        var vert = window.matchMedia('(max-width:1080px)').matches;
        var anim = vert ? { height: '100%' } : { width: '100%' };
        gsap.to(lineFill, Object.assign(anim, {
          ease: 'none',
          scrollTrigger: {
            trigger: wfSec.querySelector('.wf-track'),
            start: 'top 75%', end: 'bottom 45%', scrub: 0.6,
            onUpdate: function (self) {
              var idx = Math.floor(self.progress * steps.length + 0.0001);
              steps.forEach(function (s, i) { s.classList.toggle('active', i <= idx && self.progress > 0.02); });
            }
          }
        }));
      }

      /* ---------- parallax images ---------- */
      document.querySelectorAll('[data-parallax]').forEach(function (el) {
        gsap.to(el, {
          yPercent: -8, ease: 'none',
          scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: 1 }
        });
      });

      /* ---------- footer entrance ---------- */
      var footer = document.querySelector('.site-footer');
      if (footer) {
        var ftl = gsap.timeline({
          scrollTrigger: { trigger: footer, start: 'top 88%', once: true },
          defaults: { ease: 'power3.out' }
        });
        ftl.from(footer.querySelector('.footer-brand'), { y: 36, opacity: 0, duration: 0.8 })
          .from(footer.querySelectorAll('.footer-col'), { y: 30, opacity: 0, duration: 0.65, stagger: 0.09 }, '-=0.5')
          .from(footer.querySelector('.footer-news'), { y: 34, opacity: 0, duration: 0.7 }, '-=0.5')
          .fromTo(footer.querySelector('.footer-bottom'),
            { '--div-x': 0 }, { '--div-x': 1, duration: 1.1, ease: 'power2.inOut' }, '-=0.35')
          .from(footer.querySelectorAll('.footer-bottom > *'), { y: 12, opacity: 0, duration: 0.5, stagger: 0.08 }, '-=0.7');
      }

      /* ---------- hero visual slow float on scroll ---------- */
      var hv = document.querySelector('.hero-visual');
      if (hv) {
        gsap.to(hv, {
          y: 60, ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
        });
      }
    }

    /* ---------- bento spotlight ---------- */
    document.querySelectorAll('.bento-card,.cap-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
      });
    });

    /* ---------- testimonials slider ---------- */
    var tWrap = document.querySelector('.testi-viewport');
    if (tWrap) {
      var track = tWrap.querySelector('.testi-track');
      var cards = track.children;
      var prev = document.querySelector('.testi-prev');
      var next = document.querySelector('.testi-next');
      var idx = 0;
      function maxIdx() {
        var cardW = cards[0].getBoundingClientRect().width + 26;
        var visible = Math.max(1, Math.floor(tWrap.offsetWidth / cardW));
        return Math.max(0, cards.length - visible);
      }
      function go(i) {
        idx = Math.max(0, Math.min(i, maxIdx()));
        var cardW = cards[0].getBoundingClientRect().width + 26;
        track.style.transform = 'translateX(' + (-idx * cardW) + 'px)';
      }
      if (prev) prev.addEventListener('click', function () { go(idx - 1); });
      if (next) next.addEventListener('click', function () { go(idx + 1); });
      window.addEventListener('resize', function () { go(idx); });
    }

    /* ---------- FAQ accordion ---------- */
    document.querySelectorAll('.faq-item').forEach(function (item) {
      var q = item.querySelector('.faq-q');
      var a = item.querySelector('.faq-a');
      if (!q || !a) return;
      q.addEventListener('click', function () {
        var open = item.classList.contains('open');
        item.parentElement.querySelectorAll('.faq-item.open').forEach(function (o) {
          o.classList.remove('open');
          o.querySelector('.faq-a').style.maxHeight = '0px';
          o.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        });
        if (!open) {
          item.classList.add('open');
          a.style.maxHeight = a.scrollHeight + 'px';
          q.setAttribute('aria-expanded', 'true');
        }
      });
    });

    /* ---------- clip reveal images ---------- */
    document.querySelectorAll('.clip-reveal').forEach(function (el) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('revealed'); cio.unobserve(en.target); }
        });
      }, { threshold: 0.2 });
      cio.observe(el);
    });

    /* ---------- hero metric mini count ---------- */
    document.querySelectorAll('[data-live-count]').forEach(function (el) {
      var base = parseFloat(el.getAttribute('data-live-count'));
      setInterval(function () {
        var jitter = (Math.random() - 0.5) * 0.06;
        el.textContent = (base + jitter).toFixed(1) + '%';
        el.classList.remove('tick-flash');
        void el.offsetWidth;
        el.classList.add('tick-flash');
      }, 2600);
    });
  });
})();
