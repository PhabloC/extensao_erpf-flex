import { getStatusStrategy } from '@/patterns/strategy/statusStrategy';
import type { Status } from '@/types/status';
import { cn } from '@/utils/cn';

import styles from './styles.module.css';

export interface StatusBadgeProps {
  status: Status;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const strategy = getStatusStrategy(status);

  return (
    <span className={cn(styles.badge, styles[strategy.tone])} title={strategy.description}>
      {strategy.label}
    </span>
  );
}
