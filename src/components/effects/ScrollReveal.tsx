'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  className?: string;
}

type AxisOffset = { x?: number; y?: number };

function getInitialOffset(direction: ScrollRevealProps['direction']): AxisOffset {
  switch (direction) {
    case 'up':    return { y: 20 };
    case 'down':  return { y: -20 };
    case 'left':  return { x: 20 };
    case 'right': return { x: -20 };
    default:      return { y: 20 };
  }
}

/**
 * Framer Motion scroll-reveal wrapper.
 * Children animate from invisible + offset → visible + resting position
 * when they enter the viewport. The animation fires only once.
 */
export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });

  const offset = getInitialOffset(direction);

  const initial = { opacity: 0, ...offset };
  const animate = isInView
    ? { opacity: 1, x: 0, y: 0 }
    : initial;

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={animate}
      transition={{
        duration: 0.6,
        delay: delay / 1000, // convert ms → seconds for Framer Motion
        ease: [0.21, 0.47, 0.32, 0.98], // custom ease-out curve
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
