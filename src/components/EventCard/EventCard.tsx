// File: `src/components/EventCard/EventCard.tsx`
import React from 'react';
import styles from './eventCard.module.scss';

type EventCardProps = {
    day: number | string;
    month: string;
    title: string;
    subtitle?: string;
    time?: string; // e.g. "19.00 - 21.00"
    price?: string; // e.g. "350 sek"
    onClick?: () => void;
};

export default function EventCard({
                                      day,
                                      month,
                                      title,
                                      subtitle,
                                      time,
                                      price,
                                      onClick,
                                  }: EventCardProps) {
    const handleKey = (e: React.KeyboardEvent) => {
        if (!onClick) return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
        }
    };

    return (
        <div
            className={styles.card}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : -1}
            onClick={onClick}
            onKeyDown={handleKey}
            aria-label={title}
        >
            <div className={styles.dateBox} aria-hidden>
                <div className={styles.day}>{day}</div>
                <div className={styles.month}>{month}</div>
            </div>

            <div className={styles.details}>
                <div className={styles.titleRow}>
                    <div className={styles.title}>{title}</div>
                </div>

                {subtitle && <div className={styles.subtitle}>{subtitle}</div>}

                <div className={styles.metaRow}>
                    {time && <div className={styles.time}>{time}</div>}
                    {price && <div className={styles.price}>{price}</div>}
                </div>
            </div>
        </div>
    );
}