import { defaultConfig } from "@tamagui/config/v5";
import { createTamagui } from "tamagui";

// Design tokens mirroring the app's original Tailwind palette/scale, so the UI
// is driven by Tamagui's token system (single source of truth + theme-ready)
// rather than inline literals. Values are exact, so visuals are unchanged.
export const config = createTamagui({
  ...defaultConfig,
  tokens: {
    ...defaultConfig.tokens,
    // Colors are theme-based (not tokens) in @tamagui/config v5, so add a
    // dedicated color token group. Referenced as `$emerald400`, `$zinc100`, …
    color: {
      zinc100: "#f4f4f5",
      zinc200: "#e4e4e7",
      zinc300: "#d4d4d8",
      zinc400: "#a1a1aa",
      zinc500: "#71717a",
      zinc600: "#52525b",
      zinc700: "#3f3f46",
      zinc800: "#27272a",
      zinc900: "#18181b",
      zinc950: "#09090b",
      emerald300: "#6ee7b7",
      emerald400: "#34d399",
      red400: "#f87171",
      red500: "#ef4444",
      white: "#ffffff",
      black: "#000000",
      // translucent surfaces (Tailwind bg-*/opacity)
      scrim: "rgba(0,0,0,0.6)", // bg-black/60
      panel: "rgba(39,39,42,0.9)", // bg-zinc-800/90
      chip: "rgba(24,24,27,0.8)", // bg-zinc-900/80
    },
    radius: {
      ...defaultConfig.tokens.radius,
      box: 8, // rounded-lg
      card: 16, // rounded-2xl
      round: 9999, // rounded-full
    },
    space: {
      ...defaultConfig.tokens.space,
      s1: 4, // p-1
      s1_5: 6, // p-1.5
      s2: 8, // p-2 / gap-2
      s3: 12, // p-3 / gap-3
      s4: 16, // p-4
      s5: 20, // mt-5
      s6: 24, // p-6
      s8: 32, // p-8 / gap-8
    },
  },
});

export default config;

export type AppConfig = typeof config;

declare module "tamagui" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TamaguiCustomConfig extends AppConfig {}
}
