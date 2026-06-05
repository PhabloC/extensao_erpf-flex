import { useEffect, type MouseEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import Button from '@/ui/Button';

import styles from './styles.module.css';

export interface ModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ children, description, isOpen, onClose, title }: ModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const stopPropagation = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return createPortal(
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div
        aria-describedby={description ? 'modal-description' : undefined}
        aria-labelledby="modal-title"
        aria-modal="true"
        className={styles.modal}
        onClick={stopPropagation}
        role="dialog"
      >
        <div className={styles.header}>
          <div>
            <h2 className={styles.title} id="modal-title">
              {title}
            </h2>
            {description ? (
              <p className={styles.description} id="modal-description">
                {description}
              </p>
            ) : null}
          </div>

          <Button aria-label="Close modal" onClick={onClose} size="sm" variant="ghost">
            Close
          </Button>
        </div>

        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body,
  );
}
