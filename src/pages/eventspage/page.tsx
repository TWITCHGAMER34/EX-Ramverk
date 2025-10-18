// typescript
import {useRef, useState} from 'react';
import Pager from "../../components/pager/Pager.tsx";
import Swipeable from "../../components/swipe/Swipeable.tsx";
import {useSwipe} from "../../hooks/useSwipe.ts";
import useFetchEvents from "../../hooks/useFetchEvents";
import {useNavigate} from 'react-router-dom';
import styles from './events.module.scss';
import SearchInput from './SearchInput';
import EventsGrid from './EventsGrid';
import {pickEventsArray, mapRemoteToMapped} from './utils';

/*
  EventsPage
  - Fetches events using a generic hook
  - Normalizes and maps remote event data to the shape used by EventCard
  - Provides a simple search filter and navigation to event details
*/
export default function EventsPage() {
    // swipe / pager state (from app-level hook)
    const {routes, index} = useSwipe();
    const navigate = useNavigate();

    // local UI state: search query and input ref
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef<HTMLInputElement | null>(null);    const clearSearch = () => {
        setSearchQuery('');
        searchInputRef.current?.focus();
    };

    // Fetch raw response from hook (shape can vary)
    const fetchResponse = useFetchEvents("https://santosnr6.github.io/Data/events.json") as unknown;

    // Defensive conversion so we can read common loading/error keys
    const responseRecord = (fetchResponse as Record<string, unknown> | undefined) ?? {};
    const loading = (responseRecord['isLoading'] as boolean | undefined)
        ?? (responseRecord['loading'] as boolean | undefined)
        ?? (responseRecord['Loading'] as boolean | undefined)
        ?? false;
    const fetchError = (responseRecord['error'] as unknown) ?? (responseRecord['Error'] as unknown) ?? null;

    // Extract the actual events array from whatever nested shape the API returned
    // (utility handles common nested paths and recursive search)
    const remoteEvents = pickEventsArray(fetchResponse);

    // Map remote events to the local EventMapped shape used by EventCard
    const eventsMapped = remoteEvents.map(mapRemoteToMapped);

    // Simple search: normalize query and filter by title or subtitle
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const visibleEvents = normalizedQuery
        ? eventsMapped.filter((item) =>
            String(item.title ?? '').toLowerCase().includes(normalizedQuery) ||
            String(item.subtitle ?? '').toLowerCase().includes(normalizedQuery)
        )
        : eventsMapped;

    // Handler: open an event detail route when a card is clicked
    const handleOpenEvent = (event: typeof eventsMapped[number]) => {
        if (event.id) navigate(`/events/${event.id}`);
    };

    return (
        <Swipeable className={`page ${styles.eventsPage}`}>
            {/* Page hero / title */}
            <header className={styles.eventsHero}>
                <section className="textContainer">
                    <h1 className={"Title"}>Events</h1>
                </section>
            </header>

            <main className={"content"}>
                {/* Search input area */}
                <section className={styles.search}>
                    <SearchInput
                        value={searchQuery}
                        onChange={setSearchQuery}
                        onClear={clearSearch}
                        inputRef={searchInputRef}
                    />
                </section>

                {/* Event list / loader / error states */}
                <section style={{padding: '12px 16px'}}>
                    {loading && <div>Loading events…</div>}
                    {fetchError && <div role="alert">Failed to load events</div>}
                    {!loading && !fetchError && visibleEvents.length === 0 && <div>No events found</div>}

                    {/* Grid of event cards */}
                    <EventsGrid events={visibleEvents} onOpen={handleOpenEvent}/>
                </section>
            </main>

            {/* Pager at bottom (swipe indicator) */}
            <section className={"pagerContainer"}>
                <Pager count={routes.length} active={index} size={12} gap={16}/>
            </section>
        </Swipeable>
    );
}
