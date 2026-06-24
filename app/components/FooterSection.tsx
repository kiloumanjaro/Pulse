import { Body, Display, Eyebrow, Section } from "./ui";
import { FOOTER } from "../content/landing";

// Closing band — black canvas, gray-20 top hairline. Brand block on the left,
// link columns on the right, a divided meta row underneath. Mirrors the grid
// borders used across the landing sections (§8/§9).
export default function FooterSection() {
  return (
    <footer className="border-t border-gray-20">
      <Section className="gap-12 pt-24 pb-20">
        <div className="flex flex-row flex-wrap justify-between gap-12">
          <div className="flex flex-col gap-5 max-w-[360px]">
            <div className="flex flex-row items-center gap-2.5">
              <img src="/pulse.svg" alt="" aria-hidden className="h-8 w-auto" />
              <Display as="span" size="lg">
                Pulse
              </Display>
            </div>
            <Body size="sm" tone="muted">
              {FOOTER.tagline}
            </Body>
          </div>

          <div className="flex flex-row flex-wrap gap-x-16 gap-y-8">
            {FOOTER.columns.map((col) => (
              <nav key={col.heading} className="flex flex-col gap-4">
                <Eyebrow>{col.heading}</Eyebrow>
                <ul className="flex flex-col gap-2.5">
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
              </nav>
            ))}
          </div>
        </div>
      </Section>
    </footer>
  );
}
