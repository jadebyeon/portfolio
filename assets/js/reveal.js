document.addEventListener("DOMContentLoaded", () => {
  const selectors = [
    /* home */
    ".home__data > *",
    ".section-kicker",
    ".section-title",
    ".section__title",

    /* portfolio cards */
    ".portfolio__content",

    /* about / general content */
    "main section .container > h1",
    "main section .container > h2",
    "main section .container > h3",
    "main section .container > h4",
    "main section .container > p",
    "main section .container > ul",
    "main section .container > ol",
    "main section .container > .project-meta",
    "main section .container > .about__info",
    "main section .container > .about__buttons",
    "main section .container > .about__data",
    "main section .container > .about__content",

    /* project pages */
    ".project-hero .hero-overlay > *",
    ".project__lede",
    ".project-meta .meta-item",
    ".project-section .prose > *",
    ".project-section .figure-80",
    ".project-section .two-up-grid > *",
    ".project-section .single-tile",
    ".project-section .paired-grid > *",

    /* figures / media across pages */
    "figure.figure-80",
    ".two-up-figure",
    ".single-tile-figure",
    ".paired-figure"
  ];

  const targets = Array.from(
    new Set(
      selectors.flatMap((selector) =>
        Array.from(document.querySelectorAll(selector))
      )
    )
  ).filter(Boolean);

  if (!targets.length) return;

  const staggerMatch =
    "h1, h2, h3, h4, p, ul, ol, figure, .meta-item, .portfolio__content, .two-up-tile, .single-tile, .paired-tile, .project__lede";

  targets.forEach((el) => {
    if (!el.classList.contains("reveal-up")) {
      el.classList.add("reveal-up");
    }

    const parent = el.parentElement;
    if (!parent) return;

    const siblings = Array.from(parent.children).filter((child) =>
      child.matches(staggerMatch)
    );

    const index = siblings.indexOf(el);
    if (index >= 0) {
      el.style.transitionDelay = `${index * 90}ms`;
    }
  });

  const reveal = (el) => {
    el.classList.add("is-visible");
  };

  if (!("IntersectionObserver" in window)) {
    targets.forEach(reveal);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          reveal(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -10% 0px"
    }
  );

  targets.forEach((el) => observer.observe(el));

  /* reveal anything already in the first viewport */
  requestAnimationFrame(() => {
    targets.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.95 && rect.bottom > 0;
      if (inView) reveal(el);
    });
  });
});
