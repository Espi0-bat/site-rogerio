'use strict';
/**
 * main.js — Orquestrador
 * Inicializa todos os módulos da landing page
 * Dr. Rogério de Souza Furtado — Oftalmologista
 */

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


/* ── Navbar ──────────────────────────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();


/* ── Mobile Menu ─────────────────────────────────────────────────── */
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  let menuOpen = false;

  function closeMenu() {
    navLinks.style.display = window.innerWidth <= 768 ? 'none' : 'flex';
    menuOpen = false;
    hamburger.setAttribute('aria-expanded', 'false');
  }

  function openMenu() {
    Object.assign(navLinks.style, {
      display        : 'flex',
      flexDirection  : 'column',
      position       : 'fixed',
      top            : '64px',
      left           : '0',
      right          : '0',
      padding        : '2rem',
      background     : 'rgba(240,244,248,0.97)',
      backdropFilter : 'blur(20px)',
      borderBottom   : '1px solid rgba(0,163,122,0.2)',
      zIndex         : '999',
      gap            : '1.5rem',
    });
    menuOpen = true;
    hamburger.setAttribute('aria-expanded', 'true');
  }

  hamburger.addEventListener('click', () => { menuOpen ? closeMenu() : openMenu(); });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => { if (window.innerWidth <= 768) closeMenu(); });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      navLinks.removeAttribute('style');
      menuOpen = false;
      hamburger.setAttribute('aria-expanded', 'false');
    } else if (!menuOpen) {
      navLinks.style.display = 'none';
    }
  }, { passive: true });
})();


/* ── HERO — Scroll-driven acelerado ───────────────────────────────── */
/* ── HERO — Scroll-driven suave ───────────────────────────────────── */
(function initHeroScroll() {
  const wrapper   = document.getElementById('hero-wrapper');
  const textBlock = document.getElementById('hero-text-block');
  const stage     = document.getElementById('hero-stage');
  const hint      = document.getElementById('heroScrollHint');

  if (!wrapper || !textBlock || !stage) return;

  const isMobile = () => window.innerWidth <= 900;

  function getPhases() {
    const VH = window.innerHeight;
    if (isMobile()) {
      return { P0_END: VH * 0.1, P1_END: VH * 0.8 };
    }
    return { P0_END: 0, P1_END: VH * 0.7 };
  }

  let phases = getPhases();

  function lerp(a, b, t) { return a + (b - a) * Math.max(0, Math.min(1, t)); }
  function prog(val, s, e) { return (val - s) / (e - s); }

  const overlayDiv = document.createElement('div');
  overlayDiv.id = 'hero-overlay-div';
  overlayDiv.style.cssText = [
    'position:absolute;inset:0;z-index:1;pointer-events:none;',
    'background:',
    '  linear-gradient(to top, rgba(4,8,12,0.96) 0%, rgba(4,8,12,0.65) 28%, rgba(4,8,12,0.1) 55%, transparent 80%),',
    '  linear-gradient(to bottom, rgba(4,8,12,0.45) 0%, transparent 20%),',
    '  linear-gradient(135deg, rgba(0,163,122,0.08) 0%, transparent 55%);',
    'opacity:0;will-change:opacity;-webkit-backface-visibility:hidden;',
  ].join('');
  stage.appendChild(overlayDiv);

  const s = document.createElement('style');
  s.textContent = '#hero-stage::before { opacity: 0 !important; }';
  document.head.appendChild(s);

  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const sy = window.scrollY;
      const { P0_END, P1_END } = phases;

      if (sy <= P0_END) {
        textBlock.style.transform = 'translateY(30%) translateZ(0)';
        textBlock.style.opacity   = '0';
        overlayDiv.style.opacity = '0';
        if (hint) hint.classList.remove('fade-out');
      } else if (sy < P1_END) {
        const p  = prog(sy, P0_END, P1_END);
        // Transição muito mais leve (30% ao invés de 100%)
        const ty = lerp(30, 0, p);
        textBlock.style.transform = `translateY(${ty}%) translateZ(0)`;
        textBlock.style.opacity   = String(Math.min(1, lerp(0, 1, p * 1.5)));
        overlayDiv.style.opacity = String(Math.min(1, lerp(0, 1.2, p)));
        if (hint) hint.classList.toggle('fade-out', p > 0.05);
      } else {
        textBlock.style.transform = 'translateY(0%) translateZ(0)';
        textBlock.style.opacity   = '1';
        overlayDiv.style.opacity = '1';
        if (hint) hint.classList.add('fade-out');
      }

      ticking = false;
    });
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { phases = getPhases(); onScroll(); }, 150);
  }, { passive: true });

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ── Typewriter ──────────────────────────────────────────────────── */
(function initTypewriter() {
  const el = document.getElementById('heroTyped');
  if (!el) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = 'sem precisar dos óculos.';
    return;
  }

  const TEXT  = 'sem precisar dos óculos.';
  const SPEED = 52;
  const DELAY = 1200;
  let i = 0;
  let cursor = null;

  function addCursor() {
    cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    el.parentNode.insertBefore(cursor, el.nextSibling);
  }

  function removeCursor() {
    if (cursor) {
      cursor.style.animation = 'none';
      cursor.style.opacity = '0';
      setTimeout(() => cursor && cursor.remove(), 400);
      cursor = null;
    }
  }

  function type() {
    if (i <= TEXT.length) {
      el.textContent = TEXT.slice(0, i);
      i++;
      setTimeout(type, i === TEXT.length ? SPEED * 2 : SPEED);
    } else {
      setTimeout(removeCursor, 1500);
    }
  }

  setTimeout(() => { addCursor(); type(); }, DELAY);
})();


/* ── Contadores Animados ─────────────────────────────────────────── */
(function initCounters() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.counter').forEach(el => {
      const t = parseFloat(el.dataset.target);
      const d = parseInt(el.dataset.decimals || 0);
      el.textContent = (d ? t.toFixed(d) : t) + (el.dataset.suffix || '');
    });
    return;
  }

  const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

  function animateCounter(el) {
    const target   = parseFloat(el.dataset.target);
    const suffix   = el.dataset.suffix || '';
    const duration = parseInt(el.dataset.duration || 1600);
    const decimals = parseInt(el.dataset.decimals || 0);
    const start    = performance.now();

    if (noMotion) {
      el.textContent = (decimals ? target.toFixed(decimals) : Math.ceil(target)) + suffix;
      el.classList.add('done');
      return;
    }

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutQuart(progress);
      const current  = target * eased;
      el.textContent = (decimals ? current.toFixed(decimals) : Math.floor(current)) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = (decimals ? target.toFixed(decimals) : Math.ceil(target)) + suffix;
        el.classList.add('done');
      }
    }
    requestAnimationFrame(step);
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter').forEach(el => obs.observe(el));
})();


/* ── Scroll Reveal ───────────────────────────────────────────────── */
(function initScrollReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-scale, .stagger-children')
      .forEach(el => {
        el.classList.add('visible');
        if (el.classList.contains('stagger-children')) {
          el.querySelectorAll(':scope > *').forEach(child => {
            child.style.opacity = '1';
            child.style.transform = 'none';
          });
        }
      });
    return;
  }

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-scale')
    .forEach(el => revealObs.observe(el));

  const staggerObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const children = entry.target.querySelectorAll(':scope > *');
      children.forEach((child, i) => { child.style.setProperty('--stagger-i', i); });
      entry.target.classList.add('visible');
      staggerObs.unobserve(entry.target);
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.stagger-children')
    .forEach(el => staggerObs.observe(el));
})();


/* ── Keyword Highlight ───────────────────────────────────────────── */
(function initKeywordHighlight() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.kw').forEach(kw => kw.classList.add('kw-visible'));
    return;
  }

  const kwObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const kws = entry.target.querySelectorAll('.kw');
      kws.forEach((kw, i) => { setTimeout(() => kw.classList.add('kw-visible'), i * 150); });
      kwObs.unobserve(entry.target);
    });
  }, { threshold: 0.3, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('p:has(.kw), h2:has(.kw), h3:has(.kw), div:has(.kw)')
    .forEach(el => { if (el.querySelectorAll('.kw').length > 0) kwObs.observe(el); });
})();


/* ── Tap Ripple ──────────────────────────────────────────────────── */
(function initRipple() {
  const SELECTORS = [
    '.btn-primary',
    '.btn-whatsapp',
    '.btn-ghost',
    '.convenio-toggle-btn',
    '.convenios-not-found__cta',
    '.curadoria-card__play',
  ].join(', ');

  function createRipple(e, el) {
    el.querySelectorAll('.btn-ripple').forEach(r => r.remove());
    const rect    = el.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const ripple = document.createElement('span');
    ripple.className = 'btn-ripple';
    ripple.style.left = x + 'px';
    ripple.style.top  = y + 'px';
    el.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  }

  document.addEventListener('pointerdown', (e) => {
    const btn = e.target.closest(SELECTORS);
    if (btn) createRipple(e, btn);
  }, { passive: true });
})();


/* ── Modal de Vídeo ──────────────────────────────────────────────── */
(function initVideoModal() {
  const overlay        = document.getElementById('videoModal');
  const closeBtn       = document.getElementById('videoModalClose');
  const modalTitle     = document.getElementById('videoModalTitle');
  const placeholder    = document.getElementById('videoPlaceholder');
  const placeholderTit = document.getElementById('videoPlaceholderTitle');
  const iframeWrapper  = document.getElementById('videoIframeWrapper');

  if (!overlay) return;

  function openModal(titulo, videoUrl) {
    modalTitle.textContent     = titulo;
    placeholderTit.textContent = titulo;

    if (videoUrl) {
      iframeWrapper.innerHTML = `
        <video
          src="${videoUrl}"
          controls autoplay playsinline loading="lazy" preload="none"
          style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#000;"
          aria-label="${titulo}">
          <p style="color:#fff;padding:1rem;">
            Seu navegador não suporta reprodução de vídeo.
            <a href="${videoUrl}" download style="color:var(--cyan)">Baixar vídeo</a>.
          </p>
        </video>`;
      placeholder.style.display   = 'none';
      iframeWrapper.style.display = 'block';
      const vid = iframeWrapper.querySelector('video');
      if (vid) {
        vid.focus();
        if (window.innerWidth < 900) {
          try {
            if (vid.requestFullscreen) {
              vid.requestFullscreen();
            } else if (vid.webkitEnterFullscreen) {
              vid.webkitEnterFullscreen();
            }
          } catch(err) { console.log(err); }
        }
      }
    } else {
      iframeWrapper.style.display = 'none';
      placeholder.style.display   = 'flex';
    }

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-video-open');
    closeBtn.focus();
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    document.body.classList.remove('modal-video-open');
    const vid = iframeWrapper.querySelector('video');
    if (vid) { vid.pause(); vid.src = ''; }
    iframeWrapper.innerHTML = '';
    iframeWrapper.style.display = 'none';
    placeholder.style.display = 'flex';
  }

  document.querySelectorAll('button.curadoria-card__play[data-video], .service_cta_secondary[data-video]').forEach((btn) => {
    btn.addEventListener('click', () => {
      openModal(btn.dataset.titulo || 'Vídeo', btn.dataset.video || '');
    });
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
})();


/* ── Convênios — Busca Inteligente ───────────────────────────────── */
(function initConvenioSearch() {
  const CONVENIOS = [
    'AFEB BRASAL', 'AFFEGO', 'ASETE/ASTE', 'Amil', 'ASSEFAZ', 'ASPDF', 'ASOF', 
    'Allianz Saúde', 'ASFUB', 'ASSEDF', 'Vida Card', 'BACEN', 'BENECAP', 'Bombeiros', 
    'BRB Saúde', 'CAEME-GO', 'CAESAN', 'Cartão Executivo', 'Camed', 'CAA/DF', 'Cassi', 
    'Claro S/A', 'Conab', 'Correios (Postal Saúde)', 'Care Plus', 'CASEC (CODEVASF)', 
    'Casembrapa', 'CNTI', 'Doutor Hoje', 'E-VIDA (Eletronorte)', 'Embratel', 
    'Embaixada da Austrália', 'Embaixada da Dinamarca', 'Embaixada da Costa do Marfim', 
    'Embaixada da África do Sul', 'Embaixada do Quênia', 'FACEB', 'FAPES/BNDES', 'Fascal', 
    'FUSEX', 'GAMA Saúde', 'GDF Saúde', 'Golden Cross', 'GEAP', 'Gravia', 'Hello Med', 
    'HFA', 'HFAB', 'Hospital Naval', 'Interclinicas do Brasil', 'Life Empresarial', 
    'Mediservice', 'NotreDame Intermédica', 'Omint', 'Petrobras Distribuidora', 
    'Petrobras Petróleo', 'Porto Seguro', 'Plan Assiste (MPF, MPM, MPT, MPDFT)', 
    'Polícia Militar (PMDF)', 'Proasa', 'Real Grandeza', 'Rhede Club', 'SAMP/AGMP', 
    'Saúde Caixa', 'Salutá Card', 'S1 Saúde', 'SERPRO Saúde', 'SIS (Senado)', 'STF-MED', 
    'STJ (Pró-Ser)', 'SulAmérica', 'STM (Plas/JMU)', 'Telos', 'TJDFT (Pró-Saúde)', 
    'Top Life Saúde', 'TRE Saúde', 'TRF (Pró-Social)', 'TRT 10ª Região', 'TST Saúde', 
    'Unafisco/Sindifisco', 'Unimed Planalto', 'Unimed Norte e Nordeste', 'Unimed Seguros', 'Vale Saúde'
  ].sort();

  const grid     = document.getElementById('conveniosGrid');
  const input    = document.getElementById('convenioSearch');
  const clearBtn = document.getElementById('convenioSearchClear');
  const notFound = document.getElementById('conveniosNotFound');
  const countEl  = document.getElementById('conveniosCount');

  if (!grid || !input) return;

  function makeCard(name, query, isParticular) {
    const card = document.createElement('div');
    card.className = 'convenio-card' + (isParticular ? ' convenio-card--particular' : '');
    card.setAttribute('role', 'listitem');
    const dot = document.createElement('span');
    dot.className = 'convenio-card__dot';
    dot.setAttribute('aria-hidden', 'true');
    const label = document.createElement('span');
    label.className = 'convenio-card__name';
    if (query && !isParticular) {
      const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      label.innerHTML = name.replace(re, '<mark>$1</mark>');
    } else {
      label.textContent = name;
    }
    card.appendChild(dot);
    card.appendChild(label);
    return card;
  }

  function render(query) {
    const q = (query || '').trim().toLowerCase();
    grid.innerHTML = '';
    const particularMatch = !q || 'particular'.includes(q);
    const filtered = q ? CONVENIOS.filter(c => c.toLowerCase().includes(q)) : [...CONVENIOS];
    const total = filtered.length + (particularMatch ? 1 : 0);

    if (total === 0) {
      grid.style.display = 'none';
      notFound.classList.add('visible');
      countEl.textContent = 'Nenhum resultado encontrado';
      countEl.style.color = 'var(--silver-faint)';
      return;
    }

    grid.style.display = 'grid';
    notFound.classList.remove('visible');
    if (particularMatch) grid.appendChild(makeCard('Particular', q, true));
    filtered.forEach(name => grid.appendChild(makeCard(name, q, false)));

    countEl.textContent = q
      ? `${total} resultado${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`
      : `${total} convênios e planos aceitos`;
    countEl.style.color = q ? 'var(--cyan)' : 'var(--silver-faint)';
  }

  let timer;
  input.addEventListener('input', () => {
    clearBtn.classList.toggle('visible', input.value.length > 0);
    clearTimeout(timer);
    timer = setTimeout(() => {
      render(input.value);
      if (input.value.trim().length > 0 && collapsible && collapsible.classList.contains('collapsed')) {
        const willOpen = true;
        toggleBtn.setAttribute('aria-expanded', String(willOpen));
        collapsible.classList.remove('collapsed');
        toggleBtn.querySelector('.convenio-toggle-btn__text').textContent = 'Ocultar convênios';
      }
    }, 120);
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    clearBtn.classList.remove('visible');
    render('');
    input.focus();
  });

  const toggleBtn   = document.getElementById('convenioToggle');
  const collapsible = document.getElementById('convenioCollapsible');
  if (toggleBtn && collapsible) {
    toggleBtn.addEventListener('click', () => {
      const willOpen = toggleBtn.getAttribute('aria-expanded') !== 'true';
      toggleBtn.setAttribute('aria-expanded', String(willOpen));
      collapsible.classList.toggle('collapsed', !willOpen);
      toggleBtn.querySelector('.convenio-toggle-btn__text').textContent =
        willOpen ? 'Ocultar convênios' : 'Ver convênios aceitos';
    });
  }

  render('');
})();


/* ── Smooth Scroll ───────────────────────────────────────────────── */
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

/* ── Doctoralia Reviews Carousel ──────────────────────────────────── */
(function initDoctoraliaCarousel() {
  const carousel = document.getElementById('doctoralia-carousel');
  if (!carousel) return;

  const btnPrev = document.querySelector('.carousel-control--prev');
  const btnNext = document.querySelector('.carousel-control--next');
  const dots    = document.querySelectorAll('.carousel-dot');

  const getScrollAmount = () => {
    const card = carousel.querySelector('.review-premium-slide');
    if (!card) return 320;
    const style = window.getComputedStyle(carousel);
    const gap = parseFloat(style.gap) || 24;
    return card.offsetWidth + gap;
  };

  const scrollToSlide = (index) => {
    carousel.scrollTo({
      left: index * getScrollAmount(),
      behavior: 'smooth'
    });
  };

  // Seta Próxima
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
      if (carousel.scrollLeft >= maxScrollLeft - 20) {
        carousel.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        carousel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
      }
    });
  }

  // Seta Anterior
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (carousel.scrollLeft <= 20) {
        const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
        carousel.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
      } else {
        carousel.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
      }
    });
  }

  // Loop Infinito no Swipe (Mobile)
  let isScrolling = false;
  carousel.addEventListener('scroll', () => {
    if (isScrolling) return;
    
    const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
    // Se chegou muito perto do final, volta pro começo suavemente
    if (carousel.scrollLeft >= maxScrollLeft - 10) {
      isScrolling = true;
      setTimeout(() => {
        carousel.scrollTo({ left: 0, behavior: 'smooth' });
        setTimeout(() => isScrolling = false, 500);
      }, 150);
    }
  }, { passive: true });


  // Autoplay Opcional (Opcional, mas melhora a percepção de infinito)
  let autoplayInterval = setInterval(() => {
    if (btnNext) btnNext.click();
  }, 6000);

  // Pausa autoplay na interação
  carousel.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
  carousel.addEventListener('mouseleave', () => {
    autoplayInterval = setInterval(() => { if (btnNext) btnNext.click(); }, 6000);
  });
  carousel.addEventListener('touchstart', () => clearInterval(autoplayInterval), { passive: true });
})();
