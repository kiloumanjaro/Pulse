import { cn } from "@/lib/utils";
import { Body, Display, Eyebrow } from "../components/ui";
import PageShell from "../components/PageShell";

const PREMISE = [
  {
    k: "01",
    t: "Anonymous by default",
    d: "No sign-up, no login, no profiles. On the map you are a dot and nothing more.",
  },
  {
    k: "02",
    t: "Ephemeral by design",
    d: "Closing the tab ends the session. Everything about you disappears — there is no history to delete.",
  },
  {
    k: "03",
    t: "Location-aware, not location-exact",
    d: "Your dot lands 1–3 km from your real position, randomized fresh every session.",
  },
  {
    k: "04",
    t: "Peer-to-peer",
    d: "Chat messages and video never pass through the server — only the connection handshake does.",
  },
];

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="About Pulse"
      title="A living globe of anonymous strangers."
      intro="Pulse is an anonymous, real-time connection app. Every online user appears as a dot on a world map. Tap a dot, get connected for text chat or a video call — no accounts, no history, nothing stored."
    >
      <div className="flex flex-col border border-gray-20">
        {PREMISE.map((p, i) => (
          <div
            key={p.k}
            className={cn(
              "flex flex-row p-6 gap-5 border-gray-20 min-[460px]:flex-col min-[460px]:gap-2",
              i !== 0 && "border-t",
            )}
          >
            <Eyebrow className="mt-[3px] min-w-7">{p.k}</Eyebrow>
            <div className="flex flex-col gap-1.5 flex-1">
              <Display as="h2" size="xs">
                {p.t}
              </Display>
              <Body tone="muted" className="max-w-[620px]">
                {p.d}
              </Body>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
