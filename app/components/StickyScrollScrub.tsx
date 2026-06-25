"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Body, Display, Hatch, Placeholder } from "./ds";

// Sticky-scroll scrub (design-system.md). A bordered box whose full-width step
// nav pins to the top and highlights the active section as the left-column copy
// scrolls. Each section is text (left) + image (right); sections are separated
// by a full-width band of 135° diagonal hatch (§8). Active tab uses the gray-8
// "selected cell" fill (#121317) — monochrome, no colored accent. Scroll
// tracking uses scroll position only (no IntersectionObserver ratio ambiguity).

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
    <div className="flex flex-col flex-1 min-h-[260px] relative overflow-hidden bg-gray-5">
      {image ? (
        <img
          src={image}
          alt=""
          aria-hidden="true"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <Placeholder className="flex-1" label={label} />
      )}
    </div>
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
    <div className="flex flex-col w-full border border-gray-20">
      {/* Full-width step nav — pins to the top of the viewport while scrolling. */}
      <div className="flex flex-row w-full h-16 border-b border-gray-20 bg-background z-20 sticky top-0">
        {SECTIONS.map((s, i) => {
          const isActive = active === s.id;
          return (
            <div
              key={s.id}
              className={cn(
                "flex flex-col flex-1 items-center justify-center px-2 cursor-pointer transition-colors duration-200",
                i > 0 && "border-l border-gray-20",
                isActive ? "bg-gray-8" : "bg-transparent",
              )}
              onClick={() => goTo(s.id)}
            >
              <span
                className={cn(
                  "font-sans text-base sm:text-[19px] font-medium tracking-[-0.2px]",
                  isActive ? "text-foreground" : "text-gray-60",
                )}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

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
            <div className="flex w-full min-h-[80vh] flex-col sm:flex-row">
              <div className="flex flex-col w-full justify-center gap-[14px] py-14 px-8 sm:w-1/2 sm:px-12">
                <Display as="h3" size="md">
                  {s.headline}
                </Display>
                <Body size="lg" tone="muted">
                  {s.subheadline}
                </Body>
                <Body size="md" className="text-gray-60 max-w-[440px]">
                  {s.body}
                </Body>
              </div>

              <div className="flex flex-col w-full border-t border-gray-20 sm:w-1/2 sm:border-t-0 sm:border-l">
                <ImageSlot image={s.image} label="Image" />
              </div>
            </div>
          </section>

          {i < SECTIONS.length - 1 && (
            <div className="flex flex-col w-full h-16 relative overflow-hidden border-t border-b border-gray-20">
              <Hatch className="absolute inset-0" />
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
}
