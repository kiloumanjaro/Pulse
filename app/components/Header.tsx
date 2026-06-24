"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Text, View, XStack, styled } from "tamagui";
import { Button } from "./ui";

// The essentials only (the site is deliberately tiny): brand → home, three
// concept pages, a live heartbeat, and one way in. No e-commerce-style menu.
const NAV = [
  { href: "/about", label: "About" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/privacy", label: "Privacy" },
];

// A floating, detached chip — frosted dark fill, 1px gray-20 border, square.
// Each segment of the header is one of these (brand / nav / live), echoing the
// reference's separated boxes but kept in our dark style.
const FloatBox = styled(XStack, {
  name: "FloatBox",
  alignItems: "center",
  height: 42,
  paddingHorizontal: 14,
  borderWidth: 1,
  borderColor: "$gray20",
  backgroundColor: "rgba(4,4,6,0.6)",
  animation: "quick",
});

// Mono UPPERCASE link, gray → white on hover. The signature eyebrow voice (§3).
const NavLabel = styled(Text, {
  name: "NavLabel",
  fontFamily: "$mono",
  fontSize: 12,
  lineHeight: 15,
  letterSpacing: 0.36,
  textTransform: "uppercase",
  color: "$gray60",
  cursor: "pointer",
  animation: "quick",
  hoverStyle: { color: "$foreground" },

  variants: {
    active: { true: { color: "$foreground" } },
  } as const,
});

// Square 3px tick between nav items — the reference's separator, kept hard-cornered.
const Sep = () => <View width={3} height={3} backgroundColor="$foreground" />;

// Radar/pulse glyph: concentric rings + a chartreuse sweep, echoing the entry radar.
function RadarMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="#abaebb" strokeWidth="1.25" opacity="0.45" />
      <circle cx="12" cy="12" r="6" stroke="#abaebb" strokeWidth="1.25" opacity="0.7" />
      <line x1="12" y1="12" x2="21" y2="6.5" stroke="#def135" strokeWidth="1.25" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2.4" fill="#def135" />
    </svg>
  );
}

export default function Header({ onEnter }: { onEnter?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();

  // On the gate, "Enter" runs the geolocation flow; elsewhere it returns home.
  const handleEnter = () => (onEnter ? onEnter() : router.push("/"));

  return (
    <XStack
      tag="header"
      position="sticky"
      top={0}
      zIndex={60}
      width="100%"
      paddingTop={16}
      paddingHorizontal={16}
      alignItems="center"
      pointerEvents="box-none"
    >
      <XStack flex={1} justifyContent="flex-start" pointerEvents="box-none">
        <Link href="/" style={{ textDecoration: "none" }} aria-label="Pulse — home">
          <FloatBox
            className="nav-glass"
            width={42}
            paddingHorizontal={0}
            justifyContent="center"
            cursor="pointer"
            hoverStyle={{ borderColor: "$gray30" }}
          >
            <RadarMark />
          </FloatBox>
        </Link>
      </XStack>

      <XStack justifyContent="center" pointerEvents="box-none" display="none" $sm={{ display: "flex" }}>
        <FloatBox className="nav-glass" gap={34} paddingHorizontal={30}>
          {NAV.map((item, i) => (
            <Fragment key={item.href}>
              {i > 0 && <Sep />}
              <Link href={item.href} style={{ textDecoration: "none" }}>
                <NavLabel active={pathname === item.href}>{item.label}</NavLabel>
              </Link>
            </Fragment>
          ))}
        </FloatBox>
      </XStack>

      <XStack flex={1} justifyContent="flex-end" pointerEvents="box-none">
        <Button variant="primary" size="sm" height={42} onPress={handleEnter}>
          <Text
            fontFamily="$mono"
            fontSize={12}
            lineHeight={15}
            letterSpacing={0.36}
            textTransform="uppercase"
            color="$background"
          >
            Enter
          </Text>
        </Button>
      </XStack>
    </XStack>
  );
}
