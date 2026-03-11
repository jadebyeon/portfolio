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
