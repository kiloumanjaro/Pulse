"use client";

import type { ReactNode } from "react";
import {
  GetProps,
  Input as TamaguiInput,
  styled,
  Text,
  View,
  YStack,
} from "tamagui";

// ---------------------------------------------------------------------------
// Design-system primitives (see design-system.md). Square corners, 1px
// gray-20 borders, white-on-dark fills, mono uppercase eyebrows, flat (no
// shadows). All tokens resolve from tamagui.config.ts.
// ---------------------------------------------------------------------------

// --- Buttons (§9) -- 44px tall, square, hover = bg flip, 200ms ease-in-out ---
export const ButtonFrame = styled(View, {
  name: "Button",
  tag: "button",
  role: "button",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 4,
  height: 44,
  borderWidth: 1,
  borderColor: "transparent",
  borderRadius: 0,
  cursor: "pointer",
  userSelect: "none",
  animation: "quick",

  variants: {
    variant: {
      primary: {
        backgroundColor: "$foreground",
        hoverStyle: { backgroundColor: "$gray90" },
        pressStyle: { backgroundColor: "$gray80" },
      },
      outline: {
        backgroundColor: "$background",
        borderColor: "$foreground",
        hoverStyle: { backgroundColor: "$gray12" },
        pressStyle: { backgroundColor: "$gray8" },
      },
      ghost: {
        backgroundColor: "transparent",
        hoverStyle: { backgroundColor: "$gray12" },
        pressStyle: { backgroundColor: "$gray8" },
      },
      danger: {
        backgroundColor: "$danger",
        hoverStyle: { backgroundColor: "$dangerHover" },
        pressStyle: { backgroundColor: "$dangerHover" },
      },
    },
    size: {
      sm: { paddingHorizontal: 24 }, // text-sm
      md: { paddingHorizontal: 20 }, // text-base
      icon: { width: 44, paddingHorizontal: 0 },
    },
    full: {
      true: { width: "100%" },
    },
  } as const,

  defaultVariants: { variant: "primary", size: "sm" },
});

export const ButtonText = styled(Text, {
  name: "ButtonText",
  fontFamily: "$body",
  fontSize: 14,
  fontWeight: "500",
  letterSpacing: -0.35, // tracking-tight
  userSelect: "none",

  variants: {
    variant: {
      primary: { color: "$background" },
      outline: { color: "$foreground" },
      ghost: { color: "$foreground" },
      danger: { color: "$foreground" },
    },
  } as const,

  defaultVariants: { variant: "primary" },
});

type ButtonProps = GetProps<typeof ButtonFrame>;

export function Button({ children, variant, ...props }: ButtonProps) {
  return (
    <ButtonFrame variant={variant} {...props}>
      {typeof children === "string" ? (
        <ButtonText variant={variant}>{children}</ButtonText>
      ) : (
        children
      )}
    </ButtonFrame>
  );
}

// --- Card / grid cell (§9) -- bordered, square, flat ---
export const Card = styled(View, {
  name: "Card",
  backgroundColor: "$background",
  borderWidth: 1,
  borderColor: "$gray20",
  borderRadius: 0,
  padding: 20,

  variants: {
    pad: {
      sm: { padding: 16 },
      md: { padding: 24 },
      lg: { padding: 32 },
    },
    surface: {
      base: { backgroundColor: "$background" },
      raised: { backgroundColor: "$gray8" },
      popover: { backgroundColor: "$popover" },
    },
  } as const,
});

// --- Badge / tag (§9) -- the only rounded component (6px) ---
export const BadgeFrame = styled(View, {
  name: "Badge",
  flexDirection: "row",
  alignItems: "center",
  alignSelf: "flex-start",
  gap: 10,
  borderWidth: 1,
  borderColor: "$gray20",
  borderRadius: 6,
  paddingHorizontal: 12,
  paddingVertical: 7,
});

export const BadgeText = styled(Text, {
  name: "BadgeText",
  fontFamily: "$body",
  fontSize: 14,
  lineHeight: 19,
  letterSpacing: 0.42, // +0.03em
  color: "$gray80",
});

export function Badge({
  children,
  ...props
}: GetProps<typeof BadgeFrame> & { children?: ReactNode }) {
  return (
    <BadgeFrame {...props}>
      {typeof children === "string" ? (
        <BadgeText>{children}</BadgeText>
      ) : (
        children
      )}
    </BadgeFrame>
  );
}

// --- Typography (§3) ---
// Display = Articulat substitute, weight 400, leading 1.125, theme-aware ink.
export const Display = styled(Text, {
  name: "Display",
  tag: "h2",
  fontFamily: "$heading",
  color: "$color",
  fontWeight: "400",

  variants: {
    size: {
      hero: { fontSize: 64, lineHeight: 72, letterSpacing: -1.3 },
      xl: { fontSize: 52, lineHeight: 58, letterSpacing: -1 },
      lg: { fontSize: 40, lineHeight: 45, letterSpacing: -0.8 },
      md: { fontSize: 30, lineHeight: 34, letterSpacing: -0.6 },
      sm: { fontSize: 24, lineHeight: 27, letterSpacing: -0.5 },
      xs: { fontSize: 22, lineHeight: 25, letterSpacing: -0.4 },
    },
  } as const,

  defaultVariants: { size: "md" },
});

// Eyebrow = JetBrains Mono, UPPERCASE label. §3
export const Eyebrow = styled(Text, {
  name: "Eyebrow",
  fontFamily: "$mono",
  fontSize: 13,
  lineHeight: 16,
  letterSpacing: 0.39,
  textTransform: "uppercase",
  color: "$gray40",
});

// Body = Inter, leading-snug, slight negative tracking, gray ink. §3
export const Body = styled(Text, {
  name: "Body",
  tag: "p",
  fontFamily: "$body",
  fontSize: 16,
  lineHeight: 22,
  letterSpacing: -0.16,
  color: "$gray70",

  variants: {
    size: {
      sm: { fontSize: 14, lineHeight: 20 },
      md: { fontSize: 16, lineHeight: 22 },
      lg: { fontSize: 18, lineHeight: 25 },
      xl: { fontSize: 20, lineHeight: 28 },
    },
    tone: {
      muted: { color: "$gray60" },
      default: { color: "$gray70" },
      bright: { color: "$gray90" },
    },
  } as const,
});

// --- Divider (§9) -- 1px hairline ---
export const Divider = styled(View, {
  name: "Divider",
  backgroundColor: "$gray20",

  variants: {
    orientation: {
      horizontal: { height: 1, width: "100%" },
      vertical: { width: 1, alignSelf: "stretch" },
    },
    tone: {
      strong: { backgroundColor: "$gray20" },
      faint: { backgroundColor: "$foregroundA10" },
      white: { backgroundColor: "$foreground" },
    },
  } as const,

  defaultVariants: { orientation: "horizontal", tone: "strong" },
});

// --- Hatch (§8) -- diagonal pencil-hatch fill, web-only. Use as an absolute
// fill or fixed-size block to texture "empty" grid cells. ---
export const Hatch = styled(View, {
  name: "Hatch",
  backgroundImage:
    "repeating-linear-gradient(135deg, rgba(46,48,56,0.45) 0 1px, rgba(0,0,0,0) 1px 8px)",
});

// --- Section -- page band with the standard responsive gutter (24 -> 48 @sm).
// Every full-width landing band wraps in one so margins stay consistent. ---
export const Section = styled(YStack, {
  name: "Section",
  width: "100%",
  paddingHorizontal: 24,
  $sm: { paddingHorizontal: 48 },
});

// --- Placeholder (§8) -- hatched empty cell with a centered mono label. Used
// for reserved logo slots and image-less media slots. ---
export function Placeholder({
  label,
  ...props
}: GetProps<typeof View> & { label: string }) {
  return (
    <View
      position="relative"
      overflow="hidden"
      alignItems="center"
      justifyContent="center"
      {...props}
    >
      <Hatch
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        opacity={0.5}
      />
      <Eyebrow color="$gray30">{label}</Eyebrow>
    </View>
  );
}

// --- Input (§9) -- square, gray-8 fill, gray-20 border, focus -> gray-50 ---
export const Input = styled(TamaguiInput, {
  name: "Input",
  backgroundColor: "$gray8",
  borderWidth: 1,
  borderColor: "$gray20",
  borderRadius: 0,
  color: "$foreground",
  placeholderTextColor: "$gray50",
  fontFamily: "$body",
  fontSize: 15,
  height: 44,
  paddingHorizontal: 16,
  outlineWidth: 0,
  focusStyle: { borderColor: "$gray50" },
});
