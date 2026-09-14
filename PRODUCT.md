# PRODUCT.md

## Register
Brand — personal portfolio, first-person voice, persuasive rather than functional.

## Users
Three overlapping audiences, switchable via the homepage persona tabs:
- **Recruiters / hiring managers** — fast scanners, not necessarily designers, evaluating fit for Summer 2027 product design / UX internships. Low patience for cleverness that slows them down.
- **Designers / UX professionals** — scrutinize craft, interaction detail, and reasoning quality. Will notice sloppy alignment, generic patterns, or shallow process claims.
- **Anyone** — general audience following a shared link (LinkedIn, text). No specialized vocabulary assumed; still needs to walk away understanding what Jade actually does and why it's good.

All three are trying to accomplish the same thing from different angles: quickly decide "does this person's design judgment and experience meet my bar?"

## Purpose
Convert a visit into a correct, favorable impression of Jade's design judgment and shipped experience — fast enough for a recruiter's skim, credible enough for a designer's scrutiny.

## Operating Conditions

**Consequence when wrong:** Reversible inconvenience in the mechanical sense (nothing breaks, no data lost) — but the actual stakes are real career consequences. This site is in active use for Summer 2027 internship recruiting. If it reads as confusing, generic, overly AI-templated, or hard to scan, the failure mode is a recruiter leaving without understanding Jade's design judgment or experience — a missed opportunity, not just a cosmetic flaw. Treat scrutiny here closer to "this materially affects outcomes" than a typical low-stakes portfolio.

**Environment:** Desktop/laptop-first — recruiters and hiring managers reviewing during work hours, scanning rather than reading closely. Must also hold up on mobile, since links get shared via LinkedIn or messages and first impressions there matter too. Optimize primarily for desktop scanning; never let mobile responsiveness degrade.

**User skill level:** Mixed by design, not by accident. Recruiters/hiring managers and the general "Anyone" audience are non-specialists who need clarity without jargon. Designers/UX professionals are experts who will scrutinize reasoning and craft. The persona tabs exist specifically to serve this split — content depth and framing can shift per tab, but the underlying voice and quality bar should not.

## Voice
Exacting, quietly confident, evidence-first. States credentials and outcomes plainly (e.g., "validated with 30 caregivers," "ARVO 2026 co-author") rather than oversells them. A little wry, never flashy ("Every interface is a hypothesis: researched, prototyped, tested, shipped."). Precise about what is and isn't confirmed — see the ARVO/ACM distinction in [CLAUDE.md](CLAUDE.md).

## References
- Well-typeset personal/research portfolios (ClashGrotesk display + Inter body pairing signals this direction)
- Editorial, evidence-forward writing — the register of a research abstract more than a sales page

## Anti-references
- Generic templated "AI startup" portfolio look — the Recruiters chip ("ARVO 2026 co-author") exists specifically to avoid reading as generic
- Overselling / inflating unconfirmed outcomes (explicitly guarded against in CLAUDE.md re: ACM paper status)
- Cleverness that costs a fast-scanning recruiter time or clarity

## Design principles
1. **A recruiter's 10-second scan and a designer's close read both have to land.** Never trade one off for the other — surface the headline first, let depth be discoverable underneath.
2. **Claim only what's confirmed.** If a credential or outcome's status is unconfirmed, don't state it as shipped (see CLAUDE.md's locked-copy precedent).
3. **Desktop scanning is the primary case; mobile must never be an afterthought.** Design for the skim first, verify the phone second — but always verify it.
4. **Craft precision is the message, not just the packaging.** Pixel-level care (alignment, hover behavior, film-frame consistency) is itself evidence of the design judgment being sold.
5. **Plain evidence over persuasion techniques.** State research numbers, validation counts, and outcomes directly rather than using hype language — the voice sells itself by being exact.

## Accessibility
Target: WCAG AA. General public + recruiter/designer audience on standard desktop and mobile browsers, no specialized assistive-tech requirements stated beyond standard semantic HTML/ARIA (persona tabs already use `role="tablist"`/`aria-selected`, `prefers-reduced-motion` is respected in hero transitions). No domain-specific compliance regime (not healthcare/finance) — the portfolio describes healthcare-adjacent work but is not itself a regulated product.
