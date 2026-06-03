"use client";

import Link from "next/link";

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
 * RAKTAVA brand logo — a responsive, native-dark-mode-compatible SVG component.
 * Renders an emerald-to-teal blood-droplet icon with an integrated pulse wave,
 * plus the "RAKTAVA" wordmark. In compact mode (mobile), the wordmark is hidden.
 */
export function Logo({ compact = false, href = "/", className = "", iconSize = 32 }: LogoProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 select-none group ${className}`}
      aria-label="RAKTAVA – AI-Powered Blood Intelligence Platform"
    >
      {/* Blood-droplet SVG Icon */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          <linearGradient id="dropGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6ee7b7" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>

        {/* Droplet body */}
        <path
          d="M20 4 C20 4 10 15 10 22 C10 27.5 14.5 32 20 32 C25.5 32 30 27.5 30 22 C30 15 20 4 20 4 Z"
          fill="url(#dropGradient)"
          className="drop-shadow-md"
        />

        {/* Inner white pulse-line strip */}
        <path
          d="M13 22 L16.5 17 L18.5 22 L20.5 19 L22.5 22 L25 18 L27 22"
          stroke="url(#pulseGradient)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.9"
        />
      </svg>

      {/* Wordmark — hidden in compact mode */}
      {!compact && (
        <span className="font-black tracking-wide leading-none">
          <span className="text-foreground dark:text-white" style={{ fontSize: iconSize * 0.5 }}>
            RAK
          </span>
          <span className="text-primary" style={{ fontSize: iconSize * 0.5 }}>
            TAVA
          </span>
        </span>
      )}
    </Link>
  );
}

export default Logo;
