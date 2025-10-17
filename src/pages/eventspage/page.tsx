// File: `src/pages/eventspage/page.tsx`
import Pager from "../../components/pager/Pager.tsx";
import Swipeable from "../../components/swipe/Swipeable.tsx";
import EventCard from "../../components/EventCard/EventCard.tsx";
import styles from './events.module.scss';
import { useSwipe } from "../../hooks/useSwipe.ts";
import useFetchEvents from "../../hooks/useFetchEvents";
import { AiOutlineSearch, AiOutlineClose } from 'react-icons/ai';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EventsPage() {
    const { routes, index } = useSwipe();
    const navigate = useNavigate();

    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement | null>(null);
    const clearSearch = () => {
        setQuery('');
        inputRef.current?.focus();
    };

    // fetch (defensive)
    const fetchResult = useFetchEvents("https://santosnr6.github.io/Data/events.json");
    const raw = fetchResult as any;

    // LOG: inspect raw hook response
    console.log('useFetchEvents raw:', raw);

    // Try multiple common shapes and pick the first array we find
    const candidates = [
        raw?.events,
        raw?.data?.events,
        raw?.data,
        raw?.items,
        raw,
    ];

    // LOG: inspect candidate locations
    console.log('useFetchEvents candidates:', candidates);

    const eventsArray: any[] = (candidates.find((c: any) => Array.isArray(c)) as any[]) ?? [];

    // LOG: actual array chosen
    console.log('useFetchEvents eventsArray (length):', eventsArray?.length, eventsArray);

    const isLoading = raw?.isLoading ?? raw?.loading ?? false;
    const error = raw?.error ?? null;

    // map remote shape -> EventCard props
    const mapped = eventsArray.map((e: any) => {
        const dateStr = String(e?.when?.date ?? '').trim(); // e.g. "21 Mars"
        const parts = dateStr ? dateStr.split(/\s+/) : [];
        const day = parts[0] ?? '';
        const month = parts.slice(1).join(' ') ?? '';
        const time = e?.when ? `${e.when.from ?? ''} - ${e.when.to ?? ''}`.trim() : '';
        const price = typeof e?.price === 'number'
            ? (e.price > 0 ? `${e.price} sek` : 'Free')
            : (e?.price ?? '');

        return {
            ...e,
            day,
            month,
            title: e?.name ?? 'Untitled',
            subtitle: e?.where ?? '',
            time,
            price,
        };
    });

    // LOG: mapped result
    console.log('useFetchEvents mapped (length):', mapped?.length, mapped);

    // filter mapped list
    const normalized = query.trim().toLowerCase();
    const filtered = normalized
        ? mapped.filter((e: any) =>
            String(e.title ?? '').toLowerCase().includes(normalized) ||
            String(e.subtitle ?? '').toLowerCase().includes(normalized)
        )
        : mapped;

    const openEvent = (ev: any) => {
        if (ev.id) navigate(`/events/${ev.id}`);
    };

    return (
        <Swipeable className={`page ${styles.eventsPage}`}>
            <header className={styles.eventsHero}>
                <section className="textContainer">
                    <h1 className={"Title"}>Events</h1>
                </section>
            </header>

            <main className={"content"}>
                <section className={styles.search}>
                    <div className={styles.searchInput}>
                        <AiOutlineSearch className={styles.searchIcon} />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search for events..."
                            aria-label="Search events"
                        />
                        {query && (
                            <button
                                type="button"
                                className={styles.searchClear}
                                onClick={clearSearch}
                                aria-label="Clear search"
                            >
                                <AiOutlineClose />
                            </button>
                        )}
                    </div>
                </section>

                <section style={{ padding: '12px 16px' }}>
                    {isLoading && <div>Loading events…</div>}
                    {error && <div role="alert">Failed to load events</div>}
                    {!isLoading && !error && filtered.length === 0 && <div>No events found</div>}

                    <div style={{ display: 'grid', gap: 12, marginTop: 8 }}>
                        {filtered.map((ev: any) => (
                            <EventCard
                                key={ev.id ?? `${ev.title}-${ev.time}`}
                                day={ev.day ?? ''}
                                month={ev.month ?? ''}
                                title={ev.title ?? 'Untitled'}
                                subtitle={ev.subtitle}
                                time={ev.time}
                                price={ev.price}
                                onClick={() => openEvent(ev)}
                            />
                        ))}
                    </div>
                </section>
            </main>

            <section className={"pagerContainer"}>
                <Pager count={routes.length} active={index} size={12} gap={16}/>
            </section>
        </Swipeable>
    );
}
