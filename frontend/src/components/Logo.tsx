"use client";

import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  /** Show only the icon, no brand text */
  compact?: boolean;
  /** Override the link destination */
  href?: string;
  className?: string;
  /** Size of the icon in px */
  iconSize?: number;
}

/**
 * RAKTAVA brand logo — Renders the official brand PNG logo asset.
 */
export function Logo({ compact = false, href = "/", className = "", iconSize = 32 }: LogoProps) {
  // RAKTAVA-Logo-Witout-Background.png is a wide logo with text.
  // We scale width based on height (iconSize) to maintain aspect ratio.
  const width = compact ? iconSize : iconSize * 3.5;

  return (
    <Link
      href={href}
      className={`flex items-center select-none group ${className}`}
      aria-label="RAKTAVA – AI-Powered Blood Intelligence Platform"
    >
      <div 
        className="shrink-0 transition-transform duration-300 group-hover:scale-105 relative" 
        style={{ width: `${width}px`, height: `${iconSize}px` }}
      >
        <Image
          src="/RAKTAVA-Logo-Witout-Background.png"
          alt="RAKTAVA Brand Logo"
          fill
          sizes="(max-width: 768px) 100vw, 150px"
          className="object-contain object-left"
          priority
        />
      </div>
    </Link>
  );
}

export default Logo;
