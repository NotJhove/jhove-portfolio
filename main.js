/* ================================
   PORTFOLIO — main.js
   ================================ */

/* Active nav link highlighting
   Uses IntersectionObserver to track which section
   is currently in view and highlights the matching nav link.
   ================================ */

(function () {
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  if (!navLinks.length || !sections.length) return;

  function setActive(id) {
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === '#' + id) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  const observerOptions = {
    root: null,
    // Trigger when a section crosses the upper 20% of the viewport
    rootMargin: '-10% 0px -75% 0px',
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActive(entry.target.id);
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
})();
