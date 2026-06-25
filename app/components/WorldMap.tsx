"use client";

import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Map as MapboxMap, Marker } from "mapbox-gl";
import type { PeerDot } from "@/lib/types";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "pk.eyJ1IjoicHVsc2UtbWFwIiwiYSI6ImNrMDBkZW1vMDAwMDAwMDAifQ.AAAAAAAAAAAAAAAAAAAAAA";

const LAND_COLOR = "#0b0c0e";
const WATER_COLOR = "#040406";

// Flatten the basemap to a clean two-tone silhouette: recolor land/water,
// strip every administrative line, and hide all place labels so the first
// view is an uncluttered globe rather than a wall of city/country names.
function simplifyBasemap(map: MapboxMap) {
  const layers = map.getStyle()?.layers ?? [];
  const isWater = (id: string) => /water|river|waterway|ocean|sea/i.test(id);
  for (const layer of layers) {
    const id = layer.id;
    try {
      if (layer.type === "background") {
        map.setPaintProperty(id, "background-color", LAND_COLOR);
      } else if (layer.type === "fill") {
        map.setPaintProperty(
          id,
          "fill-color",
          isWater(id) ? WATER_COLOR : LAND_COLOR,
        );
      } else if (layer.type === "line") {
        // Strip every line — roads, admin (country/state) borders, boundaries —
        // leaving only water lines so the coastline silhouette survives.
        if (isWater(id)) {
          map.setPaintProperty(id, "line-color", WATER_COLOR);
        } else {
          map.setLayoutProperty(id, "visibility", "none");
        }
      } else if (layer.type === "symbol") {
        // Symbol layers carry all the text labels. Keep only country names so
        // the globe reads as a clean silhouette — hide settlements, roads, POIs.
        if (!/country/i.test(id)) {
          map.setLayoutProperty(id, "visibility", "none");
        }
      }
    } catch {
      // Layer doesn't support the property — skip it.
    }
  }
}

function dotColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return `hsl(${Math.abs(hash) % 360}, 70%, 60%)`;
}

export default function WorldMap({
  peers,
  me,
  onPeerClick,
  canConnect,
}: {
  peers: PeerDot[];
  me: { lat: number; lng: number } | null;
  onPeerClick: (id: string) => void;
  canConnect: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const meMarkerRef = useRef<Marker | null>(null);
  const [ready, setReady] = useState(false);

  // Marker click handlers are bound once, so read the live click handler +
  // connectability through refs (synced in an effect, never during render).
  const onPeerClickRef = useRef(onPeerClick);
  const canConnectRef = useRef(canConnect);
  useEffect(() => {
    onPeerClickRef.current = onPeerClick;
    canConnectRef.current = canConnect;
  });

  // Initialise the map once.
  useEffect(() => {
    if (!TOKEN || !containerRef.current) return;
    let cancelled = false;
    const markers = markersRef.current;

    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      if (cancelled || !containerRef.current) return;
      mapboxgl.accessToken = TOKEN;
      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/dark-v11",
        // Open centered on the user if we know where they are, else world view.
        center: me ? [me.lng, me.lat] : [0, 20],
        zoom: me ? 4 : 1.4,
        attributionControl: true,
      });
      map.on("load", () => {
        if (cancelled) return;
        simplifyBasemap(map);
        setReady(true);
      });
      mapRef.current = map;
    })();

    return () => {
      cancelled = true;
      markers.forEach((m) => m.remove());
      markers.clear();
      meMarkerRef.current?.remove();
      meMarkerRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
      setReady(false);
    };
    // `me` is only read for the initial center; we don't want to re-init on change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show / move the user's own "you are here" pin.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || !me) return;
    let cancelled = false;

    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      if (cancelled) return;
      if (!meMarkerRef.current) {
        const el = document.createElement("div");
        el.className = "pulse-me";
        el.title = "You are here";
        el.innerHTML = `<span class="pulse-me-label">Me</span>📍`;
        // anchor "bottom" → the pin's tip sits on the exact coordinate.
        meMarkerRef.current = new mapboxgl.Marker({ element: el, anchor: "bottom" })
          .setLngLat([me.lng, me.lat])
          .addTo(map);
      } else {
        meMarkerRef.current.setLngLat([me.lng, me.lat]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [me, ready]);

  // Reconcile markers whenever the peer list changes (or the map becomes ready).
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;
    let cancelled = false;

    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      if (cancelled) return;
      const markers = markersRef.current;
      const seen = new Set<string>();

      for (const peer of peers) {
        seen.add(peer.id);
        let marker = markers.get(peer.id);
        if (!marker) {
          const el = document.createElement("button");
          el.className = "pulse-dot";
          el.style.background = dotColor(peer.id);
          el.title = "Tap to connect";
          el.addEventListener("click", (e) => {
            e.stopPropagation();
            if (canConnectRef.current) onPeerClickRef.current(peer.id);
          });
          marker = new mapboxgl.Marker({ element: el })
            .setLngLat([peer.lng, peer.lat])
            .addTo(map);
          markers.set(peer.id, marker);
        }
        marker.getElement().style.opacity = peer.busy ? "0.35" : "1";
      }

      // Drop markers for peers that went offline / got filtered out.
      for (const [id, marker] of markers) {
        if (!seen.has(id)) {
          marker.remove();
          markers.delete(id);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [peers, ready]);

  return (
    <div className="absolute inset-0">
      {/* Mapbox GL owns this node imperatively — must stay a raw <div>. */}
      <div ref={containerRef} className="h-full w-full bg-background" />

      {!TOKEN && (
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <p className="max-w-[448px] rounded-none border border-gray-20 bg-gray-8 p-4 font-sans text-sm leading-5 text-gray-90 text-center">
            Set <code className="font-mono text-yellow">NEXT_PUBLIC_MAPBOX_TOKEN</code> in{" "}
            <code className="font-mono text-gray-90">.env</code> to load the map.
          </p>
        </div>
      )}

      {/* Online count */}
      <div
        className="absolute bottom-4 left-4 flex flex-col border border-gray-20 bg-gray-8 px-3 py-1.5"
        style={{ backdropFilter: "blur(8px)" }}
      >
        <span className="font-mono text-xs leading-4 text-gray-80">
          {peers.length} online
        </span>
      </div>
    </div>
  );
}
