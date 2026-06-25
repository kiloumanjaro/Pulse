"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ShieldTick } from "iconsax-reactjs";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Map as MapboxMap, Marker } from "mapbox-gl";
import type { PeerDot } from "@/lib/types";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "pk.eyJ1IjoicHVsc2UtbWFwIiwiYSI6ImNrMDBkZW1vMDAwMDAwMDAifQ.AAAAAAAAAAAAAAAAAAAAAA";

const LAND_COLOR = "#131313";
const WATER_COLOR = "#030303";
const GRATICULE_COLOR = "#2c2c2e";
const GRATICULE_STEP = 15; // degrees between grid lines

// Build the globe's graticule as GeoJSON: meridians run pole-to-pole (every
// GRATICULE_STEP° of longitude), parallels ring the globe (every step° of
// latitude). Densely sampled so each line curves smoothly under projection.
function graticule(): GeoJSON.FeatureCollection {
  const features: GeoJSON.Feature[] = [];

  for (let lng = -180; lng <= 180; lng += GRATICULE_STEP) {
    const coords: [number, number][] = [];
    for (let lat = -90; lat <= 90; lat += 2) coords.push([lng, lat]);
    features.push({
      type: "Feature",
      properties: {},
      geometry: { type: "LineString", coordinates: coords },
    });
  }

  for (let lat = -75; lat <= 75; lat += GRATICULE_STEP) {
    const coords: [number, number][] = [];
    for (let lng = -180; lng <= 180; lng += 2) coords.push([lng, lat]);
    features.push({
      type: "Feature",
      properties: {},
      geometry: { type: "LineString", coordinates: coords },
    });
  }

  return { type: "FeatureCollection", features };
}

function addGraticule(map: MapboxMap) {
  if (map.getLayer("graticule")) return;
  map.addSource("graticule", { type: "geojson", data: graticule() });
  map.addLayer({
    id: "graticule",
    type: "line",
    source: "graticule",
    paint: {
      "line-color": GRATICULE_COLOR,
      "line-width": 0.5,
      "line-opacity": 0.8,
    },
  });
}

// Overlay one simplified, solid land polygon per landmass (Natural Earth 50m).
// Because the basemap underneath is flooded to pure ocean, this single fill is
// the only land the user sees — so continents read as solid blocks with no
// inland lakes, rivers, or fragmented coastline cracks, even zoomed in.
function addLandOverlay(map: MapboxMap) {
  if (map.getLayer("land-simple")) return;
  map.addSource("land-simple", {
    type: "geojson",
    data: "/land-50m.geojson",
  });
  map.addLayer({
    id: "land-simple",
    type: "fill",
    source: "land-simple",
    paint: { "fill-color": LAND_COLOR },
  });
}

// Flood the entire basemap to pure ocean: recolor every land/water fill to the
// water tone and strip all lines and labels. The simplified land overlay (added
// separately) then supplies the only landmasses on top of this blank ocean.
function simplifyBasemap(map: MapboxMap) {
  const layers = map.getStyle()?.layers ?? [];
  for (const layer of layers) {
    const id = layer.id;
    try {
      if (layer.type === "background") {
        map.setPaintProperty(id, "background-color", WATER_COLOR);
      } else if (layer.type === "fill") {
        map.setPaintProperty(id, "fill-color", WATER_COLOR);
      } else if (layer.type === "line" || layer.type === "symbol") {
        // Strip every line (roads, borders, coastlines) and every text label —
        // the simplified land overlay defines all the geometry we want.
        map.setLayoutProperty(id, "visibility", "none");
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
  onView,
}: {
  peers: PeerDot[];
  me: { lat: number; lng: number } | null;
  onPeerClick: (id: string) => void;
  canConnect: boolean;
  onView?: (g: { x: number; y: number; radius: number }) => void;
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
  const onViewRef = useRef(onView);
  useEffect(() => {
    onPeerClickRef.current = onPeerClick;
    canConnectRef.current = canConnect;
    onViewRef.current = onView;
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
        addLandOverlay(map);
        addGraticule(map);
        // Make the space + atmosphere around the globe transparent so the
        // layer behind the canvas (KineticGrid) shows through, without
        // touching the globe's land/water surface.
        map.setFog({
          color: "rgba(0, 0, 0, 0)",
          "high-color": "rgba(0, 0, 0, 0)",
          "space-color": "rgba(0, 0, 0, 0)",
          "horizon-blend": 0,
          "star-intensity": 0,
        });
        setReady(true);
      });

      // Report the globe's on-screen center + apparent radius so a backdrop
      // (KineticGrid) can render a glow sized to it. In globe projection the
      // sphere stays centered in the viewport; its pixel radius tracks zoom:
      // worldSize (512·2^zoom) / 2π.
      const reportView = () => {
        const cb = onViewRef.current;
        if (!cb) return;
        const el = map.getContainer();
        cb({
          x: el.clientWidth / 2,
          y: el.clientHeight / 2,
          radius: (512 * Math.pow(2, map.getZoom())) / (2 * Math.PI),
        });
      };
      map.on("move", reportView);
      map.on("zoom", reportView);
      map.on("resize", reportView);
      map.on("load", reportView);

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

  // Once the globe finishes loading, surface the privacy disclaimer as a toast.
  // The fixed `id` dedupes React's double-invoke in dev so it only shows once.
  useEffect(() => {
    if (!ready) return;
    toast.custom(
      () => (
        <div
          className="flex items-center gap-3 rounded-lg border text-popover-foreground shadow-lg px-4 py-3"
          style={{ maxWidth: 340, backgroundColor: "#171717", borderColor: "#2e2e2e" }}
        >
          <ShieldTick
            size={40}
            variant="Bulk"
            color="currentColor"
            className="shrink-0 text-muted-foreground"
          />
          <p className="text-xs leading-snug text-muted-foreground">
            Your dot is placed 1–3 km from your real location. Nothing is stored —
            closing the tab ends everything.
          </p>
        </div>
      ),
      { id: "privacy-disclaimer", duration: 10000 },
    );
  }, [ready]);

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
      <div ref={containerRef} className="h-full w-full" />

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
