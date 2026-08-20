/*
 * Two behaviours, both optional. The page is fully usable with this file
 * blocked or failing: the nav is plain anchor links, and CSS keeps it
 * visible on small screens unless this script announces itself by adding
 * the `js` class (done inline in <head>, before first paint).
 */
(function () {
  'use strict';

  /* ---- small-screen nav toggle ---- */

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

    // Escape closes the menu and returns focus to the control that opened it.
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* ---- nav scroll-spy ---- */

  var links = Array.prototype.slice.call(
    document.querySelectorAll('.site-nav a[href^="#"]')
  );
  if (links.length === 0 || !('IntersectionObserver' in window)) return;

  var byId = {};
  var sections = [];

  links.forEach(function (link) {
    var id = link.getAttribute('href').slice(1);
    var section = document.getElementById(id);
    if (section) {
      byId[id] = link;
      sections.push(section);
    }
  });

  var visible = Object.create(null);

  var mark = function () {
    // Topmost section currently in the band wins, so scrolling up and down
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

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        visible[entry.target.id] = entry.isIntersecting;
      });
      mark();
    },
    // A band just under the sticky header: a section counts as current
    // once its top passes the bar, and stops when it leaves the viewport.
    { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
  );

  sections.forEach(function (section) { observer.observe(section); });
})();
