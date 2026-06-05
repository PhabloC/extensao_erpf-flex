import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/utils/cn';

import styles from './styles.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: ReactNode;
}

export default function Button({
  children,
  className,
  fullWidth = false,
  icon,
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(styles.button, styles[variant], styles[size], fullWidth && styles.fullWidth, className)}
      type={type}
      {...props}
    >
      <span className={styles.content}>
        {icon ? <span className={styles.icon}>{icon}</span> : null}
        <span>{children}</span>
      </span>
    </button>
  );
}
