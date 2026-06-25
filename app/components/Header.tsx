"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ds";
import PulseMark from "./PulseMark";

// The essentials only (the site is deliberately tiny): brand → home and three
// concept pages. No e-commerce-style menu.
const NAV = [
  { href: "/about", label: "About" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/privacy", label: "Privacy" },
];

// Inset to the page padding: the bare brand mark pinned left, the three concept
// pages grouped right in a bordered box. Cells divided by gray-20 hairlines,
// active/hover cell takes the gray-8 fill (mirrors StickyScrollScrub).
export default function Header({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "absolute top-0 inset-x-0 z-[60] pt-4 px-6 sm:px-12",
        className,
      )}
    >
      <div className="flex flex-row items-center justify-between gap-4">
        <Link
          href="/"
          aria-label="Pulse — home"
          className="flex items-center h-11 cursor-pointer"
        >
          <PulseMark />
        </Link>

        <div className="flex flex-row items-center gap-3">
          <nav className="flex flex-row items-stretch h-11 border border-gray-20 bg-background">
            {NAV.map((item, i) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-center px-5 sm:px-7 cursor-pointer transition-colors duration-200 no-underline",
                    i > 0 && "border-l border-gray-20",
                    isActive ? "bg-gray-8" : "hover:bg-gray-8",
                  )}
                >
                  <span
                    className={cn(
                      "font-sans text-sm font-medium tracking-[-0.35px] transition-colors duration-200",
                      isActive ? "text-foreground" : "text-gray-60",
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <Button
            variant="outline"
            size="md"
            className="bg-black hover:bg-gray-8 active:bg-gray-5"
          >
            Donate
          </Button>
        </div>
      </div>
    </header>
  );
}
