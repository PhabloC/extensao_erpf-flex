import type { ReactNode } from 'react';

import styles from './styles.module.css';

export interface PageContainerProps {
  children: ReactNode;
}

export default function PageContainer({ children }: PageContainerProps) {
  return <main className={styles.container}>{children}</main>;
}
