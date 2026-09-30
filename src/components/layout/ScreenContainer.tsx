/**
 * @fileoverview Page shell: top bar, content, compact footer via AppPageLayout.
 */
import type { ReactNode } from 'react';
import { AppPageLayout } from '@sudobility/building_blocks';
import { useTopBarConfig } from '@/hooks/useTopBarConfig';
import { useFooterConfig } from '@/hooks/useFooterConfig';

/** Full-width layout; each page constrains its own width with Section. */
export default function ScreenContainer({ children }: { children: ReactNode }) {
  const topBar = useTopBarConfig();
  const footer = useFooterConfig();
  return (
    <AppPageLayout
      topBar={topBar}
      footer={footer}
      page={{
        layoutMode: 'full',
        maxWidth: '7xl',
        className: 'bg-card',
        contentPadding: 'none',
        contentClassName: 'w-full min-w-0',
      }}
    >
      {children}
    </AppPageLayout>
  );
}
