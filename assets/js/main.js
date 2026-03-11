/*==================== MENU SHOW Y HIDDEN ====================*/


/*===== MENU SHOW =====*/
/* Validate if constant exists */
// ==== NAV: active link + moving underline + smooth scroll ====
document.addEventListener('DOMContentLoaded', () => {
  const links = Array.from(document.querySelectorAll('.site-menu .nav-link'));
  const brand = document.querySelector('.brand'); // <span class="nav-underline"></span> inside nav

  // set active link by section id
  const setActive = (targetHref) => {
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === targetHref));
  };

  const workLink = links.find(a => a.getAttribute('href') === '#portfolio');
  if (workLink) setActive('#portfolio');

  // click handling: update active underline/color
  links.forEach(a => {
    a.addEventListener('click', () => {
      // If it's a hash link on this page, update active
      const href = a.getAttribute('href') || '';
      if (href.startsWith('#')) setActive(href);
      // If it's a separate page (e.g., about.html/contact.html), the new page will load
      // and its own script can set the correct active state there.
    });
  });
});

  if (location.hash) {
    setActiveByHref(location.hash);
  } else {
    // mark current page link active (About/Contact pages)
    setActiveByHref(location.pathname);
  }
});
  
  // scroll → update active link (IntersectionObserver)
  const io = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(en => en.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setActive(visible.target.id);
  }, { rootMargin: '-40% 0px -50% 0px', threshold: [0.25, 0.5, 0.75] });

  sections.forEach(sec => io.observe(sec));

  // initial position (on load or when landing with a hash)
  const initialId = location.hash?.slice(1) || (sections[0] && sections[0].id);
  if (initialId) setActive(initialId);
});

/* Back-to-top for footer buttons on every page */
document.querySelectorAll('.footer__back').forEach(function (link) {
  link.addEventListener('click', function (e) {
    e.preventDefault();  // ignore default anchor + template handlers

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const navLinks   = document.querySelectorAll(".site-menu .nav-link");
  const footer     = document.getElementById("footer");
  const contactLink = document.querySelector('.site-menu .nav-link[href="#footer"]');
  const workLink    = document.querySelector('.site-menu .nav-link[href="#portfolio"]');

  /* ----- 2a. Click behavior for in-page anchors ----- */
  navLinks.forEach(link => {
    const href = link.getAttribute("href") || "";

    // Only handle same-page anchors (#portfolio, #footer, etc.)
    if (href.startsWith("#")) {
      link.addEventListener("click", () => {
        navLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
      });
    }
  });

  /* ----- 2b. Footer visibility → Contact active ----- */
  if (footer && contactLink && workLink && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Footer in view → Contact active
            contactLink.classList.add("active");
            workLink.classList.remove("active");
          } else {
            // Footer out of view → Work back to active (default)
            contactLink.classList.remove("active");
            workLink.classList.add("active");
          }
        });
      },
      { threshold: 0.35 } // ~35% of footer visible
    );

    observer.observe(footer);
  }
});



<script>
document.addEventListener("DOMContentLoaded", function () {
  const grids = Array.from(document.querySelectorAll(".paired-figure .paired-grid"));
  if (!grids.length) return;

  function layoutGrid(grid) {
    const tiles = Array.from(grid.querySelectorAll(".paired-tile"));
    const imgs  = tiles.map(t => t.querySelector("img")).filter(Boolean);
    if (!imgs.length) return;

    const isMobile = window.innerWidth <= 700;
    if (isMobile) {
      // let CSS handle stacked layout
      tiles.forEach(tile => {
        tile.style.height   = "";
        tile.style.flex     = "";
        tile.style.flexBasis = "";
      });
      return;
    }

    const width = grid.clientWidth;
    if (!width) return;

    const gapPx = parseFloat(getComputedStyle(grid).gap) || 0;
    const aspects = imgs.map(img => {
      const ar = img.naturalWidth && img.naturalHeight
        ? img.naturalWidth / img.naturalHeight
        : 1;
      return ar;
    });

    const aspectSum = aspects.reduce((a, b) => a + b, 0);
    const totalGap  = gapPx * (imgs.length - 1);
    const rowHeight = (width - totalGap) / aspectSum; // common height

    tiles.forEach((tile, i) => {
      const tileWidth = rowHeight * aspects[i];
      tile.style.height = rowHeight + "px";
      tile.style.flex   = "0 0 " + tileWidth + "px";
    });
  }

  function layoutAll() {
    grids.forEach(layoutGrid);
  }

  // wait for images to load so naturalWidth/Height are available
  const promises = [];
  grids.forEach(grid => {
    grid.querySelectorAll("img").forEach(img => {
      if (img.complete && img.naturalWidth) return;
      promises.push(new Promise(resolve => {
        img.addEventListener("load", resolve, { once: true });
        img.addEventListener("error", resolve, { once: true });
      }));
    });
  });

  Promise.all(promises).then(() => {
    layoutAll();
    window.addEventListener("resize", layoutAll);
  });
});

</script>


/*===== MENU HIDDEN =====*/
/* Validate if constant exists */


/*==================== REMOVE MENU MOBILE ====================*/


/*==================== ACCORDION SKILLS ====================*/


/*==================== QUALIFICATION TABS ====================*/


/*==================== SERVICES MODAL ====================*/


/*==================== PORTFOLIO SWIPER  ====================*/


/*==================== TESTIMONIAL ====================*/


/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/


/*==================== CHANGE BACKGROUND HEADER ====================*/ 


/*==================== SHOW SCROLL UP ====================*/ 



/*==================== DARK LIGHT THEME ====================*/ 
// ===== PERSONA SWITCHER =====
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.persona-tab');
  const panels = document.querySelectorAll('.persona-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.persona;

      // Update tabs
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Update panels
      panels.forEach(p => p.classList.remove('active', 'fade-in'));
      const activePanel = document.querySelector(`.persona-panel[data-persona="${target}"]`);
      if (activePanel) {
        activePanel.classList.add('active');
        // Trigger animation by forcing reflow
        void activePanel.offsetWidth;
        activePanel.classList.add('fade-in');
      }
    });
  });
});







