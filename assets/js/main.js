/* Dr Howard Fan: site behaviour. No dependencies. */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.remove('no-js');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* ---------- Header: scrolled state + action bar ---------- */
  var header = $('.site-header');
  var actionBar = $('.action-bar');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    if (actionBar) actionBar.classList.toggle('is-visible', y > 420);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = $('.menu-toggle');
  var mobileMenu = $('#mobile-menu');
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    if (toggle) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    if (mobileMenu) mobileMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
  }
  if (toggle) {
    toggle.addEventListener('click', function () { setMenu(!document.body.classList.contains('menu-open')); });
    if (mobileMenu) $$('a', mobileMenu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  }

  /* ---------- Desktop dropdowns ---------- */
  var drops = $$('.nav-drop');
  function closeDrops(except) {
    drops.forEach(function (d) {
      if (d === except) return;
      d.classList.remove('is-open');
      var b = $('button', d); if (b) b.setAttribute('aria-expanded', 'false');
    });
  }
  drops.forEach(function (d) {
    var btn = $('button', d);
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !d.classList.contains('is-open');
      closeDrops(d);
      d.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    d.addEventListener('mouseenter', function () { if (window.matchMedia('(hover: hover)').matches) { closeDrops(d); d.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); } });
    d.addEventListener('mouseleave', function () { if (window.matchMedia('(hover: hover)').matches) { d.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); } });
  });
  document.addEventListener('click', function () { closeDrops(null); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeDrops(null); setMenu(false); }
  });

  /* ---------- Bio read more ---------- */
  $$('[data-bio-toggle]').forEach(function (btn) {
    var target = document.getElementById(btn.getAttribute('aria-controls'));
    var label = $('span', btn);
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (target) target.hidden = !open;
      if (label) label.textContent = open ? 'Show less' : 'Read full biography';
    });
  });

  /* ---------- Practice updates carousel ---------- */
  var updates = $('[data-updates]');
  if (updates) {
    var slides = $$('.update', updates);
    var dots = $$('.dot', updates);
    var counter = $('[data-updates-count]', updates);
    var index = 0;
    // Rotation is driven by the progress-bar animation, which reduced-motion CSS
    // shortens to ~0ms, so auto-rotation stays off for those visitors.
    var autoplay = !reduceMotion;
    var hoverPaused = false;

    function show(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) {
        var on = n === index;
        s.classList.toggle('is-active', on);
        s.setAttribute('aria-hidden', on ? 'false' : 'true');
      });
      dots.forEach(function (d, n) {
        var on = n === index;
        d.classList.toggle('is-active', on);
        d.setAttribute('aria-current', on ? 'true' : 'false');
        // restart the progress animation
        var fill = $('.dot__fill', d);
        if (fill) { fill.style.animation = 'none'; void fill.offsetWidth; fill.style.animation = ''; }
      });
      if (counter) counter.textContent = String(index + 1).padStart(2, '0');
    }
    function syncPlayState() {
      updates.classList.toggle('is-playing', autoplay);
      updates.classList.toggle('is-paused', hoverPaused);
    }
    dots.forEach(function (d, n) {
      d.addEventListener('click', function () { show(n); });
      var fill = $('.dot__fill', d);
      if (fill) fill.addEventListener('animationend', function () { if (d.classList.contains('is-active') && autoplay) show(index + 1); });
    });
    var prev = $('[data-updates-prev]', updates), next = $('[data-updates-next]', updates);
    if (prev) prev.addEventListener('click', function () { show(index - 1); });
    if (next) next.addEventListener('click', function () { show(index + 1); });
    updates.addEventListener('mouseenter', function () { hoverPaused = true; syncPlayState(); });
    updates.addEventListener('mouseleave', function () { hoverPaused = false; syncPlayState(); });
    updates.addEventListener('focusin', function () { hoverPaused = true; syncPlayState(); });
    updates.addEventListener('focusout', function () { hoverPaused = false; syncPlayState(); });
    show(0); syncPlayState();
  }

  /* ---------- Affiliations carousel ---------- */
  var aff = $('[data-aff]');
  if (aff) {
    var viewport = $('.aff-viewport', aff);
    var track = $('.aff-track', aff);
    var tiles = $$('.aff-tile', track);
    var bar = $('.progress__bar', aff);
    var aIdx = 0, timer = null, hovering = false;

    function metrics() {
      var tileW = tiles[0] ? tiles[0].getBoundingClientRect().width : 220;
      var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 16;
      var step = tileW + gap;
      var visible = Math.max(1, Math.floor((viewport.clientWidth + gap) / step));
      return { step: step, max: Math.max(0, tiles.length - visible), visible: visible };
    }
    function go(i) {
      var m = metrics();
      if (i > m.max) i = 0;
      if (i < 0) i = m.max;
      aIdx = i;
      track.style.transform = 'translateX(' + (-aIdx * m.step) + 'px)';
      if (bar) bar.style.width = Math.round(Math.min(1, (aIdx + m.visible) / tiles.length) * 100) + '%';
    }
    function start() { stop(); if (!reduceMotion) timer = setInterval(function () { if (!hovering && !document.hidden) go(aIdx + 1); }, 2800); }
    function stop() { if (timer) clearInterval(timer); timer = null; }
    var ap = $('[data-aff-prev]', aff), an = $('[data-aff-next]', aff);
    if (ap) ap.addEventListener('click', function () { go(aIdx - 1); start(); });
    if (an) an.addEventListener('click', function () { go(aIdx + 1); start(); });
    viewport.addEventListener('mouseenter', function () { hovering = true; });
    viewport.addEventListener('mouseleave', function () { hovering = false; });
    viewport.addEventListener('focusin', function () { hovering = true; });
    viewport.addEventListener('focusout', function () { hovering = false; });
    // swipe
    var startX = null;
    viewport.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; hovering = true; }, { passive: true });
    viewport.addEventListener('touchend', function (e) {
      if (startX !== null) {
        var dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) go(aIdx + (dx < 0 ? 1 : -1));
      }
      startX = null; hovering = false;
    });
    window.addEventListener('resize', function () { go(aIdx); });
    go(0); start();
  }

  /* ---------- Journey stepper ---------- */
  var journey = $('[data-steps]');
  if (journey) {
    var btns = $$('.step-btn', journey);
    var panels = $$('.step-panel', journey);
    var rail = $('.steps__rail-fill', journey);
    var cur = 0;
    function setStep(i, focus) {
      cur = Math.max(0, Math.min(btns.length - 1, i));
      btns.forEach(function (b, n) {
        b.classList.toggle('is-active', n === cur);
        b.classList.toggle('is-done', n < cur);
        b.setAttribute('aria-selected', n === cur ? 'true' : 'false');
        b.tabIndex = n === cur ? 0 : -1;
      });
      panels.forEach(function (p, n) {
        var on = n === cur;
        p.hidden = !on;
        if (on) { p.classList.remove('is-entering'); void p.offsetWidth; p.classList.add('is-entering'); }
      });
      if (rail) rail.style.height = (cur / (btns.length - 1)) * 100 + '%';
      if (focus) btns[cur].focus();
    }
    btns.forEach(function (b, n) {
      b.addEventListener('click', function () { setStep(n); });
      b.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); setStep(cur + 1, true); }
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); setStep(cur - 1, true); }
      });
    });
    var sp = $('[data-step-prev]', journey), sn = $('[data-step-next]', journey);
    if (sp) sp.addEventListener('click', function () { setStep(cur - 1); });
    if (sn) sn.addEventListener('click', function () { setStep(cur + 1 > btns.length - 1 ? 0 : cur + 1); });
    setStep(0);
  }

  /* ---------- Locations ---------- */
  var locs = $('[data-locations]');
  if (locs) {
    var items = $$('.loc-item', locs);
    // Only the Sydney/Griffith toggle. .loc-item also carries data-region, and
    // matching it made every click bubble into setRegion() and reset to the first item.
    var regionBtns = $$('.segmented [data-region]', locs);
    var panel = $('.loc-panel', locs);
    var mapFrame = panel ? $('iframe', panel) : null;
    var region = 'syd';

    function fill(item) {
      if (!panel || !item) return;
      var d = item.dataset;
      $('[data-f="name"]', panel).textContent = d.name;
      $('[data-f="addr"]', panel).textContent = d.addr;
      var tel = $('[data-f="tel"]', panel); tel.textContent = d.phone; tel.href = 'tel:' + d.phone.replace(/[^0-9]/g, '');
      $('[data-f="maps"]', panel).href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(d.name + ', ' + d.addr);
      var tags = $('[data-f="tags"]', panel);
      tags.innerHTML = '';
      d.roles.split('&').forEach(function (r) {
        var s = document.createElement('span'); s.className = 'tag'; s.textContent = r.trim(); tags.appendChild(s);
      });
      if (mapFrame) {
        var src = 'https://maps.google.com/maps?q=' + encodeURIComponent(d.name + ', ' + d.addr) + '&z=15&output=embed';
        if (mapFrame.getAttribute('src') !== src) mapFrame.setAttribute('src', src);
        mapFrame.title = 'Map showing ' + d.name;
      }
      panel.classList.remove('is-entering'); void panel.offsetWidth; panel.classList.add('is-entering');
    }
    function select(item) {
      items.forEach(function (it) {
        var on = it === item;
        it.classList.toggle('is-active', on);
        $('.loc-btn', it).setAttribute('aria-expanded', on ? 'true' : 'false');
      });
      fill(item);
    }
    function setRegion(r) {
      region = r;
      regionBtns.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.region === r ? 'true' : 'false'); });
      var first = null;
      items.forEach(function (it) {
        var show = it.dataset.region === r;
        it.parentElement.hidden = !show;
        if (show && !first) first = it;
      });
      select(first);
    }
    items.forEach(function (it) {
      $('.loc-btn', it).addEventListener('click', function () {
        var mobile = window.matchMedia('(max-width: 760px)').matches;
        if (mobile && it.classList.contains('is-active')) { it.classList.remove('is-active'); this.setAttribute('aria-expanded', 'false'); return; }
        select(it);
      });
    });
    regionBtns.forEach(function (b) { b.addEventListener('click', function () { setRegion(b.dataset.region); }); });
    setRegion('syd');
  }

  /* ---------- FAQ: one open at a time within a list ---------- */
  $$('.faq-list').forEach(function (list) {
    var all = $$('details', list);
    all.forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (d.open) all.forEach(function (o) { if (o !== d) o.open = false; });
      });
    });
  });

  /* ---------- Table of contents highlight ---------- */
  var tocLinks = $$('.toc a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    tocLinks.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          tocLinks.forEach(function (a) { a.classList.remove('is-active'); });
          var a = map[en.target.id]; if (a) a.classList.add('is-active');
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    Object.keys(map).forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = $$('.reveal');
  if (reveals.length) {
    if (!('IntersectionObserver' in window) || reduceMotion) {
      reveals.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var ro = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('is-visible'); ro.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
      reveals.forEach(function (el) { ro.observe(el); });
    }
  }

  /* ---------- Footer year ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
