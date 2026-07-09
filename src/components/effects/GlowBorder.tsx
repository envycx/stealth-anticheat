import { cn } from '@/lib/utils';

interface GlowBorderProps {
  children: React.ReactNode;
  color?: 'cyan' | 'violet';
  className?: string;
}

/**
 * Wraps children in a div with a neon glow border effect.
 * Cyan (default): electric-blue box-shadow + cyan border.
 * Violet: purple box-shadow + violet border.
 */
export function GlowBorder({
  children,
  color = 'cyan',
  className,
}: GlowBorderProps) {
  return (
    <div
      className={cn(
        'rounded-xl transition-shadow duration-300',
        color === 'cyan'
          ? 'border border-cyan-500/30 shadow-[0_0_20px_rgba(0,240,255,0.3)]'
          : 'border border-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.3)]',
        className,
      )}
    >
      {children}
    </div>
  );
}
