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
    let start = null, done = false;
    const duration = 2400;

    function tick(ts) {
      if (done) return;
      if (!start) start = ts;
      const pct = Math.min(100, Math.floor(((ts - start) / duration) * 100));
      counter.textContent = String(pct).padStart(pct < 100 ? 2 : 3, '0');
      status.textContent = msgs[Math.min(Math.floor((pct / 100) * msgs.length), msgs.length - 1)];
      if (bar) bar.style.width = pct + '%';
      pct < 100 ? requestAnimationFrame(tick) : finish();
    }
    function finish() {
      if (done) return; done = true;
      counter.textContent = '100'; status.textContent = msgs[msgs.length - 1];
      if (bar) bar.style.width = '100%';
      setTimeout(() => {
        screen.classList.add('loaded');
        document.body.classList.remove('no-scroll');
        // Make butterfly appear after loading
        const bf = qs('#butterfly');
        if (bf) setTimeout(() => bf.classList.add('visible'), 600);
        setTimeout(() => { screen.style.display = 'none'; }, 900);
      }, 350);
    }
    requestAnimationFrame(tick);
    screen.addEventListener('click', finish);
  }

  /* ================================================================
     2.  SCROLL PROGRESS
     ================================================================ */
  function initScrollProgress() {
    const bar = qs('#scrollProgress');
    if (!bar) return;
    const update = () => {
      const t = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = t > 0 ? `${(window.scrollY / t) * 100}%` : '0%';
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ================================================================
     3.  NAVBAR
     ================================================================ */
  function initNavbar() {
    const navbar = qs('#navbar'), links = qsa('.nav-link'), sections = qsa('section[id]');
    if (!navbar) return;
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
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
    let tx = 0, ty = 0, cx = 0, cy = 0, gx = 0, gy = 0, raf;
    function animate() {
      cx = lerp(cx, tx, 0.06); cy = lerp(cy, ty, 0.06);
      portrait.style.transform = `translate(${cx}px, ${cy}px)`;
      if (glow) { gx = lerp(gx, -tx * 1.4, 0.04); gy = lerp(gy, -ty * 1.4, 0.04); glow.style.transform = `translate(${gx}px, ${gy}px)`; }
      raf = requestAnimationFrame(animate);
    }
    hero.addEventListener('mousemove', e => {
      if (isMobile()) return;
      const r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 16;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 10;
      if (!raf) raf = requestAnimationFrame(animate);
    });
    hero.addEventListener('mouseleave', () => { tx = 0; ty = 0; });
  }

  /* ================================================================
     9.  PROJECT CARD EFFECTS
     ================================================================ */
  function initProjectCardEffects() {
    if (isTouch()) return;
    qsa('.project-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - r.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - r.top}px`);
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -3;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 3;
        card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ================================================================
     10. CERT & WORKSPACE CARD EFFECTS
     ================================================================ */
  function initCertCardEffects() {
    if (isTouch()) return;
    qsa('.cert-card, .workspace-card, .toolkit-panel').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - r.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - r.top}px`);
      });
    });
  }

  /* ================================================================
     11. TIMELINE ILLUMINATION
     ================================================================ */
  function initTimelineIllumination() {
    const timeline = qs('.timeline'), line = qs('.timeline-line'), items = qsa('.timeline-item');
    if (!timeline || !line) return;
    const fill = document.createElement('div');
    fill.style.cssText = 'width:100%;height:0%;background:linear-gradient(to bottom,#8B5CF6,#4A8EFF);border-radius:2px;transition:height .15s linear;box-shadow:0 0 10px rgba(139,92,246,0.3);';
    line.innerHTML = ''; line.appendChild(fill);
    function update() {
      const rect = timeline.getBoundingClientRect(), vh = window.innerHeight;
      if (rect.top < vh && rect.bottom > 0) {
        fill.style.height = `${Math.min(1, Math.max(0, (vh * 0.6 - rect.top) / rect.height)) * 100}%`;
      }
      items.forEach(item => { if (item.getBoundingClientRect().top < vh * 0.7) item.classList.add('active'); });
    }
    window.addEventListener('scroll', update, { passive: true }); update();
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

      function drawBrandStars(time) {
        ctx.clearRect(0, 0, cw, ch);
        if (canvasOpacity < 0.01 && !sectionVisible) {
          requestAnimationFrame(drawBrandStars);
          return;
        }
        // Ease canvas opacity
        const targetOp = sectionVisible ? 1 : 0;
        canvasOpacity += (targetOp - canvasOpacity) * 0.03;

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
        requestAnimationFrame(drawBrandStars);
      }
      if (!reducedMotion()) requestAnimationFrame(drawBrandStars);

      // Visibility observer for star fade + glow activation
      const starIO = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          sectionVisible = e.isIntersecting;
          if (e.isIntersecting) {
            section.classList.add('brand-visible');
          } else {
            section.classList.remove('brand-visible');
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
     15. MAGNETIC BUTTONS
     ================================================================ */
  function initMagneticButtons() {
    if (isTouch()) return;
    qsa('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.2}px, ${(e.clientY - r.top - r.height / 2) * 0.2}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
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

    // Subtle parallax shift on project card image hover
    if (!isTouch()) {
      qsa('.project-image').forEach(container => {
        const img = container.querySelector('.project-img');
        if (!img) return;
        container.addEventListener('mousemove', e => {
          const r = container.getBoundingClientRect();
          const px = ((e.clientX - r.left) / r.width - 0.5) * 8;
          const py = ((e.clientY - r.top) / r.height - 0.5) * 6;
          img.style.transform = `scale(1.06) translate(${px}px, ${py}px)`;
        });
        container.addEventListener('mouseleave', () => {
          img.style.transform = '';
        });
      });
    }
  }

  /* ================================================================
     16. CUSTOM CURSOR
     ================================================================ */
  function initCustomCursor() {
    const dot = qs('#customCursor'), ring = qs('#customCursorRing');
    if (!dot || !ring) return;
    const textEl = document.createElement('div'); textEl.className = 'cursor-text'; document.body.appendChild(textEl);
    let mx = 0, my = 0, dx = 0, dy = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    function animate() {
      dx = lerp(dx, mx, 0.35); dy = lerp(dy, my, 0.35);
      dot.style.left = `${dx}px`; dot.style.top = `${dy}px`;
      rx = lerp(rx, mx, 0.12); ry = lerp(ry, my, 0.12);
      ring.style.left = `${rx}px`; ring.style.top = `${ry}px`;
      textEl.style.left = `${rx}px`; textEl.style.top = `${ry}px`;
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
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

    // Catmull-Rom safe clearance trajectory (avoids headings, text, face, cards)
    // s: normalized scroll, x: viewport %, y: viewport %
    const anchors = [
      { s: -0.05, x: 86, y: 14 },
      { s: 0.00,  x: 85, y: 16 }, // Hero upper right, far from portrait face
      { s: 0.08,  x: 91, y: 34 }, // Far right peripheral drift
      { s: 0.16,  x: 88, y: 62 }, // Lazy curve down
      { s: 0.25,  x: 86, y: 24 }, // About section upper-right open margin
      { s: 0.35,  x: 90, y: 52 }, // Expertise right margin
      { s: 0.45,  x: 92, y: 38 }, // Skills right margin
      { s: 0.55,  x: 89, y: 64 }, // Projects gutter, well clear of cards
      { s: 0.65,  x: 86, y: 32 }, // Journey upper-right
      { s: 0.74,  x: 90, y: 55 }, // Certifications right open column
      { s: 0.81,  x: 78, y: 36 }, // Transition toward Brand Statement
      { s: 0.85,  x: 51, y: 52 }, // Brand Statement empty space between image fade & text
      { s: 0.89,  x: 82, y: 22 }, // Ascends into open space away from brand text
      { s: 0.95,  x: 86, y: 26 }, // Contact section upper-right
      { s: 1.00,  x: 88, y: 42 }, // Footer rest
      { s: 1.05,  x: 88, y: 44 }
    ];

    function catmullRom(p0, p1, p2, p3, t) {
      const t2 = t * t;
      const t3 = t2 * t;
      return 0.5 * (
        (2 * p1) +
        (-p0 + p2) * t +
        (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
        (-p0 + 3 * p1 - 3 * p2 + p3) * t3
      );
    }

    function getSplinePos(pct) {
      let i = 1;
      while (i < anchors.length - 2 && anchors[i].s < pct) i++;
      const p0 = anchors[i - 1];
      const p1 = anchors[i];
      const p2 = anchors[i + 1];
      const p3 = anchors[i + 2] || p2;
      const segmentLen = p2.s - p1.s;
      const t = segmentLen > 0 ? Math.max(0, Math.min(1, (pct - p1.s) / segmentLen)) : 0;
      return {
        x: catmullRom(p0.x, p1.x, p2.x, p3.x, t),
        y: catmullRom(p0.y, p1.y, p2.y, p3.y, t)
      };
    }

    let mouseX = -1, mouseY = -1;
    let curX = 0, curY = 0;
    let prevX = 0, prevY = 0;
    let curRotate = 0;
    let curPitch = 0;
    let curFlapDur = 1.2;

    if (!isTouch()) {
      document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });
    }

    function getScrollPercent() {
      const t = document.documentElement.scrollHeight - window.innerHeight;
      return t > 0 ? Math.max(0, Math.min(1, window.scrollY / t)) : 0;
    }

    const wingL = el.querySelector('.wing-l');
    const wingR = el.querySelector('.wing-r');

    function animate(timestamp) {
      const pct = getScrollPercent();
      const spline = getSplinePos(pct);
      const time = timestamp * 0.001;

      // Brand statement section factor (~0.82 to 0.88)
      const brandDistance = Math.abs(pct - 0.85);
      const isBrandZone = brandDistance < 0.05;
      const brandDamp = isBrandZone ? (0.45 + (brandDistance / 0.05) * 0.55) : 1.0;

      // Toggle enhanced moonlight glow in Brand section
      if (isBrandZone && !el.classList.contains('brand-glow')) {
        el.classList.add('brand-glow');
      } else if (!isBrandZone && el.classList.contains('brand-glow')) {
        el.classList.remove('brand-glow');
      }

      // Harmonic organic flutter waves
      const flutterX = (Math.sin(time * 0.65) * 14 + Math.sin(time * 1.4 + 1.2) * 7 + Math.sin(time * 2.8) * 3) * brandDamp;
      const flutterY = (Math.cos(time * 0.52) * 10 + Math.cos(time * 1.25 + 0.8) * 5 + Math.sin(time * 1.9) * 2.5) * brandDamp;

      let targetX = (spline.x / 100) * window.innerWidth + flutterX;
      let targetY = (spline.y / 100) * window.innerHeight + flutterY;

      // Subtle mouse reaction (desktop only) — gentle avoidance
      if (!isTouch() && mouseX > 0) {
        const dx = targetX - mouseX;
        const dy = targetY - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160 && dist > 1) {
          const force = ((160 - dist) / 160) * 26;
          targetX += (dx / dist) * force;
          targetY += (dy / dist) * force;
        }
      }

      // Smooth lag / floating inertia (soft damping)
      const smoothFactor = isBrandZone ? 0.026 : 0.036;
      curX = lerp(curX, targetX, smoothFactor);
      curY = lerp(curY, targetY, smoothFactor);

      // Velocity calculation
      const vx = curX - prevX;
      const vy = curY - prevY;
      const speed = Math.sqrt(vx * vx + vy * vy);

      // Depth & scale modulation (0.86 to 1.0)
      const depth = 0.88 + 0.12 * Math.sin(pct * Math.PI * 3.2 + time * 0.15);
      const blur = depth < 0.90 ? 0.5 : 0;

      // Aerodynamic banking and pitch rotation
      const targetBank = Math.max(-28, Math.min(28, vx * 4.2));
      const targetPitch = Math.max(-16, Math.min(16, vy * 2.8));
      curRotate = lerp(curRotate, targetBank, 0.06);
      curPitch = lerp(curPitch, targetPitch, 0.06);

      // Position butterfly element
      el.style.left = `${curX - el.offsetWidth / 2}px`;
      el.style.top  = `${curY - el.offsetHeight / 2}px`;
      el.style.transform = `scale(${depth.toFixed(3)}) rotate(${curRotate.toFixed(1)}deg) rotateX(${curPitch.toFixed(1)}deg)`;
      el.style.filter = blur ? `blur(${blur}px)` : '';
      el.style.opacity = el.classList.contains('visible') ? ((depth * 0.78 + 0.22)).toFixed(2) : '0';

      // Organic wing flap cadence: slow graceful glide modulated by speed
      const targetFlap = isBrandZone ? 1.55 : Math.max(0.68, 1.45 - speed * 0.07);
      curFlapDur = lerp(curFlapDur, targetFlap, 0.05);
      if (wingL) wingL.style.animationDuration = `${curFlapDur.toFixed(2)}s`;
      if (wingR) wingR.style.animationDuration = `${curFlapDur.toFixed(2)}s`;

      // Extremely subtle luminous disturbance motes (rare, tiny points of light)
      if (window._starFieldTrail && speed > 0.85 && Math.random() < 0.16) {
        window._starFieldTrail.push({
          x: curX + (Math.random() - 0.5) * 6,
          y: curY + (Math.random() - 0.5) * 6,
          r: Math.random() * 0.5 + 0.6,
          life: 1.0,
          decay: 0.038
        });
        if (window._starFieldTrail.length > 5) window._starFieldTrail.shift();
      }

      prevX = curX;
      prevY = curY;
      requestAnimationFrame(animate);
    }

    // Initialize initial coordinate
    const initPos = getSplinePos(0);
    curX = (initPos.x / 100) * window.innerWidth;
    curY = (initPos.y / 100) * window.innerHeight;
    prevX = curX;
    prevY = curY;

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

