# FEATURES.md

## Summary

Jade Byeon's personal design portfolio — a static, vanilla HTML/CSS/JS site deployed on GitHub Pages. It serves three overlapping audiences (recruiters, designers, general visitors) through a persona-adaptive homepage, then routes them into four flagship case studies and a cluster of smaller side projects. Every page shares one global chrome (header, footer, scroll-reveal, in-case section navigation) built around a single visual system. The site's job is to get a recruiter's 10-second scan and a designer's close read both to land — see [PRODUCT.md](PRODUCT.md).

## Feature Map

| Area | Major features | Supporting features | Status |
|------|----------------|---------------------|--------|
| Homepage & First Impression | Persona-Adaptive Hero, Work Index | — | shipped |
| Case Studies | Pediatric Eye Exam Robot (OCT), NVP Knowledge Hub (HBOM), Wearby (OOTD) | — | shipped |
| Misc & Side Projects | — | Misc Cluster Index, TELL Tool, Turbo, Arts at the Unions, ICML 2025 Tutorial | shipped |
| About & Credibility | About Page | Resume Access | shipped |
| Site Chrome & Navigation | — | Global Header & Nav, Footer & Contact, In-Case Section Navigation, Scroll Reveal | shipped |
| SEO & Discoverability | — | Metadata & Structured Data, Sitemap | mixed |

## Needs Review

- **HANOK case study is built but not reachable from any live navigation.** Its homepage tile is HTML-commented-out (`index.html`), it's absent from the Misc cluster, yet it's still listed in `sitemap.xml` and fully crawlable at its direct URL. The hero image also carries a `<!-- Replace with your actual hero image -->` placeholder comment, suggesting it isn't finished. Status resolution deferred by the user for now — left undocumented as its own feature entry until its status (planned / deprecated / finished-but-unlinked) is decided. `sitemap.xml` is currently telling search engines to index it regardless.
- **`projects/oct/spec.html`** ("Sam: Interaction & Behavior Specification") is a complete standalone page with no inbound link from `projects/oct/index.html` or anywhere else in the site. Was it meant to be linked from the OCT case study's Interaction section and got dropped, or is it superseded content that should be deleted?
- **`projects/knowledge-hub/` is an empty directory** — no `index.html`, no assets. Likely a leftover from renaming that project to `hbom`/NVP Knowledge Hub. Safe to delete unless something is still meant to land there.
- **Swiper.js (CSS + JS bundle) loads on every single page via CDN, but is never instantiated anywhere** — no `new Swiper(...)`, no `.swiper` markup, in any page in the repo. This is pure unused weight on every page load. Confirm it's safe to remove from all `<head>`/`<script>` includes.
- **`sitemap.xml` is stale relative to the live site.** It lists `telltool-branding`, `uu-arts`, `oct`, `qq`, `turbo`, and the unreachable `hanok` — but omits `hbom`, `ootd`, and `misc`, three pages that are very much live and linked from the homepage. Worth regenerating rather than hand-patching, since it's already drifted once.

## Homepage & First Impression

> **Area summary:** The first thing any visitor sees, and the only place on the site that adapts its own copy to who's reading. Both features exist to make the recruiter-skim / designer-read split in [PRODUCT.md](PRODUCT.md) actually work.

### Persona-Adaptive Hero

| Field | Value |
|-------|-------|
| Scale | major |
| Status | shipped |
| One-liner | Homepage headline and stats change based on who's viewing — recruiter, designer, or general visitor. |
| Short | Three tabs ("For Anyone," "Recruiters," "Designers") swap the hero headline, subline, and supporting stats/chips in place, each tuned to what that audience actually wants to know first. Built click-triggered only (no hover dependence), with distinct entrance treatments per tab — a mint text reveal, a character-scramble effect, and a segmented "pipeline" word reveal — all landing within about a second. |
| Marketing | Not every visitor here wants the same thing. A recruiter wants the fastest possible read on fit; a designer wants to see how something was reasoned through. The homepage just asks who's looking, instead of guessing. |
| Technical | Driven by `PERSONA_COPY` in `assets/js/main.js:307`. Each persona defines a `titleMode` (`reveal`/`scramble`/`pipeline`), copy lines, and optional stat chips. A dedicated switcher (`main.js:344` onward) handles exit/prime/enter staging with `STAGGER_MS`/`EXIT_MS`/`LAND_MS` timing constants, computes a shared min-height across all three personas to prevent layout shift, and swaps instantly (no animation) under `prefers-reduced-motion: reduce`. |

### Work Index (Portfolio Grid)

| Field | Value |
|-------|-------|
| Scale | major |
| Status | shipped |
| One-liner | The homepage's project grid — video-preview tiles for each flagship case study. |
| Short | Four tiles, each an autoplaying muted video (with a static poster fallback) linking into a full case study: the Pediatric Eye Exam Robot, NVP Knowledge Hub, Wearby, and the Misc collection. Each tile carries a title, one-line description, and tag chips. |
| Marketing | Four projects, four different problems — a robot that has to earn a scared kid's trust, a resource hub that has to be findable at 2am, an app built around a feeling instead of a task, and a shelf of smaller experiments. |
| Technical | Static markup in `index.html:80-176`, one `<article class="portfolio__content">` per tile. Video plays on scroll into view (`main.js:1`) rather than eagerly, `preload="metadata"` keeps initial load light. A fifth tile (HANOK) exists in the markup but is HTML-commented-out — see Needs Review. |

## Case Studies

> **Area summary:** The four flagship projects a recruiter or designer would actually cite as evidence of Jade's design judgment. Each is a full narrative page with its own in-page section navigation (see Site Chrome).

### Pediatric Eye Exam Robot (OCT)

| Field | Value |
|-------|-------|
| Scale | major |
| Status | shipped |
| One-liner | Character design and caregiver research for a robot that reduces exam anxiety in kids aged 2–12. |
| Short | A healthcare-robotics case study built around research at Kellogg Eye Center: reducing pediatric exam anxiety through character design and pre-exposure media, validated with 30 caregivers. The abstract was co-authored and presented at ARVO 2026. |
| Marketing | A pediatric eye exam is already scary for a kid. This project asks what happens if the robot doing the exam looks and behaves like a character instead of a machine — and then actually tests that against real caregivers, not just intuition. |
| Technical | `projects/oct/index.html` (714 lines), six-section in-case nav (Problem → Research → Design → Interaction → Next steps → Takeaways). Notable implementation: Bradley-Terry preference modeling for character selection, an impact-number count-up animation (`main.js:115`), a character-board lightbox with cursor-follow preview (`main.js:203`), and a documented interaction spec for failure states ("When it goes wrong," `index.html:539`). An orphaned appendix page (`spec.html`) exists alongside this — see Needs Review. |

### NVP Knowledge Hub (HBOM)

| Field | Value |
|-------|-------|
| Scale | major |
| Status | shipped |
| One-liner | A searchable food-as-medicine resource hub, researched and built in Webflow for HBOM at the University of Michigan. |
| Short | Information architecture and Webflow build for a searchable resource hub connecting nutrition research to practical food-as-medicine guidance. Case study covers research, IA, design systems, and the build itself. |
| Marketing | Good nutrition research doesn't help anyone if they can't find it when they need it. This case study is about making that research actually searchable and usable, not just publishing it. |
| Technical | `projects/hbom/index.html` (534 lines). Includes a feature-tab showcase interaction (`main.js:1164`) and a "Sriya pill" tab pattern referenced in project history ([session-handoff.md](session-handoff.md)). Hero video/poster assets were compressed in a prior session (86MB→18MB video, 1.9MB→394KB poster). |

### Wearby (OOTD Diary Companion)

| Field | Value |
|-------|-------|
| Scale | major |
| Status | shipped |
| One-liner | A concept outfit-logging app for emotional self-reflection, designed end-to-end including a physical companion object. |
| Short | An end-to-end concept project: an app for logging outfits as a form of emotional self-reflection, paired with a physical companion object explored through a dedicated lightbox interaction. |
| Marketing | This one's a concept, not a shipped product — and it's shown that way. It's here because "end-to-end, physical + digital" is a different kind of design thinking than the research-heavy healthcare work, and that range matters. |
| Technical | `projects/ootd/index.html` (452 lines). Dedicated physical-companion lightbox (`main.js:701`). Known gap: `assets/video/ootd_hero.mp4` is not committed to the repo — the homepage tile currently falls back to its poster image only (flagged across multiple prior sessions per [session-handoff.md](session-handoff.md)). |

## Misc & Side Projects

> **Area summary:** Smaller, faster projects — branding, a research-communication effort, and one fitness-app redesign — presented as a self-contained cluster rather than mixed into the flagship four. Scoped as supporting-scale work, matching the site's own "side quests" framing rather than the depth of the four flagship case studies.

### Misc Cluster Index

| Field | Value |
|-------|-------|
| Scale | supporting |
| Status | shipped |
| One-liner | A radial-cluster landing page that indexes the four Misc sub-projects. |
| Short | Instead of a standard grid, the Misc page arranges its four sub-projects as nodes around a center label, with an animated starfield background and a cursor-follow "View" pill. Collapses to a simpler vertical list under 760px. |
| Marketing | Not every project needs the same weight as the flagship four — this page treats them like what they are: a shelf of side quests, styled a little more playfully than the rest of the site. |
| Technical | `projects/misc/index.html`. Radial layout math in `main.js:812` ("MISC PAGE: RADIAL CLUSTER"), plus a hide-until-hover header treatment (`main.js:1056`) unique to this page. |

### TELL Tool — Visual Identity

| Field | Value |
|-------|-------|
| Scale | supporting |
| Status | shipped |
| One-liner | A brand identity system designed to include every kind of family. |
| Short | Visual identity work for TELL Tool, framed around inclusive representation of family structures. |
| Marketing | A brand identity project with a real constraint: it has to work for every kind of family, not just the default one a template assumes. |
| Technical | `projects/telltool-branding/index.html` (372 lines). |

### Turbo — Fitness App Redesign

| Field | Value |
|-------|-------|
| Scale | supporting |
| Status | shipped |
| One-liner | A fitness app redesign focused on motivation, not just movement-tracking. |
| Short | Redesign case study reframing a fitness app around sustaining motivation rather than pure activity logging. |
| Marketing | Most fitness apps are built to count things. This one's built around the harder problem — why people stop opening the app in the first place. |
| Technical | `projects/turbo/index.html` (487 lines). |

### Arts at the Unions

| Field | Value |
|-------|-------|
| Scale | supporting |
| Status | shipped |
| One-liner | Systems design for the infrastructure behind a campus arts engagement program. |
| Short | Design work for the systems and infrastructure underlying a campus arts program, rather than a single user-facing artifact. |
| Marketing | Not every design problem is a screen. This one's about the infrastructure that makes a campus arts program actually run. |
| Technical | `projects/uu-arts/index.html` (379 lines), titled "Arts at the Unions: Systems for Campus Arts Engagement." |

### ICML 2025 Tutorial — Human-Centered Diffusion

| Field | Value |
|-------|-------|
| Scale | supporting |
| Status | shipped |
| One-liner | A live tutorial making diffusion-model research accessible, shipped for ICML 2025 attendees. |
| Short | Research-communication project: a human-centered tutorial on diffusion models, delivered live at ICML 2025. |
| Marketing | Making cutting-edge ML research legible to a live room of people is its own design problem — this is what that looked like. |
| Technical | `projects/qq/index.html` (326 lines). |

## About & Credibility

> **Area summary:** Where a visitor goes to check who Jade actually is, beyond the case studies.

### About Page

| Field | Value |
|-------|-------|
| Scale | major |
| Status | shipped |
| One-liner | Bio, current interests, and skill tags — the "who is this person" page. |
| Short | Standalone bio page: dual Art & Design + Statistics background, cross-cultural upbringing (Korea, China, Singapore, US), a skills tag row (Figma, Design Systems, User Research, WCAG Accessibility, HTML/CSS/JS, R & Python), and two short "currently exploring" / "when I'm not designing" callouts. |
| Marketing | Design and statistics aren't usually paired — that pairing is the actual point of this page, not a footnote. |
| Technical | `about.html`, uses the shared `.content-container`/`.about-hero__grid` layout. No unique JS beyond the shared header/footer/reveal scripts. |

### Resume Access

| Field | Value |
|-------|-------|
| Scale | supporting |
| Status | shipped |
| One-liner | One-click résumé access from the header nav on every page. |
| Short | A "Resume" link in the global header opens `assets/pdf/Jade_Resume.pdf` in a new tab from any page on the site — no separate resume section needed in the hero copy. |
| Technical | Static link in the shared header markup, `target="_blank" rel="noopener"`. The persona-hero copy system has a `resume` field in `PERSONA_COPY` that's currently unused (`null` for all three personas) specifically because this header link already covers it — see `main.js:326` comment. |

## Site Chrome & Navigation

> **Area summary:** The shared shell every page inherits — header, footer, in-case navigation, and the motion system that ties reveals together. None of these are unique to one case study; getting them right (or wrong) affects every page at once.

### Global Header & Nav

| Field | Value |
|-------|-------|
| Scale | supporting |
| Status | shipped |
| One-liner | Sticky site header with Work / About / Contact / Resume links, present on every page. |
| Short | Consistent header across homepage, About, and every case study, with the current section highlighted (`.nav-link.active`). |
| Technical | Shared markup pattern across all pages (`header.header#header`). Nav highlight logic and back-to-top behavior in `main.js:71` and `main.js:107`. |

### Footer & Contact

| Field | Value |
|-------|-------|
| Scale | supporting |
| Status | shipped |
| One-liner | Site-wide footer with email/LinkedIn contact links and a back-to-top control. |
| Short | "LET'S TALK" footer present on every page: direct `mailto:` and LinkedIn links, plus a back-to-top affordance with a hover-lift micro-interaction. |
| Technical | Shared `footer.footer#footer` markup. Contact is `mailto:jadebyeonj@gmail.com` — no form, no backend, by design (static site). |

### In-Case Section Navigation

| Field | Value |
|-------|-------|
| Scale | supporting |
| Status | shipped |
| One-liner | Scroll-spy section rail inside case studies (desktop) that collapses to a sticky pill strip (mobile). |
| Short | Each case study gets a jump-to-section nav that highlights the section currently in view. Desktop shows it as a left-side rail; below 1024px it becomes a horizontally-scrolling sticky pill strip under the header instead. |
| Technical | `main.js:1111` ("SECTION NAV: SCROLL-SPY"), works across any number of `.section-nav` elements per page. See [DESIGN.md](DESIGN.md) → Components for the two responsive treatments' full style spec. |

### Scroll Reveal Animations

| Field | Value |
|-------|-------|
| Scale | supporting |
| Status | shipped |
| One-liner | Section titles and content fade/slide into view on scroll, site-wide. |
| Short | A generic scroll-reveal system (`assets/js/reveal.js`) applies to section titles, portfolio cards, and general content blocks across every page. The homepage hero is deliberately excluded — it has its own dedicated load-in animation instead. |
| Technical | `assets/js/reveal.js` (109 lines), `IntersectionObserver`-based, selector list explicitly documented in-file with comments explaining exclusions (e.g. hero). Respects `prefers-reduced-motion`. |

## SEO & Discoverability

> **Area summary:** How the site presents itself to search engines and link previews. Currently drifted from the live site structure — see Needs Review.

### Metadata & Structured Data

| Field | Value |
|-------|-------|
| Scale | supporting |
| Status | shipped |
| One-liner | Per-page titles, meta descriptions, Open Graph tags, and a Person JSON-LD block on the homepage. |
| Short | Homepage carries a full meta description, OG title/description/url, Twitter card type, and a `schema.org/Person` JSON-LD block linking to LinkedIn. Case study pages have their own `<title>` and description tuned per project. |
| Technical | `index.html:17-34`. Not all case study pages carry the same completeness — `ootd/index.html` and the Misc cluster sub-pages have titles but no `meta description` (confirmed via scan). |

### Sitemap

| Field | Value |
|-------|-------|
| Scale | supporting |
| Status | shipped |
| Needs Review | Currently stale — see top-level Needs Review section. Lists `hanok` (unreachable from live nav) and omits `hbom`, `ootd`, and `misc` (all live and linked from the homepage). |
| One-liner | `sitemap.xml` at the repo root, submitted for search indexing. |
| Short | Static sitemap listing crawlable URLs. Currently out of sync with the actual site structure. |
| Technical | `sitemap.xml`, 8 URLs listed, hand-maintained rather than generated. |
