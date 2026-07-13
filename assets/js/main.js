/*==================== HERO LOAD-IN ====================
  Load-triggered only (see styles.css @keyframes heroLoadIn). Toggles
  body.loaded to start the staggered entrance animation, then once
  every group has had time to finish, adds body.is-settled (which pins
  the resting opacity/transform in CSS, independent of the animation)
  and clears each element's inline animation so the persona tab-switch
  transitions underneath work normally again. */
(function () {
  var TARGETS = '.persona-tabs, #heroCopy [data-copy-title], #heroCopy [data-copy-line]';
  var SETTLE_MS = 1150; // latest group: 0.4s delay + 0.7s duration + buffer

  function revealHero() {
    document.body.classList.add('loaded');

    setTimeout(function () {
      document.body.classList.add('is-settled');
      document.querySelectorAll(TARGETS).forEach(function (el) {
        el.style.animation = 'none';
      });
    }, SETTLE_MS);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', revealHero);
  } else {
    revealHero();
  }
})();

/*==================== NAV ====================*/
document.addEventListener("DOMContentLoaded", function () {
  const navLinks   = document.querySelectorAll(".site-menu .nav-link");
  const footer     = document.getElementById("footer");
  const contactLink = document.querySelector('.site-menu .nav-link[href="#footer"]');
  const workLink    = document.querySelector('.site-menu .nav-link[href="#portfolio"]');

  navLinks.forEach(link => {
    const href = link.getAttribute("href") || "";
    if (href.startsWith("#")) {
      link.addEventListener("click", () => {
        navLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
      });
    }
  });

  if (footer && contactLink && workLink && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            contactLink.classList.add("active");
            workLink.classList.remove("active");
          } else {
            contactLink.classList.remove("active");
            workLink.classList.add("active");
          }
        });
      },
      { threshold: 0.35 }
    );
    observer.observe(footer);
  }
});

/*==================== BACK TO TOP ====================*/
document.querySelectorAll('.footer__back').forEach(function (link) {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

/*==================== OCT PROJECT: IMPACT NUMBER COUNT-UP ====================
  Counts each .impact-number up from 0 once it scrolls into view.
  Handles both plain integers ("30") and percentages ("93%"). No-ops
  on pages without .impact-number or without IntersectionObserver. */
(function () {
  function animateCount(el, target, suffix, reduceMotion) {
    if (reduceMotion) {
      el.textContent = target + suffix;
      return;
    }
    var duration = 1000;
    var start = null;
    function tick(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target + suffix;
      }
    }
    requestAnimationFrame(tick);
  }

  function init() {
    var numbers = document.querySelectorAll('.impact-number');
    if (!numbers.length) return;

    var reduceMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    numbers.forEach(function (el) {
      var match = el.textContent.trim().match(/^(\d+)(%?)$/);
      if (!match) return;
      var target = parseInt(match[1], 10);
      var suffix = match[2];

      if (reduceMotion || !('IntersectionObserver' in window)) {
        el.textContent = target + suffix;
        return;
      }

      el.textContent = '0' + suffix;

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          animateCount(el, target, suffix, false);
          observer.unobserve(el);
        });
      }, { threshold: 0.4 });
      observer.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/*==================== OCT PROJECT: CHARACTER OVERLAY ====================
  Click a character tile to reveal its name + description; click again
  (or another tile) to close. No-ops on pages without .character-tile. */
(function () {
  function init() {
    var tiles = document.querySelectorAll('.character-tile');
    if (!tiles.length) return;

    tiles.forEach(function (tile) {
      tile.addEventListener('click', function () {
        var wasOpen = tile.classList.contains('is-open');
        tiles.forEach(function (t) { t.classList.remove('is-open'); });
        if (!wasOpen) tile.classList.add('is-open');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/*==================== OCT PROJECT: JOURNEY SCRUBBER ====================
  Range slider (0-100) that scrubs the two SVG polylines via
  stroke-dasharray/stroke-dashoffset. The mint "with Sam" line is a
  single dash the length of the reveal (solid). The gray "without Sam"
  line rebuilds a small repeating dash/gap pattern up to the reveal
  point each time the slider moves, so it stays visually dashed while
  still only showing up to the current position. Works with mouse,
  touch, and keyboard (native <input type="range">). No-ops on pages
  without .journey-scrubber-slider. */
(function () {
  var STAGES = [
    { label: 'Home', note: "Sam's video plays at home. First familiarity forms." },
    { label: 'Waiting room', note: 'Sam appears again on the waiting room screen.' },
    { label: 'First contact', note: "The child recognizes Sam. The robot isn't a stranger." },
    { label: 'During exam', note: 'Sam narrates the mission. The child has a role.' },
    { label: 'Goodbye', note: 'Sam says goodbye. The exam ends as a story, not a procedure.' }
  ];
  var DASH = 7;
  var GAP = 6;

  // Builds a dasharray that shows a repeating dash/gap pattern only up
  // to `revealedLength`, then hides everything after it.
  function dashedRevealArray(totalLength, revealedLength) {
    if (revealedLength <= 0) return '0 ' + totalLength;
    var segments = [];
    var covered = 0;
    var isDash = true;
    while (covered < revealedLength) {
      var unit = isDash ? DASH : GAP;
      var seg = Math.min(unit, revealedLength - covered);
      segments.push(seg);
      covered += seg;
      isDash = !isDash;
    }
    // whatever position comes next must render as empty so nothing
    // beyond revealedLength shows
    if (isDash) {
      segments.push(0, totalLength);
    } else {
      segments.push(totalLength);
    }
    return segments.join(' ');
  }

  function init() {
    var slider = document.getElementById('journeyScrubberSlider');
    var without = document.querySelector('.scrubber-line--without');
    var withSam = document.querySelector('.scrubber-line--with');
    var stageEl = document.getElementById('journeyScrubberStage');
    var noteEl = document.getElementById('journeyScrubberAnnotation');
    if (!slider || !without || !withSam || !stageEl || !noteEl) return;

    var withoutLength = without.getTotalLength();
    var withLength = withSam.getTotalLength();

    function render() {
      var value = Number(slider.value);
      var progress = value / 100;

      var revealedWithout = withoutLength * progress;
      without.style.strokeDasharray = dashedRevealArray(withoutLength, revealedWithout);

      withSam.style.strokeDasharray = withLength;
      withSam.style.strokeDashoffset = withLength * (1 - progress);

      var stageIndex = Math.min(STAGES.length - 1, Math.floor(value / (100 / STAGES.length)));
      stageEl.textContent = STAGES[stageIndex].label;
      noteEl.textContent = STAGES[stageIndex].note;
    }

    slider.addEventListener('input', render);
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/*==================== PERSONA COPY ====================
  Single place to edit the hero copy per audience tab.

  title: use [[...]] to mark the highlighted phrase (exactly one pair).
  titleMode: how that phrase reveals —
    'reveal'    marker-stroke clip-path sweep (Tab 1)
    'scramble'  characters flicker then settle, left to right (Tab 2)
    'pipeline'  each comma-separated word fades in as its own step,
                underlining the previous word once the next appears (Tab 3)

  line1 / line1Mode: line1Mode 'text' = plain line; 'pipeline' = arrow-
  separated segments that light up left to right (Tab 3's process line).
  line2: plain static line, or null to hide it (Tab 2 replaces it with chips).
  chips: array of short strings shown as pill chips (Tab 2 only) or null.
  resume: optional { text, href } to show the résumé link. */
var PERSONA_COPY = {
  anyone: {
    titleMode: 'reveal',
    title: "Hi, I'm Jade. I design products that [[make hard situations feel less hard.]]",
    line1Mode: 'text',
    line1: 'Incoming MEng Design & Technology Innovation @ Duke',
    line2: 'Previously BA Art & Design + BS Statistics @ University of Michigan',
    chips: null,
    resume: null
  },
  recruiters: {
    titleMode: 'scramble',
    title: 'Product designer with a statistics degree — I turn [[research into shipped, measurable design.]]',
    line1Mode: 'text',
    line1: 'Seeking product design & UX internships (2026–27)',
    line2: null,
    chips: ['3 shipped projects', 'ACM co-author', '30+ research participants'],
    resume: { text: 'View Résumé →', href: 'assets/pdf/Jade_Resume.pdf' }
  },
  designers: {
    titleMode: 'pipeline',
    title: 'Every interface is a hypothesis — [[researched, prototyped, tested, shipped.]]',
    line1Mode: 'pipeline',
    line1: 'mixed-methods research → design systems → front-end handoff',
    line2: 'Currently rebuilding this site in vanilla HTML/CSS/JS, one commit at a time',
    chips: null,
    resume: null
  }
};

/*==================== PERSONA SWITCHER ====================
  Click-triggered only — no hover-dependent behavior. Every tab's
  extra effect (scramble, pipeline words, chips, lit segments) starts
  once the headline has landed (~300ms) and finishes within ~1s total.
  Respects prefers-reduced-motion by swapping instantly. */
(function () {
  var STAGGER_MS = 60;
  var EXIT_MS = 150;
  var LAND_MS = 300; // when the headline's own fade+slide lands
  var SCRAMBLE_CHARS = '01#$%&*+=?/';

  function escapeHTML(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function splitTitle(title) {
    var parts = title.split(/\[\[|\]\]/);
    return { before: parts[0], mint: parts[1], after: parts[2] || '' };
  }

  // "abc [[def]] ghi" -> "abc <span class="text-mint" data-mint>def</span> ghi",
  // or, for titleMode "pipeline", each comma-separated word gets its own span.
  function renderTitleHTML(copy) {
    var t = splitTitle(copy.title);
    if (copy.titleMode === 'pipeline') {
      var words = t.mint.split(', ');
      var wordsHTML = words.map(function (w, i) {
        return '<span class="text-mint-word" data-word="' + i + '">' + escapeHTML(w) + '</span>';
      }).join(', ');
      return escapeHTML(t.before) + wordsHTML + escapeHTML(t.after);
    }
    return escapeHTML(t.before) +
      '<span class="text-mint" data-mint data-mint-mode="' + copy.titleMode + '">' + escapeHTML(t.mint) + '</span>' +
      escapeHTML(t.after);
  }

  // Plain text, or (titleMode-independent) arrow-separated segments
  // for line1Mode "pipeline".
  function renderLine1HTML(copy) {
    if (copy.line1Mode === 'pipeline') {
      return copy.line1.split(' → ').map(function (seg) {
        return '<span class="pipeline-segment" data-segment>' + escapeHTML(seg) + '</span>';
      }).join(' <span class="pipeline-arrow">→</span> ');
    }
    return escapeHTML(copy.line1);
  }

  function populate(container, copy) {
    container.querySelector('[data-copy-title]').innerHTML = renderTitleHTML(copy);

    var line1 = container.querySelector('[data-copy-line="1"]');
    line1.innerHTML = renderLine1HTML(copy);

    var line2 = container.querySelector('[data-copy-line="2"]');
    if (copy.line2) {
      line2.textContent = copy.line2;
      line2.hidden = false;
    } else {
      line2.hidden = true;
    }

    var chipsEl = container.querySelector('[data-copy-chips]');
    chipsEl.innerHTML = '';
    if (copy.chips) {
      copy.chips.forEach(function (text) {
        var chip = document.createElement('span');
        chip.className = 'hero-chip';
        chip.textContent = text;
        chipsEl.appendChild(chip);
      });
      chipsEl.hidden = false;
    } else {
      chipsEl.hidden = true;
    }

    var link = container.querySelector('[data-copy-link]');
    if (copy.resume) {
      link.textContent = copy.resume.text;
      link.href = copy.resume.href;
      link.hidden = false;
    } else {
      link.hidden = true;
    }
  }

  // Flicker through random glyphs, settling into the final characters
  // left to right over `duration` ms. Whitespace is left untouched.
  function scrambleReveal(el, finalText, duration) {
    var chars = finalText.split('');
    var n = chars.length;
    var start = Date.now();
    var timer = setInterval(function () {
      var elapsed = Date.now() - start;
      var out = '';
      var done = true;
      for (var i = 0; i < n; i++) {
        var settleAt = (i / n) * duration;
        if (elapsed >= settleAt || /\s/.test(chars[i])) {
          out += chars[i];
        } else {
          done = false;
          out += SCRAMBLE_CHARS[(Math.random() * SCRAMBLE_CHARS.length) | 0];
        }
      }
      el.textContent = out;
      if (done) {
        clearInterval(timer);
        el.textContent = finalText;
      }
    }, 45);
    return function cancel() {
      clearInterval(timer);
      el.textContent = finalText;
    };
  }

  function initPersona() {
    var tabs = document.querySelectorAll('.persona-tab');
    var heroEl = document.getElementById('heroCopy');
    if (!tabs.length || !heroEl) return;

    var reduceMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // setTimeout/interval-cancel functions for whatever the currently
    // active tab's extra effect scheduled, so a fast second click
    // doesn't leave a stale scramble/pipeline timer still running
    var pendingCancels = [];
    function clearPending() {
      pendingCancels.forEach(function (cancel) { cancel(); });
      pendingCancels = [];
    }
    function schedule(fn, delay) {
      var id = setTimeout(fn, delay);
      pendingCancels.push(function () { clearTimeout(id); });
    }

    function getLines() {
      var lines = [heroEl.querySelector('[data-copy-title]')];
      var line1 = heroEl.querySelector('[data-copy-line="1"]');
      if (!line1.hidden) lines.push(line1);
      var line2 = heroEl.querySelector('[data-copy-line="2"]');
      if (!line2.hidden) lines.push(line2);
      return lines;
    }

    // ---- Tab-specific extras, all timed off LAND_MS (headline landing) ----
    function revealMint(copy) {
      if (copy.titleMode === 'reveal') {
        var mint = heroEl.querySelector('[data-mint]');
        if (!mint) return;
        mint.classList.remove('is-revealed');
        void mint.offsetWidth;
        mint.classList.add('is-revealed'); // its own transition-delay does the waiting
      } else if (copy.titleMode === 'scramble') {
        var scrambleEl = heroEl.querySelector('[data-mint]');
        if (!scrambleEl) return;
        var finalText = scrambleEl.textContent;
        schedule(function () {
          pendingCancels.push(scrambleReveal(scrambleEl, finalText, 350));
        }, LAND_MS);
      } else if (copy.titleMode === 'pipeline') {
        var words = heroEl.querySelectorAll('[data-word]');
        var leadIn = 100, stagger = 250;
        words.forEach(function (w, i) {
          schedule(function () {
            w.classList.add('is-in');
            if (i > 0) words[i - 1].classList.add('is-done');
            if (i === words.length - 1) {
              schedule(function () { w.classList.add('is-done'); }, 200);
            }
          }, leadIn + i * stagger);
        });
      }
    }

    function revealChips(copy) {
      if (!copy.chips) return;
      var chips = heroEl.querySelectorAll('[data-copy-chips] .hero-chip');
      chips.forEach(function (chip, i) {
        schedule(function () { chip.classList.add('is-in'); }, LAND_MS + i * 80);
      });
    }

    function revealResume(copy) {
      var link = heroEl.querySelector('[data-copy-link]');
      if (link.hidden) return;
      var delay = copy.chips ? LAND_MS + copy.chips.length * 80 : LAND_MS;
      schedule(function () {
        link.style.transitionDelay = '0ms';
        void link.offsetWidth;
        link.classList.remove('is-priming');
      }, delay);
    }

    function revealPipelineSegments(copy) {
      if (copy.line1Mode !== 'pipeline') return;
      var segs = heroEl.querySelectorAll('[data-segment]');
      segs.forEach(function (seg, i) {
        schedule(function () { seg.classList.add('is-lit'); }, LAND_MS + i * 200);
      });
    }

    function revealInReduced(copy) {
      getLines().forEach(function (el) { el.classList.remove('is-priming'); });
      var mint = heroEl.querySelector('[data-mint]');
      if (mint) mint.classList.add('is-revealed');
      heroEl.querySelectorAll('[data-word]').forEach(function (w) {
        w.classList.add('is-in', 'is-done');
      });
      heroEl.querySelectorAll('[data-copy-chips] .hero-chip').forEach(function (c) {
        c.classList.add('is-in');
      });
      heroEl.querySelectorAll('[data-segment]').forEach(function (s) {
        s.classList.add('is-lit');
      });
      var link = heroEl.querySelector('[data-copy-link]');
      link.classList.remove('is-priming');
    }

    function revealIn(copy) {
      if (reduceMotion) {
        revealInReduced(copy);
        return;
      }

      var lines = getLines();
      lines.forEach(function (el, i) {
        el.style.transitionDelay = (i * STAGGER_MS) + 'ms';
      });
      // force layout so the transitions below actually animate from
      // their "primed"/hidden state instead of jumping straight in
      void heroEl.offsetWidth;
      lines.forEach(function (el) { el.classList.remove('is-priming'); });

      revealMint(copy);
      revealChips(copy);
      revealResume(copy);
      revealPipelineSegments(copy);
    }

    function switchTo(persona) {
      var copy = PERSONA_COPY[persona];
      if (!copy) return;

      clearPending();

      if (reduceMotion) {
        populate(heroEl, copy);
        revealIn(copy);
        return;
      }

      var outgoing = getLines();
      var chipsEl = heroEl.querySelector('[data-copy-chips]');
      var link = heroEl.querySelector('[data-copy-link]');
      if (!chipsEl.hidden) outgoing = outgoing.concat([].slice.call(chipsEl.querySelectorAll('.hero-chip')));
      if (!link.hidden) outgoing.push(link);

      outgoing.forEach(function (el) {
        el.style.transitionDelay = '0s';
        el.classList.add('is-exiting');
      });

      schedule(function () {
        populate(heroEl, copy);

        var incoming = getLines();
        var newLink = heroEl.querySelector('[data-copy-link]');
        if (!newLink.hidden) incoming.push(newLink);
        incoming.forEach(function (el) {
          el.classList.remove('is-exiting');
          el.classList.add('is-priming');
        });

        revealIn(copy);
      }, EXIT_MS);
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = tab.getAttribute('data-persona');

        tabs.forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        switchTo(target);
      });
    });

    // Initial fade-in for the "anyone" copy already baked into the HTML
    revealIn(PERSONA_COPY.anyone);

    // ---- Reserve hero height across all three tabs (no layout shift) ----
    function computeMinHeight() {
      heroEl.style.minHeight = '0';

      var clone = heroEl.cloneNode(true);
      clone.style.position = 'absolute';
      clone.style.visibility = 'hidden';
      clone.style.pointerEvents = 'none';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      clone.style.width = heroEl.getBoundingClientRect().width + 'px';
      document.body.appendChild(clone);

      var max = 0;
      Object.keys(PERSONA_COPY).forEach(function (key) {
        populate(clone, PERSONA_COPY[key]);
        max = Math.max(max, clone.scrollHeight);
      });

      document.body.removeChild(clone);
      heroEl.style.minHeight = max + 'px';
    }

    computeMinHeight();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(computeMinHeight);
    }

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(computeMinHeight, 150);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPersona);
  } else {
    initPersona();
  }
})();

