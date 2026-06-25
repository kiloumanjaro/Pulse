"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ShieldTick } from "iconsax-reactjs";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Map as MapboxMap, Marker, GeoJSONSource } from "mapbox-gl";
import type { PeerDot } from "@/lib/types";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const LAND_COLOR = "#131313";
const WATER_COLOR = "#030303";
const GRATICULE_COLOR = "#2c2c2e";
const GRATICULE_STEP = 15; // degrees between grid lines
const LINK_COLOR = "#17181d"; // connection line (dashed pending → solid connected)

// Densely sample the great-circle arc between two lng/lat points so the
// connection line curves along the globe surface instead of cutting a straight
// chord through it. Endpoints are slerped as 3D unit vectors and reprojected.
function greatCircle(
  a: [number, number],
  b: [number, number],
  steps = 64,
): [number, number][] {
  const d = Math.PI / 180;
  const [lng1, lat1, lng2, lat2] = [a[0] * d, a[1] * d, b[0] * d, b[1] * d];
  const v1 = [
    Math.cos(lat1) * Math.cos(lng1),
    Math.cos(lat1) * Math.sin(lng1),
    Math.sin(lat1),
  ];
  const v2 = [
    Math.cos(lat2) * Math.cos(lng2),
    Math.cos(lat2) * Math.sin(lng2),
    Math.sin(lat2),
  ];
  const dot = Math.min(1, Math.max(-1, v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2]));
  const omega = Math.acos(dot);
  if (omega < 1e-6) return [a, b];
  const sin = Math.sin(omega);
  const out: [number, number][] = [];
  let prevLng = a[0];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const s1 = Math.sin((1 - t) * omega) / sin;
    const s2 = Math.sin(t * omega) / sin;
    const x = s1 * v1[0] + s2 * v2[0];
    const y = s1 * v1[1] + s2 * v2[1];
    const z = s1 * v1[2] + s2 * v2[2];
    // Unwrap across the antimeridian: keep each step within 180° of the last so
    // Mapbox doesn't bridge a +179°→-179° jump by sweeping around the globe.
    let lng = Math.atan2(y, x) / d;
    while (lng - prevLng > 180) lng -= 360;
    while (lng - prevLng < -180) lng += 360;
    prevLng = lng;
    out.push([lng, Math.atan2(z, Math.sqrt(x * x + y * y)) / d]);
  }
  return out;
}

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

export default function WorldMap({
  peers,
  me,
  onPeerClick,
  canConnect,
  onView,
  connection,
}: {
  peers: PeerDot[];
  me: { lat: number; lng: number } | null;
  onPeerClick: (id: string) => void;
  canConnect: boolean;
  onView?: (g: { x: number; y: number; radius: number }) => void;
  // Active connection to draw a line to: dashed while pending, solid once connected.
  connection?: { peerId: string; connected: boolean } | null;
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
        attributionControl: false,
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
        el.innerHTML = `<span class="pulse-me-label">you are here</span>`;
        // Center anchor (like peer dots) sits the dot on the exact coordinate.
        // pitch/rotation "map" lays it tangent to the globe surface so it tilts
        // with the sphere instead of billboarding flat at the camera.
        meMarkerRef.current = new mapboxgl.Marker({
          element: el,
          pitchAlignment: "map",
          rotationAlignment: "map",
        })
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
          el.title = "Tap to connect";
          el.addEventListener("click", (e) => {
            e.stopPropagation();
            if (canConnectRef.current) onPeerClickRef.current(peer.id);
          });
          // pitch/rotation "map" sticks the dot to the globe surface like a
          // decal — it foreshortens toward the limb instead of facing the camera.
          marker = new mapboxgl.Marker({
            element: el,
            pitchAlignment: "map",
            rotationAlignment: "map",
          })
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

  // Draw the arc from "me" to the peer we're connecting with: a broken line
  // while the connection is pending, snapping to a solid line once connected.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready) return;

    const SRC = "connection-link";
    const peer = connection
      ? peers.find((p) => p.id === connection.peerId)
      : undefined;

    // No active connection (or an endpoint we can't place) → tear the line down.
    if (!connection || !me || !peer) {
      if (map.getLayer(SRC)) map.removeLayer(SRC);
      if (map.getSource(SRC)) map.removeSource(SRC);
      return;
    }

    const data: GeoJSON.Feature = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: greatCircle([me.lng, me.lat], [peer.lng, peer.lat]),
      },
    };

    if (!map.getSource(SRC)) {
      map.addSource(SRC, { type: "geojson", data });
      map.addLayer({
        id: SRC,
        type: "line",
        source: SRC,
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": LINK_COLOR, "line-width": 2 },
      });
    } else {
      (map.getSource(SRC) as GeoJSONSource).setData(data);
    }

    // [1, 0] = continuous solid; [2, 2] = dash/gap (broken) in line-width units.
    map.setPaintProperty(
      SRC,
      "line-dasharray",
      connection.connected ? [1, 0] : [2, 2],
    );
  }, [connection, peers, me, ready]);

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
        className="absolute top-4 right-4 flex flex-col border border-gray-20 bg-gray-8 px-3 py-1.5"
        style={{ backdropFilter: "blur(8px)" }}
      >
        <span className="font-mono text-xs leading-4 text-gray-80">
          {peers.length} online
        </span>
      </div>
    </div>
  );
}
