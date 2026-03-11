/*==================== NAV ====================*/
document.addEventListener("DOMContentLoaded", function () {
  const navLinks   = document.querySelectorAll(".site-menu .nav-link");
  const footer     = document.getElementById("footer");
  const contactLink = document.querySelector('.site-menu .nav-link[href="#footer"]');
  const workLink    = document.querySelector('.site-menu .nav-link[href="#portfolio"]');

  navLinks.forEach(link => {
    const href = link.getAttribute("href") || "";
    if (href.startsWith("#")) {
      link.addEventListener("click", () => {
        navLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
      });
    }
  });

  if (footer && contactLink && workLink && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            contactLink.classList.add("active");
            workLink.classList.remove("active");
          } else {
            contactLink.classList.remove("active");
            workLink.classList.add("active");
          }
        });
      },
      { threshold: 0.35 }
    );
    observer.observe(footer);
  }
});

/*==================== BACK TO TOP ====================*/
document.querySelectorAll('.footer__back').forEach(function (link) {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

/*==================== PERSONA SWITCHER ====================*/
(function () {
  function initPersona() {
    const tabs = document.querySelectorAll('.persona-tab');
    const panels = document.querySelectorAll('.persona-panel');
    if (!tabs.length || !panels.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        const target = tab.getAttribute('data-persona');

        tabs.forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        panels.forEach(function (p) {
          p.classList.remove('active', 'fade-in');
        });

        const activePanel = document.querySelector('.persona-panel[data-persona="' + target + '"]');
        if (activePanel) {
          activePanel.classList.add('active');
          void activePanel.offsetWidth;
          activePanel.classList.add('fade-in');
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPersona);
  } else {
    initPersona();
  }
})();

(function () {

  // ── Helpers ──────────────────────────────────────────────
  function typewrite(el, opts) {
    opts = opts || {};
    var speed = opts.speed || 28;
    var text = el.getAttribute('data-text') || el.textContent;
    el.setAttribute('data-text', text);
    el.textContent = '';
    el.style.visibility = 'visible';
    var i = 0;
    var mono = opts.mono || false;

    // Engineer variant: monospace mid-type, snap back at end
    if (mono) {
      el.style.fontFamily = "'Courier New', monospace";
      el.style.letterSpacing = '0.04em';
    }

    function tick() {
      if (i < text.length) {
        el.textContent += text[i];
        i++;
        setTimeout(tick, speed);
      } else {
        if (mono) {
          // snap back to display font after short pause
          setTimeout(function () {
            el.style.fontFamily = '';
            el.style.letterSpacing = '';
          }, 320);
        }
        if (opts.cursor) {
          // add blinking cursor that stays
          var cursor = document.createElement('span');
          cursor.className = 'mint-cursor';
          cursor.setAttribute('aria-hidden', 'true');
          el.parentNode.insertBefore(cursor, el.nextSibling);
        }
      }
    }
    tick();
  }

  function wordFadeUp(el) {
    var text = el.getAttribute('data-text') || el.textContent;
    el.setAttribute('data-text', text);
    el.innerHTML = '';
    el.style.visibility = 'visible';
    var words = text.split(' ');
    words.forEach(function (word, i) {
      var span = document.createElement('span');
      span.textContent = (i < words.length - 1) ? word + '\u00a0' : word;
      span.style.cssText = 'display:inline-block;opacity:0;transform:translateY(10px);transition:opacity 0.4s ease ' + (i * 0.1) + 's,transform 0.4s ease ' + (i * 0.1) + 's';
      el.appendChild(span);
      setTimeout(function () {
        span.style.opacity = '1';
        span.style.transform = 'translateY(0)';
      }, 30);
    });
  }

  function slowFade(el) {
    el.style.visibility = 'visible';
    el.style.opacity = '0';
    el.style.transition = 'opacity 1.4s ease';
    setTimeout(function () { el.style.opacity = '1'; }, 30);
  }

  function drawUnderline(el) {
    el.style.visibility = 'visible';
    // wrap in relative span, inject SVG underline
    var text = el.textContent;
    el.innerHTML = '<span style="position:relative;display:inline">' + text +
      '<svg aria-hidden="true" style="position:absolute;left:0;bottom:-4px;width:100%;height:6px;overflow:visible" viewBox="0 0 100 6" preserveAspectRatio="none">' +
      '<path d="M0,4 Q50,0 100,4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"' +
      ' style="stroke-dasharray:120;stroke-dashoffset:120;transition:stroke-dashoffset 0.7s cubic-bezier(0.4,0,0.2,1)"/>' +
      '</svg></span>';
    setTimeout(function () {
      var path = el.querySelector('path');
      if (path) path.style.strokeDashoffset = '0';
    }, 40);
  }

  // ── Remove old cursors ────────────────────────────────────
  function clearCursors() {
    document.querySelectorAll('.mint-cursor').forEach(function (c) { c.remove(); });
  }

  // ── Animate the mint span based on persona ────────────────
  function animateMint(panel) {
    clearCursors();
    var mint = panel.querySelector('.text-mint');
    if (!mint) return;

    // Reset
    mint.innerHTML = mint.getAttribute('data-text') || mint.textContent;
    mint.style.visibility = 'visible';
    mint.style.opacity = '1';
    mint.style.fontFamily = '';
    mint.style.letterSpacing = '';
    mint.style.transition = '';

    var persona = panel.getAttribute('data-persona');

    if (persona === 'anyone') {
      drawUnderline(mint);
    } else if (persona === 'recruiters') {
      typewrite(mint, { speed: 22 });
    } else if (persona === 'ux') {
      wordFadeUp(mint);
    } else if (persona === 'designers') {
      typewrite(mint, { speed: 26, cursor: true });
    } else if (persona === 'engineers') {
      typewrite(mint, { speed: 20, mono: true });
    } else if (persona === 'personal') {
      slowFade(mint);
    }
  }

  // ── Init ──────────────────────────────────────────────────
  function initAnimations() {
    var tabs = document.querySelectorAll('.persona-tab');
    if (!tabs.length) return;

    // Store original text on each mint span before any animation
    document.querySelectorAll('.persona-panel .text-mint').forEach(function (el) {
      if (!el.getAttribute('data-text')) el.setAttribute('data-text', el.textContent);
    });

    // Page load
    var active = document.querySelector('.persona-panel.active');
    if (active) setTimeout(function () { animateMint(active); }, 120);

    // Tab switch
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = tab.getAttribute('data-persona');
        var panel = document.querySelector('.persona-panel[data-persona="' + target + '"]');
        if (panel) setTimeout(function () { animateMint(panel); }, 90);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
  } else {
    initAnimations();
  }

})();

