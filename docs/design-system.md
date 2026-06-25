# Design System

> **⚠ PRIMARY MODE: DARK.** The site is hard-locked to dark mode — `<html class="dark">` with no theme toggle. The canvas is a near-black `#040406`. The single most recognizable move is the inversion of this: a **solid white (#fff) horizontal bar** for the nav and white-filled buttons floating on the black page, plus whole sections that flip to light backgrounds with dark text.

## 1. Design Philosophy

The system reads like an **engineering blueprint rendered as a website**: a near-black canvas divided by thin 1px hairline grids into hard-edged rectangular cells, with empty cells filled by a 135° diagonal pencil-hatch to signal "structure, not content." Nothing is rounded where it matters — buttons, cards, the nav bar, and grid cells are all square-cornered, giving it a precise, CAD-like rigor that most SaaS sites soften away. Type is a deliberate three-voice system: a geometric display face (Articulat CF) for headlines, neutral Inter for body, and JetBrains Mono in UPPERCASE for eyebrow labels — the mono labels are what make it feel like documentation/terminal-adjacent rather than marketing. The lone chromatic accent in an otherwise monochrome UI is a chartreuse `#def135` used as a literal highlighter-pen `<mark>` over text. If rebuilt from scratch, the non-negotiables are: the black-canvas/white-bar inversion, the 1px gray-20 bordered-grid layout with diagonal-hatch fillers, square corners everywhere, and the mono uppercase eyebrows.

## 2. Color Tokens

> Two neutral systems coexist: a custom **cool-gray scale** (named by approximate lightness, faint blue-violet cast) used for almost all structure/text, and a few leftover **zinc/shadcn** tokens. Everything below is a literal hex pulled from compiled utility classes.

### Core / Neutral
| Token | Hex | Usage |
|---|---|---|
| `background` | `#040406` | Page canvas (near-black, faint blue tint); also the *text* color in inverted light sections |
| `foreground` | `#ffffff` | Primary headings/text; **the white nav bar fill**; primary button fill |
| `gray-5` | `#0b0c0e` | Deepest surface tint above canvas |
| `gray-8` | `#121317` | Active/raised cell fill (e.g. selected stat box) |
| `gray-12` | `#1c1d22` | Hover fill for outline/ghost buttons; subtle borders |
| `gray-20` | `#2e3038` | **Primary structural border & divider color** (the entire grid) |
| `gray-30` | `#464853` | Mid borders; hover text in light menus |
| `gray-40` | `#60606c` | Muted/meta text; mono eyebrows |
| `gray-50` | `#777a88` | Muted text/borders |
| `gray-60` | `#9194a1` | Secondary body text |
| `gray-70` | `#abaebb` | Body text on dark; icon-box borders |
| `gray-80` | `#c7c9d1` | Body text (higher contrast) |
| `gray-90` | `#e3e4e9` | High-contrast body text; **primary button hover fill** |
| `gray-94` | `#eeeff1` | Lightest gray surface |

### Zinc / shadcn leftovers (present but secondary)
| Token | Hex | Usage |
|---|---|---|
| `border` | `#27272a` | Alt border token (zinc-800) |
| `muted-foreground` | `#a1a1aa` | Muted text (zinc-400) |
| `popover` | `#09090b` | Popover surface (zinc-950) |
| — | `#18181b` / `#fafafa` | zinc-900 / zinc-50, occasional |

### Accent
| Token | Hex | Usage |
|---|---|---|
| `brand` | `#def135` | **Single source of truth** for the accent. Drives the landing logo mark, eyebrows, Live pulse dot, and all interactive UI (primary buttons, switches, checkboxes, sliders, multi-select). Change this one value to recolor the app. `bg-brand` / `text-brand` / `border-brand` |
| `yellow` | → `var(--color-brand)` | Back-compat alias for existing `text-yellow` utilities; resolves to `brand` |
| `yellow-glow` | `#c29500` | Darker amber glow / brand button border |

### Alpha-modified neutrals (observed in markup)
| Value | Resolves to | Usage |
|---|---|---|
| `foreground/10` | `rgba(255,255,255,0.10)` | Mobile-menu row dividers (`border-b`) |
| `foreground/5` | `rgba(255,255,255,0.05)` | List-row hover background |

### Extended / illustration palette
These saturated hues appear only in decorative graphics, charts, syntax highlighting, and logos — **not** in core UI chrome. Treat as a secondary, non-systematic set: `#ff573d`, `#f5841f`, `#f87272`, `#ff68f7`, `#a3fe1b`, `#00ff5e`, `#37b746`, `#45b36e`, `#35f1e4`, `#559fff`, `#3580f1`, `#3c83f6`, `#14289d`, `#b061ff`, `#6100c2`, `#9b2ea9`, `#b63524`. *[uncertain — exact per-element usage; verify against specific graphics]*

### Gradients (literal stops)
| Purpose | Value |
|---|---|
| Vignette / spotlight fade-to-canvas | `radial-gradient(ellipse 132% 112% at 24% 100%, rgba(4,4,6,0.9) 0%, rgba(4,4,6,0.72) 46%, rgba(4,4,6,0.32) 78%, rgba(4,4,6,0.1) 90%, transparent 100%)` |
| Bottom content-fade | `linear-gradient(#04040600 19%, #0404062b 45%, #040406 89%)` |
| Light-blue (decorative) | `linear-gradient(#b6cdfb 0%, #ecf2fe 80.629%)` |

## 3. Typography System

### Font Families
| Role | Family | Source | Notes |
|---|---|---|---|
| Display / headings | `articulat-cf` (+ `articulat-heavy-cf`) | Adobe Typekit (`tcb4uyw`) | `.font-display` applies `font-feature-settings:"ss02" 1` (stylistic set 2). Class: `font-display`. |
| Body / UI | **Inter** (`--font-inter`) | Next self-host | Site default (`font-sans`, applied on `<body>`) |
| Mono / labels / code | **JetBrains Mono** (`--font-jetbrains-mono`) | Next self-host | `.font-mono` **and** `.font-label` both map to JetBrains Mono |

### Font Weights
| Weight | Token | Available in |
|---|---|---|
| 400 normal | `font-weight-normal` | Articulat (+italic), Inter, JBMono — **hero H1 is 400** |
| 500 medium | `font-weight-medium` | Articulat, all — buttons/nav/labels |
| 600 semibold | `font-weight-semibold` | Articulat (+italic) |
| 700 bold | `font-weight-bold` | Articulat (+italic) |
| 900 heavy | — | `articulat-heavy-cf` only (+italic) |

### Size Scale (Tailwind tokens, all defined)
| Token | rem | px | Line-height token | Computed LH |
|---|---|---|---|---|
| `text-xs` | .75 | 12 | `calc(1/.75)` | 1.333 |
| `text-sm` | .875 | 14 | `calc(1.25/.875)` | 1.429 |
| `text-base` | 1 | 16 | `calc(1.5/1)` | 1.5 |
| `text-lg` | 1.125 | 18 | `calc(1.75/1.125)` | 1.556 |
| `text-xl` | 1.25 | 20 | `calc(1.75/1.25)` | 1.4 |
| `text-2xl` | 1.5 | 24 | `calc(2/1.5)` | 1.333 |
| `text-3xl` | 1.875 | 30 | `calc(2.25/1.875)` | 1.2 |
| `text-4xl` | 2.25 | 36 | `calc(2.5/2.25)` | 1.111 |
| `text-5xl` | 3 | 48 | 1 | 1 |
| `text-6xl` | 3.75 | 60 | 1 | 1 |
| `text-8xl` / `text-9xl` | 6 / 8 | 96 / 128 | 1 | 1 |

Arbitrary sizes also used directly: `2.625rem`(42), `3.25rem`(52), `4rem`(64), `2.5rem`(40), `2.75rem`(44), `1.875rem`(30), `1.75rem`(28), `1.375rem`(22), `0.9375rem`(15), `0.8125rem`(13).

### Applied Styles (per context — directly observed)
| Context | Font | Size (responsive) | Weight | Line-height | Tracking | Color |
|---|---|---|---|---|---|---|
| **H1 (hero)** | display | 36 → sm 48 → md 42 → lg 52 → **xl 64** | 400 | `1.125` | — | `#fff` |
| **H2** | display | 30 → … → xl 52 (variants ~30–52) | 400 | `1.125` (some `1.2`/`1.25`) | — | `#fff` or `#040406` (inverted) |
| **H3 (display)** | display | 22 → lg 28 | — | `1.125` | — | `#040406`/`#fff` |
| **H3 (mono label)** | mono | 15 | — | `leading-tight` 1.25 | — | `gray-40` |
| **Eyebrow label** | `font-label` (mono) | 13 → md 14 | — | — | (UPPERCASE) | `#fff` / `#040406` |
| **Body paragraph** | Inter | 16 → lg/xl | 400 | `leading-snug` 1.375 | `-0.01em` | `gray-60/70/80/90` |
| **Small meta** | Inter | 14 | 500 | `leading-tight` 1.25 | `-tracking-wide` (-0.025em) | `gray-40/80` |
| **Buttons / nav links** | Inter | 14 / 16 | 500 | `leading-none` | `tracking-tight` -0.025em | varies |

### Tracking & Line-height tokens
- Tracking: `tighter` -.05em · `tight` -.025em · `wide` .025em · custom **-0.01em** (body), **-0.02em** (headings), **0.03em** (badges/tags).
- Line-height: `leading-tight` 1.25 · `leading-snug` 1.375 · `leading-normal` 1.5 · custom **`leading-[1.125]`** (headings).

### Text-transform
- **UPPERCASE** only on `.font-label` eyebrows (mono). No lowercase/capitalize transforms observed. Headlines are sentence case.

## 4. Spacing System

- **Base unit:** `--spacing: .25rem` (4px). Standard Tailwind 4px scale.
- **Section vertical padding** (the large rhythm): `pt-16`(64) · `pt-18`(72) · `pt-20`(80) · `pt-22`(88) · `pt-30`(120) · `pt-34`(136) · `pt-35`(140); matching `pb-*`. Heroes commonly `pt-20`; major sections `pt-34`/`pt-35`.
- **Card / cell padding:** `px-5 py-8` (20/32, mobile) → `md:px-10 md:py-12` (40/48) → `lg:px-16` (64) → `xl:px-24` (96); some cells `lg:pt-34.25` (~137). Smaller content cards: `p-5` / `p-6` / `p-8`.
- **Badge padding:** `px-3 py-1.75` (12px / 7px).
- **Gaps:** button internal `gap-1` (4) · badge `gap-2.5` (10) · nav action group `gap-16` (64) · footer `gap-x-8`(32) `gap-y-10/12`(40/48) · list rows `gap-3` (12).

## 5. Layout System

- **Container** (`.container`, custom override): `width:100%; max-width: calc(var(--spacing-content) + 5rem)` = **101rem (1616px)**; `--spacing-content: 96rem` (1536px content); `padding-inline` `1.25rem`(20px) → md `2rem`(32px) → xl `2.5rem`(40px); `margin-inline:auto`. *(A standard Tailwind responsive `.container` — max-widths 40/48/64/80/96rem at each breakpoint — is also defined; the custom 101rem rule governs the page chrome. [uncertain — which wins per-section; verify in devtools])*
- **Grid implementation:** mix of **CSS Grid + Flexbox**. Footer nav is CSS Grid: `grid-cols-2` → `sm:grid-cols-[repeat(2,minmax(10rem,10rem))]` → `lg:grid-cols-4`. Most page sections are flex columns/rows assembled into a bordered table.
- **Common column splits:** asymmetric 2-col feature blocks (text cell + visual cell, each `flex-1` / fixed-height); 4-col footer; segmented stat rows of equal cells.
- **Signature bordered grid:** content cells carry `border border-gray-20`, then selectively drop edges (`border-r-0`, `border-t-0`, `lg:border-l-0`) so adjacent cells share a single 1px line rather than doubling — a real table/blueprint grid, not card gaps.

## 6. Border & Radius System

- **Border width:** `1px` everywhere (`border`). No 2px/4px structural borders observed in core UI.
- **Border colors:** `gray-20 #2e3038` (primary, the grid) · `gray-12 #1c1d22` (subtle) · `gray-30 #464853` · `gray-70 #abaebb` (icon boxes / inverted-section outlines) · `border #27272a` (alt) · `foreground/10` (menu rows).
- **Radius — predominantly `0`.** Buttons, cards, grid cells, the nav bar, and icon boxes are all **square** (`rounded-none` is explicitly applied).
  - Exceptions: **Badges/tags** `rounded-[0.375rem]` = **6px** (`--radius`).
  - Tokens that exist but are rare in chrome: `radius-xl` .75rem(12px), `radius-2xl` 1rem(16px), arbitrary `1.25rem`(20px), `9999px` (pill — toggles/switches only).
- **Outline vs filled:** primary buttons are **filled** (white); secondary/tertiary are **1px outline** (`border-foreground` or `border-gray-70`) on transparent/canvas.

## 7. Shadows & Elevation

- **Core UI is flat — effectively no drop shadows.** Elevation is communicated by 1px borders and background-tint changes, never by shadow.
- The only shadow-like patterns belong to the embedded **cookie-consent (c15t)** widget and prose/`<kbd>` styles, e.g.:
  - `box-shadow: inset 0 1px #ffffff29, 0 1px 2px #0f172a1f`
  - `box-shadow: inset 0 0 0 1px #ebebeb`
  - Focus ring: `box-shadow: 0 0 0 2px <ring>`
  - Buttons use `inset 0 0 0 1px <color>` (a *border via shadow*, not elevation).
- **Hover:** no shadow transition on cards — hover changes the **background color** only.

## 8. Textures & Patterns

> ❗ **No dot-grid, halftone, or noise/grain texture exists on this site.** There are zero tiled `background-size` patterns; the only `radial-gradient(circle …)` is a single non-repeating ring mask. Do not invent dots — the editorial texture here is a **diagonal hatch**.

| Texture | Exact implementation | Where |
|---|---|---|
| **Diagonal pencil-hatch** | `background-image: repeating-linear-gradient(135deg, rgba(46,48,56,0.45) 0 1px, rgba(0,0,0,0) 1px 8px)` — 1px lines at 135°, 8px pitch, ~45%-opacity gray-20, on cells bounded by `border-r border-l border-gray-20` | Empty/structural grid cells (used ~6×) — "blank cell" blueprint device |
| **Spotlight vignette** | `radial-gradient(ellipse 132% 112% at 24% 100%, rgba(4,4,6,0.9)…transparent)` | Overlay fading visuals into the canvas |
| **Edge content-fade** | `linear-gradient(#04040600 19%, #0404062b 45%, #040406 89%)` | Bottom-of-section fade to black |
| **Donut/ring mask** | `-webkit-mask: radial-gradient(circle farthest-side, #0000 1.95px, #000 2.05px 100%) 50%/100% 100% no-repeat` on a `border-radius:9999px` absolute element | Single ring/spotlight element (not a repeating pattern) |

## 9. Component Specifications

### Buttons
All buttons: `inline-flex items-center justify-center`, height `h-11` (**44px**), `gap-1`, `font-medium tracking-tight`, **square** corners, child icons `[&_svg]:size-4.5`(18) or `size-3.5`(14).

- **Primary (filled):** `bg-foreground text-background hover:bg-gray-90` · `px-6 text-sm` or `px-5 text-base` · `transition duration-200 ease-in-out`. → white button, dark label, hovers to `#e3e4e9`.
- **Secondary (outline):** `border border-foreground text-foreground bg-background hover:bg-gray-12` · `transition-colors duration-300`. → 1px white outline, fills to `#1c1d22` on hover.
- **Ghost / tertiary:** `bg-transparent` (or `border border-transparent`) `text-foreground hover:bg-gray-12`.
- **Inverted-section outline:** `border border-gray-70 text-background hover:bg-gray-12` (dark label on light bg).
- **Icon-only:** `flex size-11 items-center justify-center bg-foreground` (44px white square).

### Cards
- `flex flex-col border border-gray-20`, `bg-background` (or `bg-gray-8` when active), **square**, `overflow-hidden`.
- Padding scales `px-5 py-8` → `md:px-10 md:py-12` → `lg:px-16 / xl:px-24`; some fixed/clamped heights (`h-100`, `h-132`, `h-[clamp(23.75rem,92vw,28.75rem)]`).
- **Hover:** background-tint change only — **no shadow, no lift, no radius**.
- Edge borders toggled per layout (`lg:border-r-0`, `border-t-0`, `lg:border-l-0`) to share lines with neighbors.

### Navigation
- **Header:** `sticky top-0 z-50 pt-2.5`; inside `.container`, a **solid white bar** `bg-foreground h-11` with `pl-6`, dark logo (`logo-dark.svg`, 83×28).
- **Desktop links** (`lg:flex`): `inline-flex items-center gap-0.5 px-5 text-sm leading-none font-medium tracking-tight text-background`; dropdown trigger pairs label + Lucide `chevron-down size-3.5 opacity-70`. Vertical divider: `h-7.5 w-px bg-white`.
- **Link hover:** `transition-colors duration-200 hover:text-white` (dark→white) / in light menus `hover:text-gray-30`.
- **Mobile (`< lg`):** hamburger `button size-11 bg-foreground lg:hidden`; menu opens on a **light** surface, rows `border-b border-foreground/10 py-3.5 text-base font-medium tracking-tight text-background`.

### Inputs
- No primary form inputs on the homepage. The visible inputs (consent dialog, search) belong to the third-party **c15t** widget and are **not** part of the core system. *[uncertain — verify core input styling on a form page e.g. login/contact]*

### Badges / Tags
- `inline-flex items-center w-fit text-sm leading-snug tracking-[0.03em] rounded-[0.375rem] border border-gray-20 gap-2.5 px-3 py-1.75`.
- **Only component that is intentionally rounded (6px)** while the rest of the UI is square. A `border-none p-0` borderless/inline variant also exists.
- **Icon chip variant:** `flex size-9 items-center justify-center border border-gray-70 bg-foreground` (36px square, white fill, light border).

### Dividers
- Hairlines are 1px elements, not `<hr>`: `w-px`/`h-px` with `bg-gray-20 #2e3038` (structural), `bg-white` (nav accent), or `border-foreground/10` (menu rows).
- Full-bleed section rules: `border-b border-gray-20` (often `-mx-5 md:-mx-8` to bleed past container padding).
- **Ornamental, not plain:** empty divider cells are filled with the 135° diagonal hatch (§8).

## 10. Effects & Animation

- **Default transition:** `.15s cubic-bezier(.4,0,.2,1)` (`--default-transition-*`).
- **Durations observed:** `.15s` · **`.2s`** (buttons/nav, most common) · **`.3s`** (outline buttons) · `.5s` · `0s`.
- **Easings:** `ease-out` = `cubic-bezier(0,0,.2,1)` · `ease-in-out` = `cubic-bezier(.4,0,.2,1)`.
- **Micro-interactions (all color/background flips, no transforms):** `hover:bg-gray-90`, `hover:bg-gray-12`, `hover:text-white`, `hover:text-gray-30`, `hover:bg-foreground/5`. Icon opacity shifts (`opacity-70`).
- **Keyframes available:** `animate-spin` (1s linear infinite), `animate-pulse` (2s `cubic-bezier(.4,0,.6,1)`).
- **Blur token:** `--blur-2xl: 40px` (used behind glows).
- Scroll-triggered reveals / logo marquees are likely present but JS-driven — *[uncertain — exact timing not in CSS; verify at runtime]*.

## 11. Iconography

- **Library: Lucide.** Markup signature: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-…">`.
- **Stroke weight:** `2` (uniform). Color inherits via `currentColor`.
- **Sizing:** controlled by Tailwind, not the SVG attrs — `size-3.5` (14px) in small buttons/dropdowns, `size-4.5` (18px) in primary buttons, contained in `size-9` (36px) bordered boxes.
- **Usage modes:** inline beside link/button text; standalone inside square `border border-gray-70` boxes; chevrons at `opacity-70`.

## 12. Responsive Behavior

- **Breakpoints (Tailwind v4 defaults; `--breakpoint-sm:40rem` confirmed):** `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280 · `2xl` 1536px.
- **Navigation:** desktop nav `hidden … lg:flex`; below `lg`, hamburger (`size-11 bg-foreground`) opens a full light-background menu with `border-b foreground/10` rows.
- **Typography scaling:** fluid ramp up across breakpoints (hero H1 36→48→42→52→**64**; H2 30→52); body bumps `text-sm→base→lg→xl`.
- **Grid collapse:** multi-column grids stack to 1–2 columns on mobile (footer `grid-cols-2` → `lg:grid-cols-4`).
- **Border/edge management on collapse:** shared-edge classes flip with breakpoints (`border-t-0` on stacked mobile gains `sm:border-t` / `lg:border-l-0` when laid side-by-side) so the 1px grid never doubles or orphans a line.
- **Container padding:** `20px → md 32px → xl 40px`.

## 13. Bold / Non-Generic Elements

Preserve all of these — they ARE the brand:

1. **Black canvas (`#040406`) with a solid white nav bar and white-filled buttons** — the signature inversion.
2. **Hard square corners everywhere** (buttons, cards, cells, nav, icon boxes) — `rounded-none` is deliberate; only badges get 6px.
3. **1px `gray-20 (#2e3038)` bordered grid** with shared/de-duplicated edges — the page is literally a table.
4. **135° diagonal pencil-hatch** (`repeating-linear-gradient … 0 1px, transparent 1px 8px`) filling empty grid cells — blueprint/engineering device.
5. **UPPERCASE JetBrains-Mono eyebrow labels** (`.font-label`) sitting above display headlines.
6. **Chartreuse `#def135` highlighter `<mark>`** over black text, wrapping cleanly across lines via `box-decoration-break: clone`.
7. **Articulat CF display face with stylistic set `ss02`**, weight 400 even at 64px hero scale (light, wide headlines — not bold).
8. **Inverted light sections** (`text-background` dark type on light fills) breaking up the dark page.
9. **Flat — zero elevation.** No drop shadows in core UI; depth is borders + bg-tint only.
10. **Cool blue-violet-tinted gray scale** (not neutral gray) spanning `#0b0c0e`→`#eeeff1`.

## 14. Implementation Notes

- **Stack:** Next.js + **Tailwind CSS v4** (`@theme`-style `:root` tokens). Most class names ARE the spec; values above are resolved from the compiled CSS.
- **Fonts:** Articulat CF / Articulat Heavy CF require an **Adobe Typekit** kit (`tcb4uyw`). Inter and JetBrains Mono are self-hosted via Next font (`--font-inter`, `--font-jetbrains-mono`).
- **Two coexisting neutral systems:** the custom `gray-N` scale (primary) and zinc tokens (`border #27272a`, `muted-foreground #a1a1aa`, `popover #09090b`). New work should standardize on `gray-N`; the zinc tokens appear to be legacy/shadcn carryover.
- **Third-party noise:** a large share of the CSS bundle is the **c15t cookie-consent** widget (`--c15t-*`, `--consent-*`, `--accordion-*`, `--button-shadow-*`) and Tailwind Typography `prose`. Its shadows, radii, and inputs are **not** part of this design language — exclude them when rebuilding.
- **`.container` duality:** both a custom 101rem rule and the standard Tailwind responsive `.container` are defined. *[uncertain — confirm which applies per section in devtools]*.
- **Not verified from static source (verify at runtime):** core form/input styling (none on homepage), exact scroll-reveal and marquee timings, and per-element usage of the extended illustration palette.
- **Extended palette caveat:** the ~17 saturated hexes in §2 are decorative/data-viz/syntax colors, observed in compiled classes but not mapped to specific UI roles — treat as an accent grab-bag, not a token system.

---

*Source: live scrape of the reference site — compiled CSS (`120m7eldozp-x.css`, `05m0gxhcgqfo7.css`), Adobe Typekit (`tcb4uyw.css`), and server-rendered HTML. All values directly observed; uncertain items flagged inline.*
