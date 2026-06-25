import { cn } from "@/lib/utils";
import { Body, Display, Eyebrow } from "../components/ds";
import PageShell from "../components/PageShell";

const ROWS = [
  { what: "Exact location", how: "Offset 1–3 km in a random direction, fresh each session. Raw coordinates are never written to the database." },
  { what: "Chat messages", how: "Sent over a direct WebRTC data channel. They never touch the server." },
  { what: "Video & audio", how: "Streamed peer-to-peer over WebRTC media tracks. Never recorded, never relayed through us." },
  { what: "Session identity", how: "An ephemeral UUID generated in your browser and deleted the moment you leave." },
  { what: "History", how: "None. Nothing is logged or persisted between sessions — every visit starts blank." },
];

export default function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Privacy"
      title="Built to forget you."
      intro="Privacy isn't a setting in Pulse — it's the architecture. Here is exactly what is protected, and how."
    >
      <div className="flex flex-col border border-gray-20">
        {ROWS.map((r, i) => (
          <div
            key={r.what}
            className={cn(
              "flex flex-row border-gray-20 min-[460px]:flex-col",
              i !== 0 && "border-t",
            )}
          >
            <div className="flex flex-col p-5 w-[36%] min-[460px]:w-full">
              <Eyebrow>{r.what}</Eyebrow>
            </div>
            <div className="flex flex-col flex-1 p-5 border-l border-gray-20 min-[460px]:border-l-0 min-[460px]:border-t">
              <Body tone="muted">{r.how}</Body>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col bg-gray-8 border border-gray-20 p-7 gap-2.5">
        <Display as="h2" size="xs">
          Stateless by design
        </Display>
        <Body tone="muted" className="max-w-[680px]">
          No message history, no call history, no connection history. Every session starts completely
          fresh — the server holds no data about you once your session ends.
        </Body>
      </div>
    </PageShell>
  );
}
