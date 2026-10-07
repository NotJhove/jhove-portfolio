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

  document.querySelectorAll('.resume-item-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      // Only intervene on touch devices — desktop keeps normal click behavior
      if (window.matchMedia('(hover: none)').matches) {
        if (!link.classList.contains('tapped')) {
          e.preventDefault();
          // close any other open tab first
          document.querySelectorAll('.resume-item-link.tapped').forEach(function (other) {
            if (other !== link) other.classList.remove('tapped');
          });
          link.classList.add('tapped');
        }
        // if already tapped, do nothing here — let the click through to navigate
      }
    });
  });

/* ================================
   PROJECTS PAGE — CATEGORY FILTER
   Reads ?category=data|software|hardware from the URL and shows only
   matching cards. Does nothing on pages without [data-category] cards.
   ================================ */

(function () {
  var cards = document.querySelectorAll('.project-card[data-category]');
  if (!cards.length) return;

  var buttons = document.querySelectorAll('.filter-btn[data-filter]');
  var params  = new URLSearchParams(window.location.search);
  var current = params.get('category') || 'all';

  function applyFilter(category) {
    cards.forEach(function (card) {
      var match = category === 'all' || card.dataset.category === category;
      card.classList.toggle('is-hidden', !match);
    });
    buttons.forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.filter === category);
    });
  }

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var category = btn.dataset.filter;
      applyFilter(category);
      // keep the URL shareable without reloading
      var url = category === 'all' ? window.location.pathname
                                   : '?category=' + category;
      history.replaceState(null, '', url);
    });
  });

  applyFilter(current);
})();


/* ================================
   PROJECT CATEGORY CAROUSEL (home page)
   Middle card = selected. Clicking the top/bottom card slides it
   into the middle; clicking the middle card opens its link.
   ================================ */

(function () {
  var grid = document.querySelector('.category-grid');
  if (!grid) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll('.category-card'));
  var total = cards.length;
  if (total < 3) return;

  var active = 0;                 // starts on the first card (Data Analytics)
  grid.classList.add('is-carousel');

  // offset of card i relative to the active one, as -1, 0 or 1
  function offsetOf(i) {
    var d = (i - active + total) % total;
    return d === 0 ? 0 : (d === 1 ? 1 : -1);
  }

  function render(animate) {
    cards.forEach(function (card, i) {
      var next = String(offsetOf(i));
      var prev = card.getAttribute('data-pos');
      var wraps = animate && prev !== null && prev !== next && prev !== '0' && next !== '0';

      if (wraps) card.classList.add('jump');
      card.setAttribute('data-pos', next);
      if (next === '0') card.setAttribute('aria-current', 'true');
      else card.removeAttribute('aria-current');
      if (wraps) {
        void card.offsetWidth;    // commit the new position before fading in
        card.classList.remove('jump');
      }
    });
  }

  function select(i) {
    active = (i + total) % total;
    render(true);
  }

  cards.forEach(function (card, i) {
    card.addEventListener('click', function (e) {
      if (i !== active) {
        e.preventDefault();       // side card: bring forward instead of navigating
        select(i);
      }
      // selected card: normal link navigation
    });
  });

  // Arrow keys move the selection when focus is on a card
  grid.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); select(active + 1); cards[active].focus(); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); select(active - 1); cards[active].focus(); }
  });

  render(false);
})();


/* ================================
   ABOUT PHOTO — tap to swap on touch devices
   ================================ */

(function () {
  var swap = document.querySelector('.about-photo-swap');
  if (!swap) return;

  swap.addEventListener('click', function () {
    // desktop uses CSS :hover; only toggle on devices that can't hover
    if (window.matchMedia('(hover: none)').matches) {
      swap.classList.toggle('swapped');
    }
  });
})();

/* ================================
   SCROLL REVEAL
   Fades elements up as they enter the viewport. Grids of items
   (skills, certificates) reveal one by one with a slight stagger.
   Skips entirely for reduced-motion users.
   ================================ */

(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var TRIGGER_OFFSET = '30%';

  var targets = [];

  document.querySelectorAll(
    '#about > .container, #projects > .container, #skills > .container, ' +
    '#certificates > .container, #resume > .container, #connect > .container'
  ).forEach(function (container) {
    Array.prototype.forEach.call(container.children, function (child) {
      // Reveal items of these lists individually instead of the whole block
      var inner = null;
      if (child.matches('.skills-grid'))    inner = child.querySelectorAll('.skill-group');
      else if (child.matches('.cert-list')) inner = child.querySelectorAll('.cert-item');

      if (inner) {
        Array.prototype.forEach.call(inner, function (item, i) {
          item.style.transitionDelay = (i % 4) * 90 + 'ms';
          targets.push(item);
        });
      } else {
        targets.push(child);
      }
    });
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      // also reveal anything already scrolled past (e.g. after a nav-link jump)
      if (!entry.isIntersecting && entry.boundingClientRect.top >= 0) return;

      var el = entry.target;
      el.classList.add('is-visible');
      observer.unobserve(el);

      // clean up afterwards so it doesn't interfere with hover effects
      el.addEventListener('transitionend', function done(e) {
        if (e.target !== el || e.propertyName !== 'opacity') return;
        el.classList.remove('reveal', 'is-visible');
        el.style.transitionDelay = '';
        el.removeEventListener('transitionend', done);
      });
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -' + TRIGGER_OFFSET + ' 0px' });

  targets.forEach(function (el) {
    el.classList.add('reveal');
    observer.observe(el);
  });
})();