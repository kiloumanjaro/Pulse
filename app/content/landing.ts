import { config } from "../../tamagui.config";

// Marketing copy + palette for the landing page (EntryGate). Kept out of the
// section components so wording can change without touching layout — mirrors how
// StickyScrollScrub keeps its lifecycle steps in a data array.

export const GITHUB_URL = "https://github.com/kiloumanjaro/Pulse";

// Radar colors resolved from design tokens so a brand recolor in
// tamagui.config.ts stays in sync (Radar takes plain color strings, not tokens).
export const RADAR_COLOR = config.tokens.color.yellow.val as string;
export const RADAR_BACKGROUND = config.tokens.color.background.val as string;

export const HERO = {
  title: "Pulse",
  body: "A living globe of anonymous strangers. No sign-up, nothing stored — gone the moment you leave.",
};

export const STATEMENT = {
  eyebrow: "Why Pulse",
  headline:
    "One living map of real people — with nothing kept, and nothing tracked.",
  body: "Stop trading your identity for a conversation. Most apps make you sign up and leave a permanent trail behind. Pulse drops you onto a global radar as an anonymous dot — talk, video-call peer-to-peer, then vanish without a record.",
};

export const PARTNERS = {
  count: 4,
  label: "Logo",
};
