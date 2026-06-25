import { useEffect, useState } from "react";

// Canvas / WebGL surfaces (Radar, KineticGrid) take literal color strings and
// can't read CSS custom properties, so they can't use the `--color-brand`
// token directly. This hook bridges that gap: it reads the resolved token off
// the document root at mount, so those surfaces track the single source of
// truth in globals.css. BRAND_FALLBACK is the only JS copy of the brand hex —
// it's used for the first paint (before the effect runs) and SSR; keep it in
// sync with `--color-brand`.
export const BRAND_FALLBACK = "#00de11";

export function useBrandColor(): string {
  const [color, setColor] = useState(BRAND_FALLBACK);
  useEffect(() => {
    const v = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-brand")
      .trim();
    if (v) setColor(v);
  }, []);
  return color;
}
