(() => {
  const frames = document.querySelectorAll('.wearby-component-embed');
  const send = frame => frame.contentWindow?.postMessage({
    type: 'wearby-visibility', visible: frame.dataset.visible === 'true' && !document.hidden
  }, location.origin);
  const visible = new IntersectionObserver(entries => entries.forEach(({ target, isIntersecting }) => {
    target.dataset.visible = String(isIntersecting);
    send(target);
  }));
  const lazy = new IntersectionObserver(entries => entries.forEach(({ target, isIntersecting }) => {
    if (!isIntersecting) return;
    target.src = target.dataset.src;
    lazy.unobserve(target);
  }), { rootMargin: '300px' });
  frames.forEach(frame => {
    frame.addEventListener('load', () => send(frame));
    visible.observe(frame);
    lazy.observe(frame);
  });
  document.addEventListener('visibilitychange', () => frames.forEach(send));
})();
