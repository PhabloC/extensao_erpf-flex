import type { ReactNode } from 'react';

import Button from '@/ui/Button';

import styles from './styles.module.css';

export interface HeaderProps {
  title: string;
  subtitle: string;
  sessionLabel: string;
  isAuthenticated: boolean;
  onSessionToggle: () => void;
  sessionActionLabel?: string;
  actions?: ReactNode;
}

export default function Header({
  actions,
  isAuthenticated,
  onSessionToggle,
  sessionActionLabel,
  sessionLabel,
  subtitle,
  title,
}: HeaderProps) {
  return (
    <header className={styles.header}>
      <div>
        <p className={styles.eyebrow}>Frontend Scaffold</p>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      <div className={styles.actions}>
        {actions ? <div className={styles.customActions}>{actions}</div> : null}

        <div className={styles.sessionCard}>
          <span className={styles.sessionLabel}>{sessionLabel}</span>
          <Button onClick={onSessionToggle} size="sm" variant={isAuthenticated ? 'secondary' : 'primary'}>
            {sessionActionLabel ?? (isAuthenticated ? 'Sign out' : 'Sign in')}
          </Button>
        </div>
      </div>
    </header>
  );
}
