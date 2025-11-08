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


