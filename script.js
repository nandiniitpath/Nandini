/* ==========================================================================
   NANDINI — Cinematic Night Sky Portfolio  ·  v3
   Star Field · Purple Butterfly · Shooting Stars · All Interactions
   ========================================================================== */
(function () {
  'use strict';

  const qs  = (s, c = document) => c.querySelector(s);
  const qsa = (s, c = document) => [...c.querySelectorAll(s)];
  const lerp = (a, b, t) => a + (b - a) * t;
  const isMobile = () => window.innerWidth < 768;
  const isTouch  = () => matchMedia('(pointer: coarse)').matches;
  const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', () => {
    initLoadingScreen();
    initScrollProgress();
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initScrollReveal();
    initTextReveal();
    initHeroParallax();
    initProjectCardEffects();
    initCertCardEffects();
    initTimelineIllumination();
    initBrandReveal();
    initCertModal();
    initRecruiterMode();
    initContactForm();
    initMagneticButtons();
    initImageReveal();
    if (!isTouch()) initCustomCursor();
    if (!reducedMotion()) {
      initStarField();
      initButterfly();
      initShootingStars();
    }
  });

  // Global visibility state for pausing non-essential animations when tab is hidden
  let isPageVisible = !document.hidden;
  const visibilityListeners = [];
  function onVisibilityChange(fn) {
    visibilityListeners.push(fn);
  }
  document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
    visibilityListeners.forEach(fn => fn(isPageVisible));
  }, { passive: true });

  // Central requestAnimationFrame Scroll Scheduler
  const scrollCallbacks = [];
  let scrollScheduled = false;
  function addScrollListener(fn) {
    scrollCallbacks.push(fn);
  }
  window.addEventListener('scroll', () => {
    if (!scrollScheduled) {
      scrollScheduled = true;
      requestAnimationFrame(() => {
        const sy = window.scrollY;
        for (let i = 0; i < scrollCallbacks.length; i++) {
          scrollCallbacks[i](sy);
        }
        scrollScheduled = false;
      });
    }
  }, { passive: true });

  /* ================================================================
     1.  LOADING SCREEN
     ================================================================ */
  function initLoadingScreen() {
    const screen = qs('#loadingScreen'), counter = qs('#loaderCount'),
          status = qs('#loaderStatus'), bar = qs('#loaderProgressBar');
    if (!screen || !counter || !status) return;
    document.body.classList.add('no-scroll');
    const msgs = ['LOADING MODULES...','LOADING PROFILE...','LOADING EXPERIENCE...',
                  'LOADING SKILLS...','LOADING PROJECTS...','VERIFYING CREDENTIALS...','SYSTEM READY'];
    let start = null, done = false, rafId = null;
    const duration = 2400;

    function tick(ts) {
      if (done) return;
      if (!start) start = ts;
      const pct = Math.min(100, Math.floor(((ts - start) / duration) * 100));
      counter.textContent = String(pct).padStart(pct < 100 ? 2 : 3, '0');
      status.textContent = msgs[Math.min(Math.floor((pct / 100) * msgs.length), msgs.length - 1)];
      if (bar) bar.style.width = pct + '%';
      if (pct < 100) {
        rafId = requestAnimationFrame(tick);
      } else {
        finish();
      }
    }
    function finish() {
      if (done) return; done = true;
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      counter.textContent = '100'; status.textContent = msgs[msgs.length - 1];
      if (bar) bar.style.width = '100%';
      screen.removeEventListener('click', finish);
      setTimeout(() => {
        screen.classList.add('loaded');
        document.body.classList.remove('no-scroll');
        // Make butterfly appear after loading
        const bf = qs('#butterfly');
        if (bf) setTimeout(() => bf.classList.add('visible'), 600);
        setTimeout(() => { screen.style.display = 'none'; }, 900);
      }, 350);
    }
    rafId = requestAnimationFrame(tick);
    screen.addEventListener('click', finish, { once: true });
  }

  /* ================================================================
     2.  SCROLL PROGRESS (Unified RAF Scheduler)
     ================================================================ */
  function initScrollProgress() {
    const bar = qs('#scrollProgress');
    if (!bar) return;
    let cachedMax = 1;
    function updateMax() {
      cachedMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    }
    updateMax();
    window.addEventListener('resize', updateMax, { passive: true });

    addScrollListener((sy) => {
      bar.style.width = `${Math.min(100, Math.max(0, (sy / cachedMax) * 100))}%`;
    });
    bar.style.width = `${Math.min(100, Math.max(0, (window.scrollY / cachedMax) * 100))}%`;
  }

  /* ================================================================
     3.  NAVBAR (Unified RAF Scheduler)
     ================================================================ */
  function initNavbar() {
    const navbar = qs('#navbar'), links = qsa('.nav-link'), sections = qsa('section[id]');
    if (!navbar) return;
    let isScrolled = false;
    const checkScroll = (sy) => {
      const shouldBeScrolled = sy > 60;
      if (shouldBeScrolled !== isScrolled) {
        isScrolled = shouldBeScrolled;
        navbar.classList.toggle('scrolled', isScrolled);
      }
    };
    addScrollListener(checkScroll);
    checkScroll(window.scrollY);

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.id;
          links.forEach(l => {
            const href = l.getAttribute('href');
            if (id === 'skills' || id === 'toolkit') {
              l.classList.toggle('active', href === '#skills' || href === '#expertise');
            } else {
              l.classList.toggle('active', href === `#${id}`);
            }
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => io.observe(s));
  }

  /* ================================================================
     4.  MOBILE MENU
     ================================================================ */
  function initMobileMenu() {
    const navbar = qs('#navbar'), hamburger = qs('#hamburger'), menu = qs('#mobileMenu'), links = qsa('.mobile-link');
    if (!hamburger || !menu) return;
    function toggle(open) {
      const isOpen = typeof open === 'boolean' ? open : !menu.classList.contains('active');
      menu.classList.toggle('active', isOpen); navbar.classList.toggle('nav-open', isOpen);
      document.body.classList.toggle('no-scroll', isOpen);
    }
    hamburger.addEventListener('click', () => toggle());
    links.forEach(l => l.addEventListener('click', () => toggle(false)));
  }

  /* ================================================================
     5.  SMOOTH SCROLL
     ================================================================ */
  function initSmoothScroll() {
    qsa('a[href^="#"]').forEach(a => {
      a.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = qs(href);
        if (!target) return;
        e.preventDefault();
        const menu = qs('#mobileMenu');
        if (menu && menu.classList.contains('active')) {
          menu.classList.remove('active'); qs('#navbar').classList.remove('nav-open'); document.body.classList.remove('no-scroll');
        }
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
      });
    });
  }

  /* ================================================================
     6.  SCROLL REVEAL
     ================================================================ */
  function initScrollReveal() {
    const els = qsa('.reveal, .reveal-left, .reveal-right');
    if (!els.length) return;
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('active'); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    els.forEach(el => io.observe(el));
  }

  /* ================================================================
     7.  TEXT REVEAL
     ================================================================ */
  function initTextReveal() {
    if (reducedMotion()) return;
    qsa('.section-title:not(.workspace-title):not(.toolkit-title)').forEach(title => {
      if (title.classList.contains('workspace-title') || title.classList.contains('toolkit-title')) return;
      const text = title.textContent; title.innerHTML = '';
      text.split('').forEach((ch, i) => {
        const s = document.createElement('span');
        s.className = 'text-reveal-char';
        s.textContent = ch === ' ' ? '\u00A0' : ch;
        s.style.transitionDelay = `${i * 0.03}s`;
        title.appendChild(s);
      });
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => { if (e.isIntersecting) { qsa('.text-reveal-char', e.target).forEach(c => c.classList.add('visible')); obs.unobserve(e.target); } });
      }, { threshold: 0.3 });
      io.observe(title);
    });
  }

  /* ================================================================
     8.  HERO PARALLAX
     ================================================================ */
  function initHeroParallax() {
    const hero = qs('#hero'), portrait = qs('.hero-portrait-container'), glow = qs('.portrait-glow');
    if (!hero || !portrait || isTouch()) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, gx = 0, gy = 0, raf = null;
    let heroRect = null;

    function updateRect() {
      heroRect = hero.getBoundingClientRect();
    }
    updateRect();
    window.addEventListener('resize', updateRect, { passive: true });

    function animate() {
      cx = lerp(cx, tx, 0.06); cy = lerp(cy, ty, 0.06);
      portrait.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;
      if (glow) {
        gx = lerp(gx, -tx * 1.4, 0.04);
        gy = lerp(gy, -ty * 1.4, 0.04);
        glow.style.transform = `translate3d(${gx.toFixed(2)}px, ${gy.toFixed(2)}px, 0)`;
      }
      // Stop loop when converged and idle
      if (Math.abs(cx - tx) > 0.05 || Math.abs(cy - ty) > 0.05) {
        raf = requestAnimationFrame(animate);
      } else {
        raf = null;
      }
    }
    hero.addEventListener('mousemove', e => {
      if (isMobile()) return;
      if (!heroRect) updateRect();
      tx = ((e.clientX - heroRect.left) / heroRect.width - 0.5) * 16;
      ty = ((e.clientY - heroRect.top) / heroRect.height - 0.5) * 10;
      if (!raf) raf = requestAnimationFrame(animate);
    }, { passive: true });
    hero.addEventListener('mouseleave', () => {
      tx = 0; ty = 0;
      if (!raf) raf = requestAnimationFrame(animate);
    });
  }

  /* ================================================================
     9.  PROJECT CARD EFFECTS (RAF throttled)
     ================================================================ */
  function initProjectCardEffects() {
    if (isTouch()) return;
    qsa('.project-card').forEach(card => {
      let rafId = null;
      let targetE = null;
      card.addEventListener('mousemove', e => {
        targetE = e;
        if (!rafId) {
          rafId = requestAnimationFrame(() => {
            if (!targetE) return;
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${targetE.clientX - r.left}px`);
            card.style.setProperty('--mouse-y', `${targetE.clientY - r.top}px`);
            const rx = ((targetE.clientY - r.top) / r.height - 0.5) * -3;
            const ry = ((targetE.clientX - r.left) / r.width - 0.5) * 3;
            card.style.transform = `perspective(800px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-6px)`;
            rafId = null;
          });
        }
      }, { passive: true });
      card.addEventListener('mouseleave', () => {
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        targetE = null;
        card.style.transform = '';
      });
    });
  }

  /* ================================================================
     10. CERT & WORKSPACE CARD EFFECTS (RAF throttled)
     ================================================================ */
  function initCertCardEffects() {
    if (isTouch()) return;
    qsa('.cert-card, .workspace-card, .toolkit-panel').forEach(card => {
      let rafId = null;
      let targetE = null;
      card.addEventListener('mousemove', e => {
        targetE = e;
        if (!rafId) {
          rafId = requestAnimationFrame(() => {
            if (!targetE) return;
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${targetE.clientX - r.left}px`);
            card.style.setProperty('--mouse-y', `${targetE.clientY - r.top}px`);
            rafId = null;
          });
        }
      }, { passive: true });
      card.addEventListener('mouseleave', () => {
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        targetE = null;
      });
    });
  }

  /* ================================================================
     11. TIMELINE ILLUMINATION (IntersectionObserver + Unified RAF)
     ================================================================ */
  function initTimelineIllumination() {
    const timeline = qs('.timeline'), line = qs('.timeline-line'), items = qsa('.timeline-item');
    if (!timeline || !line) return;
    const fill = document.createElement('div');
    fill.style.cssText = 'width:100%;height:0%;background:linear-gradient(to bottom,#8B5CF6,#4A8EFF);border-radius:2px;transition:height .15s linear;box-shadow:0 0 10px rgba(139,92,246,0.3);';
    line.innerHTML = ''; line.appendChild(fill);

    let isTimelineVisible = false;
    const tIO = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        isTimelineVisible = e.isIntersecting;
        if (e.isIntersecting) update();
      });
    }, { rootMargin: '100px 0px' });
    tIO.observe(timeline);

    function update() {
      if (!isTimelineVisible) return;
      const rect = timeline.getBoundingClientRect(), vh = window.innerHeight;
      if (rect.top < vh && rect.bottom > 0) {
        fill.style.height = `${Math.min(1, Math.max(0, (vh * 0.6 - rect.top) / rect.height)) * 100}%`;
      }
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (!item.classList.contains('active') && item.getBoundingClientRect().top < vh * 0.7) {
          item.classList.add('active');
        }
      }
    }
    addScrollListener(update);
    update();
  }

  /* ================================================================
     12. BRAND REVEAL — centered cinematic statement + local star field
     ================================================================ */
  function initBrandReveal() {
    const section = qs('.brand-section');
    const lines = qsa('.brand-line');
    const words = qsa('.brand-words span');
    if (!section) return;

    // ── Brand-local star field canvas ──
    const canvas = qs('#brandStarCanvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      let cw, ch;
      function resizeCanvas() {
        const rect = section.getBoundingClientRect();
        cw = canvas.width = rect.width;
        ch = canvas.height = rect.height;
      }
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      const starCount = isMobile() ? 28 : 55;
      const brandStars = [];
      // Clear zone: center 50% width × 40% height — keep stars in outer frame
      for (let i = 0; i < starCount; i++) {
        let sx, sy;
        do {
          sx = Math.random() * cw;
          sy = Math.random() * ch;
        } while (
          sx > cw * 0.25 && sx < cw * 0.75 &&
          sy > ch * 0.30 && sy < ch * 0.70
        );
        const t = Math.random();
        const color = t < 0.12 ? [167,139,250]
                    : t < 0.22 ? [139,92,246]
                    : t < 0.30 ? [74,142,255]
                    :            [248,250,252];
        brandStars.push({
          x: sx, y: sy,
          r: Math.random() * 1.1 + 0.3,
          baseAlpha: Math.random() * 0.35 + 0.1,
          twinkleSpeed: Math.random() * 0.002 + 0.0008,
          twinklePhase: Math.random() * Math.PI * 2,
          color: color
        });
      }
      // A few brighter accent stars
      for (let i = 0; i < (isMobile() ? 2 : 4); i++) {
        let sx, sy;
        do {
          sx = Math.random() * cw;
          sy = Math.random() * ch;
        } while (
          sx > cw * 0.20 && sx < cw * 0.80 &&
          sy > ch * 0.25 && sy < ch * 0.75
        );
        brandStars.push({
          x: sx, y: sy,
          r: Math.random() * 1.2 + 1.0,
          baseAlpha: Math.random() * 0.25 + 0.35,
          twinkleSpeed: Math.random() * 0.0015 + 0.0005,
          twinklePhase: Math.random() * Math.PI * 2,
          color: [196,181,253]
        });
      }

      let canvasOpacity = 0;
      let sectionVisible = false;
      let brandRaf = null;

      function drawBrandStars(time) {
        if (!isPageVisible || (!sectionVisible && canvasOpacity <= 0.01)) {
          brandRaf = null;
          ctx.clearRect(0, 0, cw, ch);
          return;
        }

        ctx.clearRect(0, 0, cw, ch);
        // Ease canvas opacity
        const targetOp = sectionVisible ? 1 : 0;
        canvasOpacity += (targetOp - canvasOpacity) * 0.04;

        brandStars.forEach(s => {
          const a = (s.baseAlpha + Math.sin(time * s.twinkleSpeed + s.twinklePhase) * s.baseAlpha * 0.5) * canvasOpacity;
          if (a < 0.01) return;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${s.color[0]},${s.color[1]},${s.color[2]},${a.toFixed(3)})`;
          ctx.fill();
          // Soft halo on brighter stars
          if (s.r > 1.2 && a > 0.2) {
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r * 2.6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${s.color[0]},${s.color[1]},${s.color[2]},${(a * 0.09).toFixed(3)})`;
            ctx.fill();
          }
        });
        brandRaf = requestAnimationFrame(drawBrandStars);
      }

      function ensureBrandLoop() {
        if (!reducedMotion() && !brandRaf && (sectionVisible || canvasOpacity > 0.01) && isPageVisible) {
          brandRaf = requestAnimationFrame(drawBrandStars);
        }
      }

      onVisibilityChange((visible) => {
        if (visible) ensureBrandLoop();
      });

      // Visibility observer for star fade + glow activation
      const starIO = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          sectionVisible = e.isIntersecting;
          if (e.isIntersecting) {
            section.classList.add('brand-visible');
            ensureBrandLoop();
          } else {
            section.classList.remove('brand-visible');
            if (canvasOpacity > 0.01) ensureBrandLoop();
          }
        });
      }, { threshold: 0.15 });
      starIO.observe(section);
    }

    // ── Text reveal animations ──
    if (!reducedMotion()) {
      lines.forEach((l, i) => {
        l.style.opacity = '0';
        l.style.transform = 'translateY(24px)';
        l.style.transition = `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + i * 0.22}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + i * 0.22}s`;
      });
      words.forEach((w, i) => {
        w.style.opacity = '0';
        w.style.transform = 'translateY(12px)';
        w.style.transition = `opacity 0.5s ease ${0.9 + i * 0.1}s, transform 0.5s ease ${0.9 + i * 0.1}s`;
      });

      const textIO = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            lines.forEach(l => {
              l.style.opacity = '1';
              l.style.transform = 'translateY(0)';
            });
            words.forEach(w => {
              w.style.opacity = '1';
              w.style.transform = 'translateY(0)';
            });
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.25 });
      textIO.observe(section);
    }
  }

  /* ================================================================
     13. CERT MODAL
     ================================================================ */
  function initCertModal() {
    const modal = qs('#certModal'), overlay = qs('.cert-modal-overlay'), closeBtn = qs('#certModalClose'),
          titleEl = qs('#certModalTitle'), issuerEl = qs('#certModalIssuer'), btns = qsa('.cert-view-btn');
    if (!modal || !titleEl || !issuerEl) return;
    function open(n, i) { titleEl.textContent = n; issuerEl.textContent = i; modal.classList.add('active'); document.body.classList.add('no-scroll'); }
    function close() { modal.classList.remove('active'); document.body.classList.remove('no-scroll'); }
    btns.forEach(b => { if (b.tagName === 'BUTTON') b.addEventListener('click', () => open(b.dataset.certName || 'Certificate', b.dataset.certIssuer || '')); });
    closeBtn && closeBtn.addEventListener('click', close);
    overlay && overlay.addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('active')) close(); });
  }

  /* ================================================================
     13b. RECRUITER MODE MODAL & CONSTELLATION
     ================================================================ */
  function initRecruiterMode() {
    const modal = qs('#recruiterModal');
    const openBtn = qs('#openRecruiterMode');
    const closeBtn = qs('#closeRecruiterBtn');
    const overlay = qs('#recruiterOverlay');
    const stage = qs('#constellationStage', modal);
    const svg = qs('#constellationSvg', modal);

    if (!modal || !openBtn) return;

    function updateConstellationLines() {
      if (!stage || !svg || window.innerWidth <= 600) return;

      const stageRect = stage.getBoundingClientRect();
      if (stageRect.width === 0 || stageRect.height === 0) return;

      const getCenter = (selector) => {
        const el = qs(selector, stage);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          x: (r.left + r.width / 2) - stageRect.left,
          y: (r.top + r.height / 2) - stageRect.top
        };
      };

      const w = getCenter('[data-node="writing"]');
      const d = getCenter('[data-node="data"]');
      const a = getCenter('[data-node="ai"]');
      const c = getCenter('[data-node="cybersecurity"]');
      const center = getCenter('.constellation-center-point') || {
        x: stageRect.width / 2,
        y: stageRect.height / 2
      };

      const setLine = (id, p1, p2) => {
        const l = qs('#' + id, svg);
        if (l && p1 && p2) {
          l.setAttribute('x1', p1.x.toFixed(1));
          l.setAttribute('y1', p1.y.toFixed(1));
          l.setAttribute('x2', p2.x.toFixed(1));
          l.setAttribute('y2', p2.y.toFixed(1));
        }
      };

      setLine('line-w-center', w, center);
      setLine('line-d-center', d, center);
      setLine('line-a-center', a, center);
      setLine('line-c-center', c, center);

      setLine('line-w-d', w, d);
      setLine('line-w-a', w, a);
      setLine('line-d-c', d, c);
      setLine('line-a-c', a, c);
    }

    function open() {
      modal.classList.add('active');
      document.body.classList.add('no-scroll');
      requestAnimationFrame(() => {
        updateConstellationLines();
        setTimeout(updateConstellationLines, 120);
      });
    }

    function close() {
      modal.classList.remove('active');
      document.body.classList.remove('no-scroll');
    }

    openBtn.addEventListener('click', (e) => {
      e.preventDefault();
      open();
    });

    closeBtn && closeBtn.addEventListener('click', close);
    overlay && overlay.addEventListener('click', close);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        close();
      }
    });

    // Close on navigation to in-page anchors
    qsa('[data-close-recruiter="true"]', modal).forEach((link) => {
      link.addEventListener('click', () => {
        close();
      });
    });

    // Constellation interactive nodes
    const nodes = qsa('.constellation-node', modal);
    nodes.forEach((node) => {
      const nodeKey = node.dataset.node;

      node.addEventListener('mouseenter', () => {
        nodes.forEach((other) => {
          if (other !== node) other.classList.add('dimmed');
        });
        // Brighten connecting lines
        if (svg) {
          const classTarget = 'line-to-' + (nodeKey === 'writing' ? 'w' : nodeKey === 'data' ? 'd' : nodeKey === 'ai' ? 'a' : 'c');
          qsa('.' + classTarget, svg).forEach((l) => l.classList.add('active-line'));
        }
      });

      node.addEventListener('mouseleave', () => {
        nodes.forEach((other) => other.classList.remove('dimmed'));
        if (svg) {
          qsa('.constellation-line', svg).forEach((l) => l.classList.remove('active-line'));
        }
      });

      // Clicking anywhere on a node card navigates to its primary target if not clicking a sub-link
      node.addEventListener('click', (e) => {
        if (e.target.closest('.constellation-sub-link') || e.target.closest('a')) {
          return;
        }
        const link = qs('a.constellation-node-link-hint', node);
        if (link) {
          if (link.dataset.closeRecruiter === 'true') {
            close();
            const target = qs(link.getAttribute('href'));
            if (target) {
              target.scrollIntoView({ behavior: 'smooth' });
            }
          } else {
            window.location.href = link.href;
          }
        }
      });

      // Keyboard accessibility (Enter/Space on focused node)
      node.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          node.click();
        }
      });
    });

    window.addEventListener('resize', () => {
      if (modal.classList.contains('active')) {
        updateConstellationLines();
      }
    });
  }

  /* ================================================================
     14. CONTACT FORM
     ================================================================ */
  function initContactForm() {
    const form = qs('#contactForm'), toast = qs('#toast'), msg = qs('#toastMessage');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const n = qs('#contactName', form), em = qs('#contactEmail', form), m = qs('#contactMessage', form);
      let valid = true;
      const chk = (f, ok) => { f.classList.toggle('error', !ok); if (!ok) valid = false; };
      chk(n, n.value.trim() !== ''); chk(em, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value.trim())); chk(m, m.value.trim() !== '');
      if (!valid) return;
      const submitBtn = qs('.form-submit', form);
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'SENDING...'; }
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(r => {
        if (r.ok) {
          if (toast && msg) { msg.textContent = 'MESSAGE SENT ✓'; toast.classList.add('active'); setTimeout(() => toast.classList.remove('active'), 3200); }
          form.reset();
        } else {
          if (toast && msg) { msg.textContent = 'FAILED TO SEND — TRY AGAIN'; toast.classList.add('active'); setTimeout(() => toast.classList.remove('active'), 3200); }
        }
      }).catch(() => {
        if (toast && msg) { msg.textContent = 'NETWORK ERROR — TRY AGAIN'; toast.classList.add('active'); setTimeout(() => toast.classList.remove('active'), 3200); }
      }).finally(() => {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'SEND MESSAGE'; }
      });
    });
    qsa('.form-input', form).forEach(i => i.addEventListener('input', () => i.classList.remove('error')));
  }

  /* ================================================================
     15. MAGNETIC BUTTONS (RAF throttled)
     ================================================================ */
  function initMagneticButtons() {
    if (isTouch()) return;
    qsa('.magnetic').forEach(btn => {
      let rafId = null;
      let targetE = null;
      btn.addEventListener('mousemove', e => {
        targetE = e;
        if (!rafId) {
          rafId = requestAnimationFrame(() => {
            if (!targetE) return;
            const r = btn.getBoundingClientRect();
            btn.style.transform = `translate3d(${((targetE.clientX - r.left - r.width / 2) * 0.2).toFixed(1)}px, ${((targetE.clientY - r.top - r.height / 2) * 0.2).toFixed(1)}px, 0)`;
            rafId = null;
          });
        }
      }, { passive: true });
      btn.addEventListener('mouseleave', () => {
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        targetE = null;
        btn.style.transform = '';
      });
    });
  }

  /* ================================================================
     15b. IMAGE REVEAL — blur→clear entrance + project image parallax
     ================================================================ */
  function initImageReveal() {
    // Add img-reveal class to all project images and section bg images
    qsa('.project-img, .section-bg-img').forEach(img => {
      img.classList.add('img-reveal');
    });
    // Observe and reveal
    const imgs = qsa('.img-reveal');
    if (!imgs.length) return;
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('active');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.05 });
    imgs.forEach(img => io.observe(img));

    // Subtle parallax shift on project card image hover (RAF throttled)
    if (!isTouch()) {
      qsa('.project-image').forEach(container => {
        const img = container.querySelector('.project-img');
        if (!img) return;
        let rafId = null;
        let targetE = null;
        container.addEventListener('mousemove', e => {
          targetE = e;
          if (!rafId) {
            rafId = requestAnimationFrame(() => {
              if (!targetE) return;
              const r = container.getBoundingClientRect();
              const px = (((targetE.clientX - r.left) / r.width - 0.5) * 8).toFixed(1);
              const py = (((targetE.clientY - r.top) / r.height - 0.5) * 6).toFixed(1);
              img.style.transform = `scale(1.06) translate3d(${px}px, ${py}px, 0)`;
              rafId = null;
            });
          }
        }, { passive: true });
        container.addEventListener('mouseleave', () => {
          if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
          targetE = null;
          img.style.transform = '';
        });
      });
    }
  }

  /* ================================================================
     16. CUSTOM CURSOR (Sleeping RAF Loop)
     ================================================================ */
  function initCustomCursor() {
    const dot = qs('#customCursor'), ring = qs('#customCursorRing');
    if (!dot || !ring) return;
    const textEl = document.createElement('div'); textEl.className = 'cursor-text'; document.body.appendChild(textEl);
    let mx = -100, my = -100, dx = -100, dy = -100, rx = -100, ry = -100;
    let cursorRaf = null;

    function animate() {
      if (!isPageVisible) {
        cursorRaf = null;
        return;
      }
      dx = lerp(dx, mx, 0.35); dy = lerp(dy, my, 0.35);
      dot.style.left = `${dx.toFixed(1)}px`; dot.style.top = `${dy.toFixed(1)}px`;
      rx = lerp(rx, mx, 0.12); ry = lerp(ry, my, 0.12);
      ring.style.left = `${rx.toFixed(1)}px`; ring.style.top = `${ry.toFixed(1)}px`;
      textEl.style.left = `${rx.toFixed(1)}px`; textEl.style.top = `${ry.toFixed(1)}px`;

      // Sleep loop when cursor has settled within 0.1px of mouse
      const distD = Math.abs(dx - mx) + Math.abs(dy - my);
      const distR = Math.abs(rx - mx) + Math.abs(ry - my);
      if (distD > 0.15 || distR > 0.15) {
        cursorRaf = requestAnimationFrame(animate);
      } else {
        cursorRaf = null;
      }
    }

    function wakeCursor() {
      if (!cursorRaf && isPageVisible) {
        cursorRaf = requestAnimationFrame(animate);
      }
    }

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      wakeCursor();
    }, { passive: true });

    onVisibilityChange((visible) => {
      if (visible) wakeCursor();
    });
    qsa('a, button, input, textarea, .skill-pill').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
    qsa('[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => { textEl.textContent = el.dataset.cursor; textEl.classList.add('visible'); ring.classList.add('text-mode'); });
      el.addEventListener('mouseleave', () => { textEl.classList.remove('visible'); ring.classList.remove('text-mode'); });
    });
    qsa('.project-card, .cert-card').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
  }

  /* ================================================================
     17. STAR FIELD — 3-layer parallax stars + rare elegant shooting star
     ================================================================ */
  function initStarField() {
    const canvas = qs('#particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Star counts per layer — intentional empty darkness
    const bgCount  = isMobile() ? 55 : 125;
    const midCount = isMobile() ? 15 : 32;
    const fgCount  = isMobile() ? 3  : 7;

    class Star {
      constructor(layer) {
        this.layer = layer; // 0=bg, 1=mid, 2=fg
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.baseY = this.y;
        if (layer === 0) {
          this.r = Math.random() * 0.65 + 0.25;
          this.baseAlpha = Math.random() * 0.25 + 0.08;
          this.parallaxSpeed = 0.015;
        } else if (layer === 1) {
          this.r = Math.random() * 0.95 + 0.45;
          this.baseAlpha = Math.random() * 0.35 + 0.15;
          this.parallaxSpeed = 0.038;
        } else {
          this.r = Math.random() * 1.5 + 0.7;
          this.baseAlpha = Math.random() * 0.45 + 0.25;
          this.parallaxSpeed = 0.08;
        }
        this.alpha = this.baseAlpha;
        this.twinkleSpeed = Math.random() * 0.0018 + 0.0006;
        this.twinklePhase = Math.random() * Math.PI * 2;

        const t = Math.random();
        this.color = t < 0.08 ? [167, 139, 250]   // lavender
                   : t < 0.16 ? [74, 142, 255]    // blue
                   : t < 0.22 ? [139, 92, 246]   // violet
                   :            [248, 250, 252];  // off-white
      }
      update(time, scrollY) {
        this.alpha = this.baseAlpha + Math.sin(time * this.twinkleSpeed + this.twinklePhase) * (this.baseAlpha * 0.45);
        this.y = this.baseY - scrollY * this.parallaxSpeed;
        if (this.y < -15) this.y += h + 30;
        if (this.y > h + 15) this.y -= h + 30;
      }
      draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color[0]},${this.color[1]},${this.color[2]},${Math.max(0, this.alpha)})`;
        ctx.fill();
        if (this.layer === 2 && this.alpha > 0.28) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.r * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${this.color[0]},${this.color[1]},${this.color[2]},${this.alpha * 0.07})`;
          ctx.fill();
        }
      }
    }

    const stars = [];
    for (let i = 0; i < bgCount; i++) stars.push(new Star(0));
    for (let i = 0; i < midCount; i++) stars.push(new Star(1));
    for (let i = 0; i < fgCount; i++) stars.push(new Star(2));

    // Subtle faint constellation pairs
    const midStars = stars.filter(s => s.layer === 1);
    const constellations = [];
    for (let i = 0; i < midStars.length; i++) {
      for (let j = i + 1; j < midStars.length; j++) {
        const dx = midStars[i].x - midStars[j].x;
        const dy = midStars[i].baseY - midStars[j].baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 85 && Math.random() < 0.22) {
          constellations.push({ a: midStars[i], b: midStars[j], fadePhase: Math.random() * Math.PI * 2 });
        }
      }
    }

    // Rare, elegant shooting star state
    let activeShootingStar = null;
    let nextShootingStarTime = performance.now() + 18000 + Math.random() * 18000;

    function updateShootingStar(now) {
      if (!activeShootingStar && now >= nextShootingStarTime) {
        // Spawn a rare shooting star across upper sky
        const angleDeg = -26 - Math.random() * 22; // diagonal downwards
        const angleRad = angleDeg * (Math.PI / 180);
        const dirX = Math.cos(angleRad);
        const dirY = -Math.sin(angleRad);
        const speed = 650 + Math.random() * 450; // px/sec
        const length = 55 + Math.random() * 50;
        const duration = 650 + Math.random() * 450; // 650-1100ms
        const startX = Math.random() * (w * 0.65) + w * 0.05;
        const startY = Math.random() * (h * 0.28) + 25;

        activeShootingStar = {
          startTime: now,
          duration: duration,
          startX: startX,
          startY: startY,
          dirX: dirX,
          dirY: dirY,
          speed: speed,
          length: length,
          alpha: 0.45 + Math.random() * 0.35
        };

        // Next one randomized between 22-42 seconds
        nextShootingStarTime = now + duration + 22000 + Math.random() * 20000;
      }

      if (activeShootingStar) {
        const elapsed = now - activeShootingStar.startTime;
        const p = elapsed / activeShootingStar.duration;
        if (p >= 1) {
          activeShootingStar = null;
          return;
        }

        const dist = (activeShootingStar.speed * elapsed) / 1000;
        const headX = activeShootingStar.startX + activeShootingStar.dirX * dist;
        const headY = activeShootingStar.startY + activeShootingStar.dirY * dist;
        const tailX = headX - activeShootingStar.dirX * activeShootingStar.length;
        const tailY = headY - activeShootingStar.dirY * activeShootingStar.length;

        // Fades in quickly, glides, fades out
        let fade = 1;
        if (p < 0.14) fade = p / 0.14;
        else if (p > 0.45) fade = Math.max(0, 1 - (p - 0.45) / 0.55);
        const curAlpha = activeShootingStar.alpha * fade;

        if (curAlpha > 0.01) {
          const grad = ctx.createLinearGradient(tailX, tailY, headX, headY);
          grad.addColorStop(0, 'rgba(167,139,250,0)');
          grad.addColorStop(0.65, `rgba(196,181,253,${(curAlpha * 0.35).toFixed(3)})`);
          grad.addColorStop(1, `rgba(255,255,255,${curAlpha.toFixed(3)})`);

          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(headX, headY);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.1;
          ctx.lineCap = 'round';
          ctx.stroke();

          // Tiny luminous head
          ctx.beginPath();
          ctx.arc(headX, headY, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${curAlpha.toFixed(3)})`;
          ctx.fill();

          // Soft ambient halo
          ctx.beginPath();
          ctx.arc(headX, headY, 3.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(167,139,250,${(curAlpha * 0.22).toFixed(3)})`;
          ctx.fill();
        }
      }
    }

    // Subtle wing disturbance motes
    const trailDots = [];

    function loop(time) {
      ctx.clearRect(0, 0, w, h);
      const scrollY = window.scrollY;

      // Draw 3-layer stars
      stars.forEach(s => {
        s.update(time, scrollY);
        s.draw(ctx);
      });

      // Draw faint constellation lines
      constellations.forEach(c => {
        const fade = (Math.sin(time * 0.00025 + c.fadePhase) + 1) * 0.5;
        if (fade < 0.25) return;
        ctx.beginPath();
        ctx.moveTo(c.a.x, c.a.y);
        ctx.lineTo(c.b.x, c.b.y);
        ctx.strokeStyle = `rgba(139,92,246,${(0.024 * fade).toFixed(4)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      // Rare shooting star
      if (!reducedMotion()) {
        updateShootingStar(time);
      }

      // Draw subtle light disturbance motes
      for (let i = trailDots.length - 1; i >= 0; i--) {
        const d = trailDots[i];
        d.life -= (d.decay || 0.035);
        if (d.life <= 0) {
          trailDots.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * d.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196,181,253,${(0.12 * d.life).toFixed(3)})`;
        ctx.fill();
      }

      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    window._starFieldTrail = trailDots;
  }

  /* ================================================================
     18. BUTTERFLY — Natural Spline Flight + Organic Cadence
     ================================================================ */
  function initButterfly() {
    const el = qs('#butterfly');
    if (!el) return;

    const canvas = qs('#butterflyCanvas');
    let ctx = null;
    let canvasW = window.innerWidth;
    let canvasH = window.innerHeight;

    if (canvas) {
      ctx = canvas.getContext('2d');
    }

    function resizeCanvas() {
      if (!canvas || !ctx) return;
      canvasW = window.innerWidth;
      canvasH = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvasW * dpr;
      canvas.height = canvasH * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Respect prefers-reduced-motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.left = '78%';
      el.style.top = '18%';
      el.style.transform = 'none';
      el.style.opacity = '0.7';
      return;
    }

    // Autonomous Flight Simulation State
    const isMobile = isTouch() || window.innerWidth < 768;

    // Initial position in upper-right open viewport area
    let posX = isMobile ? window.innerWidth * 0.72 : window.innerWidth * 0.76;
    let posY = isMobile ? window.innerHeight * 0.18 : window.innerHeight * 0.22;

    // Velocity & Acceleration
    let vx = 0.8, vy = -0.6;
    let ax = 0, ay = 0;

    // Memory-based Wandering Noise with angular momentum
    let wanderAngle = -Math.PI / 3;
    let wanderAngularVelocity = 0;

    // Speed & Probabilistic Behavior States (+30% overall speed calibration)
    let currentSpeed = 1.7;
    let targetSpeed = 1.7;
    let flightState = 'cruise';
    let stateTimer = 120;

    // Heading, Aerodynamic Banking, Pitch & Wing Cadence
    let currentHeading = -30; // degrees from upward-facing SVG
    let currentBank = 0;
    let currentPitch = 0;
    let currentFlapDur = 2.2;
    let currentGlow = 0;

    // Glitter Trail Particle System
    const particles = [];
    const MAX_PARTICLES = 70;

    function drawSparkle(context, x, y, size, rot, alpha) {
      context.save();
      context.translate(x, y);
      context.rotate(rot);
      context.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
      context.shadowColor = `rgba(196, 181, 253, ${(alpha * 0.9).toFixed(3)})`;
      context.shadowBlur = size * 3.2;

      context.beginPath();
      const rInner = size * 0.22;
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 2;
        const aNext = a + Math.PI / 4;
        context.lineTo(Math.cos(a) * size, Math.sin(a) * size);
        context.lineTo(Math.cos(aNext) * rInner, Math.sin(aNext) * rInner);
      }
      context.closePath();
      context.fill();
      context.restore();
    }

    let mouseX = -1, mouseY = -1;
    if (!isMobile) {
      document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      }, { passive: true });
    }

    const wingL = el.querySelector('.wing-l');
    const wingR = el.querySelector('.wing-r');

    function animate(timestamp) {
      const time = timestamp * 0.001;

      // 1. Probabilistic Behavioral Events (irregular, non-periodic)
      stateTimer--;
      if (stateTimer <= 0) {
        const roll = Math.random();
        if (roll < 0.24) {
          // Floating pause / gentle glide (almost hovering)
          flightState = 'glide';
          stateTimer = Math.floor(Math.random() * 80 + 50); // ~0.8s to 2.2s
          targetSpeed = Math.random() * 0.45 + 0.45; // 0.45 - 0.90
        } else if (roll < 0.46) {
          // Gentle climb on an upward air current
          flightState = 'climb';
          stateTimer = Math.floor(Math.random() * 70 + 40);
          targetSpeed = Math.random() * 0.65 + 1.6; // 1.6 - 2.25
        } else if (roll < 0.66) {
          // Sweeping graceful curve
          flightState = 'turn';
          stateTimer = Math.floor(Math.random() * 90 + 50);
          targetSpeed = Math.random() * 0.5 + 1.35; // 1.35 - 1.85
        } else {
          // Natural cruising & wandering
          flightState = 'cruise';
          stateTimer = Math.floor(Math.random() * 140 + 80);
          targetSpeed = Math.random() * 0.9 + 1.5; // 1.5 - 2.40
        }
      }

      // 2. Smooth Wandering Randomness with Memory
      wanderAngularVelocity += (Math.random() - 0.5) * 0.038;
      wanderAngularVelocity *= 0.91; // damping ensures momentum & continuity
      if (flightState === 'turn') {
        wanderAngularVelocity += (Math.sin(time * 0.6) > 0 ? 0.022 : -0.022);
      }
      wanderAngle += wanderAngularVelocity;

      // 3. Viewport Boundary Awareness (Organic inward curve, no walls or bounces)
      const padLeft = Math.max(isMobile ? 50 : 85, window.innerWidth * 0.08);
      const padRight = Math.max(isMobile ? 50 : 85, window.innerWidth * 0.08);
      const padTop = Math.max(isMobile ? 80 : 125, window.innerHeight * 0.14);
      const padBottom = Math.max(isMobile ? 60 : 100, window.innerHeight * 0.12);

      let edgeDistX = 0, edgeDistY = 0;

      if (posX < padLeft) {
        edgeDistX = (padLeft - posX) / padLeft;
        if (vx < 0) vx *= 0.94;
      } else if (posX > window.innerWidth - padRight) {
        edgeDistX = (posX - (window.innerWidth - padRight)) / padRight;
        if (vx > 0) vx *= 0.94;
      }

      if (posY < padTop) {
        edgeDistY = (padTop - posY) / padTop;
        if (vy < 0) vy *= 0.94;
      } else if (posY > window.innerHeight - padBottom) {
        edgeDistY = (posY - (window.innerHeight - padBottom)) / padBottom;
        if (vy > 0) vy *= 0.94;
      }

      const edgeFactor = Math.max(edgeDistX, edgeDistY);
      if (edgeFactor > 0) {
        // Gently steer wanderAngle toward viewport interior
        const toCenterX = (window.innerWidth * 0.5) - posX;
        const toCenterY = (window.innerHeight * (isMobile ? 0.38 : 0.46)) - posY;
        const toCenterAngle = Math.atan2(toCenterY, toCenterX);

        let aDiff = (toCenterAngle - wanderAngle) % (Math.PI * 2);
        if (aDiff > Math.PI) aDiff -= Math.PI * 2;
        if (aDiff < -Math.PI) aDiff += Math.PI * 2;

        wanderAngle += aDiff * Math.min(0.20, Math.pow(edgeFactor, 1.3) * 0.15);

        // Smooth inward steering acceleration
        const pushForce = Math.pow(edgeFactor, 1.4) * 0.38;
        const distToCenter = Math.hypot(toCenterX, toCenterY) || 1;
        ax += (toCenterX / distToCenter) * pushForce;
        ay += (toCenterY / distToCenter) * pushForce;
      }

      // 4. Cursor Evasion (Soft organic avoidance with momentum)
      let targetGlow = 0;
      if (!isMobile && mouseX > 0 && mouseY > 0) {
        const dx = posX - mouseX;
        const dy = posY - mouseY;
        const dist = Math.hypot(dx, dy);
        const avoidRadius = 160;

        if (dist < avoidRadius && dist > 1) {
          const norm = (avoidRadius - dist) / avoidRadius;
          const force = Math.pow(norm, 1.6) * 0.36;
          ax += (dx / dist) * force;
          ay += (dy / dist) * force;
          targetGlow = norm;
        }
      }

      // 5. Speed & Steering Vector
      currentSpeed += (targetSpeed - currentSpeed) * 0.028; // +17% acceleration responsiveness
      let desiredVx = Math.cos(wanderAngle) * currentSpeed;
      let desiredVy = Math.sin(wanderAngle) * currentSpeed;

      // Natural vertical buoyancy & state biases
      if (flightState === 'climb') {
        desiredVy -= 0.28;
      } else if (flightState === 'glide') {
        desiredVy += 0.20; // slow drift downwards
      } else {
        // Balanced rhythmic fluttering lift against gravity
        const lift = Math.sin(time * 2.0) * 0.08;
        desiredVy += lift;
      }

      // Steering acceleration towards desired velocity
      const steerRate = 0.046;
      ax += (desiredVx - vx) * steerRate;
      ay += (desiredVy - vy) * steerRate;

      // 6. Physics Integration with Momentum & Damping
      vx += ax;
      vy += ay;
      vx *= 0.982;
      vy *= 0.982;

      posX += vx;
      posY += vy;

      ax = 0;
      ay = 0;

      // Safety viewport margins keeping butterfly fully on-screen
      const halfW = (el.offsetWidth || 82) / 2 + 10;
      const halfH = (el.offsetHeight || 68) / 2 + 10;
      posX = Math.max(halfW, Math.min(window.innerWidth - halfW, posX));
      posY = Math.max(isMobile ? 55 : 85, Math.min(window.innerHeight - halfH, posY));

      const speed = Math.hypot(vx, vy);

      // 7. Body Orientation & Aerodynamic Banking
      let turnRate = 0;
      if (speed > 0.15) {
        // SVG faces upwards by default (+90 deg offset from atan2)
        const targetHeading = (Math.atan2(vy, vx) * 180 / Math.PI) + 90;
        let diff = (targetHeading - currentHeading) % 360;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        turnRate = diff;
        currentHeading += diff * 0.06;
        // Normalize heading to [-180, 180] to prevent degree windup
        currentHeading = ((currentHeading + 180) % 360 + 360) % 360 - 180;
      }

      // Roll bank during turns (dips wing into the curve)
      const targetBank = Math.max(-20, Math.min(20, turnRate * 0.36));
      currentBank = lerp(currentBank, targetBank, 0.065);

      // Pitch angle based on vertical climb / descent
      const targetPitch = Math.max(-14, Math.min(14, vy * 2.4));
      currentPitch = lerp(currentPitch, targetPitch, 0.06);

      // Desynchronized depth & breathing scale
      const depth = 0.96 + Math.sin(time * 0.32) * 0.07;
      const blur = depth < 0.90 ? ((0.90 - depth) * 3).toFixed(1) : 0;

      // Glow & Aura
      currentGlow = lerp(currentGlow, targetGlow, 0.05);
      if (currentGlow > 0.12 && !el.classList.contains('butterfly-glow')) {
        el.classList.add('butterfly-glow');
      } else if (currentGlow <= 0.12 && el.classList.contains('butterfly-glow')) {
        el.classList.remove('butterfly-glow');
      }

      // Check Brand Statement visibility for moonlight glow
      const brandSec = qs('#brand-statement') || qs('.brand-section');
      if (brandSec) {
        const bRect = brandSec.getBoundingClientRect();
        const inBrand = bRect.top < window.innerHeight && bRect.bottom > 0;
        if (inBrand && !el.classList.contains('brand-glow')) el.classList.add('brand-glow');
        else if (!inBrand && el.classList.contains('brand-glow')) el.classList.remove('brand-glow');
      }

      // Apply transform and positioning
      el.style.left = `${posX - el.offsetWidth / 2}px`;
      el.style.top  = `${posY - el.offsetHeight / 2}px`;
      el.style.transform = `scale(${depth.toFixed(3)}) rotate(${currentHeading.toFixed(1)}deg) rotateY(${currentBank.toFixed(1)}deg) rotateX(${currentPitch.toFixed(1)}deg)`;

      const baseShadow = (10 + (depth - 0.9) * 8 + currentGlow * 14).toFixed(1);
      const glowAlpha = (0.42 + currentGlow * 0.38).toFixed(2);
      el.style.filter = blur > 0
        ? `blur(${blur}px) drop-shadow(0 0 ${baseShadow}px rgba(167,139,250,${glowAlpha}))`
        : `drop-shadow(0 0 ${baseShadow}px rgba(167,139,250,${glowAlpha}))`;

      const targetOpacity = (0.80 + (depth - 0.90) * 1.2).toFixed(2);
      el.style.opacity = el.classList.contains('visible') ? targetOpacity : '0';

      // 8. Wing Flap Cadence (Responds subtly to speed, slightly more active in normal flight)
      // Calm gliding when slow; natural lively fluttering when cruising
      const targetFlap = flightState === 'glide'
        ? 3.0
        : Math.max(1.35, 2.85 - speed * 0.65 - currentGlow * 0.30);
      currentFlapDur = lerp(currentFlapDur, targetFlap, 0.045);
      if (wingL) wingL.style.animationDuration = `${currentFlapDur.toFixed(2)}s`;
      if (wingR) wingR.style.animationDuration = `${currentFlapDur.toFixed(2)}s`;

      // 9. Glitter Particles (Inherits actual butterfly flight trajectory)
      const isMoving = speed > 0.35;
      const spawnChance = isMoving ? 0.95 : 0.28;
      if (Math.random() < spawnChance && particles.length < MAX_PARTICLES) {
        const count = isMoving && speed > 2.2 ? 2 : 1;
        for (let k = 0; k < count; k++) {
          const isSparkle = Math.random() < 0.26;
          // Spawn slightly trailing the butterfly's actual motion vector
          const dirX = speed > 0.05 ? vx / speed : 0;
          const dirY = speed > 0.05 ? vy / speed : 0;
          const spawnX = posX - dirX * 18 + (Math.random() - 0.5) * 16;
          const spawnY = posY - dirY * 18 + (Math.random() - 0.5) * 14;

          let baseSize;
          if (isSparkle) {
            baseSize = Math.random() * 3.0 + 3.5; // 3.5px to 6.5px diamond star
          } else {
            const sizeRoll = Math.random();
            if (sizeRoll < 0.30) {
              baseSize = Math.random() * 1.8 + 2.8; // 2.8px to 4.6px glowing orb
            } else if (sizeRoll < 0.75) {
              baseSize = Math.random() * 1.0 + 1.8; // 1.8px to 2.8px
            } else {
              baseSize = Math.random() * 0.8 + 1.0; // 1.0px to 1.8px fine shimmer
            }
          }

          const palette = [
            'rgba(245,243,255,', // Pale lilac / white
            'rgba(196,181,253,', // Lavender
            'rgba(167,139,250,', // Violet
            'rgba(139,92,246,'   // Deep violet
          ];
          const color = palette[Math.floor(Math.random() * palette.length)];

          particles.push({
            x: spawnX,
            y: spawnY,
            vx: -dirX * speed * 0.12 + (Math.random() - 0.5) * 0.35,
            vy: -dirY * speed * 0.08 + (Math.random() * 0.25 + 0.06), // subtle downward floating drift
            baseSize: baseSize,
            isSparkle: isSparkle,
            rot: Math.random() * Math.PI,
            rotSpeed: (Math.random() - 0.5) * 0.06,
            color: color,
            life: 1.0,
            decay: Math.random() * 0.012 + 0.011 // ~50 to 90 frames lifespan
          });
        }
      }

      // Update and render glitter particles on butterfly canvas
      if (ctx) {
        ctx.clearRect(0, 0, canvasW, canvasH);
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life -= p.decay;
          if (p.isSparkle) p.rot += p.rotSpeed;

          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }

          const alpha = Math.pow(p.life, 1.2);
          const currentSize = p.baseSize * (0.35 + 0.65 * p.life);

          if (p.isSparkle) {
            drawSparkle(ctx, p.x, p.y, currentSize, p.rot, alpha);
          } else {
            ctx.save();
            ctx.beginPath();
            ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
            ctx.fillStyle = `${p.color}${alpha.toFixed(3)})`;
            ctx.shadowColor = `rgba(167, 139, 250, ${(alpha * 0.85).toFixed(3)})`;
            ctx.shadowBlur = currentSize * 3.5;
            ctx.fill();

            // Inner bright core for larger orbs
            if (currentSize > 2.2 && alpha > 0.4) {
              ctx.beginPath();
              ctx.arc(p.x, p.y, currentSize * 0.45, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(255, 255, 255, ${(alpha * 0.9).toFixed(3)})`;
              ctx.fill();
            }
            ctx.restore();
          }
        }
      }

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }

  /* ================================================================
     19. SHOOTING STARS DELEGATED TO CANVAS
     ================================================================ */
  function initShootingStars() {
    // Shooting stars are handled with sub-pixel gradient precision
    // in initStarField on the particle canvas.
  }

})();

