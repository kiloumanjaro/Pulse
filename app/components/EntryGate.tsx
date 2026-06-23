"use client";

import { useState } from "react";
import Radar from "./Radar";

export default function EntryGate({
  onReady,
}: {
  onReady: (lat: number, lng: number) => void;
}) {
  const [status, setStatus] = useState<"idle" | "locating" | "error">("idle");
  const [error, setError] = useState<string>("");

  function enter() {
    if (!("geolocation" in navigator)) {
      setStatus("error");
      setError("Your browser doesn't support location access.");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => onReady(pos.coords.latitude, pos.coords.longitude),
      (err) => {
        setStatus("error");
        setError(
          err.code === err.PERMISSION_DENIED
            ? "Location permission is required to place you on the map."
            : "Couldn't get your location. Please try again.",
        );
      },
      // High accuracy + maximumAge:0 forces a fresh fix (Wi-Fi/GPS scan)
      // instead of reusing the browser's cached IP-based location.
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 0 },
    );
  }

  return (
    <div className="relative flex h-screen flex-col items-center justify-center gap-8 p-6 text-zinc-100">
      <div className="absolute inset-0">
        <Radar
          speed={0.7}
          scale={0.60}
          ringCount={8}
          spokeCount={10}
          ringThickness={0.02}
          spokeThickness={0.005}
          sweepSpeed={0.7}
          sweepWidth={2}
          sweepLobes={1}
          color="#00d492"
          backgroundColor="#000000"
          falloff={3}
          brightness={0.4}
          enableMouseInteraction={false}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Pulse</h1>
          <p className="mt-2 max-w-sm text-zinc-400">
            A living globe of anonymous strangers. Drop onto the map and connect.
          </p>
        </div>

        <button
          onClick={enter}
          disabled={status === "locating"}
          className="rounded-full bg-emerald-400 px-8 py-3 font-semibold text-zinc-950 transition hover:bg-emerald-300 disabled:opacity-60"
        >
          {status === "locating" ? "Locating…" : "Enter Pulse"}
        </button>

        {status === "error" && (
          <p className="max-w-sm text-center text-sm text-red-400">{error}</p>
        )}

        <p className="max-w-sm text-center text-xs text-zinc-500">
          No sign-up. Your dot is placed 1–3&nbsp;km from your real location.
          Nothing is stored — closing the tab ends everything.
        </p>
      </div>
    </div>
  );
}
