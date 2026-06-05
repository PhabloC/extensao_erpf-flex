import type { ReactNode } from 'react';

import { routePaths } from '@/constants/routes';
import Header from '@/layout/Header';
import PageContainer from '@/layout/PageContainer';
import Sidebar, { type NavigationItem } from '@/layout/Sidebar';

import styles from './styles.module.css';

const navigationItems: NavigationItem[] = [
  {
    label: 'Orders',
    to: routePaths.dashboard,
    description: 'Production order list, manual creation and kanban flow.',
  },
  {
    label: 'Kanban',
    to: routePaths.privateArea,
    description: 'Protected route alias for the same authenticated workflow.',
  },
];

export interface MainLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  actions?: ReactNode;
  sessionLabel: string;
  isAuthenticated: boolean;
  onSessionToggle: () => void;
  sessionActionLabel?: string;
}

export default function MainLayout({
  actions,
  children,
  isAuthenticated,
  onSessionToggle,
  sessionActionLabel,
  sessionLabel,
  subtitle,
  title,
}: MainLayoutProps) {
  return (
    <div className={styles.shell}>
      <Sidebar items={navigationItems} />

      <div className={styles.content}>
        <Header
          actions={actions}
          isAuthenticated={isAuthenticated}
          onSessionToggle={onSessionToggle}
          sessionActionLabel={sessionActionLabel}
          sessionLabel={sessionLabel}
          subtitle={subtitle}
          title={title}
        />

        <PageContainer>{children}</PageContainer>
      </div>
    </div>
  );
}
