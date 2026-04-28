'use client';

import React from 'react';
import clsx from 'clsx';
import styles from './IconButton.module.css';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ElementType;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  ariaLabel: string;
}

export function IconButton({
  icon: Icon,
  size = 'md',
  disabled = false,
  ariaLabel,
  className,
  ...props
}: IconButtonProps) {
  const iconSizes = { sm: 14, md: 16, lg: 18 };

  return (
    <button
      className={clsx(styles.iconButton, styles[size], className, {
        [styles.disabled]: disabled,
      })}
      disabled={disabled}
      aria-label={ariaLabel}
      title={ariaLabel}
      {...props}
    >
      <Icon size={iconSizes[size]} />
    </button>
  );
}
