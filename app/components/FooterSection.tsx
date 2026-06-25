import { Fragment } from "react";
import { Body, Display, Eyebrow, Section } from "./ui";
import { FOOTER } from "../content/landing";

// Closing band — black canvas, gray-20 top hairline. Laid out as a 2-row grid
// so row 1 (brand lockup + column headings) and row 2 (tagline + link lists)
// each share a baseline: the tagline lines up with the first link in every
// column even though the lockup is taller than the headings. Mirrors the grid
// borders used across the landing sections (§8/§9).

// Static per-column placement — Tailwind can't see interpolated class names.
const COL_START = ["sm:col-start-2", "sm:col-start-3"];

export default function FooterSection() {
  return (
    <footer className="border-t border-gray-20">
      <Section className="pt-24 pb-20">
        <div className="grid grid-cols-1 gap-x-16 gap-y-6 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:gap-y-5 sm:items-start">
          {/* Row 1 / col 1 — brand lockup */}
          <div className="flex flex-row items-center gap-2.5 sm:col-start-1 sm:row-start-1">
            <img src="/pulse.svg" alt="" aria-hidden className="h-8 w-auto" />
            <Display as="span" size="lg">
              Pulse
            </Display>
          </div>

          {/* Row 2 / col 1 — tagline, aligned with the first link in each column */}
          <Body
            size="sm"
            tone="muted"
            className="max-w-[360px] sm:col-start-1 sm:row-start-2"
          >
            {FOOTER.tagline}
          </Body>

          {FOOTER.columns.map((col, i) => (
            <Fragment key={col.heading}>
              <Eyebrow className={`sm:row-start-1 ${COL_START[i]}`}>
                {col.heading}
              </Eyebrow>
              <ul className={`flex flex-col gap-2.5 sm:row-start-2 ${COL_START[i]}`}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={"external" in link && link.external ? "_blank" : undefined}
                      rel={"external" in link && link.external ? "noreferrer" : undefined}
                      className="font-sans text-sm tracking-[-0.16px] text-gray-70 transition-colors duration-200 hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Fragment>
          ))}
        </div>
      </Section>
    </footer>
  );
}
