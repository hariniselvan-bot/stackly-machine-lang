/* ============================================================
   STACKLY — form.js
   Validation for contact / login / register + demo auth routing.
   Login routes USER → dashboard.html, ADMIN → seller-dashboard.html.
   ============================================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    function setError(field, msg) {
      var wrap = field.closest('.field');
      if (!wrap) return;
      wrap.classList.add('error');
      var m = wrap.querySelector('.f-msg');
      if (m && msg) m.textContent = msg;
    }
    function clearError(field) {
      var wrap = field.closest('.field');
      if (wrap) wrap.classList.remove('error');
    }
    function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
    function saveAccount(email, role) {
      var account = JSON.stringify({ email: email.trim(), role: role });
      try {
        localStorage.setItem('stacklyUser', account);
        localStorage.setItem('stacklyEmail', email.trim());
        sessionStorage.setItem('stacklyUser', account);
        sessionStorage.setItem('stacklyEmail', email.trim());
        return true;
      } catch (error) {
        return false;
      }
    }

    function bindLive(form) {
      form.querySelectorAll('input,select,textarea').forEach(function (f) {
        f.addEventListener('input', function () { clearError(f); });
      });
    }

    /* ---------- password visibility toggles ---------- */
    document.querySelectorAll('.pw-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var input = btn.closest('.pass-wrap').querySelector('input');
        var show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      });
    });

    /* ---------- role switches ---------- */
    document.querySelectorAll('.role-switch').forEach(function (sw) {
      sw.querySelectorAll('button').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          sw.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
          var hidden = sw.querySelector('input[type="hidden"]');
          if (hidden) hidden.value = btn.getAttribute('data-role');
        });
      });
    });

    /* ---------- contact form ---------- */
    var contact = document.getElementById('contactForm');
    if (contact) {
      bindLive(contact);
      contact.addEventListener('submit', function (e) {
        e.preventDefault();
        var ok = true;
        var name = contact.querySelector('#cf-name');
        var email = contact.querySelector('#cf-email');
        var service = contact.querySelector('#cf-service');
        var msg = contact.querySelector('#cf-message');
        if (!name.value.trim()) { setError(name, 'Please tell us your name.'); ok = false; }
        if (!isEmail(email.value)) { setError(email, 'Enter a valid work email.'); ok = false; }
        if (!service.value) { setError(service, 'Choose a service.'); ok = false; }
        if (msg.value.trim().length < 12) { setError(msg, 'Give us a little more detail (12+ characters).'); ok = false; }
        if (!ok) return;
        window.location.href = '404.html';
      });
    }

    /* ---------- login ---------- */
    var login = document.getElementById('loginForm');
    if (login) {
      bindLive(login);
      login.addEventListener('submit', function (e) {
        e.preventDefault();
        var ok = true;
        var email = login.querySelector('#lf-email');
        var pass = login.querySelector('#lf-pass');
        if (!isEmail(email.value)) { setError(email, 'Enter a valid email address.'); ok = false; }
        if (pass.value.length < 6) { setError(pass, 'Password must be at least 6 characters.'); ok = false; }
        if (!ok) return;
        var roleInput = login.querySelector('input[name="role"]');
        var role = roleInput ? roleInput.value : 'user';
        if (!saveAccount(email.value, role)) {
          setError(email, 'Unable to save your sign-in details. Enable browser storage and try again.');
          return;
        }
        var btn = login.querySelector('button[type="submit"]');
        if (btn) { btn.disabled = true; btn.style.opacity = '.7'; btn.firstChild.textContent = 'Signing in… '; }
        setTimeout(function () {
          window.location.href = role === 'admin' ? 'seller-dashboard.html' : 'dashboard.html';
        }, 650);
      });
    }

    /* ---------- register ---------- */
    var reg = document.getElementById('registerForm');
    if (reg) {
      bindLive(reg);
      reg.addEventListener('submit', function (e) {
        e.preventDefault();
        var ok = true;
        var name = reg.querySelector('#rf-name');
        var email = reg.querySelector('#rf-email');
        var pass = reg.querySelector('#rf-pass');
        var pass2 = reg.querySelector('#rf-pass2');
        var terms = reg.querySelector('#rf-terms');
        if (name.value.trim().length < 2) { setError(name, 'Enter your full name.'); ok = false; }
        if (!isEmail(email.value)) { setError(email, 'Enter a valid work email.'); ok = false; }
        if (pass.value.length < 8) { setError(pass, 'Use at least 8 characters.'); ok = false; }
        if (pass2.value !== pass.value) { setError(pass2, 'Passwords do not match.'); ok = false; }
        if (terms && !terms.checked) { ok = false; terms.closest('.check').style.color = '#C05A3A'; }
        else if (terms) { terms.closest('.check').style.color = ''; }
        if (!ok) return;
        var roleInput = reg.querySelector('input[name="role"]');
        var role = roleInput ? roleInput.value : 'user';
        if (!saveAccount(email.value, role)) {
          setError(email, 'Unable to save your account details. Enable browser storage and try again.');
          return;
        }
        var btn = reg.querySelector('button[type="submit"]');
        if (btn) { btn.disabled = true; btn.style.opacity = '.7'; btn.firstChild.textContent = 'Creating account… '; }
        setTimeout(function () { window.location.href = 'dashboard.html'; }, 700);
      });
    }
  });
})();
