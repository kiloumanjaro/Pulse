"use client";

import { XStack } from "tamagui";
import { Placeholder, Section } from "./ui";
import { PARTNERS } from "../content/landing";

// Future partners — reserved logo grid, empty cells hatched (§8).
export default function PartnersSection() {
  return (
    <Section paddingTop={120} paddingBottom={96} gap={32} alignItems="center">
      <XStack
        width="100%"
        borderTopWidth={1}
        borderLeftWidth={1}
        borderColor="$gray20"
        flexWrap="wrap"
      >
        {Array.from({ length: PARTNERS.count }).map((_, i) => (
          <Placeholder
            key={i}
            label={PARTNERS.label}
            width="50%"
            $sm={{ width: "25%" }}
            height={120}
            borderRightWidth={1}
            borderBottomWidth={1}
            borderColor="$gray20"
          />
        ))}
      </XStack>
    </Section>
  );
}
