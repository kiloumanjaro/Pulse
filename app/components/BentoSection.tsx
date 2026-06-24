import { Body, Card, Display, Placeholder, Section } from "./ui";
import { BENTO } from "../content/landing";

// Explicit grid placement so the center cell (index 2) is the tall rectangle
// flanked by two stacked squares per side. Mobile collapses to one column.
const PLACEMENT = [
  "md:col-start-1 md:row-start-1 aspect-square",
  "md:col-start-1 md:row-start-2 aspect-square",
  "md:col-start-2 md:row-start-1 md:row-span-2 md:aspect-auto md:min-h-0 aspect-square",
  "md:col-start-3 md:row-start-1 aspect-square",
  "md:col-start-3 md:row-start-2 aspect-square",
];

// Feature bento — full-row title over a 5-cell grid (4 squares + 1 tall center).
export default function BentoSection() {
  return (
    <Section id="how-it-works" className="py-24 gap-12">
      <div className="flex flex-col items-center text-center py-20 px-7 sm:px-16 gap-5">
        <Display as="h2" size="lg" className="max-w-[760px]">
          {BENTO.headline}
        </Display>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6">
        {BENTO.cards.map((card, i) => (
          <Card
            key={i}
            className={`flex flex-col gap-4 p-6 ${PLACEMENT[i]}`}
          >
            <Body size="md">
              <span className="text-foreground">{card.lead}</span> {card.body}
            </Body>
            <Placeholder label={card.image} className="flex-1 min-h-[120px]" />
          </Card>
        ))}
      </div>
    </Section>
  );
}
