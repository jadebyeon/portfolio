document.addEventListener("DOMContentLoaded", () => {
  const selectors = [
    /* home / hero */
    ".home__data > *",
    ".section-kicker",
    ".section-title",

    /* portfolio cards */
    ".portfolio__content",

    /* project pages */
    ".project-hero .hero-overlay > *",
    ".project-intro .project__lede",
    ".project-meta .meta-item",
    ".project .project-section",
    ".project .figure-80"
  ].join(", ");

  const items = Array.from(document.querySelectorAll(selectors));
  if (!items.length) return;

  const portfolioCards = Array.from(document.querySelectorAll(".portfolio__content"));
  const homeItems = Array.from(document.querySelectorAll(".home__data > *"));
  const heroOverlayItems = Array.from(document.querySelectorAll(".project-hero .hero-overlay > *"));

  items.forEach((el) => {
    el.classList.add("reveal-up");

    let delay = 0;

    if (el.matches(".portfolio__content")) {
      const i = portfolioCards.indexOf(el);
      delay = (i % 3) * 100; // stagger by row
    } else if (el.closest(".home__data")) {
      const i = homeItems.indexOf(el);
      delay = i * 120; // stagger hero text
    } else if (el.closest(".project-hero .hero-overlay")) {
      const i = heroOverlayItems.indexOf(el);
      delay = i * 120;
    }

    el.style.transitionDelay = `${delay}ms`;
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  items.forEach((item) => observer.observe(item));
});
