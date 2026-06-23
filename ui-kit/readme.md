# Business Solutions — Design System

**Version:** 1.0  
**Source:** Reference screenshot — Business Solutions corporate website  
**Primary surface:** B2B corporate marketing website

---

## Company & Product Context

**Business Solutions** is a B2B technology consulting and implementation company with 26+ years of operation, 700+ implementations, 255+ employees, and 400+ certifications. They deliver ERP, CRM, DMS, BI, Project Management, Marketing, Sales, e-commerce, IoT, HRM, and IT infrastructure solutions.

The design system powers a single primary surface: the **corporate marketing website** — a dark-themed, professional interface aimed at enterprise buyers.

---

## Content Fundamentals

**Tone:** Professional, confident, factual. Not casual, not hyperbolic. Short declarative sentences.  
**Voice:** Third-person for credentials ("Business Solutions provides..."), second-person for CTAs ("Digitalize your entire business with us").  
**Casing:** Sentence case for all headings. ALL CAPS only for section labels (e.g. `ABOUT US`, `CASE STUDIES`).  
**Numbers:** Used aggressively as social proof — always with `+` suffix (`26+`, `700+`).  
**CTA copy:** Action verbs. Short. Examples: "Solutions →", "Contact us ↗", "Let's talk →", "Who we are →".  
**Emoji:** Never used.  
**Links:** Always paired with an arrow glyph — internal pages use `→`, external use `↗`.

---

## Visual Foundations

### Color

A **dark-first** palette with a single red accent. Nearly all surfaces are dark charcoal; red (#E8192C) is reserved exclusively for:
- Primary buttons  
- Section labels  
- Statistic numbers  
- Link arrows and hover states  

Light sections (newsletter, standalone CTA forms) use a cool off-white (#F2F2F0) background.

### Typography

- **Primary font:** Barlow (Google Fonts) — substituting Helvetica Neue (brand original)
- **Condensed variant:** Barlow Condensed — used for hero display text and stat numbers
- **Weights used:** 400 (body), 600 (UI labels, nav), 700 (headings, stats)
- **Hero text treatment:** Large ghost/outline text using `-webkit-text-stroke: 1.5px rgba(255,255,255,0.55)` with color set to `transparent` — the key signature motif of the brand
- **Section labels:** 11px, uppercase, letter-spacing 0.14em, red (#E8192C)

### Backgrounds & Surfaces

- Page: `#1A1A1A` (very dark charcoal, not pure black)
- Cards/panels: `#2E2E2E` (slightly lighter than page)
- Footer: `#0D0D0D` (near-black)
- Light sections: `#F2F2F0` (cool off-white)
- Grid effect: Cards at `#2E2E2E` separated by `2px` gaps at page background color `#1A1A1A` — creates a tile grid visual

### Layout

- Max container width: 1280px
- Section vertical padding: 80–128px
- Grid tile gap: 2px (not 8px — this is deliberate and precise)
- Service grid: 6-column tile layout

### Imagery

- Photography: Dark-toned, desaturated/cool, office/tech scenes
- Full-bleed or contained rectangles — no rounded corners on images
- Overlay: Dark gradient overlay on hero image (~60% black)

### Borders

- On dark: `rgba(255,255,255,0.12)` default, `rgba(255,255,255,0.06)` subtle
- On light: `rgba(0,0,0,0.14)`
- Accent border: `#E8192C`

### Corner Radii

Nearly zero. The brand is **sharp-edged** — `border-radius: 0` or `2px` max on most surfaces. Buttons have `0` radius. No "card" rounded corners.

### Shadows

Deep, high-opacity shadows appropriate for dark-on-dark elevation: `rgba(0,0,0,0.55–0.70)`.

### Animation

- Transitions: fast (`0.12s`) for hover states, base (`0.2s`) for reveals
- No bounce/spring on UI elements
- Hover on cards: background lightens slightly, no scale transform
- Hover on buttons: background darkens

### Hover States

- Buttons: darken background by one step
- Cards: `background-color` from `--bg-card` to `--bg-card-hover`
- Links: color shifts to red or opacity drops to 0.7
- No scale transforms, no lift shadows

---

## Iconography

- **Style:** Thin stroke icons (1.5–2px stroke weight), monoline, geometric
- **Size:** 20–24px in service cards
- **Colors:** White on dark backgrounds
- **System:** Appears to be a custom thin-line icon set; closest CDN match: **Lucide Icons** (same stroke weight, geometric style)
- **Usage:** Icons appear in service grid cards — one icon per card, centered, with label below
- **No emoji, no filled/solid icons**

---

## File Index

```
styles.css              Global CSS entry point (@imports only)
tokens/
  colors.css            Color primitives + semantic aliases
  typography.css        Font imports + type scale + roles
  spacing.css           Space scale + radii + layout vars
  effects.css           Shadows, transitions, overlays
  base.css              Reset + body defaults
assets/
  logo.svg              White wordmark (for dark backgrounds)
  logo-dark.svg         Dark wordmark (for light backgrounds)
guidelines/
  colors-dark.card.html     Dark palette specimen
  colors-accent.card.html   Accent / red palette
  colors-light.card.html    Light & neutral palette
  typography-display.card.html  Display & heading scale
  typography-body.card.html     Body & UI text styles
  spacing.card.html         Space scale visual
  effects.card.html         Shadows, borders, transitions
  brand.card.html           Logo & identity motifs
components/core/
  Button.jsx + .d.ts + .prompt.md   CTA buttons (3 variants)
  Card.jsx + .d.ts + .prompt.md     ServiceCard, CaseStudyCard
  Badge.jsx + .d.ts                 Category labels / tags
  Input.jsx + .d.ts                 Text input, checkbox
  Stat.jsx + .d.ts                  Statistic block
  components.card.html              Component specimen
ui_kits/website/
  index.html            Full homepage recreation (starting point)
```
