// Stop requesting frames when the containing tile or browser tab is hidden.
window.wearbyMotion = (render, canRun) => {
  let visible = window.parent === window, request = 0;
  const sync = () => {
    if (visible && !document.hidden && canRun()) {
      if (!request) request = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(request);
      request = 0;
    }
  };
  const tick = now => {
    request = 0;
    render(now);
    sync();
  };
  window.addEventListener('message', event => {
    if (event.source !== window.parent || event.origin !== location.origin || event.data?.type !== 'wearby-visibility') return;
    visible = event.data.visible === true;
    sync();
  });
  document.addEventListener('visibilitychange', sync);
  document.addEventListener('click', sync);
  window.addEventListener('wearby-motion-change', sync);
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => queueMicrotask(sync));
  sync();
};
