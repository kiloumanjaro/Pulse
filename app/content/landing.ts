// Marketing copy + palette for the landing page (EntryGate). Kept out of the
// section components so wording can change without touching layout — mirrors how
// StickyScrollScrub keeps its lifecycle steps in a data array.

export const GITHUB_URL = "https://github.com/kiloumanjaro/Pulse";

// The radar's accent color now tracks the `--color-brand` token at runtime via
// useBrandColor() (see HeroSection). The background stays a literal — it mirrors
// the --color-background canvas, which never changes.
export const RADAR_BACKGROUND = "#040406";

export const HERO = {
  title: "Pulse",
  body: "A living globe of anonymous strangers. No sign-up, nothing stored — gone the moment you leave.",
};

export const STATEMENT = {
  headline:
    "One living map of real people — with nothing kept, and nothing tracked.",
  body: "Stop trading your identity for a conversation. Most apps make you sign up and leave a permanent trail behind. Pulse drops you onto a global radar as an anonymous dot — talk, video-call peer-to-peer, then vanish without a record.",
};

// What Pulse stands for — a trust strip in place of a partner logo wall. The
// `icon` key maps to an iconsax-reactjs icon in PartnersSection.
export const VALUES = [
  { icon: "Mask", label: "Anonymous" },
  { icon: "Share", label: "Peer-to-Peer" },
  { icon: "ShieldSecurity", label: "Encrypted" },
  { icon: "Timer1", label: "Ephemeral" },
  { icon: "Global", label: "Global" },
] as const;

// Footer (FooterSection). Brand mark + tagline on the left, link columns on
// the right, a hairline-divided bottom row for the legal/meta line. Link `href`
// values point at on-site anchors or external resources.
export const FOOTER = {
  tagline: "A living globe of anonymous strangers. Nothing stored, gone the moment you leave.",
  columns: [
    {
      heading: "Product",
      links: [
        { label: "Enter Pulse", href: "/live" },
        { label: "How it works", href: "#how-it-works" },
        { label: "Why Pulse", href: "#why-pulse" },
      ],
    },
    {
      heading: "Project",
      links: [
        { label: "GitHub", href: GITHUB_URL, external: true },
        { label: "Privacy", href: "#why-pulse" },
      ],
    },
  ],
};

// Bento feature grid (BentoSection). Cards are ordered to match grid slots:
// col1-top, col1-bottom, center (tall), col3-top, col3-bottom. `lead` is the
// bold opener, `body` the rest, `image` the placeholder/art hint.
export const BENTO = {
  headline: "Be everywhere at once — and gone without a trace.",
  cards: [
    {
      lead: "Live global map.",
      body: "Real people surface as anonymous dots on a spinning globe, updating the instant they arrive or leave.",
      image: "Globe with live dots",
    },
    {
      lead: "Ephemeral by design.",
      body: "Nothing is written down. The moment you close the tab, your presence and history are gone for good.",
      image: "Fading session trail",
    },
    {
      lead: "Peer-to-peer video.",
      body: "Tap a dot and talk face to face over a direct WebRTC connection — your stream never lands on a server.",
      image: "P2P video link diagram",
    },
    {
      lead: "Anonymous by default.",
      body: "No sign-up, no profile, no handle. You are a dot on the map and nothing more.",
      image: "Identity-less dot",
    },
    {
      lead: "Zero tracking.",
      body: "No cookies, no analytics, no trail. We can't sell what we never keep.",
      image: "Crossed-out tracker grid",
    },
  ],
};
