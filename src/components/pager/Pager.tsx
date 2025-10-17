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
    const isControlled = active !== undefined;
    const [internal, setInternal] = useState(() => Math.max(0, Math.min(defaultActive, count - 1)));
    const current = isControlled ? (active as number) : internal;
    const dotsRef = useRef<Array<HTMLButtonElement | null>>([]);

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

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            select((current + 1) % count);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            select((current - 1 + count) % count);
        } else if (e.key === 'Home') {
            e.preventDefault();
            select(0);
        } else if (e.key === 'End') {
            e.preventDefault();
            select(count - 1);
        }
    };

    const cssVars = {
        ['--pager-size' as any]: `${size}px`,
        ['--pager-gap' as any]: `${gap}px`,
        ['--pager-active' as any]: activeColor,
        ['--pager-inactive' as any]: inactiveColor,
    };

    return (
        <nav
            className={`${styles.pager} ${className ?? ''}`}
            aria-label={ariaLabel}
            onKeyDown={onKeyDown}
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
