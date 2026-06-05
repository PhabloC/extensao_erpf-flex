import { forwardRef, type InputHTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

import styles from './styles.module.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, errorMessage, helperText, id, label, ...props },
  ref,
) {
  const inputId = id ?? props.name;

  return (
    <label className={styles.field} htmlFor={inputId}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <input
        ref={ref}
        className={cn(styles.input, errorMessage && styles.error, className)}
        id={inputId}
        {...props}
      />
      {errorMessage ? <span className={styles.messageError}>{errorMessage}</span> : null}
      {!errorMessage && helperText ? <span className={styles.messageHint}>{helperText}</span> : null}
    </label>
  );
});

export default Input;
