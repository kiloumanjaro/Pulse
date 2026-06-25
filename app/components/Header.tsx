"use client";

import { Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ds";
import PulseMark from "./PulseMark";

// The essentials only (the site is deliberately tiny): brand → home, three
// concept pages, and one way in. No e-commerce-style menu.
const NAV = [
  { href: "/about", label: "About" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/privacy", label: "Privacy" },
];

// Mono UPPERCASE link, gray → white on hover. The signature eyebrow voice (§3).
function NavLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-sans text-sm font-medium tracking-[-0.35px] text-foreground cursor-pointer transition-colors duration-200">
      {children}
    </span>
  );
}

// Square 3px tick between nav items — the reference's separator, hard-cornered.
const Sep = () => <div className="w-[3px] h-[3px] bg-foreground" />;

export default function Header({
  onEnter,
  className,
}: {
  onEnter?: () => void;
  className?: string;
}) {
  const router = useRouter();

  // On the gate, "Enter" runs the geolocation flow; elsewhere it returns home.
  const handleEnter = () => (onEnter ? onEnter() : router.push("/"));

  return (
    <header
      className={cn(
        "sticky top-0 z-[60] w-full pt-4 px-4 flex flex-row items-center pointer-events-none",
        className,
      )}
    >
      <div className="flex flex-1 justify-start pointer-events-auto">
        <Link href="/" aria-label="Pulse — home" className="block cursor-pointer">
          <PulseMark />
        </Link>
      </div>

      <div className="hidden sm:flex justify-center pointer-events-auto">
        <div className="flex flex-row items-center h-11 gap-[34px] px-[30px] border border-foreground bg-black transition-colors duration-200">
          {NAV.map((item, i) => (
            <Fragment key={item.href}>
              {i > 0 && <Sep />}
              <Link href={item.href} className="no-underline">
                <NavLabel>{item.label}</NavLabel>
              </Link>
            </Fragment>
          ))}
        </div>
      </div>

      <div className="flex flex-1 justify-end pointer-events-auto">
        <Button
          variant="primary"
          size="sm"
          onClick={handleEnter}
          className="h-[42px]"
        >
          <span className="font-mono text-xs leading-[15px] tracking-[0.36px] uppercase text-background">
            Enter
          </span>
        </Button>
      </div>
    </header>
  );
}
