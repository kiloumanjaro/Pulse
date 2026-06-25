"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

// Hard-locked dark theme; square corners and gray-20 hairlines are owned by each
// toast's own markup (we render fully custom content), so the container stays bare.
export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      position="top-right"
      toastOptions={{ unstyled: true }}
      {...props}
    />
  );
}
