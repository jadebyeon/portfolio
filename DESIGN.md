# DESIGN.md

## Overview

**Creative North Star:** Research notebook, typeset for a fast reader.

The system reads like a well-typeset case-study notebook, not a pitch deck. Chrome stays quiet — near-neutral grays, hairline borders, flat surfaces — so that type, imagery, and the single accent color carry all the emphasis. Nothing is decorated for its own sake; every visual flourish (a hover-lift, a reveal animation, a focus ring) exists to support reading, scanning, or confirming an interaction, never to impress on its own.

**What it optimizes for:** two incompatible reading speeds at once — a recruiter's 10-second scan and a designer's close read — without degrading either. Density and hierarchy do the work; decoration does not.

**Accessibility:** WCAG AA target. Standard desktop and mobile browsers, no specialized assistive-tech requirements beyond correct semantic HTML/ARIA. `prefers-reduced-motion: reduce` must be honored everywhere motion is used — this is already implemented for scroll behavior and hero transitions and must be preserved in any new interaction.

**Operating Conditions as principles** (see [PRODUCT.md](PRODUCT.md)):
- Desktop scanning is the primary read. Design for the skim first, then verify mobile every time — never treat mobile as an afterthought.
- This site is doing real recruiting work. Never let a visual flourish stand in for missing evidence or reasoning — see Components → Do's and Don'ts.
- State credentials and outcomes plainly. Never use visual weight (bold, color, size) to make an unconfirmed claim look more certain than it is.

## Colors

The palette is deliberately narrow: one near-neutral scale plus exactly one accent. Values below are the actual computed colors behind the site's HSL custom properties.

| Name | Token | Value | Usage |
|---|---|---|---|
| Charcoal ink | `--title-color` | `hsl(250, 8%, 15%)` ≈ `#242329` | Headings, primary titles, default link color before hover |
| Slate text | `--text-color` | `hsl(250, 8%, 45%)` ≈ `#6D6A7C` | Body copy, descriptions |
| Soft slate | `--text-color-light` | `hsl(250, 8%, 65%)` ≈ `#A19FAD` | Secondary/muted text (subtitles, role lines, meta) |
| Near-white | `--body-color` | `hsl(250, 60%, 99%)` ≈ `#FBFBFE` | Page background — a whisper of cool violet, never pure white |
| True white | — | `#FFFFFF` | Card/container surfaces that need to sit above the page background |
| Deep muted forest | `--mint-color` | `#1a7a5e` | **The one accent.** Reserved for hover, focus, and reveal moments only — see Components. |
| Dark forest (text) | — | `#064e3b` | Accent color used *as text* on hover (e.g. footer "back to top"), always paired with the mint fill, never standalone |
| Near-black | — | `#111111` | Active/selected state fill (persona tabs) — deliberately distinct from the mint accent so "selected" and "accent" never look the same thing |
| Hairline gray | — | `#CCCCCC`, `#D4D4D8`, `#D1D5DB` | Borders on quiet chrome (tabs, pills, tags) at rest |
| Muted gray text | — | `#9CA3AF`, `#4B5563` | Secondary label text (tags, footer credits) |

**Usage rules:**
- Mint is the *only* accent in the system. It appears on hover, focus rings, and specific reveal animations — never as a resting/default fill on a component. If a new component wants color for emphasis, the answer is almost always "use the neutral scale's weight/contrast instead," not "add another color."
- Selection state (persona tab `.active`) uses near-black, not mint. Do not collapse this distinction — conflating "selected" with "accent" removes a signal the system currently uses deliberately.
- Focus rings use `color-mix(in oklab, var(--mint-color) 35–45%, transparent)` at 3px. Never rely on the ring alone — pair with a visible border or background change (see Components → Do's and Don'ts).

**Dead tokens — do not use:** `--first-color`, `--first-color-second`, `--first-color-alt`, `--first-color-lighter`, `--input-color`, `--container-color` are defined in `:root` but have zero live usages in the stylesheet. They're leftovers from an earlier template. Do not reach for them; remove on sight if editing the surrounding block.

## Typography

**Families:**
- Display: `ClashGrotesk` (fallback `Inter, sans-serif`) — all headings, titles, and the hero/about name treatments.
- Body: `Inter` (fallback `system-ui, sans-serif`) — paragraph copy, descriptions, UI labels.

**Fixed scale** (product-style UI chrome — tags, nav, small labels):
| Token | Size |
|---|---|
| `--big-font-size` | 2rem |
| `--h1-font-size` | 1.5rem |
| `--h2-font-size` | 1.25rem |
| `--h3-font-size` | 1.125rem |
| `--normal-font-size` | .938rem |
| `--small-font-size` | .813rem |
| `--smaller-font-size` | .75rem |

**Fluid scale** (marketing/editorial surfaces — hero, about, footer): register from [PRODUCT.md](PRODUCT.md) is brand, so these use `clamp()` rather than fixed rem.
- Hero title (`.home__title`): `clamp(1.8rem, 3.6vw, 4rem)`, weight 500
- About name (`.about-name`): `clamp(2.8rem, 5.5vw, 4.8rem)`, weight 700
- Footer wordmark (`.footer__title`): `clamp(3.8rem, 11vw, 7rem)`, weight 700, uppercase

**Weights:** 500 (`--font-medium`) for confident-but-quiet emphasis; 600 (`--font-semi-bold`) and 700 for display headlines only. Never use weight below 400 anywhere — this is a legibility-first, scan-friendly system.

**Body reading measure:** long-form bio/case-study text caps at ~52ch (`.about-bio`) with 1.8 line-height. Hold this measure for any new long-form paragraph — it's what keeps dense evidence readable at a skim.

## Elevation

Static elevation is permitted on resting surfaces that need visual separation (portfolio tiles, cards) — this system does not force flat-only. But elevation still means something: reserve the *stronger* end of the shadow scale for interaction feedback, so a hover/focus state still reads as a response, not just "slightly more of the same."

**Shadow scale (actual values in use):**
| Level | Value | Use |
|---|---|---|
| Resting, subtle | `0 1px 2px rgba(0,0,0,.04)` / `0 1px 10px rgba(0,0,0,.06)` | Default card/tile separation from the page background |
| Lift, medium | `0 8px 18px rgba(15,23,42,.18)` / `0 12px 32px rgba(0,0,0,.14)` / `0 8px 24px rgba(0,0,0,.12)` | Hover state on buttons, footer back-to-top, tag interactions |
| Lift, strong | `0 14px 40px rgba(0,0,0,.14)` / `0 20px 60px rgba(0,0,0,.18)` | Large hero-scale hover moments only (e.g. a full tile lift) — do not use for small components |

**Focus rings:** `0 0 0 3px color-mix(in oklab, var(--mint-color) 35–45%, transparent)` — the accent color's only sanctioned use as a "fill," and only ever as a ring, never a solid background.

**z-index scale:** tooltip `10`, fixed header `100`, modal `1000`. Do not invent new z-index values outside this scale without a documented reason — three tiers is enough for a site this size, and a fourth is a sign something is fighting the header/modal stack rather than composing with it.

**Motion:** all elevation and reveal transitions are `ease`/`ease-out` at 0.15–0.4s, never longer for a UI-feedback interaction (case-study reveal animations can run slightly longer, up to ~0.9s, but that's content pacing, not UI feedback). `prefers-reduced-motion: reduce` must disable or shortcut every transition — verify this on any new animated component, it is not automatic.

## Components

States are listed only where the component actually implements them — a missing state below is a gap, not an omission from this doc.

**Pill button** (`.footer__btn`)
- Default: white background, `1px solid #d4d4d8`, `#111827` text, uppercase, letter-spacing .08em, 999px radius
- Hover: mint fill, `border-color #10b981`, white text, `translateY(-1px)`, medium lift shadow
- Focus: needs a visible focus-visible treatment — not currently distinct from hover in the stylesheet. **Gap:** add a focus-visible ring (reuse the mint `color-mix` ring) so keyboard users get the same signal mouse users get from hover.
- Touch target: padding `0.8rem 2.1rem` clears 44px comfortably. Safe as a mobile tap target.

**Tag / pill label** (`.portfolio__tags .tag`)
- Default: transparent background, mint-outline border (1–1.2px), uppercase, small-caps letterspacing, `#111827` or `#9ca3af` text depending on context (two competing tag styles currently coexist in the stylesheet at different line ranges — reconcile to one spec before extending this component further)
- No hover/focus state implemented — tags are currently decorative labels, not interactive. If a future change makes tags clickable (e.g. filter by tag), they need hover/focus/active states added, not inherited silently from the static style.

**Persona tab** (`.persona-tab`)
- Default: transparent, `1.5px solid #ccc`, `#888` text, 999px radius
- Hover: `border-color #555`, `#333` text
- Active/selected: near-black fill (`#111`), near-black border, white text — deliberately *not* mint (see Colors → usage rules)
- Focus: relies on browser default outline; no custom focus-visible style. **Gap:** same as pill button — add an explicit focus-visible treatment for keyboard tab-switching.
- Touch target: padding `0.4rem 1.1rem` is tight — likely under the 44px minimum at small font sizes. **Flag for /craft responsive:** verify actual rendered height on mobile before shipping any persona-tab layout change.

**Hero chip** (`.hero-chip`)
- Default: `1.5px solid #ccc`, `#555` text, 999px radius, same visual family as persona tabs (quiet, unfilled)
- Entrance state only (`opacity`/`scale` transition on `.is-in`) — no hover/focus, these are informational, not interactive. Keep it that way; don't make chips look clickable if they aren't.

**Portfolio tile / title link** (`.portfolio__title-link`, `.tile-framed`)
- Default: `--title-color` text, no decoration
- Hover/focus-visible: mint text color; focus-visible additionally gets the mint `color-mix` ring at 4px radius
- This is the one component with a fully specified focus-visible state — use it as the reference pattern when filling the gaps above.

**Section nav link** (`.section-nav__link`, desktop rail / mobile pill strip)
- Default: `--text-color-light`
- Hover: `--title-color`
- Focus-visible: `2px solid var(--mint-color)` outline
- Active (current section): `--mint-color` text + left border (desktop) or mint pill fill + white text (mobile strip — the one place mint is used as a resting fill, because it's communicating "current position," not decoration)

### Do's and Don'ts

1. **Never give mint a resting fill outside "current position" indicators.** The section-nav active pill is the one sanctioned exception because it encodes state, not decoration. A new component reaching for a mint background by default is a signal to stop and check this rule.
2. **Every hover state needs a matching focus-visible state.** Two components currently ship hover without focus (pill button, persona tab) — treat that as debt, not precedent. Copy the portfolio-title-link pattern (mint text + `color-mix` ring) rather than inventing a new focus treatment.
3. **Never use color as the only signal for state.** Persona tab active state pairs color change with a background fill and border change, not color alone — keep that redundancy on any future selected/active state.
4. **Touch targets on mobile clear 44px minimum.** Verify, don't assume — the persona tab's current padding is a known risk (see Components above). Run `/craft responsive` before shipping any mobile-facing interactive element.
5. **Reconcile duplicate component definitions before extending them.** `.portfolio__tags .tag` currently has two divergent style blocks at different points in the stylesheet. Extending a component without first collapsing it to one definition compounds the drift.
6. **Elevation communicates response, not decoration.** Strong shadows (`20px 60px` range) are reserved for hero-scale hover moments. Don't reach for the strong tier to make a small, static component "feel more important" — that's a hierarchy problem to solve with type/spacing, not shadow depth.
7. **Respect `prefers-reduced-motion` on every new transition, not just the ones that already have it.** This is currently correct for scroll and hero-copy transitions; it is not automatic for anything new you add.
8. **Never let visual polish substitute for visible reasoning.** Per [PRODUCT.md](PRODUCT.md)'s core design principle — a well-styled claim is not evidence. If a new section needs to justify itself, the type and color system exist to make that justification *easier to read*, not to make its absence less noticeable.
