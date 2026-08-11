/* Lease Tracking Services — shared site behaviour */

(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- current year in footer ---- */
  var yr = document.getElementById('yr');
  if (yr) { yr.textContent = new Date().getFullYear(); }

  /* ---- mobile menu ---- */
  var menuBtn = document.getElementById('menuBtn');
  var navLinks = document.getElementById('navLinks');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navLinks.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        navLinks.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- signature: coverage status board (home page only) ---- */
  var host = document.getElementById('ledgerRows');
  if (host) {
    var FLEET = [
      { asset: '2023 Freightliner Cascadia', meta: 'Auto lease · comp/coll 1,000', end: 'approved',   label: 'Approved'   },
      { asset: 'Bobcat S76 Skid-Steer',      meta: 'Equipment lease · GL required', end: 'inadequate', label: 'Inadequate' },
      { asset: '2022 Ford F-250 Super Duty', meta: 'Auto loan · physical damage',  end: 'approved',   label: 'Approved'   },
      { asset: 'Great Dane 53ft Dry Van',    meta: 'Commercial lease · 100/300/50', end: 'cancelled',  label: 'Cancelled'  },
      { asset: '2024 Kenworth T680',         meta: 'Auto lease · renewal pursued', end: 'approved',   label: 'Approved'   }
    ];

    FLEET.forEach(function (item, i) {
      var row = document.createElement('div');
      row.className = 'ledger-row';
      row.style.animationDelay = (reduce ? 0 : i * 0.12) + 's';

      var left = document.createElement('div');
      var a = document.createElement('div');
      a.className = 'asset';
      a.textContent = item.asset;
      var m = document.createElement('div');
      m.className = 'meta';
      m.textContent = item.meta;
      left.appendChild(a);
      left.appendChild(m);

      var chip = document.createElement('span');
      chip.className = 'chip';
      chip.dataset.state = 'pending';
      chip.textContent = 'Checking';

      row.appendChild(left);
      row.appendChild(chip);
      host.appendChild(row);

      if (reduce) {
        chip.dataset.state = item.end;
        chip.textContent = item.label;
      } else {
        setTimeout(function () {
          chip.dataset.state = item.end;
          chip.textContent = item.label;
        }, 900 + i * 420);
      }
    });
  }

  /* ---- scroll reveal ---- */
  var targets = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- forms: no backend wired yet ----
     Replace FORM_ENDPOINT below with a Formspree / Basin / your own endpoint,
     or point the form action at whatever handles mail on your host. Until then
     the form shows a message instead of silently doing nothing. */
  var FORM_ENDPOINT = '';
  document.querySelectorAll('form[data-lts-form]').forEach(function (form) {
    if (FORM_ENDPOINT) { form.setAttribute('action', FORM_ENDPOINT); return; }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = form.querySelector('.form-note');
      if (note) {
        note.textContent = 'This form is not connected to a mail service yet. Please email jmark@ltsinc.com or call 1-800-695-8419.';
        note.style.color = '#D45B4C';
      }
    });
  });
})();
