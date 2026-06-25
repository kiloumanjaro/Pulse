import { Body, Display, Section } from "../components/ds";
import { STATEMENT } from "../content/landing";

// The statement — the why-Pulse copy.
export default function StatementSection() {
  return (
    <Section id="why-pulse">
      <div className="flex flex-col py-20 px-7 sm:px-16 gap-5">
        <div className="flex flex-row flex-wrap items-start gap-12 sm:gap-20">
          <div className="flex flex-col grow-[1.6] shrink basis-[420px] gap-5">
            <Display as="h2" size="lg">
              {STATEMENT.headline}
            </Display>
          </div>
          <div className="flex flex-col grow shrink basis-[280px]">
            <Body size="lg" tone="muted">
              {STATEMENT.body}
            </Body>
          </div>
        </div>
      </div>
    </Section>
  );
}
