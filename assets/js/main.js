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

  /* ---------- Affiliations: native scroll + draggable scrollbar ---------- */
  var aff = $('[data-aff]');
  if (aff) {
    var scroller = $('.aff-viewport', aff);
    var sbar = $('.aff-scrollbar', aff);
    var thumb = sbar ? $('.aff-scrollbar__thumb', sbar) : null;
    var firstTile = $('.aff-tile', aff);
    var autoTimer = null, idleUntil = 0, pointerInside = false;

    function maxScroll() { return Math.max(0, scroller.scrollWidth - scroller.clientWidth); }
    function step() {
      var gap = parseFloat(getComputedStyle($('.aff-track', aff)).columnGap) || 16;
      return (firstTile ? firstTile.getBoundingClientRect().width : 260) + gap;
    }
    function clamp01(n) { return Math.min(1, Math.max(0, n)); }
    function sync() {
      if (!sbar) return;
      var max = maxScroll();
      sbar.hidden = max < 2;
      var trackW = sbar.clientWidth;
      var thumbW = Math.max(48, trackW * scroller.clientWidth / scroller.scrollWidth);
      var pos = max ? clamp01(scroller.scrollLeft / max) : 0;
      thumb.style.width = thumbW + 'px';
      thumb.style.transform = 'translateX(' + pos * (trackW - thumbW) + 'px)';
      sbar.setAttribute('aria-valuenow', Math.round(pos * 100));
    }
    // Any interaction pauses auto-scroll for a couple of seconds
    function hold(ms) { idleUntil = Date.now() + (ms || 2000); }

    scroller.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    $$('img', scroller).forEach(function (im) { if (!im.complete) im.addEventListener('load', sync); });

    if (sbar && thumb) {
      // Drag the thumb, or press anywhere on the track to jump there and keep dragging
      var barDrag = null;
      var scrollFromBar = function (clientX, grabOffset) {
        var r = sbar.getBoundingClientRect(), tw = thumb.offsetWidth;
        scroller.scrollLeft = clamp01((clientX - r.left - grabOffset) / (r.width - tw)) * maxScroll();
      };
      sbar.addEventListener('pointerdown', function (e) {
        if (e.button > 0) return;
        e.preventDefault();
        var tr = thumb.getBoundingClientRect();
        var onThumb = e.clientX >= tr.left && e.clientX <= tr.right;
        barDrag = { offset: onThumb ? e.clientX - tr.left : tr.width / 2 };
        if (!onThumb) scrollFromBar(e.clientX, barDrag.offset);
        sbar.setPointerCapture(e.pointerId);
        aff.classList.add('is-dragging');
        sbar.focus({ preventScroll: true });
        hold();
      });
      sbar.addEventListener('pointermove', function (e) { if (barDrag) { scrollFromBar(e.clientX, barDrag.offset); hold(); } });
      var endBar = function () { if (!barDrag) return; barDrag = null; aff.classList.remove('is-dragging'); hold(); };
      sbar.addEventListener('pointerup', endBar);
      sbar.addEventListener('pointercancel', endBar);
      sbar.addEventListener('keydown', function (e) {
        var k = e.key, s = step();
        if (k === 'ArrowRight' || k === 'ArrowDown') scroller.scrollBy({ left: s, behavior: 'smooth' });
        else if (k === 'ArrowLeft' || k === 'ArrowUp') scroller.scrollBy({ left: -s, behavior: 'smooth' });
        else if (k === 'Home') scroller.scrollTo({ left: 0, behavior: 'smooth' });
        else if (k === 'End') scroller.scrollTo({ left: maxScroll(), behavior: 'smooth' });
        else return;
        e.preventDefault(); hold();
      });
    }

    // Desktop: drag the tiles with the mouse (touch already scrolls natively)
    var tileDrag = null, suppressClick = false;
    scroller.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      tileDrag = { x: e.clientX, left: scroller.scrollLeft, moved: false, id: e.pointerId };
    });
    scroller.addEventListener('pointermove', function (e) {
      if (!tileDrag) return;
      var dx = e.clientX - tileDrag.x;
      if (!tileDrag.moved && Math.abs(dx) > 6) {
        tileDrag.moved = true;
        scroller.setPointerCapture(tileDrag.id);
        aff.classList.add('is-dragging');
      }
      if (tileDrag.moved) { scroller.scrollLeft = tileDrag.left - dx; hold(); }
    });
    var endTile = function () {
      if (!tileDrag) return;
      if (tileDrag.moved) {
        suppressClick = true;
        setTimeout(function () { suppressClick = false; }, 0);
        aff.classList.remove('is-dragging');
        // settle onto the nearest tile
        var s = step();
        scroller.scrollTo({ left: Math.round(scroller.scrollLeft / s) * s, behavior: 'smooth' });
      }
      tileDrag = null;
    };
    scroller.addEventListener('pointerup', endTile);
    scroller.addEventListener('pointercancel', endTile);
    scroller.addEventListener('click', function (e) { if (suppressClick) { e.preventDefault(); e.stopPropagation(); } }, true);
    scroller.addEventListener('dragstart', function (e) { e.preventDefault(); }); // stop the browser dragging images/links

    // Pause auto-scroll while people are looking or touching
    aff.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') pointerInside = true; });
    aff.addEventListener('pointerleave', function () { pointerInside = false; });
    scroller.addEventListener('touchstart', function () { hold(); }, { passive: true });
    scroller.addEventListener('wheel', function () { hold(); }, { passive: true });
    aff.addEventListener('focusin', function () { hold(8000); });

    if (!reduceMotion) {
      autoTimer = setInterval(function () {
        if (document.hidden || pointerInside || Date.now() < idleUntil || aff.classList.contains('is-dragging')) return;
        var max = maxScroll();
        if (max < 2) return;
        if (scroller.scrollLeft >= max - 2) scroller.scrollTo({ left: 0, behavior: 'smooth' });
        else scroller.scrollBy({ left: step(), behavior: 'smooth' });
      }, 3000);
    }
    sync();
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

  /* ---------- Booking form ---------- */
  var booking = $('[data-booking]');
  if (booking) {
    var endpoint = booking.getAttribute('data-endpoint') || '';
    var toEmail = booking.getAttribute('data-email');
    var alertBox = $('[data-form-alert]', booking);
    var submitBtn = $('[data-submit]', booking);
    var submitLabel = submitBtn ? $('span', submitBtn) : null;
    var success = $('[data-booking-success]');
    var checked = $$('input, select, textarea', booking).filter(function (el) {
      return el.name && el.name.charAt(0) !== '_' && el.type !== 'hidden';
    });
    var tried = false;

    function messageFor(el) {
      var v = el.validity;
      if (v.customError) return el.validationMessage;
      if (v.valueMissing) return 'Please enter your ' + el.getAttribute('data-label').toLowerCase() + '.';
      if (v.typeMismatch && el.type === 'email') return 'Enter an email address like name@example.com.';
      if (v.patternMismatch) return el.getAttribute('data-pattern') || 'Please check this field.';
      if (v.tooLong) return 'Please keep this under ' + el.maxLength + ' characters.';
      return 'Please check this field.';
    }
    function validate(el) {
      var ok = el.checkValidity();
      var err = document.getElementById(el.id + '-error');
      el.setAttribute('aria-invalid', ok ? 'false' : 'true');
      if (err) { err.textContent = ok ? '' : messageFor(el); err.hidden = ok; }
      return ok;
    }
    checked.forEach(function (el) {
      el.addEventListener('blur', function () { if (tried || el.value) validate(el); });
      el.addEventListener('input', function () {
        if (el.getAttribute('aria-invalid') === 'true') validate(el);
      });
    });

    // Attachments: show what was picked and enforce the file count / size limits
    var fileInput = booking.elements['attachments'];
    if (fileInput) {
      var drop = fileInput.parentNode;
      var fileList = $('[data-file-list]', drop);
      var emptyText = fileList.textContent;
      var maxFiles = +fileInput.getAttribute('data-max-files') || 5;
      var maxMb = +fileInput.getAttribute('data-max-mb') || 10;
      var checkFiles = function () {
        var picked = Array.prototype.slice.call(fileInput.files);
        var total = picked.reduce(function (n, f) { return n + f.size; }, 0);
        fileInput.setCustomValidity(
          picked.length > maxFiles ? 'Please choose up to ' + maxFiles + ' files.' :
          total > maxMb * 1024 * 1024 ? 'Please keep attachments under ' + maxMb + ' MB in total.' : '');
        fileList.textContent = !picked.length ? emptyText :
          picked.length === 1 ? picked[0].name :
          picked.length + ' files: ' + picked.map(function (f) { return f.name; }).join(', ');
        validate(fileInput);
      };
      fileInput.addEventListener('change', checkFiles);
      ['dragenter', 'dragover'].forEach(function (t) { fileInput.addEventListener(t, function () { drop.classList.add('is-over'); }); });
      ['dragleave', 'drop'].forEach(function (t) { fileInput.addEventListener(t, function () { drop.classList.remove('is-over'); }); });
    }

    function showAlert(html) { alertBox.innerHTML = html; alertBox.hidden = !html; }
    function busy(on) {
      if (!submitBtn) return;
      submitBtn.disabled = on;
      if (submitLabel) submitLabel.textContent = on ? 'Sending…' : 'Send request';
    }
    function finish(variant) {
      booking.hidden = true;
      $$('[data-variant]', success).forEach(function (v) { v.hidden = v.getAttribute('data-variant') !== variant; });
      success.hidden = false;
      success.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      success.focus({ preventScroll: true });
    }
    // Plain-text summary used for the email fallback
    function summary() {
      return checked.filter(function (el) { return el.type !== 'file' && el.value.trim(); })
        .map(function (el) { return el.getAttribute('data-label') + ': ' + el.value.trim(); })
        .join('\n');
    }

    booking.addEventListener('submit', function (e) {
      e.preventDefault();
      tried = true;
      var gotcha = booking.elements['_gotcha'];
      if (gotcha && gotcha.value) { finish('sent'); return; } // likely a bot
      var bad = checked.filter(function (el) { return !validate(el); });
      if (bad.length) {
        showAlert(bad.length === 1 ? 'Please check the highlighted field.' : 'Please check the ' + bad.length + ' highlighted fields.');
        bad[0].focus();
        return;
      }
      showAlert('');
      if (!endpoint) {
        var name = (booking.elements['first-name'].value + ' ' + booking.elements['last-name'].value).trim();
        var subject = booking.elements['subject'].value.trim();
        window.location.href = 'mailto:' + toEmail + '?subject=' + encodeURIComponent(subject + ' (' + name + ')') +
          '&body=' + encodeURIComponent('Hello,\n\nI would like to request an appointment with Dr Fan.\n\n' + summary() + '\n');
        finish('email');
        return;
      }
      busy(true);
      fetch(endpoint, { method: 'POST', body: new FormData(booking), headers: { Accept: 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error(r.status); finish('sent'); })
        .catch(function () {
          busy(false);
          showAlert('Sorry, your request couldn’t be sent. Please call <a href="tel:1300038398">1300 038 398</a> or email <a href="mailto:' + toEmail + '">' + toEmail + '</a>.');
          alertBox.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        });
    });
  }

  /* ---------- Footer year ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
