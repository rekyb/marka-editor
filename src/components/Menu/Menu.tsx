'use client';

import React, { useState, useRef } from 'react';
import clsx from 'clsx';
import styles from './Menu.module.css';

interface MenuProps {
  trigger: (onClick: () => void) => React.ReactNode;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

export function Menu({ trigger, children, placement = 'bottom' }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.menuContainer} ref={triggerRef}>
      {trigger(() => setIsOpen(!isOpen))}

      {isOpen && (
        <>
          <div
            className={styles.backdrop}
            onClick={() => setIsOpen(false)}
            role="presentation"
          />
          <div
            className={clsx(styles.menuContent, styles[placement])}
            role="menu"
          >
            {children}
          </div>
        </>
      )}
    </div>
  );
}

interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function MenuItem({ children, ...props }: MenuItemProps) {
  return (
    <button className={styles.menuItem} role="menuitem" {...props}>
      {children}
    </button>
  );
}
