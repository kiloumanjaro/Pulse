"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { Text, XStack, YStack } from "tamagui";
import { Body, Display, Hatch, Placeholder } from "./ui";

// Sticky-scroll scrub (design-system.md). A bordered box whose full-width step
// nav pins to the top and highlights the active section as the left-column copy
// scrolls. Each section is text (left) + image (right); sections are separated
// by a full-width band of 135° diagonal hatch (§8). Active tab uses the $gray8
// "selected cell" fill — monochrome, no colored accent. Scroll tracking is
// IntersectionObserver only (no scroll listeners).

type Section = {
  id: string;
  label: string;
  headline: string;
  subheadline: string;
  body: string;
  image?: string;
};

const SECTIONS: Section[] = [
  {
    id: "locate",
    label: "Locate",
    headline: "You appear as a single dot.",
    subheadline: "A fresh fix, privacy-offset.",
    body: "Your browser asks for location once. A privacy-offset coordinate places you on the globe — never your exact address.",
  },
  {
    id: "discover",
    label: "Discover",
    headline: "See who's live, right now.",
    subheadline: "A globe of pure presence.",
    body: "The map fills with other anonymous dots, each a real person online this moment. No names, no profiles — just presence.",
  },
  {
    id: "connect",
    label: "Connect",
    headline: "Tap a dot to reach out.",
    subheadline: "Consent before contact.",
    body: "A connection request is sent. Nothing reaches the other person until they accept — and they can always decline.",
  },
  {
    id: "converse",
    label: "Converse",
    headline: "Talk peer-to-peer.",
    subheadline: "Direct WebRTC, no relay.",
    body: "On accept, a direct channel opens between the two of you. Text first, then escalate to live video. Nothing routes through a server.",
  },
  {
    id: "vanish",
    label: "Vanish",
    headline: "Leave and you're gone.",
    subheadline: "Nothing kept behind.",
    body: "Close the tab and your dot disappears from every map within ~15 seconds. No history, no account, nothing stored.",
  },
];

// Height of the pinned nav, so clicked sections settle just beneath it.
const NAV_OFFSET = 64;

function ImageSlot({ image, label }: { image?: string; label: string }) {
  return (
    <YStack
      flex={1}
      minHeight={260}
      position="relative"
      overflow="hidden"
      backgroundColor="$gray5"
    >
      {image ? (
        <img
          src={image}
          alt=""
          aria-hidden="true"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <Placeholder flex={1} label={label} />
      )}
    </YStack>
  );
}

export default function StickyScrollScrub() {
  const [active, setActive] = useState<string>(SECTIONS[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    // Scrollspy: the active section is the last one whose top has scrolled
    // above the line just beneath the pinned nav. Deterministic — no ratio
    // ambiguity when two sections share the viewport.
    let raf = 0;
    const pick = () => {
      raf = 0;
      const line = NAV_OFFSET + 1;
      let current = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = sectionRefs.current[s.id];
        if (el && el.getBoundingClientRect().top <= line) current = s.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(pick);
    };

    pick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  function goTo(id: string) {
    setActive(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <YStack width="100%" borderWidth={1} borderColor="$gray20">
      {/* Full-width step nav — pins to the top of the viewport while scrolling. */}
      <XStack
        width="100%"
        height={64}
        borderBottomWidth={1}
        borderColor="$gray20"
        backgroundColor="$background"
        zIndex={20}
        style={{ position: "sticky", top: 0 }}
      >
        {SECTIONS.map((s, i) => {
          const isActive = active === s.id;
          return (
            <YStack
              key={s.id}
              flex={1}
              alignItems="center"
              justifyContent="center"
              paddingHorizontal={8}
              cursor="pointer"
              animation="quick"
              borderLeftWidth={i > 0 ? 1 : 0}
              borderColor="$gray20"
              backgroundColor={isActive ? "$gray8" : "transparent"}
              hoverStyle={{ backgroundColor: isActive ? "$gray8" : "transparent" }}
              onPress={() => goTo(s.id)}
            >
              <Text
                fontFamily="$body"
                fontSize={16}
                $sm={{ fontSize: 19 }}
                fontWeight="500"
                letterSpacing={-0.2}
                color={isActive ? "$foreground" : "$gray60"}
              >
                {s.label}
              </Text>
            </YStack>
          );
        })}
      </XStack>

      {/* Sections: text (left) + image (right), hatch band between each. */}
      {SECTIONS.map((s, i) => (
        <Fragment key={s.id}>
          <section
            id={s.id}
            ref={(el) => {
              sectionRefs.current[s.id] = el;
            }}
            style={{ minHeight: "80vh", scrollMarginTop: NAV_OFFSET }}
          >
            <XStack width="100%" minHeight="80vh" flexDirection="column" $sm={{ flexDirection: "row" }}>
              <YStack
                width="100%"
                justifyContent="center"
                gap={14}
                paddingVertical={56}
                paddingHorizontal={32}
                $sm={{ width: "50%", paddingHorizontal: 48 }}
              >
                <Display tag="h3" size="md">
                  {s.headline}
                </Display>
                <Body size="lg" tone="muted">
                  {s.subheadline}
                </Body>
                <Body size="md" color="$gray60" maxWidth={440}>
                  {s.body}
                </Body>
              </YStack>

              <YStack
                width="100%"
                borderTopWidth={1}
                borderColor="$gray20"
                $sm={{ width: "50%", borderTopWidth: 0, borderLeftWidth: 1 }}
              >
                <ImageSlot image={s.image} label="Image" />
              </YStack>
            </XStack>
          </section>

          {i < SECTIONS.length - 1 && (
            <YStack
              width="100%"
              height={64}
              position="relative"
              overflow="hidden"
              borderTopWidth={1}
              borderBottomWidth={1}
              borderColor="$gray20"
            >
              <Hatch position="absolute" top={0} left={0} right={0} bottom={0} />
            </YStack>
          )}
        </Fragment>
      ))}
    </YStack>
  );
}
