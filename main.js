/*
 * Four small behaviours, all optional. The page is fully usable with this
 * file blocked or failing: the nav is plain anchor links, nothing is
 * hidden, and CSS keeps the nav visible on small screens unless this
 * script announces itself with the `js` class (set inline in <head>,
 * before first paint, so there is no flash).
 *
 * No libraries. Two IntersectionObservers and one scroll listener.
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false };

  /* ---- 1. small-screen nav toggle ---- */

  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('site-nav');

  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };

    toggle.addEventListener('click', function () {
      setOpen(nav.classList.contains('open') === false);
    });

    // Jumping to a section should not leave the menu covering it.
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });

    // Escape closes and hands focus back to the control that opened it.
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* ---- 2. scroll progress + header state ---- */

  var bar = document.querySelector('.progress span');
  var header = document.querySelector('.site-header');
  var ticking = false;

  var onScroll = function () {
    var top = window.scrollY || document.documentElement.scrollTop;

    if (bar) {
      var scrollable = document.documentElement.scrollHeight - window.innerHeight;
      // scaleX beats animating width: it stays on the compositor.
      var ratio = scrollable > 0 ? Math.min(top / scrollable, 1) : 0;
      bar.style.width = '100%';
      bar.style.transform = 'scaleX(' + ratio + ')';
    }

    if (header) header.classList.toggle('stuck', top > 8);
    ticking = false;
  };

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  onScroll();

  /* ---- 3. scroll reveal ---- */

  var revealables = document.querySelectorAll('.reveal');

  var revealAll = function () {
    Array.prototype.forEach.call(revealables, function (el) {
      el.classList.add('is-visible');
    });
  };

  if (revealables.length && 'IntersectionObserver' in window && !reduceMotion.matches) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target); // reveal once, then stop
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.04 });

    Array.prototype.forEach.call(revealables, function (el) {
      revealObserver.observe(el);
    });

    // Failsafe. Hiding content until an observer fires is only acceptable
    // if it cannot get stuck: anything still hidden after 3s is shown
    // unconditionally, whatever went wrong. Content is never the thing
    // that loses.
    window.setTimeout(revealAll, 3000);

    // Someone jumping straight to #skills from a shared link must not
    // land on an invisible section.
    window.addEventListener('hashchange', revealAll);
    if (window.location.hash) revealAll();
  } else {
    // No observer, or the visitor asked for less motion: show everything.
    revealAll();
  }

  /* ---- 4. nav scroll-spy ---- */

  var links = Array.prototype.slice.call(
    document.querySelectorAll('.site-nav a[href^="#"]')
  );
  if (links.length === 0 || !('IntersectionObserver' in window)) return;

  var sections = [];
  links.forEach(function (link) {
    var section = document.getElementById(link.getAttribute('href').slice(1));
    if (section) sections.push(section);
  });

  var visible = Object.create(null);

  var mark = function () {
    // Topmost section in the band wins, so scrolling either direction
    // through overlapping sections gives a stable answer.
    var current = null;
    sections.forEach(function (section) {
      if (visible[section.id] && current === null) current = section.id;
    });

    links.forEach(function (link) {
      if (link.getAttribute('href') === '#' + current) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      visible[entry.target.id] = entry.isIntersecting;
    });
    mark();
  }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

  sections.forEach(function (section) { spy.observe(section); });
})();
