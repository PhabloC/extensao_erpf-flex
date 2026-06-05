import type { ReactNode } from 'react';

import { cn } from '@/utils/cn';

import styles from './styles.module.css';

export interface CardProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function Card({ actions, children, className, description, title }: CardProps) {
  return (
    <section className={cn(styles.card, className)}>
      {title || description || actions ? (
        <header className={styles.header}>
          <div>
            {title ? <h2 className={styles.title}>{title}</h2> : null}
            {description ? <p className={styles.description}>{description}</p> : null}
          </div>
          {actions ? <div className={styles.actions}>{actions}</div> : null}
        </header>
      ) : null}
      <div className={styles.content}>{children}</div>
    </section>
  );
}
