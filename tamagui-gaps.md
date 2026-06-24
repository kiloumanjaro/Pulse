# Tamagui Migration Gaps

Components that could not be migrated to Tamagui due to no direct equivalent and no feasible workaround.

| Component File | Element/Pattern | Reason No Migration Was Possible | Suggested Manual Fix |
|----------------|-----------------|----------------------------------|----------------------|
| app/components/Radar.tsx | `<canvas>` (WebGL via OGL) appended through `container.appendChild(canvas)` | Tamagui has no canvas/WebGL primitive. OGL's `Renderer` produces a raw `HTMLCanvasElement` that is imperatively appended to a DOM node and driven by a `requestAnimationFrame` shader loop; none of this maps to a Tamagui component. The component is left fully untouched. | Keep the `<canvas>` and OGL render loop as-is. If desired, only the outer wrapper `<div className="radar-container">` could become `<YStack>`, but the canvas itself must remain a raw element OGL controls. |
| app/components/WorldMap.tsx | Mapbox GL map container `<div ref={containerRef}>` | Mapbox GL takes ownership of this DOM node (`new mapboxgl.Map({ container })`) and mutates it imperatively. It must be a stable raw element, not a React-rendered Tamagui component that Tamagui may re-render or wrap. | Keep the container as a raw `<div>` (done). The surrounding overlays were migrated to `<YStack>`/`<Text>`. |
| app/components/WorldMap.tsx | Imperative markers built with `document.createElement("button" \| "div")` passed to `mapboxgl.Marker({ element })` | Mapbox's `Marker` API accepts only a raw `HTMLElement`; a Tamagui React component cannot be handed to it. This is imperative DOM in a `useEffect`, not JSX markup, so it is out of the JSX-only migration scope. | Keep `document.createElement`. To use Tamagui for marker contents, adopt a portal-based marker pattern (render a Tamagui tree into the marker element with `createRoot`/`createPortal`). |
| app/components/VideoPanel.tsx | `<video>` (×2: remote full-screen + local PiP) | Tamagui has no media/`<video>` primitive. Each element needs a raw `HTMLVideoElement` ref so the WebRTC `MediaStream` can be assigned to `.srcObject`. | Keep the two `<video>` elements as raw HTML (done). Their containers and the "End video" button were migrated to Tamagui; the elements remain styled by their existing Tailwind classes. |
| app/components/ChatPanel.tsx | `<div ref={endRef} />` scroll anchor | Non-visual, zero-size layout marker used only as a `scrollIntoView` target. `endRef` is typed `HTMLDivElement` and calls the DOM `scrollIntoView`; routing it through a Tamagui `<View>` ref changes the ref type with no visual or functional benefit. | Keep the bare `<div>` scroll anchor (done). |

## Notes — migrated with a Tamagui web `style` escape hatch (not gaps)

These Tailwind utilities have no first-class Tamagui style prop, so they were reproduced via Tamagui's web-only `style` prop (which Tamagui merges as inline CSS). They are migrated, not gaps, but are listed for transparency:

- **`shadow-lg` / `shadow-xl` / `shadow-2xl`** → `style={{ boxShadow: "…" }}` using Tailwind's exact box-shadow values.
- **`backdrop-blur`** → `style={{ backdropFilter: "blur(8px)" }}`.
- **`-translate-x-1/2`** (centering pills) → `style={{ transform: "translateX(-50%)" }}` alongside `left="50%"`.
- **`overflow-y-auto`** → `style={{ overflowY: "auto" }}`.
- **`transition`** (Enter button hover) → `style={{ transition: "background-color 150ms" }}`.
- **`font-*` family** → `style={{ fontFamily: "inherit" }}` so Tamagui text inherits the app's body font (Arial) instead of Tamagui's themed font.
- **`focus:ring-1 focus:ring-emerald-400`** (chat input) → approximated with `focusStyle={{ outlineWidth: 1, outlineColor: "#34d399", outlineStyle: "solid" }}`. Tailwind's ring is a `box-shadow`; this uses an outline, which is visually equivalent at 1px but not pixel-identical.

## Notes — build/setup constraints discovered

- **Next 16 defaults to Turbopack, which cannot run Tamagui's webpack-based `@tamagui/next-plugin`.** Per the chosen approach, `dev`/`build` scripts were switched to `--webpack` so the official plugin runs.
- **`react-native` type resolution**: `react-native-web` ships no type declarations and Tamagui's source imports RN primitives as types. Resolved with a `react-native` → `app/react-native.d.ts` loose shim via tsconfig `paths` (types-only; runtime aliasing is handled by the webpack plugin).
