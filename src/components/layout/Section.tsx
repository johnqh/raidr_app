import type { ReactNode } from 'react';
import { cn } from '@sudobility/design';

interface SectionProps {
  children: ReactNode;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SPACING = { sm: 'py-4', md: 'py-8', lg: 'py-12', xl: 'py-20' } as const;

/** Full-width band with a constrained, padded inner container. */
export function Section({ children, spacing = 'md', className }: SectionProps) {
  return (
    <section className={cn(SPACING[spacing], className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-w-0">{children}</div>
    </section>
  );
}
