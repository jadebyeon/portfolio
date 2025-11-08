/*==================== MENU SHOW Y HIDDEN ====================*/


/*===== MENU SHOW =====*/
/* Validate if constant exists */
// ==== NAV: active link + moving underline + smooth scroll ====
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('nav');                 // your top nav element
  const links = document.querySelectorAll('nav a[href^="#"]');
  const sections = [...document.querySelectorAll('section[id]')];
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
  const setActive = (id) => {
    links.forEach(a => {
      const active = a.getAttribute('href') === `#${id}`;
      a.classList.toggle('is-active', active);  // CSS will make it grey
      if (active) moveUnderline(a);
    });
  };

  // click → smooth scroll + active state
  links.forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActive(id);
      history.replaceState(null, '', `#${id}`);
    });
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
