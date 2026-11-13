/* Let the introduction portrait leave naturally with the scrolling conversation. */
(() => {
  const avatar = document.querySelector('.home-page .hero-chat__avatar');
  const header = document.querySelector('.home-page .header');
  if (!avatar || !header) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let geometry, pending = 0;
  const clamp = n => Math.max(0, Math.min(1, n));
  const smooth = n => { n = clamp(n); return n * n * (3 - 2 * n); };
  function measure() {
    avatar.style.translate = '';
    avatar.style.scale = '';
    const rect = avatar.getBoundingClientRect();
    geometry = { top: rect.top + scrollY, height: rect.height,
      headerBottom: header.getBoundingClientRect().bottom };
    schedule();
  }
  function render() {
    pending = 0;
    if (!geometry || reduced.matches) {
      avatar.style.opacity = '';
      avatar.style.translate = '';
      avatar.style.scale = '';
      return;
    }
    const g = geometry;
    const start = Math.max(0, g.top - g.headerBottom - 96);
    const end = Math.max(start + 96, g.top + g.height * .55 - g.headerBottom);
    const progress = clamp((scrollY - start) / (end - start));
    const fade = smooth(progress);
    avatar.style.opacity = String(1 - fade);
    avatar.style.translate = `0 ${-12 * fade}px`;
    avatar.style.scale = String(1 - .025 * fade);
  }
  function schedule() { if (!pending) pending = requestAnimationFrame(render); }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', () => requestAnimationFrame(measure));
  window.addEventListener('load', measure);
  reduced.addEventListener('change', schedule);
  new ResizeObserver(measure).observe(avatar);
  document.fonts?.ready.then(measure);
  measure();
})();
