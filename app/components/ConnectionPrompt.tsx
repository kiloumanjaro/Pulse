"use client";

import { Body, Button, Card, Display } from "./ui";

// Reusable centered prompt for "someone wants to connect" and
// "someone wants to start video".
export default function ConnectionPrompt({
  title,
  subtitle,
  acceptLabel,
  declineLabel,
  onAccept,
  onDecline,
}: {
  title: string;
  subtitle?: string;
  acceptLabel: string;
  declineLabel: string;
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-scrim p-6">
      <Card surface="popover" pad="md" className="flex flex-col w-full max-w-[320px]">
        <Display as="h2" size="xs" className="text-center">
          {title}
        </Display>
        {subtitle && (
          <Body size="sm" tone="muted" className="text-center mt-1">
            {subtitle}
          </Body>
        )}
        <div className="flex flex-row mt-5 gap-3">
          <Button variant="outline" size="md" full className="flex-1" onClick={onDecline}>
            {declineLabel}
          </Button>
          <Button variant="primary" size="md" full className="flex-1" onClick={onAccept}>
            {acceptLabel}
          </Button>
        </div>
      </Card>
    </div>
  );
}
