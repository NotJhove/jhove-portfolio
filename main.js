/* ================================
   PORTFOLIO — main.js
   ================================ */

/* ================================
   HAMBURGER MENU
   ================================ */

(function () {
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks  = document.querySelector('.nav-links');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when any nav link is tapped
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ================================
   ACTIVE NAV HIGHLIGHTING
   Uses IntersectionObserver to track which section
   is currently in view and highlights the matching link.
   ================================ */

(function () {
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  if (!navLinks.length || !sections.length) return;

  function setActive(id) {
    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === '#' + id) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        setActive(entry.target.id);
      }
    });
  }, {
    root: null,
    rootMargin: '-10% 0px -75% 0px',
    threshold: 0,
  });

  sections.forEach(function (section) {
    observer.observe(section);
  });
})();
