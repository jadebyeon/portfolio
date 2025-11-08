/*==================== MENU SHOW Y HIDDEN ====================*/


/*===== MENU SHOW =====*/
/* Validate if constant exists */
// ==== NAV: active link + moving underline + smooth scroll ====
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('nav');                 // your top nav element
  const links = document.querySelectorAll('.site-nav .nav-link');
  const underline = document.querySelector('.nav-underline'); // <span class="nav-underline"></span> inside nav

  // move underline under an anchor
  const moveUnderline = (a) => {
    if (!underline || !a) return;
    const navBox = nav.getBoundingClientRect();
    const aBox = a.getBoundingClientRect();
    underline.style.width = `${aBox.width}px`;
    underline.style.transform = `translateX(${aBox.left - navBox.left}px)`;
  };

  // set active link by section id
  const setActiveByHref = (href) => {
    links.forEach(a => {
      const isActive =
        a.getAttribute('href') === href ||
        (href.startsWith('#') && a.getAttribute('href') === href) ||
        (!href.startsWith('#') && a.pathname === location.pathname);
      a.classList.toggle('is-active', isActive);
      if (isActive) moveUnderline(a);
    });
  };

  // click → smooth scroll + active state
  links.forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      // in-page section (hash)
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const id = href.slice(1);
        const target = document.getElementById(id);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', href);
        setActiveByHref(href);
      } else {
        // full page → let the browser navigate; optional: pre-set active for instant feedback
        setActiveByHref(href || '');
      }
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

