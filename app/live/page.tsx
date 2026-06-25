"use client";

import { useEffect, useRef, useState } from "react";
import { Body, Button } from "../components/ds";
import PulseMark from "../components/PulseMark";
import WorldMap from "../components/WorldMap";
import KineticGrid, { type GlowSource } from "../components/KineticGrid";
import { type ChatMessage } from "../components/ChatPanel";
import { ControlPanel } from "../components/control-panel";
import type {
  ConnectionRequest,
  ControlPanelState,
  ControlPanelTab,
  SettingsValues,
} from "../components/control-panel/types";
import { join, leave, poll, sendSignal } from "@/lib/api";
import { PeerSession, type DescType, type PeerControl } from "@/lib/webrtc";
import { POLL_INTERVAL_MS } from "@/lib/presence";
import { type PeerDot, type SignalMsg } from "@/lib/types";
import { haversineKm } from "@/lib/geo";
import { useBrandColor } from "@/lib/useBrandColor";

type Conn =
  | { kind: "idle" }
  | { kind: "requesting"; peerId: string }
  | { kind: "incoming"; peerId: string }
  | { kind: "connecting"; peerId: string }
  | { kind: "connected"; peerId: string };

type VideoState = "none" | "requesting" | "incoming" | "active";

type Geo = "locating" | "error" | "live";

const REQUEST_TIMEOUT_MS = 30_000;

// The Settings tab is hidden in the live panel (no device backend yet); the
// panel state still needs a settings object to satisfy the type.
const STUB_SETTINGS: SettingsValues = {
  cameraId: "",
  micId: "",
  speakerId: "",
  soundOnRequest: true,
  allowVideo: true,
  appearOnMap: true,
};

const peerHandle = (id: string) => `Stranger-${id.slice(-3).toUpperCase()}`;

export default function Live() {
  const [geo, setGeo] = useState<Geo>("locating");
  const [geoError, setGeoError] = useState("");
  const [sessionId] = useState(() => crypto.randomUUID());
  const [peers, setPeers] = useState<PeerDot[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [myLocation, setMyLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  // Brand accent for the canvas grid glow — tracks the `--color-brand` token.
  const brandColor = useBrandColor();

  // Control-panel UI state. The panel is the single live surface: a persistent
  // rail with a flyout that opens to the relevant tab as the session changes.
  const [activeTab, setActiveTab] = useState<ControlPanelTab>("people");
  const [collapsed, setCollapsed] = useState(true);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);

  // Open the flyout to where attention is needed. The conn/video setters are the
  // single choke point every transition (user- or peer-initiated) flows through,
  // so the tab surfacing lives here rather than in a state-watching effect.
  const surface = (tab: ControlPanelTab) => {
    setActiveTab(tab);
    setCollapsed(false);
  };

  const [conn, _setConn] = useState<Conn>({ kind: "idle" });
  const connRef = useRef<Conn>(conn);
  const setConn = (c: Conn) => {
    connRef.current = c;
    _setConn(c);
    // A call owns the flyout while it's up. Otherwise the pre-connection
    // handshake lives in the Requests tab; chat surfaces once the call is up.
    if (videoRef.current === "none") {
      if (c.kind === "requesting" || c.kind === "incoming") surface("requests");
      else if (c.kind === "connecting" || c.kind === "connected") surface("chat");
    }
  };

  const [video, _setVideo] = useState<VideoState>("none");
  const videoRef = useRef<VideoState>(video);
  const setVideo = (v: VideoState) => {
    videoRef.current = v;
    _setVideo(v);
    if (v !== "none") surface("call");
    else if (connRef.current.kind !== "idle") setActiveTab("chat");
  };

  const peerRef = useRef<PeerSession | null>(null);
  const msgId = useRef(0);
  // Globe geometry reported by WorldMap, read by KineticGrid to glow behind it.
  const glowRef = useRef<GlowSource | null>(null);
  const requestTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showNotice(text: string) {
    setNotice(text);
    window.setTimeout(() => setNotice(null), 3500);
  }

  function addMessage(mine: boolean, text: string) {
    setMessages((prev) => [...prev, { id: msgId.current++, mine, text }]);
  }

  function resetVideo() {
    setLocalStream(null);
    setRemoteStream(null);
    setVideo("none");
    setMuted(false);
    setCameraOff(false);
  }

  function teardown(message?: string) {
    if (requestTimer.current) clearTimeout(requestTimer.current);
    peerRef.current?.close();
    peerRef.current = null;
    resetVideo();
    setMessages([]);
    setConn({ kind: "idle" });
    if (message) showNotice(message);
  }

  function startPeer(peerId: string, initiator: boolean) {
    const ps = new PeerSession(initiator, {
      onSignal: (type: DescType, payload: string) => {
        void sendSignal(sessionId, peerId, type, payload);
      },
      onChat: (text) => addMessage(false, text),
      onControl: (ctrl) => handleControl(ctrl),
      onRemoteStream: (stream) => setRemoteStream(stream),
      onConnectionState: (state) => {
        // "failed" is terminal, so tear down. "disconnected" is usually a
        // transient ICE blip that recovers on its own, and "closed" is our own
        // teardown firing back through here — neither should reset the session.
        // This is the hook point if reconnection logic is added later.
        if (state === "failed") {
          teardown("Connection failed (network).");
        }
      },
      onChannelOpen: () => {
        setConn({ kind: "connected", peerId });
      },
    });
    peerRef.current = ps;
  }

  function handleControl(ctrl: PeerControl) {
    const ps = peerRef.current;
    switch (ctrl) {
      case "video-request":
        if (videoRef.current === "none") setVideo("incoming");
        break;
      case "video-accept":
        if (videoRef.current === "requesting" && ps) {
          ps.startVideo()
            .then((stream) => {
              setLocalStream(stream);
              setVideo("active");
            })
            .catch(() => {
              setVideo("none");
              ps.sendControl("video-end");
              showNotice("Camera unavailable.");
            });
        }
        break;
      case "video-decline":
        if (videoRef.current === "requesting") {
          setVideo("none");
          showNotice("Video declined.");
        }
        break;
      case "video-end":
        ps?.stopVideo();
        resetVideo();
        break;
    }
  }

  function requestConnection(peerId: string) {
    if (connRef.current.kind !== "idle") return;
    setConn({ kind: "requesting", peerId });
    void sendSignal(sessionId, peerId, "request");
    requestTimer.current = setTimeout(() => {
      if (
        connRef.current.kind === "requesting" &&
        connRef.current.peerId === peerId
      ) {
        void sendSignal(sessionId, peerId, "end");
        teardown("No answer.");
      }
    }, REQUEST_TIMEOUT_MS);
  }

  function cancelRequest() {
    if (connRef.current.kind === "requesting") {
      void sendSignal(sessionId, connRef.current.peerId, "end");
    }
    teardown();
  }

  function acceptIncoming() {
    if (connRef.current.kind !== "incoming") return;
    const peerId = connRef.current.peerId;
    startPeer(peerId, false);
    void sendSignal(sessionId, peerId, "accept");
    setConn({ kind: "connecting", peerId });
  }

  function declineIncoming() {
    if (connRef.current.kind !== "incoming") return;
    void sendSignal(sessionId, connRef.current.peerId, "decline");
    setConn({ kind: "idle" });
  }

  function endConnection() {
    const c = connRef.current;
    if (c.kind === "connecting" || c.kind === "connected") {
      void sendSignal(sessionId, c.peerId, "end");
    }
    teardown();
  }

  function startVideoRequest() {
    if (videoRef.current !== "none" || !peerRef.current) return;
    setVideo("requesting");
    peerRef.current.sendControl("video-request");
  }

  function acceptVideo() {
    const ps = peerRef.current;
    if (!ps) return;
    ps.startVideo()
      .then((stream) => {
        setLocalStream(stream);
        ps.sendControl("video-accept");
        setVideo("active");
      })
      .catch(() => {
        ps.sendControl("video-decline");
        setVideo("none");
        showNotice("Camera unavailable.");
      });
  }

  function declineVideo() {
    peerRef.current?.sendControl("video-decline");
    setVideo("none");
  }

  function endVideo() {
    const ps = peerRef.current;
    ps?.stopVideo();
    ps?.sendControl("video-end");
    resetVideo();
  }

  function processSignal(sig: SignalMsg) {
    switch (sig.type) {
      case "request": {
        if (connRef.current.kind === "idle") {
          setConn({ kind: "incoming", peerId: sig.fromId });
        } else {
          void sendSignal(sessionId, sig.fromId, "decline");
        }
        break;
      }
      case "accept": {
        const c = connRef.current;
        if (c.kind === "requesting" && c.peerId === sig.fromId) {
          if (requestTimer.current) clearTimeout(requestTimer.current);
          startPeer(sig.fromId, true);
          setConn({ kind: "connecting", peerId: sig.fromId });
        }
        break;
      }
      case "decline": {
        const c = connRef.current;
        if (c.kind === "requesting" && c.peerId === sig.fromId) {
          if (requestTimer.current) clearTimeout(requestTimer.current);
          teardown("Request declined.");
        }
        break;
      }
      case "offer":
      case "answer":
      case "ice": {
        const c = connRef.current;
        const peerId =
          c.kind === "connecting" || c.kind === "connected" ? c.peerId : null;
        if (peerRef.current && peerId === sig.fromId) {
          void peerRef.current.handleSignal(
            sig.type as DescType,
            sig.payload ?? "",
          );
        }
        break;
      }
      case "end": {
        const c = connRef.current;
        if (
          (c.kind === "incoming" ||
            c.kind === "connecting" ||
            c.kind === "connected") &&
          c.peerId === sig.fromId
        ) {
          if (c.kind === "incoming") setConn({ kind: "idle" });
          else teardown("Stranger disconnected.");
        }
        break;
      }
    }
  }

  const processSignalRef = useRef(processSignal);
  useEffect(() => {
    processSignalRef.current = processSignal;
  });

  // Acquire a fresh location on mount, then join the live map. The landing page
  // (/) is pure marketing and never prompts for permission — that happens here.
  useEffect(() => {
    let active = true;
    if (!("geolocation" in navigator)) {
      // Defer to a microtask so this isn't a synchronous setState in the effect
      // body (which would otherwise trigger a cascading render).
      queueMicrotask(() => {
        if (!active) return;
        setGeo("error");
        setGeoError("Your browser doesn't support location access.");
      });
      return () => {
        active = false;
      };
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        if (!active) return;
        const { latitude, longitude } = pos.coords;
        setMyLocation({ lat: latitude, lng: longitude });
        try {
          await join(sessionId, latitude, longitude);
        } catch {}
        if (active) setGeo("live");
      },
      (err) => {
        if (!active) return;
        setGeo("error");
        setGeoError(
          err.code === err.PERMISSION_DENIED
            ? "Location permission is required to place you on the map."
            : "Couldn't get your location. Please try again.",
        );
      },
      // High accuracy + maximumAge:0 forces a fresh fix (Wi-Fi/GPS scan)
      // instead of reusing the browser's cached IP-based location.
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 0 },
    );
    return () => {
      active = false;
    };
  }, [sessionId]);

  useEffect(() => {
    if (geo !== "live") return;
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const tick = async () => {
      try {
        const data = await poll(sessionId);
        if (!active) return;
        setPeers(data.peers);
        for (const s of data.signals) processSignalRef.current(s);
      } catch {}
      if (active) timer = setTimeout(tick, POLL_INTERVAL_MS);
    };
    tick();

    return () => {
      active = false;
      if (timer) clearTimeout(timer);
    };
  }, [geo, sessionId]);

  useEffect(() => {
    if (geo !== "live") return;
    const onLeave = () => leave(sessionId);
    window.addEventListener("pagehide", onLeave);
    window.addEventListener("beforeunload", onLeave);
    return () => {
      window.removeEventListener("pagehide", onLeave);
      window.removeEventListener("beforeunload", onLeave);
    };
  }, [sessionId, geo]);

  if (geo === "locating") {
    return (
      <div className="relative flex flex-col flex-1 h-screen items-center justify-center gap-4 bg-background">
        <div className="flex size-20 items-center justify-center rounded-2xl bg-brand">
          <PulseMark className="h-9 w-auto text-background" />
        </div>
        <Body size="sm" tone="muted">
          Finding your location…
        </Body>
        <Body
          size="sm"
          tone="muted"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 max-w-[420px] px-6 text-center opacity-60"
        >
          A living globe of anonymous strangers. Nothing stored, gone the
          moment you leave.
        </Body>
      </div>
    );
  }

  if (geo === "error") {
    return (
      <div className="flex flex-col flex-1 h-screen items-center justify-center gap-4 px-6 bg-background">
        <Body size="md" className="text-danger max-w-[360px] text-center">
          {geoError}
        </Body>
        <Button variant="outline" size="md" href="/">
          Back to home
        </Button>
      </div>
    );
  }

  const toggleMute = () => {
    const next = !muted;
    localStream?.getAudioTracks().forEach((t) => (t.enabled = !next));
    setMuted(next);
  };

  const toggleCamera = () => {
    const next = !cameraOff;
    localStream?.getVideoTracks().forEach((t) => (t.enabled = !next));
    setCameraOff(next);
  };

  // The assistant has no backend yet — echo a fixed reply so the UI is alive.
  const sendAi = (text: string) => {
    setAiMessages((prev) => [
      ...prev,
      { id: msgId.current++, mine: true, text },
      {
        id: msgId.current++,
        mine: false,
        text: "This is a stubbed reply — the assistant is UI-only for now.",
      },
    ]);
  };

  const panelState: ControlPanelState = {
    activeTab,
    conn: conn.kind,
    video,
    messages,
    aiMessages,
    people: peers.map((p) => ({
      id: p.id,
      handle: peerHandle(p.id),
      distanceKm: myLocation
        ? Math.max(1, Math.round(haversineKm(myLocation, p)))
        : 0,
      busy: p.busy,
    })),
    // The single `conn` machine renders as a one-entry request queue: an
    // outgoing request while we wait, an incoming one awaiting our answer.
    requests:
      conn.kind === "incoming" || conn.kind === "requesting"
        ? [
            {
              id: conn.peerId,
              handle: peerHandle(conn.peerId),
              direction: conn.kind === "incoming" ? "incoming" : "outgoing",
              distanceKm: (() => {
                const p = peers.find((x) => x.id === conn.peerId);
                return p && myLocation
                  ? Math.max(1, Math.round(haversineKm(myLocation, p)))
                  : 0;
              })(),
            } satisfies ConnectionRequest,
          ]
        : [],
    settings: STUB_SETTINGS,
  };

  return (
    <main className="fixed inset-0 overflow-hidden bg-background">
      <KineticGrid
        hoverColor={brandColor}
        glowSourceRef={glowRef}
        glowStrength={2.2}
        glowFalloff={4}
        glowRadiusScale={2.5}
        glowWarp
        glowWarpStrength={3.5}
      />

      <WorldMap
        peers={peers}
        me={myLocation}
        onPeerClick={requestConnection}
        canConnect={conn.kind === "idle"}
        onView={(g) => {
          glowRef.current = g;
        }}
        connection={
          conn.kind === "idle"
            ? null
            : { peerId: conn.peerId, connected: conn.kind === "connected" }
        }
      />

      {notice && (
        <div
          className="absolute left-1/2 top-20 z-30 flex flex-col border border-gray-20 bg-gray-8 px-4 py-2"
          style={{ transform: "translateX(-50%)", backdropFilter: "blur(8px)" }}
        >
          <Body size="sm" className="text-foreground">
            {notice}
          </Body>
        </div>
      )}

      <ControlPanel
        state={panelState}
        tabs={["ai-chat", "people", "requests", "chat", "call"]}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        localStream={localStream}
        remoteStream={remoteStream}
        muted={muted}
        cameraOff={cameraOff}
        onTabChange={setActiveTab}
        onSend={(text) => {
          peerRef.current?.sendChat(text);
          addMessage(true, text);
        }}
        onAiSend={sendAi}
        onConnectPeer={requestConnection}
        onAcceptConnect={acceptIncoming}
        onDeclineConnect={declineIncoming}
        onCancelConnect={cancelRequest}
        onStartVideo={startVideoRequest}
        onEndChat={endConnection}
        onAcceptVideo={acceptVideo}
        onDeclineVideo={declineVideo}
        onCancelVideo={endVideo}
        onEndCall={endVideo}
        onToggleMute={toggleMute}
        onToggleCamera={toggleCamera}
      />
    </main>
  );
}
