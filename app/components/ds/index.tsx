import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  ElementType,
  ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Design-system primitives (see design-system.md). Square corners, 1px
// gray-20 borders, white-on-dark fills, mono uppercase eyebrows, flat (no
// shadows). Colors resolve from the Tailwind theme tokens in globals.css.
// ---------------------------------------------------------------------------

// --- Buttons (§9) -- 44px tall, square, hover = bg flip, 200ms ease-in-out ---
const button = cva(
  "inline-flex flex-row items-center justify-center gap-1 h-11 border border-transparent rounded-none cursor-pointer select-none transition-colors duration-200 ease-in-out font-sans text-sm font-medium tracking-[-0.35px]",
  {
    variants: {
      variant: {
        primary:
          "bg-foreground text-background hover:bg-gray-90 active:bg-gray-80",
        outline:
          "bg-background text-foreground border-foreground hover:bg-gray-12 active:bg-gray-8",
        ghost:
          "bg-transparent text-foreground hover:bg-gray-12 active:bg-gray-8",
        danger:
          "bg-danger text-foreground hover:bg-danger-hover active:bg-danger-hover",
      },
      size: {
        sm: "px-6",
        md: "px-5",
        icon: "w-11 px-0",
      },
      full: { true: "w-full" },
    },
    defaultVariants: { variant: "primary", size: "sm" },
  },
);

type ButtonProps = VariantProps<typeof button> & {
  className?: string;
  children?: ReactNode;
  href?: string;
  // When disabled, fill the button with the §8 diagonal hatch (opt-in).
  hatchDisabled?: boolean;
} & ComponentPropsWithoutRef<"button"> &
  Pick<ComponentPropsWithoutRef<"a">, "href" | "target" | "rel">;

export function Button({
  variant,
  size,
  full,
  className,
  href,
  children,
  target,
  rel,
  style,
  hatchDisabled,
  ...props
}: ButtonProps) {
  const cls = cn(button({ variant, size, full }), className);
  if (href != null) {
    return (
      <a href={href} target={target} rel={rel} className={cls} style={style}>
        {children}
      </a>
    );
  }
  const hatched = hatchDisabled && props.disabled;
  return (
    <button
      type="button"
      className={cn(
        cls,
        hatched &&
          "cursor-not-allowed text-gray-50 hover:bg-background active:bg-background",
      )}
      style={hatched ? { backgroundImage: HATCH_IMAGE, ...style } : style}
      {...props}
    >
      {children}
    </button>
  );
}

// --- Card / grid cell (§9) -- bordered, square, flat ---
const card = cva("border border-gray-20 rounded-none", {
  variants: {
    pad: { sm: "p-4", md: "p-6", lg: "p-8" },
    surface: {
      base: "bg-background",
      raised: "bg-gray-8",
      popover: "bg-[#09090b]",
    },
  },
  defaultVariants: { pad: undefined, surface: "base" },
});

type CardProps = VariantProps<typeof card> &
  ComponentPropsWithoutRef<"div"> & { className?: string };

export function Card({ pad, surface, className, ...props }: CardProps) {
  return (
    <div
      className={cn(card({ surface }), pad ? card({ pad }) : "p-5", className)}
      {...props}
    />
  );
}

// --- Badge / tag (§9) -- the only rounded component (6px) ---
export function Badge({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"div"> & { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-row items-center self-start gap-2.5 border border-gray-20 rounded-md px-3 py-[7px]",
        className,
      )}
      {...props}
    >
      {typeof children === "string" ? (
        <span className="font-sans text-sm leading-[19px] tracking-[0.42px] text-gray-80">
          {children}
        </span>
      ) : (
        children
      )}
    </div>
  );
}

// --- Typography (§3) ---
// Display = Articulat substitute, weight 400, theme-aware ink (white on dark).
const display = cva("font-heading font-normal text-foreground", {
  variants: {
    size: {
      hero: "text-[64px] leading-[72px] tracking-[-1.3px]",
      xl: "text-[52px] leading-[58px] tracking-[-1px]",
      lg: "text-[40px] leading-[45px] tracking-[-0.8px]",
      md: "text-[30px] leading-[34px] tracking-[-0.6px]",
      sm: "text-[24px] leading-[27px] tracking-[-0.5px]",
      xs: "text-[22px] leading-[25px] tracking-[-0.4px]",
    },
  },
  defaultVariants: { size: "md" },
});

type DisplayProps<T extends ElementType = "h2"> = VariantProps<typeof display> & {
  as?: T;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export function Display<T extends ElementType = "h2">({
  as,
  size,
  className,
  ...props
}: DisplayProps<T>) {
  const Tag = (as ?? "h2") as ElementType;
  return <Tag className={cn(display({ size }), className)} {...props} />;
}

// Eyebrow = JetBrains Mono, UPPERCASE label. §3
export function Eyebrow({
  className,
  ...props
}: ComponentPropsWithoutRef<"span"> & { className?: string }) {
  return (
    <span
      className={cn(
        "font-mono text-[13px] leading-4 tracking-[0.39px] uppercase text-gray-40",
        className,
      )}
      {...props}
    />
  );
}

// Body = Inter, leading-snug, slight negative tracking, gray ink. §3
const body = cva("font-sans tracking-[-0.16px] text-gray-70", {
  variants: {
    size: {
      sm: "text-sm leading-5",
      md: "text-base leading-[22px]",
      lg: "text-lg leading-[25px]",
      xl: "text-xl leading-7",
    },
    tone: {
      muted: "text-gray-60",
      default: "text-gray-70",
      bright: "text-gray-90",
    },
  },
  defaultVariants: { size: "md" },
});

type BodyProps<T extends ElementType = "p"> = VariantProps<typeof body> & {
  as?: T;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export function Body<T extends ElementType = "p">({
  as,
  size,
  tone,
  className,
  ...props
}: BodyProps<T>) {
  const Tag = (as ?? "p") as ElementType;
  return <Tag className={cn(body({ size, tone }), className)} {...props} />;
}

// --- Divider (§9) -- 1px hairline ---
const divider = cva("", {
  variants: {
    orientation: {
      horizontal: "h-px w-full",
      vertical: "w-px self-stretch",
    },
    tone: {
      strong: "bg-gray-20",
      faint: "bg-white/10",
      white: "bg-foreground",
    },
  },
  defaultVariants: { orientation: "horizontal", tone: "strong" },
});

type DividerProps = VariantProps<typeof divider> & { className?: string };

export function Divider({ orientation, tone, className }: DividerProps) {
  return <div className={cn(divider({ orientation, tone }), className)} />;
}

// --- Hatch (§8) -- diagonal pencil-hatch fill. Use as an absolute fill or
// fixed-size block to texture "empty" grid cells. ---
const HATCH_IMAGE =
  "repeating-linear-gradient(135deg, rgba(46,48,56,0.45) 0 1px, rgba(0,0,0,0) 1px 8px)";

export function Hatch({
  className,
  style,
  ...props
}: ComponentPropsWithoutRef<"div"> & { className?: string; style?: CSSProperties }) {
  return (
    <div
      className={className}
      style={{ backgroundImage: HATCH_IMAGE, ...style }}
      {...props}
    />
  );
}

// --- Input (§9) -- square, gray-8 fill, gray-20 border, focus -> gray-50 ---
export function Input({
  className,
  ...props
}: ComponentPropsWithoutRef<"input"> & { className?: string }) {
  return (
    <input
      className={cn(
        "bg-gray-8 border border-gray-20 rounded-none text-foreground placeholder:text-gray-50 font-sans text-[15px] h-11 px-4 outline-none focus:border-gray-50",
        className,
      )}
      {...props}
    />
  );
}

// --- Section -- page band with the standard responsive gutter (24 -> 48 @sm).
// Every full-width landing band wraps in one so margins stay consistent. ---
export function Section({
  className,
  ...props
}: ComponentPropsWithoutRef<"div"> & { className?: string }) {
  return (
    <div className={cn("flex flex-col w-full px-6 sm:px-12", className)} {...props} />
  );
}

// --- Placeholder (§8) -- hatched empty cell with a centered mono label. Used
// for reserved logo slots and image-less media slots. ---
export function Placeholder({
  label,
  className,
  ...props
}: ComponentPropsWithoutRef<"div"> & { label: string; className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden flex items-center justify-center",
        className,
      )}
      {...props}
    >
      <Hatch className="absolute inset-0 opacity-50" />
      <Eyebrow className="relative text-gray-30">{label}</Eyebrow>
    </div>
  );
}
