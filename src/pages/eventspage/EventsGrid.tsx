import EventCard from "../../components/EventCard/EventCard.tsx";
import styles from './events.module.scss';
import type { EventMapped } from './types';

type Props = {
    events: EventMapped[];
    onOpen: (ev: EventMapped) => void;
};

export default function EventsGrid({ events, onOpen }: Props) {
    return (
        <div className={styles.eventsGrid}>
            {events.map((ev) => (
                <EventCard
                    key={ev.id ?? `${ev.title}-${ev.time}`}
                    day={ev.day ?? ''}
                    month={ev.month ?? ''}
                    title={ev.title ?? 'Untitled'}
                    subtitle={ev.subtitle}
                    time={ev.time}
                    price={ev.price}
                    onClick={() => onOpen(ev)}
                />
            ))}
        </div>
    );
}