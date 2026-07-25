import React, { ReactNode } from 'react';
import styles from './AnimatedButtonText.module.css';

interface AnimatedButtonTextProps {
  children: ReactNode;
}

export function AnimatedButtonText({ children }: AnimatedButtonTextProps) {
  return (
    <span className={styles.buttonText}>
      <span className={styles.buttonTextOriginal}>{children}</span>
      <span className={styles.buttonTextCopy} aria-hidden="true">
        {children}
      </span>
    </span>
  );
}
