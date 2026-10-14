/* ============================================================
   STACKLY — dashboard.js
   Canvas charts (line / area / bar / donut), sidebar drawer,
   notifications, progress bars, segment switches, live ticks.
   Works for dashboard.html, seller-dashboard.html and the
   interactive preview on the home page. No chart libraries.
   ============================================================ */
(function () {
  'use strict';

  var GOLD = '#B7A84A', GOLD2 = '#D8C86A', INK = '#11140D', OLIVE = '#7C9A3F';

  function setupCanvas(canvas) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var r = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, r.width * dpr);
    canvas.height = Math.max(1, r.height * dpr);
    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return { ctx: ctx, w: r.width, h: r.height };
  }

  function smooth(points) {
    /* catmull-rom → bezier */
    return function (ctx) {
      ctx.moveTo(points[0].x, points[0].y);
      for (var i = 0; i < points.length - 1; i++) {
        var p0 = points[Math.max(0, i - 1)], p1 = points[i], p2 = points[i + 1], p3 = points[Math.min(points.length - 1, i + 2)];
        ctx.bezierCurveTo(
          p1.x + (p2.x - p0.x) / 6, p1.y + (p2.y - p0.y) / 6,
          p2.x - (p3.x - p1.x) / 6, p2.y - (p3.y - p1.y) / 6,
          p2.x, p2.y);
      }
    };
  }

  function lineAreaChart(canvas, cfg) {
    var o = setupCanvas(canvas), ctx = o.ctx, W = o.w, H = o.h;
    var padL = 8, padR = 8, padT = 14, padB = 24;
    var series = cfg.series; // [{data,color,fill}]
    var labels = cfg.labels || [];
    var all = series.reduce(function (a, s) { return a.concat(s.data); }, []);
    var max = Math.max.apply(null, all) * 1.15;
    var min = Math.min.apply(null, all) * 0.85;
    function X(i, n) { return padL + (W - padL - padR) * (i / (n - 1)); }
    function Y(v) { return padT + (H - padT - padB) * (1 - (v - min) / (max - min)); }

    var t0 = null, dur = 1400;
    function frame(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      ctx.clearRect(0, 0, W, H);

      /* grid */
      ctx.strokeStyle = cfg.dark ? 'rgba(255,255,255,.06)' : 'rgba(17,20,13,.07)';
      ctx.lineWidth = 1;
      for (var g = 0; g <= 4; g++) {
        var gy = padT + (H - padT - padB) * (g / 4);
        ctx.beginPath(); ctx.moveTo(padL, gy); ctx.lineTo(W - padR, gy); ctx.stroke();
      }
      /* labels */
      ctx.fillStyle = cfg.dark ? 'rgba(244,242,234,.35)' : 'rgba(17,20,13,.4)';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      labels.forEach(function (l, i) {
        ctx.fillText(l, X(i, labels.length), H - 6);
      });

      series.forEach(function (s) {
        var n = s.data.length;
        var upto = Math.max(2, Math.floor(n * e));
        var pts = [];
        for (var i = 0; i < upto; i++) pts.push({ x: X(i, n), y: Y(s.data[i]) });
        if (e === 1) pts.push({ x: X(n - 1, n), y: Y(s.data[n - 1]) });

        if (s.fill) {
          var grad = ctx.createLinearGradient(0, padT, 0, H - padB);
          grad.addColorStop(0, s.fill);
          grad.addColorStop(1, 'rgba(183,168,74,0)');
          ctx.beginPath();
          smooth(pts)(ctx);
          ctx.lineTo(pts[pts.length - 1].x, H - padB);
          ctx.lineTo(pts[0].x, H - padB);
          ctx.closePath();
          ctx.fillStyle = grad;
          ctx.fill();
        }
        ctx.beginPath();
        smooth(pts)(ctx);
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 2.4;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.stroke();

        /* end dot */
        if (e === 1) {
          var last = pts[pts.length - 1];
          ctx.beginPath(); ctx.arc(last.x, last.y, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = s.color; ctx.fill();
          ctx.beginPath(); ctx.arc(last.x, last.y, 8, 0, Math.PI * 2);
          ctx.fillStyle = s.color + '33'; ctx.fill();
        }
      });

      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function barChart(canvas, cfg) {
    var o = setupCanvas(canvas), ctx = o.ctx, W = o.w, H = o.h;
    var padB = 26, padT = 12;
    var data = cfg.data, labels = cfg.labels || [];
    var max = Math.max.apply(null, data) * 1.1;
    var t0 = null, dur = 1100;
    function frame(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      ctx.clearRect(0, 0, W, H);
      var n = data.length;
      var gap = W / n;
      var bw = Math.min(34, gap * 0.5);
      for (var i = 0; i < n; i++) {
        var bh = (H - padT - padB) * (data[i] / max) * e;
        var x = gap * i + (gap - bw) / 2;
        var y = H - padB - bh;
        var grad = ctx.createLinearGradient(0, y, 0, H - padB);
        grad.addColorStop(0, GOLD2);
        grad.addColorStop(1, GOLD);
        ctx.fillStyle = i === n - 1 ? grad : (cfg.dark ? 'rgba(216,200,106,.28)' : 'rgba(183,168,74,.3)');
        if (cfg.highlightLast === false) ctx.fillStyle = grad;
        ctx.beginPath();
        if (ctx.roundRect) { ctx.roundRect(x, y, bw, bh, [6, 6, 2, 2]); } else { ctx.rect(x, y, bw, bh); }
        ctx.fill();
        ctx.fillStyle = cfg.dark ? 'rgba(244,242,234,.35)' : 'rgba(17,20,13,.4)';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        if (labels[i]) ctx.fillText(labels[i], gap * i + gap / 2, H - 7);
      }
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function donutChart(canvas, cfg) {
    var o = setupCanvas(canvas), ctx = o.ctx, W = o.w, H = o.h;
    var cx = W / 2, cy = H / 2, r = Math.min(W, H) / 2 - 10;
    var t0 = null, dur = 1300;
    function frame(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      ctx.clearRect(0, 0, W, H);
      var start = -Math.PI / 2;
      var total = cfg.segments.reduce(function (a, s) { return a + s.value; }, 0);
      cfg.segments.forEach(function (s) {
        var ang = (s.value / total) * Math.PI * 2 * e;
        ctx.beginPath();
        ctx.arc(cx, cy, r, start, start + ang);
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 13;
        ctx.lineCap = 'round';
        ctx.stroke();
        start += ang + 0.06;
      });
      ctx.fillStyle = cfg.dark ? '#F4F2EA' : INK;
      ctx.font = '700 ' + Math.round(r * 0.5) + 'px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(cfg.center || '', cx, cy - 4);
      ctx.fillStyle = cfg.dark ? 'rgba(244,242,234,.4)' : 'rgba(17,20,13,.45)';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(cfg.centerLabel || '', cx, cy + r * 0.34);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  document.addEventListener('DOMContentLoaded', function () {

    /* animate charts when visible */
    var chartEls = document.querySelectorAll('canvas[data-chart]');
    if (chartEls.length) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          cio.unobserve(en.target);
          var el = en.target;
          var cfg;
          try { cfg = JSON.parse(el.getAttribute('data-chart')); } catch (err) { return; }
          if (cfg.type === 'line') lineAreaChart(el, cfg);
          else if (cfg.type === 'bar') barChart(el, cfg);
          else if (cfg.type === 'donut') donutChart(el, cfg);
        });
      }, { threshold: 0.25 });
      chartEls.forEach(function (el) { cio.observe(el); });
    }

    /* progress bars */
    document.querySelectorAll('.pr-bar i[data-val]').forEach(function (bar) {
      var bio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            bar.style.width = bar.getAttribute('data-val') + '%';
            bio.unobserve(bar);
          }
        });
      }, { threshold: 0.4 });
      bio.observe(bar);
    });

    /* dashboard sidebar drawer (mobile) */
    var tBurger = document.querySelector('.tb-burger');
    var sidebar = document.querySelector('.dash-sidebar');
    var overlay = document.querySelector('.dash-overlay');
    if (tBurger && sidebar && overlay) {
      tBurger.addEventListener('click', function () {
        sidebar.classList.add('open');
        overlay.classList.add('open');
      });
      overlay.addEventListener('click', function () {
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
      });
    }

    /* notifications dropdown */
    var notifBtn = document.querySelector('[data-notif-btn]');
    var notifDrop = document.querySelector('.notif-drop');
    if (notifBtn && notifDrop) {
      notifBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        notifDrop.classList.toggle('open');
      });
      document.addEventListener('click', function (e) {
        if (!notifDrop.contains(e.target)) notifDrop.classList.remove('open');
      });
    }

    /* segment switch re-renders the bound chart */
    document.querySelectorAll('.seg-switch[data-target]').forEach(function (sw) {
      var target = document.querySelector(sw.getAttribute('data-target'));
      if (!target) return;
      sw.querySelectorAll('button').forEach(function (btn) {
        btn.addEventListener('click', function () {
          sw.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
          var cfg;
          try { cfg = JSON.parse(btn.getAttribute('data-cfg')); } catch (err) { return; }
          if (cfg.type === 'line') lineAreaChart(target, cfg);
          else if (cfg.type === 'bar') barChart(target, cfg);
        });
      });
    });
  });
})();
