/* Sharp Tool Tech — main.js */
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Preloader ---------- */
  var pre = document.getElementById('preloader');
  window.addEventListener('load', function () {
    setTimeout(function () { if (pre) pre.classList.add('hide'); }, 500);
  });
  setTimeout(function () { if (pre) pre.classList.add('hide'); }, 2200);

  /* ---------- Nav scroll state ---------- */
  var nav = document.querySelector('.nav');
  function navState() {
    if (!nav) return;
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  navState();
  window.addEventListener('scroll', navState);

  /* ---------- Progress bar ---------- */
  var progress = document.querySelector('.progress-bar');
  window.addEventListener('scroll', function () {
    if (!progress) return;
    var h = document.documentElement;
    var pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progress.style.width = pct + '%';
  });

  /* ---------- Back to top ---------- */
  var top = document.querySelector('.float-top');
  window.addEventListener('scroll', function () {
    if (!top) return;
    if (window.scrollY > 700) top.classList.add('show'); else top.classList.remove('show');
  });
  if (top) top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ---------- Mobile menu ---------- */
  var burger = document.querySelector('.nav-burger');
  var mmenu = document.querySelector('.mobile-menu');
  var mclose = document.querySelector('.mobile-close');
  function toggleMenu(open) {
    if (!mmenu) return;
    mmenu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger) burger.addEventListener('click', function () { toggleMenu(true); });
  if (mclose) mclose.addEventListener('click', function () { toggleMenu(false); });
  document.querySelectorAll('.mobile-menu a').forEach(function (a) {
    a.addEventListener('click', function () { toggleMenu(false); });
  });

  /* ---------- Reveal on scroll ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.14 });
  document.querySelectorAll('[data-reveal]').forEach(function (el) { io.observe(el); });

  /* ---------- Animated counters ---------- */
  var counted = false;
  function animateCounters() {
    if (counted) return; counted = true;
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffixEl = el.querySelector('.stat-suffix');
      var suffix = suffixEl ? suffixEl.outerHTML : '';
      var dur = 1600, start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = Math.floor(eased * target);
        el.innerHTML = val + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.innerHTML = target + suffix;
      }
      requestAnimationFrame(step);
    });
  }
  var statBlock = document.querySelector('.hero-stats');
  if (statBlock) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { animateCounters(); so.disconnect(); } });
    }, { threshold: 0.4 });
    so.observe(statBlock);
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.acc-item').forEach(function (item) {
    var head = item.querySelector('.acc-head');
    var body = item.querySelector('.acc-body');
    head.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.acc-item.open').forEach(function (o) {
        o.classList.remove('open');
        o.querySelector('.acc-body').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Product filter ---------- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var cards = document.querySelectorAll('.product-card');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var cat = btn.getAttribute('data-filter');
      cards.forEach(function (card) {
        var show = cat === 'all' || card.getAttribute('data-cat') === cat;
        card.style.display = show ? '' : 'none';
      });
    });
  });

  /* ---------- Product quick-view modal ---------- */
  var overlay = document.getElementById('pdOverlay');
  if (overlay) {
    var pdImg = overlay.querySelector('.pd-media img');
    var pdCat = overlay.querySelector('.pd-cat');
    var pdTitle = overlay.querySelector('.pd-title');
    var pdDesc = overlay.querySelector('.pd-desc');
    var pdSpecs = overlay.querySelector('.pd-specs');

    document.querySelectorAll('[data-quickview]').forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        var card = trigger.closest('.product-card');
        pdImg.src = card.querySelector('img').src;
        pdImg.alt = card.querySelector('img').alt;
        pdCat.textContent = card.getAttribute('data-cat-label') || 'Precision Tooling';
        pdTitle.textContent = card.querySelector('h3').textContent;
        pdDesc.textContent = card.querySelector('.product-desc') ? card.querySelector('.product-desc').textContent : '';
        var specsAttr = card.getAttribute('data-specs');
        pdSpecs.innerHTML = '';
        if (specsAttr) {
          specsAttr.split('|').forEach(function (pair) {
            var parts = pair.split(':');
            if (parts.length === 2) {
              var row = document.createElement('div');
              row.innerHTML = '<span>' + parts[0] + '</span><b>' + parts[1] + '</b>';
              pdSpecs.appendChild(row);
            }
          });
        }
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target.closest('.pd-close')) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------- Contact / Enquiry form ---------- */
  document.querySelectorAll('form[data-enquiry]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var original = btn.innerHTML;
      btn.innerHTML = 'Message Sent ✓';
      btn.style.opacity = '.75';
      form.reset();
      setTimeout(function () { btn.innerHTML = original; btn.style.opacity = '1'; }, 2600);
    });
  });

  /* ---------- Set active nav link ---------- */
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
  });
});
