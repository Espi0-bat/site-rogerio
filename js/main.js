/**
 * main.js
 * Todos os comportamentos interativos da landing page
 * Dr. Rogério de Souza Furtado — Oftalmologista
 */

'use strict';

/* ── Cursor personalizado ────────────────────────────────────────── */
(function initCursor() {
  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');

  if (!cursor || !cursorRing) return;
  if (!window.matchMedia('(hover: hover)').matches) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  (function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();

  const hoverTargets = 'a, button, .curadoria-card, .bento-card, .convenio-item, .protocolo-step';
  document.querySelectorAll(hoverTargets).forEach((el) => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
  });
})();


/* ── Navbar — adiciona classe ao rolar ───────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();


/* ── Scroll Reveal via IntersectionObserver ──────────────────────── */
(function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) {
    // Fallback: mostra todos imediatamente
    els.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach((el) => observer.observe(el));
})();


/* ── Mobile menu ─────────────────────────────────────────────────── */
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  let menuOpen = false;

  hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;

    if (menuOpen) {
      Object.assign(navLinks.style, {
        display        : 'flex',
        flexDirection  : 'column',
        position       : 'fixed',
        top            : '64px',
        left           : '0',
        right          : '0',
        padding        : '2rem',
        background     : 'rgba(10,15,26,0.97)',
        backdropFilter : 'blur(20px)',
        borderBottom   : '1px solid rgba(0,209,255,0.15)',
        zIndex         : '999',
        gap            : '1.5rem',
      });
    } else {
      navLinks.style.display = 'none';
    }
  });

  // Fecha ao clicar em um link (mobile)
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navLinks.style.display = 'none';
        menuOpen = false;
      }
    });
  });
})();


/* ── Smooth scroll para âncoras ──────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
