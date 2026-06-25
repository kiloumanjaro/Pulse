import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "./components/ui/sonner";

// Body voice. §3
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Mono / eyebrow-label voice. §3
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

// Free geometric substitute for the paid Articulat CF display face. The config
// names `articulat-cf` first, so this only renders until a licensed kit is added.
const display = Hanken_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pulse",
  description: "A living globe of anonymous strangers. Tap a dot, start talking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} ${display.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col"
        style={{ backgroundColor: "#040406", color: "#ffffff" }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
