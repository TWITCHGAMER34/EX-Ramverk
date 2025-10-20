// File: `src/pages/AddToCart/page.tsx`
import React from 'react';
import { useParams } from 'react-router-dom';
import styles from './AddToCart.module.scss';
import { useEvents } from '../../context/EventsContext';

interface EventItem {
    id?: string;
    _id?: string;
    uid?: string;
    slug?: string;
    title?: string;
    date?: string;
    location?: string;
    [key: string]: unknown;
}

function slugify(input: string) {
    return input.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

export default function AddToCart() {
    const { id } = useParams<{ id?: string }>();
    const { events, loading, error, refetch } = useEvents();

    if (loading) {
        return <div className={styles.eventCard}><p>Loading events…</p></div>;
    }

    if (error) {
        return (
            <div className={styles.eventCard}>
                <p>Error: {error}</p>
                <button onClick={refetch}>Retry</button>
            </div>
        );
    }

    const normalize = (s?: string) => (s ? String(s).trim() : '');

    const findEvent = (param?: string | undefined): EventItem | null => {
        if (!events || !events.length) return null;
        const raw = param ?? '';
        const decoded = (() => {
            try {
                return decodeURIComponent(raw);
            } catch {
                return raw;
            }
        })().trim();

        if (!decoded) return events[0] ?? null;

        // exact match against a few common id fields
        const matchByIdField = events.find((e) => {
            const candidates = [
                normalize((e as any).id),
                normalize((e as any)._id),
                normalize((e as any).uid),
                normalize((e as any).slug),
            ];
            return candidates.some((c) => c && c === decoded);
        });
        if (matchByIdField) return matchByIdField;

        // numeric index (e.g. /events/0)
        const idx = Number(decoded);
        if (!Number.isNaN(idx) && events[idx]) return events[idx];

        // title slug match (e.g. /events/my-event-title)
        const paramSlug = slugify(decoded);
        const bySlug = events.find((e) => slugify(String((e as any).title ?? '')) === paramSlug);
        if (bySlug) return bySlug;

        // fallback: contains match on id-like fields or title
        const fallback = events.find((e) => {
            const all = [
                normalize((e as any).id),
                normalize((e as any)._id),
                normalize((e as any).uid),
                normalize((e as any).slug),
                normalize((e as any).title),
            ].join(' ');
            return all.toLowerCase().includes(decoded.toLowerCase());
        });
        return fallback ?? null;
    };

    const evt = findEvent(id);

    return (
        <main className={`page ${styles.atcPage}`}>
            <section className="textContainer">
                <h1 className="Title">Event</h1>
                <p className="fira">You are about to score some tickets to</p>
            </section>

            <section>
                {evt ? (
                    <div className={styles.eventCard}>
                        <h2 className={styles.eventTitle}>{(evt.title as string) ?? 'Untitled Event'}</h2>
                        <p className={styles.eventDate}>Date: {(evt.date as string) ?? 'TBA'}</p>
                        <p className={styles.eventLocation}>Location: {(evt.location as string) ?? 'TBA'}</p>
                        <button className={styles.addToCartButton}>Add to Cart</button>
                    </div>
                ) : (
                    <div className={styles.eventCard}><p>No events to show</p></div>
                )}
            </section>
        </main>
    );
}
