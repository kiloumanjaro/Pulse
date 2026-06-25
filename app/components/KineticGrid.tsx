"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";

// A fixed glow source (e.g. centered behind the globe) that brightens the grid
// like the cursor hover does, but contributes no warp/displacement.
export interface GlowSource {
  x: number;
  y: number;
  radius: number;
}

interface ClickProps {
  clickForce?: number;
  motionSpeed?: number;
}

interface CursorTrailProps {
  trailMode?: "click" | "hover";
  trailLength?: number;
  trailColor?: string;
}

interface KineticGridProps {
  clickInteraction?: boolean;
  clickProps?: ClickProps;
  cursorTrail?: boolean;
  cursorTrailProps?: CursorTrailProps;
  backgroundColor?: string;
  gridColor?: string;
  dotColor?: string;
  hoverColor?: string;
  gridSize?: number;
  repulsionStrength?: number;
  radius?: number;
  dotSize?: number;
  gridThickness?: number;
  baseOpacity?: number;
  soundEnabled?: boolean;
  soundSrc?: string;
  soundVolume?: number;
  clickSoundEnabled?: boolean;
  clickSoundSrc?: string;
  clickSoundVolume?: number;
  glowSourceRef?: RefObject<GlowSource | null>;
  glowEnabled?: boolean;
  glowStrength?: number;
  glowRadiusScale?: number;
  glowFalloff?: number;
  glowWarp?: boolean;
  glowWarpStrength?: number;
  style?: CSSProperties;
}

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  targetSize: number;
  brightness: number;
}

interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

function parseColor(color: string): Rgba {
  if (!color || color === "transparent") return { r: 0, g: 0, b: 0, a: 0 };
  const rgbaMatch = color.match(
    /rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)/i
  );
  if (rgbaMatch)
    return {
      r: parseInt(rgbaMatch[1]),
      g: parseInt(rgbaMatch[2]),
      b: parseInt(rgbaMatch[3]),
      a: parseFloat(rgbaMatch[4]),
    };
  const rgbMatch = color.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rgbMatch)
    return {
      r: parseInt(rgbMatch[1]),
      g: parseInt(rgbMatch[2]),
      b: parseInt(rgbMatch[3]),
      a: 1,
    };
  let hex = color.replace("#", "");
  if (hex.length === 8) {
    return {
      r: parseInt(hex.substring(0, 2), 16),
      g: parseInt(hex.substring(2, 4), 16),
      b: parseInt(hex.substring(4, 6), 16),
      a: parseInt(hex.substring(6, 8), 16) / 255,
    };
  }
  if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  const r = parseInt(hex.substring(0, 2), 16),
    g = parseInt(hex.substring(2, 4), 16),
    b = parseInt(hex.substring(4, 6), 16);
  return {
    r: isNaN(r) ? 160 : r,
    g: isNaN(g) ? 160 : g,
    b: isNaN(b) ? 160 : b,
    a: 1,
  };
}

// Cursor-reactive dot grid rendered on a 2D canvas. Ported from a Framer code
// component; the editor's property controls are replaced by plain props.
export default function KineticGrid(props: KineticGridProps) {
  const {
    clickInteraction = false,
    clickProps = {},
    cursorTrail = false,
    cursorTrailProps = {},
    backgroundColor = "transparent",
    gridColor = "#FFFFFF",
    dotColor = "#FFFFFF",
    hoverColor = "#0073FF",
    gridSize = 60,
    repulsionStrength = -0.65,
    radius = 350,
    dotSize = 1.5,
    gridThickness = 0.5,
    baseOpacity = 0.09,
    soundEnabled = true,
    soundSrc = "/hoverfx2.mp3",
    soundVolume = 0.05,
    clickSoundEnabled = true,
    clickSoundSrc = "/hoverfx2.mp3",
    clickSoundVolume = 0.05,
    glowSourceRef,
    glowEnabled = true,
    glowStrength = 1,
    glowRadiusScale = 1.8,
    glowFalloff = 2,
    glowWarp = false,
    glowWarpStrength = 0.65,
  } = props;
  const { clickForce = 0.5, motionSpeed = 0.5 } = clickProps;
  const {
    trailMode = "hover",
    trailLength = 0.1,
    trailColor = "#FFFFFF",
  } = cursorTrailProps;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const dotsRef = useRef<Map<string, Dot>>(new Map());
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);
  const trailPointsRef = useRef<{ x: number; y: number; time: number }[]>([]);
  const isMouseDownRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  // Web Audio: a clicky tick that fires when the cursor crosses into a new
  // grid cell — same approach as robot.co/playground/grid (lazy AudioContext
  // unlocked on first gesture, pitch-randomized, throttled short envelope).
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const clickBufferRef = useRef<AudioBuffer | null>(null);
  const lastCellRef = useRef<string | null>(null);
  const lastTickRef = useRef(0);
  const soundRef = useRef({
    soundEnabled,
    soundVolume,
    clickSoundEnabled,
    clickSoundVolume,
  });

  const colorsRef = useRef({
    backgroundColor,
    gridColor,
    dotColor,
    hoverColor,
    gridSize,
    repulsionStrength,
    radius,
    dotSize,
    gridThickness,
    baseOpacity,
    clickInteraction,
    clickForce,
    motionSpeed,
    cursorTrail,
    trailMode,
    trailLength,
    trailColor,
    glowEnabled,
    glowStrength,
    glowRadiusScale,
    glowFalloff,
    glowWarp,
    glowWarpStrength,
  });
  const prevGridSizeRef = useRef(gridSize);

  useEffect(() => {
    const gridSizeChanged = prevGridSizeRef.current !== gridSize;
    prevGridSizeRef.current = gridSize;
    soundRef.current = {
      soundEnabled,
      soundVolume,
      clickSoundEnabled,
      clickSoundVolume,
    };
    colorsRef.current = {
      backgroundColor,
      gridColor,
      dotColor,
      hoverColor,
      gridSize,
      repulsionStrength,
      radius,
      dotSize,
      gridThickness,
      baseOpacity,
      clickInteraction,
      clickForce,
      motionSpeed,
      cursorTrail,
      trailMode,
      trailLength,
      trailColor,
      glowEnabled,
      glowStrength,
      glowRadiusScale,
      glowFalloff,
      glowWarp,
      glowWarpStrength,
    };
    if (gridSizeChanged && mounted && canvasRef.current) {
      const canvas = canvasRef.current;
      const width = canvas.clientWidth || canvas.offsetWidth || 1;
      const height = canvas.clientHeight || canvas.offsetHeight || 1;
      dotsRef.current.clear();
      for (let gx = -gridSize; gx < width + gridSize * 2; gx += gridSize) {
        for (let gy = -gridSize; gy < height + gridSize * 2; gy += gridSize) {
          dotsRef.current.set(`${gx},${gy}`, {
            x: gx,
            y: gy,
            vx: 0,
            vy: 0,
            size: 1,
            targetSize: 1,
            brightness: 1,
          });
        }
      }
    }
  }, [
    mounted,
    backgroundColor,
    gridColor,
    dotColor,
    hoverColor,
    gridSize,
    repulsionStrength,
    radius,
    dotSize,
    gridThickness,
    baseOpacity,
    clickInteraction,
    clickForce,
    motionSpeed,
    cursorTrail,
    trailMode,
    trailLength,
    trailColor,
    soundEnabled,
    soundVolume,
    clickSoundEnabled,
    clickSoundVolume,
    glowEnabled,
    glowStrength,
    glowRadiusScale,
    glowFalloff,
    glowWarp,
    glowWarpStrength,
  ]);

  useEffect(() => {
    setMounted(true);
    return () => {
      audioCtxRef.current?.close().catch(() => {});
      audioCtxRef.current = null;
    };
  }, []);

  // Lazily create the AudioContext + decode the click sample on the first user
  // gesture (browsers block audio until then). Loaded once, reused per tick.
  useEffect(() => {
    if (!mounted || (!soundEnabled && !clickSoundEnabled)) return;
    const initAudio = () => {
      if (audioCtxRef.current) return;
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return;
      const ctx = new AC();
      audioCtxRef.current = ctx;
      const load = (src: string, ref: typeof audioBufferRef) =>
        fetch(src)
          .then((r) => r.arrayBuffer())
          .then((b) => ctx.decodeAudioData(b))
          .then((buf) => {
            ref.current = buf;
          })
          .catch(() => {});
      if (soundEnabled) load(soundSrc, audioBufferRef);
      if (clickSoundEnabled) load(clickSoundSrc, clickBufferRef);
    };
    window.addEventListener("mousedown", initAudio, { once: true });
    window.addEventListener("keydown", initAudio, { once: true });
    window.addEventListener("touchstart", initAudio, { once: true });
    return () => {
      window.removeEventListener("mousedown", initAudio);
      window.removeEventListener("keydown", initAudio);
      window.removeEventListener("touchstart", initAudio);
    };
  }, [mounted, soundEnabled, soundSrc, clickSoundEnabled, clickSoundSrc]);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const maxDist = 400;

    const getSpringParams = () => {
      const speed = colorsRef.current.motionSpeed;
      const t = Math.max(0, Math.min(1, speed));
      return { springStiffness: 0.02 + t * 0.06, damping: 0.7 + t * 0.05 };
    };

    const getCanvasSize = () => {
      const width = canvas.clientWidth || canvas.offsetWidth || 1;
      const height = canvas.clientHeight || canvas.offsetHeight || 1;
      return { width, height };
    };

    const initDots = () => {
      dotsRef.current.clear();
      const { width, height } = getCanvasSize();
      const currentGridSize = colorsRef.current.gridSize;
      for (
        let gx = -currentGridSize;
        gx < width + currentGridSize * 2;
        gx += currentGridSize
      ) {
        for (
          let gy = -currentGridSize;
          gy < height + currentGridSize * 2;
          gy += currentGridSize
        ) {
          dotsRef.current.set(`${gx},${gy}`, {
            x: gx,
            y: gy,
            vx: 0,
            vy: 0,
            size: 1,
            targetSize: 1,
            brightness: 1,
          });
        }
      }
    };

    let { width, height } = getCanvasSize();
    canvas.width = width;
    canvas.height = height;
    initDots();

    const getHoverIntensity = (x: number, y: number) => {
      const mouse = mousePosRef.current;
      if (!mouse) return 0;
      const hoverRadius = colorsRef.current.radius;
      const dx = x - mouse.x,
        dy = y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > hoverRadius) return 0;
      return Math.pow(1 - dist / hoverRadius, 3.5);
    };

    // Static glow from a fixed source (the globe). Same falloff shape as hover
    // but its own radius/strength — and it never feeds the push functions, so
    // it brightens the grid without warping it.
    const getGlowIntensity = (x: number, y: number) => {
      const c = colorsRef.current;
      const g = glowSourceRef?.current;
      if (!c.glowEnabled || !g) return 0;
      const r = g.radius * c.glowRadiusScale;
      if (r <= 0) return 0;
      const dx = x - g.x,
        dy = y - g.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > r) return 0;
      return Math.pow(1 - dist / r, c.glowFalloff) * c.glowStrength;
    };

    // Combined intensity for COLOR / OPACITY / SIZE only. Push uses the mouse
    // directly, so the glow contributes brightness but zero displacement.
    const getVisualIntensity = (x: number, y: number) =>
      Math.min(1, Math.max(getHoverIntensity(x, y), getGlowIntensity(x, y)));

    const mapRepulsion = (value: number) => (value <= 0 ? value * 25 : value * 90);

    const getCursorPush = (baseX: number, baseY: number) => {
      const mouse = mousePosRef.current;
      const mappedRepulsion = mapRepulsion(colorsRef.current.repulsionStrength);
      if (!mouse || mappedRepulsion === 0) return { x: 0, y: 0 };
      const dx = baseX - mouse.x,
        dy = baseY - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist === 0) return { x: 0, y: 0 };
      const normalizedDist = Math.min(dist / maxDist, 1);
      const pushAmount = Math.pow(1 - normalizedDist, 2) * mappedRepulsion;
      return { x: (dx / dist) * pushAmount, y: (dy / dist) * pushAmount };
    };

    const getClickPush = (baseX: number, baseY: number) => {
      if (!colorsRef.current.clickInteraction || !isMouseDownRef.current)
        return { x: 0, y: 0 };
      const mouse = mousePosRef.current;
      const force = colorsRef.current.clickForce;
      if (!mouse || force <= 0) return { x: 0, y: 0 };
      const dx = baseX - mouse.x,
        dy = baseY - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist === 0) return { x: 0, y: 0 };
      const normalizedDist = Math.min(dist / maxDist, 1);
      const pushAmount = Math.pow(1 - normalizedDist, 2) * force * 100;
      return { x: (dx / dist) * pushAmount, y: (dy / dist) * pushAmount };
    };

    // Static warp from the globe — pulls dots inward toward its center (pucker),
    // reach scaled to the globe radius. Independent of the cursor push.
    const getGlowPush = (baseX: number, baseY: number) => {
      const c = colorsRef.current;
      const g = glowSourceRef?.current;
      if (!c.glowWarp || !g || c.glowWarpStrength === 0) return { x: 0, y: 0 };
      const reach = g.radius * c.glowRadiusScale;
      if (reach <= 0) return { x: 0, y: 0 };
      const dx = baseX - g.x,
        dy = baseY - g.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist === 0 || dist > reach) return { x: 0, y: 0 };
      const normalizedDist = dist / reach;
      const pushAmount =
        Math.pow(1 - normalizedDist, 2) * c.glowWarpStrength * 25;
      // Negative direction = toward the center (inward pucker).
      return { x: -(dx / dist) * pushAmount, y: -(dy / dist) * pushAmount };
    };

    const animate = () => {
      const currentColors = colorsRef.current;
      const hoverColorParsed = parseColor(currentColors.hoverColor);
      const gridColorParsed = parseColor(currentColors.gridColor);
      const dotColorParsed = parseColor(currentColors.dotColor);
      const bgColorParsed = parseColor(currentColors.backgroundColor);
      const currentGridSize = currentColors.gridSize;
      const currentDotSize = currentColors.dotSize;
      const currentGridThickness = currentColors.gridThickness;
      const currentBaseOpacity = currentColors.baseOpacity;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = `rgba(${bgColorParsed.r}, ${bgColorParsed.g}, ${bgColorParsed.b}, ${bgColorParsed.a})`;
      ctx.fillRect(0, 0, width, height);

      dotsRef.current.forEach((dot, key) => {
        const [gxStr, gyStr] = key.split(",");
        const gx = parseInt(gxStr),
          gy = parseInt(gyStr);
        const rightDot = dotsRef.current.get(`${gx + currentGridSize},${gy}`);
        const bottomDot = dotsRef.current.get(`${gx},${gy + currentGridSize}`);
        const hoverIntensity = getVisualIntensity(dot.x, dot.y);

        if (rightDot) {
          const avgHover =
            (hoverIntensity + getVisualIntensity(rightDot.x, rightDot.y)) / 2;
          const r = Math.round(
            gridColorParsed.r + (hoverColorParsed.r - gridColorParsed.r) * avgHover
          );
          const g = Math.round(
            gridColorParsed.g + (hoverColorParsed.g - gridColorParsed.g) * avgHover
          );
          const b = Math.round(
            gridColorParsed.b + (hoverColorParsed.b - gridColorParsed.b) * avgHover
          );
          const lineOpacity =
            currentBaseOpacity + (1 - currentBaseOpacity) * avgHover;
          ctx.beginPath();
          ctx.moveTo(dot.x, dot.y);
          ctx.lineTo(rightDot.x, rightDot.y);
          ctx.lineWidth = currentGridThickness + avgHover * 2;
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${lineOpacity})`;
          ctx.stroke();
        }
        if (bottomDot) {
          const avgHover =
            (hoverIntensity + getVisualIntensity(bottomDot.x, bottomDot.y)) / 2;
          const r = Math.round(
            gridColorParsed.r + (hoverColorParsed.r - gridColorParsed.r) * avgHover
          );
          const g = Math.round(
            gridColorParsed.g + (hoverColorParsed.g - gridColorParsed.g) * avgHover
          );
          const b = Math.round(
            gridColorParsed.b + (hoverColorParsed.b - gridColorParsed.b) * avgHover
          );
          const lineOpacity =
            currentBaseOpacity + (1 - currentBaseOpacity) * avgHover;
          ctx.beginPath();
          ctx.moveTo(dot.x, dot.y);
          ctx.lineTo(bottomDot.x, bottomDot.y);
          ctx.lineWidth = currentGridThickness + avgHover * 2;
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${lineOpacity})`;
          ctx.stroke();
        }
      });

      const { springStiffness, damping } = getSpringParams();
      dotsRef.current.forEach((dot, key) => {
        const [gxStr, gyStr] = key.split(",");
        const gx = parseInt(gxStr),
          gy = parseInt(gyStr);
        const glowPush = getGlowPush(gx, gy);
        const targetX =
          gx + getCursorPush(gx, gy).x + getClickPush(gx, gy).x + glowPush.x;
        const targetY =
          gy + getCursorPush(gx, gy).y + getClickPush(gx, gy).y + glowPush.y;
        const forceX = (targetX - dot.x) * springStiffness;
        const forceY = (targetY - dot.y) * springStiffness;
        dot.vx = (dot.vx + forceX) * damping;
        dot.vy = (dot.vy + forceY) * damping;
        dot.x += dot.vx;
        dot.y += dot.vy;
        const hoverIntensity = getVisualIntensity(dot.x, dot.y);
        dot.targetSize = currentDotSize + hoverIntensity * currentDotSize;
        dot.size += (dot.targetSize - dot.size) * 0.15;
        const r = Math.round(
          dotColorParsed.r + (hoverColorParsed.r - dotColorParsed.r) * hoverIntensity
        );
        const g = Math.round(
          dotColorParsed.g + (hoverColorParsed.g - dotColorParsed.g) * hoverIntensity
        );
        const b = Math.round(
          dotColorParsed.b + (hoverColorParsed.b - dotColorParsed.b) * hoverIntensity
        );
        const opacity =
          currentBaseOpacity + (1 - currentBaseOpacity) * hoverIntensity;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, Math.max(currentDotSize * 0.5, dot.size), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        ctx.fill();
      });

      const { cursorTrail: ct, trailLength: tlen, trailColor: tcolor } =
        currentColors;
      const effectiveTrailLength = Math.max(1, Math.round(tlen * 50));
      if (ct && effectiveTrailLength > 0) {
        const trail = trailPointsRef.current;
        if (trail.length > 1) {
          const now2 = performance.now();
          const maxAge = Math.max(200, effectiveTrailLength * 40);
          ctx.save();
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.lineWidth = 2;
          ctx.beginPath();
          let started = false;
          for (let i = 0; i < trail.length; i++) {
            const point = trail[i],
              age = now2 - point.time;
            if (age < maxAge) {
              if (!started) {
                ctx.moveTo(point.x, point.y);
                started = true;
              } else {
                ctx.lineTo(point.x, point.y);
              }
            }
          }
          const trailAlpha =
            trail.length > 0
              ? Math.max(0, 1 - (now2 - trail[trail.length - 1].time) / maxAge)
              : 0;
          const tc = parseColor(tcolor);
          ctx.strokeStyle = `rgba(${tc.r}, ${tc.g}, ${tc.b}, ${trailAlpha * 0.9 * tc.a})`;
          ctx.stroke();
          ctx.restore();
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);

    // Drag tick: the hoverfx2 sample at the site's hover pitch (0.6) with a
    // 50ms envelope — same as robot.co's playQuickStartHover.
    const playTick = (rate: number) => {
      const actx = audioCtxRef.current;
      const buf = audioBufferRef.current;
      if (!actx || !buf) return;
      if (actx.state === "suspended") actx.resume().catch(() => {});
      const t0 = actx.currentTime;
      const src = actx.createBufferSource();
      const gain = actx.createGain();
      src.buffer = buf;
      src.playbackRate.value = rate;
      const v = soundRef.current.soundVolume;
      gain.gain.setValueAtTime(v, t0);
      gain.gain.setValueAtTime(v, t0 + 0.05 - 0.01);
      gain.gain.linearRampToValueAtTime(0, t0 + 0.05);
      src.connect(gain);
      gain.connect(actx.destination);
      src.start(t0);
      src.stop(t0 + 0.05);
    };

    // Lower-pitched click/confirm accent (hoverfx2) fired on press — mirrors
    // robot.co's playQuickStartClick (playbackRate 0.8, ~60ms envelope).
    const playClick = () => {
      const actx = audioCtxRef.current;
      const buf = clickBufferRef.current;
      if (!actx || !buf || !soundRef.current.clickSoundEnabled) return;
      if (actx.state === "suspended") actx.resume().catch(() => {});
      const t0 = actx.currentTime;
      const src = actx.createBufferSource();
      const gain = actx.createGain();
      src.buffer = buf;
      src.playbackRate.value = 0.8;
      const v = soundRef.current.clickSoundVolume;
      gain.gain.setValueAtTime(v, t0);
      gain.gain.setValueAtTime(v, t0 + 0.06 - 0.01);
      gain.gain.linearRampToValueAtTime(0, t0 + 0.06);
      src.connect(gain);
      gain.connect(actx.destination);
      src.start(t0);
    };

    // Convert a window mouse event to canvas-local coordinates.
    const eventToCanvas = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cw = canvas.clientWidth || canvas.offsetWidth || 1;
      const ch = canvas.clientHeight || canvas.offsetHeight || 1;
      return {
        x: (e.clientX - rect.left) * (cw / rect.width),
        y: (e.clientY - rect.top) * (ch / rect.height),
        width: cw,
        height: ch,
      };
    };

    // True when a canvas-local point falls inside the globe's drawn circle.
    const isOverGlobe = (x: number, y: number) => {
      const glow = glowSourceRef?.current;
      if (!glow) return false;
      const dx = x - glow.x,
        dy = y - glow.y;
      return dx * dx + dy * dy <= glow.radius * glow.radius;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { x, y, width: canvasWidth, height: canvasHeight } = eventToCanvas(e);
      // Only track if mouse is within component bounds
      if (x >= 0 && y >= 0 && x <= canvasWidth && y <= canvasHeight) {
        mousePosRef.current = { x, y };

        // Tick once per grid cell entered, throttled — pitch jittered ±15%.
        // But stay silent while the cursor is over the globe itself: there the
        // grid is hidden behind the sphere, so only the click sound should fire.
        const overGlobe = isOverGlobe(x, y);
        const gs = colorsRef.current.gridSize;
        const cell = `${Math.floor(x / gs)},${Math.floor(y / gs)}`;
        if (cell !== lastCellRef.current) {
          lastCellRef.current = cell;
          const now3 = performance.now();
          if (
            !overGlobe &&
            soundRef.current.soundEnabled &&
            now3 - lastTickRef.current > 25
          ) {
            playTick(0.6 + (Math.random() - 0.5) * 0.08);
            lastTickRef.current = now3;
          }
        }

        const { cursorTrail: ct, trailMode: tm, trailLength: tlen } =
          colorsRef.current;
        const effectiveLength = Math.max(1, Math.round(tlen * 100));
        if (ct && effectiveLength > 0 && (tm === "hover" || isMouseDownRef.current)) {
          const now2 = performance.now();
          const trail = trailPointsRef.current;
          trail.push({ x, y, time: now2 });
          if (trail.length > effectiveLength)
            trail.splice(0, trail.length - effectiveLength);
        }
      } else {
        mousePosRef.current = null;
      }
    };
    const handleMouseDown = (e: MouseEvent) => {
      isMouseDownRef.current = true;
      // The click sound only fires for a "valid" press: a peer marker, or
      // anywhere on the background. Pressing the globe itself (e.g. dragging to
      // rotate) stays silent — unless it lands on a peer dot.
      const target = e.target as Element | null;
      const onPeerMarker = !!target?.closest(".pulse-dot");
      if (!onPeerMarker) {
        const { x, y } = eventToCanvas(e);
        if (isOverGlobe(x, y)) return;
      }
      playClick();
    };
    const handleMouseUp = () => {
      if (colorsRef.current.trailMode === "click") trailPointsRef.current = [];
      isMouseDownRef.current = false;
    };
    // Attach listeners to window to allow interaction with underlying elements
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    const handleResize = () => {
      const newSize = getCanvasSize();
      width = newSize.width;
      height = newSize.height;
      canvas.width = width;
      canvas.height = height;
      initDots();
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      resizeObserver.disconnect();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        ...props.style,
      }}
    />
  );
}
