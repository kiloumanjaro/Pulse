"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Body, Button, Display, Eyebrow } from "./ds";
import Header from "./Header";

// Shared chrome for the static concept pages (/about, /how-it-works, /privacy):
// sticky header + centered blueprint container + a single "way in" at the foot.
export default function PageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children?: ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <div className="flex flex-col flex-1 w-full max-w-[1080px] self-center px-6 pt-28 pb-[120px] gap-12">
        <div className="flex flex-col gap-4 max-w-[680px]">
          <Eyebrow>{eyebrow}</Eyebrow>
          <Display as="h1" size="lg">
            {title}
          </Display>
          <Body size="lg" tone="muted">
            {intro}
          </Body>
        </div>

        {children}

        <div className="flex flex-row pt-2">
          <Button variant="primary" onClick={() => router.push("/")}>
            Enter Pulse
          </Button>
        </div>
      </div>
    </div>
  );
}
