/* A continuous phone reel; repeated screens recycle beyond the visible area. */
(() => {
  document.querySelectorAll('[data-screen-motion]').forEach(panel => {
    let items = [...panel.querySelectorAll('.ootd-screen-motion__group > li')];
    const button = panel.querySelector('button');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const base = new URL('../../assets/img/iPhone16_frame.png', location.href);
    items.forEach(item => {
      const screen = document.createElement('div');
      screen.className = 'ootd-screen-motion__screen';
      screen.append(item.querySelector('img'));
      const frame = document.createElement('img');
      frame.src = base.href;
      frame.className = 'ootd-screen-motion__frame';
      frame.alt = '';
      frame.setAttribute('aria-hidden', 'true');
      frame.loading = 'lazy';
      frame.decoding = 'async';
      item.append(screen, frame);
    });
    // Keep three complete sequences, so wrapping never happens at a visible edge.
    const group = panel.querySelector('.ootd-screen-motion__group');
    const originals = [...items];
    for (let copy = 0; copy < 2; copy++) {
      originals.forEach(original => {
        const clone = original.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.querySelectorAll('img').forEach(img => img.alt = '');
        group.append(clone);
      });
    }
    items = [...group.children];
    panel.classList.add('is-enhanced');
    let paused = reduced.matches, visible = false, request = 0, last = 0, elapsed = 0, stride = 240;
    function render() {
      // Match the reference's quick handoff and long, gentle settling tail.
      const cycle = 2400;
      const progress = (elapsed % cycle) / cycle;
      const t = Math.max(0, (progress - .08) / .92);
      const decay = x => 1 - (1 + 8 * x) * Math.exp(-8 * x);
      const phase = Math.floor(elapsed / cycle) + decay(t) / decay(1);
      items.forEach((item, i) => {
        const distance = ((i - phase + items.length * 100 + items.length / 2) % items.length) - items.length / 2;
        const away = Math.min(1, Math.abs(distance));
        const x = distance * stride;
        const edgeStart = panel.clientWidth / 2 - item.offsetWidth * .65;
        const edge = Math.max(0, Math.min(1, (Math.abs(x) - edgeStart) / (item.offsetWidth * .7)));
        item.style.transform = `translateX(${x}px)`;
        item.style.filter = `blur(${away * .2 + edge * 2.2}px)`;
        item.style.opacity = String(1 - away * .22);
        item.style.zIndex = String(10 - Math.round(Math.abs(distance) * 2));
      });
    }
    function tick(now) {
      request = 0;
      if (last) elapsed += Math.min(50, now - last);
      last = now;
      render();
      request = requestAnimationFrame(tick);
    }
    function sync() {
      const running = visible && !paused && !document.hidden;
      panel.dataset.running = String(running);
      if (running && !request) { last = 0; request = requestAnimationFrame(tick); }
      if (!running) { cancelAnimationFrame(request); request = 0; last = 0; }
      button.setAttribute('aria-pressed', String(paused));
      button.setAttribute('aria-label', paused ? 'Play screen animation' : 'Pause screen animation');
      button.firstElementChild.textContent = paused ? '▷' : 'Ⅱ';
    }
    function measure() {
      stride = items[0].offsetWidth * 1.36;
      render();
    }
    new ResizeObserver(measure).observe(panel);
    button.addEventListener('click', () => { paused = !paused; sync(); });
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }).observe(panel);
    document.addEventListener('visibilitychange', sync);
    reduced.addEventListener('change', () => { paused = reduced.matches; sync(); });
    measure();
    sync();
  });
})();
