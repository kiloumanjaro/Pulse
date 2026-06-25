import { Display, Section } from "../../components/ds";
import { BENTO } from "../../content/landing";

// Centered headline that introduces the feature bento.
export default function BentoIntroSection() {
  return (
    <Section>
      <div className="flex flex-col items-center text-center py-20 px-7 sm:px-16 gap-5 mt-24">
        <Display as="h2" size="lg" className="max-w-[760px]">
          {BENTO.headline}
        </Display>
      </div>
    </Section>
  );
}
