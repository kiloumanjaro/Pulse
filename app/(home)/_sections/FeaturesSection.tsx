import { Global, Mask, Share, ShieldSecurity, Timer1 } from "iconsax-reactjs";
import { Section } from "../../components/ds";
import { VALUES } from "../../content/landing";

const ICONS = { Mask, Share, ShieldSecurity, Timer1, Global };

// What Pulse stands for — a borderless trust strip: logo left, label right.
export default function FeaturesSection() {
  return (
    <Section className="items-center pt-10 pb-10">
      <div className="flex flex-row flex-wrap w-full justify-between gap-y-8">
        {VALUES.map(({ icon, label }) => {
          const Icon = ICONS[icon];
          return (
            <div key={label} className="flex flex-row items-center gap-4 text-gray-50">
              <Icon size={32} variant="Bold" color="currentColor" />
              <span className="text-xl font-semibold tracking-tight">{label}</span>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
