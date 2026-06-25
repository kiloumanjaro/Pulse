import { Placeholder, Section } from "../components/ds";
import { PARTNERS } from "../content/landing";

// Future partners — reserved logo grid, empty cells hatched (§8).
export default function PartnersSection() {
  return (
    <Section className="items-center gap-8 pt-[120px] pb-24">
      <div className="flex flex-row flex-wrap w-full border-t border-l border-gray-20">
        {Array.from({ length: PARTNERS.count }).map((_, i) => (
          <Placeholder
            key={i}
            label={PARTNERS.label}
            className="w-1/2 sm:w-1/4 h-[120px] border-r border-b border-gray-20"
          />
        ))}
      </div>
    </Section>
  );
}
