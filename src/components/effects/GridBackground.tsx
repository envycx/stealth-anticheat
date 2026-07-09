'use client';

import { cn } from '@/lib/utils';

interface GridBackgroundProps {
  className?: string;
}

/**
 * Animated subtle circuit/grid background with a cyberpunk aesthetic.
 * Uses an SVG pattern of cyan grid lines at very low opacity.
 * Intended to be placed as a fixed or absolute background layer.
 */
export function GridBackground({ className }: GridBackgroundProps) {
  return (
    <div
      className={cn(
        'pointer-events-none select-none',
        className,
      )}
      aria-hidden="true"
    >
      {/* Base grid pattern */}
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Small grid cell: 40×40 */}
          <pattern
            id="grid-small"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(0,240,255,0.06)"
              strokeWidth="0.5"
            />
          </pattern>

          {/* Large grid cell: 200×200 — highlighted major lines */}
          <pattern
            id="grid-large"
            width="200"
            height="200"
            patternUnits="userSpaceOnUse"
          >
            <rect width="200" height="200" fill="url(#grid-small)" />
            <path
              d="M 200 0 L 0 0 0 200"
              fill="none"
              stroke="rgba(0,240,255,0.1)"
              strokeWidth="0.8"
            />
          </pattern>

          {/* Radial fade mask — keeps center visible, fades edges */}
          <radialGradient id="grid-fade" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="grid-mask">
            <rect width="100%" height="100%" fill="url(#grid-fade)" />
          </mask>
        </defs>

        {/* Grid fill — masked so it fades toward edges */}
        <rect
          width="100%"
          height="100%"
          fill="url(#grid-large)"
          mask="url(#grid-mask)"
        />

        {/* Subtle horizontal scan-line pulse (CSS animation) */}
        <line
          x1="0"
          y1="0"
          x2="100%"
          y2="0"
          stroke="rgba(0,240,255,0.15)"
          strokeWidth="1"
          className="animate-[gridScan_6s_linear_infinite]"
        />
      </svg>

      {/* Inline keyframe for the scan-line — Tailwind JIT doesn't cover this */}
      <style>{`
        @keyframes gridScan {
          0%   { transform: translateY(0); opacity: 0.15; }
          50%  { opacity: 0.3; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
