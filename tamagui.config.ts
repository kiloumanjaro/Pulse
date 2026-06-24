import { defaultConfig } from "@tamagui/config/v5";
import { createAnimations } from "@tamagui/animations-css";
import { createFont, createTamagui } from "tamagui";

// ---------------------------------------------------------------------------
// Unkey design system, ported to Tamagui. Single source of truth for the app.
// Values are taken verbatim from design-system.md (scraped from unkey.com):
// near-black canvas, white ink, a cool blue-violet gray scale, one chartreuse
// accent, square corners, and a three-voice type system.
// ---------------------------------------------------------------------------

// CSS transitions (web driver). `animation="quick"` -> 200ms ease-in-out, the
// site's most common hover timing (§10). Animates bg/border/color/transform.
const animations = createAnimations({
  quick: "ease-in-out 200ms",
  medium: "ease-in-out 300ms",
  slow: "ease-in-out 500ms",
  fast: "ease-in-out 150ms",
});

// Shared type scale (token -> px). Display, body and mono share keys so the
// `fontSize="$n"` token auto-pairs the matching line-height + letter-spacing.
const SIZE = {
  1: 12, // text-xs
  2: 13, // eyebrow label
  3: 14, // text-sm
  4: 15, // 0.9375rem
  5: 16, // text-base
  6: 18, // text-lg
  7: 20, // text-xl
  8: 22, // h3 display
  9: 24, // text-2xl
  10: 28, // h3 lg
  11: 30, // text-3xl
  12: 36, // text-4xl
  13: 42, // h1 md
  14: 48, // text-5xl
  15: 52, // h1 lg
  16: 64, // hero h1 xl
} as const;

const lineHeights = (factor: number) =>
  Object.fromEntries(
    Object.entries(SIZE).map(([k, v]) => [k, Math.round(v * factor)]),
  );

const tracking = (em: number) =>
  Object.fromEntries(
    Object.entries(SIZE).map(([k, v]) => [k, Math.round(v * em * 100) / 100]),
  );

// Display = Articulat CF (paid Typekit). `articulat-cf` is named first so it
// upgrades automatically if a licensed kit is ever added; until then the free
// substitute loaded via --font-display (Hanken Grotesk) renders. §3
const displayFont = createFont({
  family: "articulat-cf, var(--font-display), system-ui, sans-serif",
  size: SIZE,
  lineHeight: lineHeights(1.125), // leading-[1.125] on headings
  letterSpacing: tracking(-0.02), // -0.02em tight headings
  weight: { 4: "400", 5: "500", 6: "600", 7: "700", 9: "900" },
});

// Body = Inter.
const bodyFont = createFont({
  family: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
  size: SIZE,
  lineHeight: lineHeights(1.4), // ~leading-snug 1.375
  letterSpacing: tracking(-0.01), // -0.01em body
  weight: { 4: "400", 5: "500", 6: "600", 7: "700" },
});

// Mono = JetBrains Mono. Also the eyebrow/label voice (.font-label). §3
const monoFont = createFont({
  family: "var(--font-jetbrains), ui-monospace, SFMono-Regular, monospace",
  size: SIZE,
  lineHeight: lineHeights(1.25), // leading-tight
  letterSpacing: tracking(0),
  weight: { 4: "400", 5: "500", 6: "600", 7: "700" },
});

export const config = createTamagui({
  ...defaultConfig,
  animations,
  fonts: {
    heading: displayFont,
    body: bodyFont,
    mono: monoFont,
  },
  tokens: {
    ...defaultConfig.tokens,
    // Fixed colors. Theme-aware slots ($background/$color/$borderColor) come
    // from the themes below; these are the literal palette for when a specific
    // value is needed regardless of theme. §2
    color: {
      background: "#040406", // canvas (near-black, faint blue)
      foreground: "#ffffff", // ink / white nav bar / primary button fill
      // cool blue-violet gray scale (named by ~lightness)
      gray5: "#0b0c0e",
      gray8: "#121317",
      gray12: "#1c1d22",
      gray20: "#2e3038", // primary structural border + divider
      gray30: "#464853",
      gray40: "#60606c",
      gray50: "#777a88",
      gray60: "#9194a1",
      gray70: "#abaebb",
      gray80: "#c7c9d1",
      gray90: "#e3e4e9", // primary button hover fill
      gray94: "#eeeff1",
      // zinc/shadcn carryover tokens still present on the site
      border: "#27272a",
      mutedForeground: "#a1a1aa",
      popover: "#09090b",
      // accent
      yellow: "#def135", // highlighter <mark> fill
      yellowGlow: "#c29500",
      // semantic destructive (from the extended palette) for "leave/end" actions
      danger: "#ff573d",
      dangerHover: "#f87272",
      white: "#ffffff",
      black: "#000000",
      // translucent overlays
      scrim: "rgba(4,4,6,0.72)", // dim layer over content
      foregroundA5: "rgba(255,255,255,0.05)", // list-row hover
      foregroundA10: "rgba(255,255,255,0.10)", // menu-row dividers
    },
    // Square by default ($true = 0). Only badges round (6px). §6
    radius: {
      ...defaultConfig.tokens.radius,
      true: 0,
      0: 0,
      badge: 6, // rounded-[0.375rem]
      box: 12, // radius-xl
      card: 16, // radius-2xl
      round: 9999,
    },
    space: { ...defaultConfig.tokens.space },
    size: { ...defaultConfig.tokens.size },
    zIndex: {
      ...defaultConfig.tokens.zIndex,
      nav: 50,
      navTop: 60,
    },
  },
  themes: {
    ...defaultConfig.themes,
    // Primary theme: dark is the only first-class mode. §(top flag)
    dark: {
      ...defaultConfig.themes.dark,
      background: "#040406",
      backgroundHover: "#121317",
      backgroundPress: "#1c1d22",
      backgroundFocus: "#1c1d22",
      color: "#ffffff",
      colorHover: "#e3e4e9",
      colorPress: "#e3e4e9",
      borderColor: "#2e3038",
      borderColorHover: "#464853",
      placeholderColor: "#60606c",
    },
    // Light sub-theme: the inverted sections (light bg, dark ink). §13 #8
    // Wrap a region in <Theme name="light"> to flip $background/$color.
    light: {
      ...defaultConfig.themes.light,
      background: "#ffffff",
      backgroundHover: "#eeeff1",
      backgroundPress: "#e3e4e9",
      backgroundFocus: "#eeeff1",
      color: "#040406",
      colorHover: "#2e3038",
      colorPress: "#040406",
      borderColor: "#2e3038",
      borderColorHover: "#464853",
      placeholderColor: "#777a88",
    },
  },
  settings: {
    ...defaultConfig.settings,
    defaultFont: "body",
    onlyAllowShorthands: false,
  },
});

export default config;

export type AppConfig = typeof config;

declare module "tamagui" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TamaguiCustomConfig extends AppConfig {}
}
