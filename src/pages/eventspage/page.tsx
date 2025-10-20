// File: `src/pages/eventspage/page.tsx`
import { useRef, useState, useMemo, useCallback } from 'react';
import Pager from "../../components/pager/Pager.tsx";
import { useNavigate } from 'react-router-dom';
import styles from './events.module.scss';
import SearchInput from './SearchInput';
import { mapRemoteToMapped } from './utils';
import { useEvents } from '../../context/EventsContext';

// Swiper imports (use named exports from 'swiper' for Vite)
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import Keyboard from 'swiper/modules/keyboard/keyboard';
import Mousewheel from 'swiper/modules/mousewheel/mousewheel';
// CSS for core + modules
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/modules/keyboard/keyboard.css';
import 'swiper/modules/mousewheel/mousewheel.css';

SwiperCore.use([Navigation, Pagination, Keyboard, Mousewheel]);

type EventMapped = ReturnType<typeof mapRemoteToMapped>;

export default function EventsPage() {
    const { routes, index } = useSwipe();
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef<HTMLInputElement | null>(null);
    const clearSearch = () => {
        setSearchQuery('');
        searchInputRef.current?.focus();
    };

    const { events: ctxEvents, loading, error } = useEvents();
    const fetchError = error ?? null;

    const eventsMapped = useMemo<EventMapped[]>(() => {
        const remoteEvents = Array.isArray(ctxEvents) ? ctxEvents : [];
        return remoteEvents.map(mapRemoteToMapped);
    }, [ctxEvents]);

    const visibleEvents = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return eventsMapped;
        return eventsMapped.filter((e) => {
            const title = String(e.title ?? '').toLowerCase();
            const location = String(e.location ?? '').toLowerCase();
            const id = String(e.id ?? '').toLowerCase();
            return title.includes(q) || location.includes(q) || id.includes(q);
        });
    }, [eventsMapped, searchQuery]);

    const handleOpenEvent = useCallback((event: EventMapped) => {
        if (event.id) navigate(`/events/${event.id}`);
    }, [navigate]);

    return (
        <div className={`page ${styles.eventsPage}`}>
            <header className={styles.eventsHero}>
                <section className="textContainer">
                    <h1 className={"Title"}>Events</h1>
                </section>
            </header>

            <main className={"content"}>
                <section className={styles.search}>
                    <SearchInput
                        value={searchQuery}
                        onChange={setSearchQuery}
                        onClear={clearSearch}
                        inputRef={searchInputRef}
                    />
                </section>

                <section style={{ padding: '12px 16px' }}>
                    {loading && <div>Loading events…</div>}
                    {fetchError && <div role="alert">Failed to load events</div>}
                    {!loading && !fetchError && visibleEvents.length === 0 && <div>No events found</div>}

                    {!loading && !fetchError && visibleEvents.length > 0 && (
                        <Swiper
                            modules={[Navigation, Pagination, Keyboard, Mousewheel]}
                            spaceBetween={16}
                            navigation
                            pagination={{ clickable: true }}
                            keyboard={{ enabled: true }}
                            mousewheel={{ forceToAxis: true }}
                            breakpoints={{
                                0: { slidesPerView: 1 },
                                700: { slidesPerView: 2 },
                                1000: { slidesPerView: 3 }
                            }}
                            style={{ paddingBottom: 24 }}
                        >
                            {visibleEvents.map((evt) => (
                                <SwiperSlide key={String(evt.id ?? evt.title ?? Math.random())}>
                                    <div className={styles.eventCard} onClick={() => handleOpenEvent(evt)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') handleOpenEvent(evt); }}>
                                        <h2 className={styles.eventTitle}>{String(evt.title ?? 'Untitled Event')}</h2>
                                        <p className={styles.eventDate}>Date: {String(evt.date ?? 'TBA')}</p>
                                        <p className={styles.eventLocation}>Location: {String(evt.location ?? 'TBA')}</p>
                                        <button className={styles.addToCartButton} onClick={(e) => { e.stopPropagation(); handleOpenEvent(evt); }}>Open</button>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </section>
            </main>

            <section className={"pagerContainer"}>
                <Pager count={routes.length} active={index} size={12} gap={16} />
            </section>
        </div>
    );
}
