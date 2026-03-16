/* ================================
   PORTFOLIO — main.js
   ================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ================================
     HAMBURGER MENU
     ================================ */

  const hamburger = document.querySelector('.nav-hamburger');
  const navMenu   = document.querySelector('.nav-links');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when any link is tapped
    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ================================
     ACTIVE NAV HIGHLIGHTING
     Uses IntersectionObserver to track which section
     is currently in view and highlights the matching link.
     ================================ */

  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  if (navLinks.length && sections.length) {
    function setActive(id) {
      navLinks.forEach(function (link) {
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, {
      root: null,
      rootMargin: '-10% 0px -75% 0px',
      threshold: 0,
    });

    sections.forEach(function (section) { observer.observe(section); });
  }

});
