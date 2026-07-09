'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Smoothly counts from 0 to `target` over `duration` milliseconds.
 * Uses requestAnimationFrame for a fluid animation.
 *
 * @param target   - The final number to count up to.
 * @param duration - Animation duration in ms (default: 2000).
 * @returns The current animated count value.
 */
export function useCountUp(target: number, duration: number = 2000): number {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // Reset whenever target or duration changes.
    setCount(0);
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out quad: decelerates towards the end for a more natural feel.
      const eased = 1 - Math.pow(1 - progress, 2);
      const current = Math.round(eased * target);

      setCount(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [target, duration]);

  return count;
}
