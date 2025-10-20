import React, { useEffect, useRef, useState } from 'react';
import styles from './pager.module.scss';

interface PagerProps {
    count?: number; // number of dots, default 3
    active?: number; // controlled active index (0-based)
    defaultActive?: number; // uncontrolled initial index
    onChange?: (index: number) => void;
    size?: number; // dot diameter in px
    gap?: number; // gap between dots in px
    activeColor?: string;
    inactiveColor?: string;
    className?: string;
    ariaLabel?: string;
}

export default function Pager({
                                  count = 3,
                                  active,
                                  defaultActive = 0,
                                  onChange,
                                  size = 10,
                                  gap = 12,
                                  activeColor = '#FFFFFF',
                                  inactiveColor = '#FFFFFF4D',
                                  className,
                                  ariaLabel = 'Pager',
                              }: PagerProps) {
    const isControlled = active !== undefined; // determine if controlled
    const [internal, setInternal] = useState(() => Math.max(0, Math.min(defaultActive, count - 1))); // clamp initial value
    const current = isControlled ? (active as number) : internal; // type assertion since active is defined here
    const dotsRef = useRef<Array<HTMLButtonElement | null>>([]); // refs to dot buttons

    useEffect(() => {
        // clamp if count changes
        if (!isControlled && internal >= count) {
            setInternal(count - 1);
        }
    }, [count, internal, isControlled]);

    const select = (index: number) => {
        const next = Math.max(0, Math.min(index, count - 1));
        if (!isControlled) setInternal(next);
        onChange?.(next);
        dotsRef.current[next]?.focus();
    };

    // CSS variables for styling
    const cssVars: React.CSSProperties & Record<`--${string}`, string> = { // Type assertion for CSS variables
        '--pager-size': `${size}px`, // dot size
        '--pager-gap': `${gap}px`, // gap between dots
        '--pager-active': activeColor, // active dot color
        '--pager-inactive': inactiveColor, // inactive dot color
    };

    return (
        <nav
            className={`${styles.pager} ${className ?? ''}`}
            aria-label={ariaLabel}
            style={cssVars as React.CSSProperties}
        >
            <ul className={styles.list}>
                {Array.from({ length: count }).map((_, i) => {
                    const isActive = i === current;
                    return (
                        <li key={i}>
                            <button
                                ref={(el) => { dotsRef.current[i] = el; }}
                                type="button"
                                className={`${styles.dot} ${isActive ? styles.active : ''}`}
                                aria-label={`Go to page ${i + 1}`}
                                aria-current={isActive ? 'true' : undefined}
                                onClick={() => select(i)}
                            />
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
