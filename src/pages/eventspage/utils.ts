import type { EventRemote, EventMapped } from './types';

export function findFirstArray(obj: unknown): unknown[] | undefined {
    if (Array.isArray(obj)) return obj;
    if (obj && typeof obj === 'object') {
        for (const key of Object.keys(obj as Record<string, unknown>)) {
            const found = findFirstArray((obj as Record<string, unknown>)[key]);
            if (found) return found;
        }
    }
    return undefined;
}

export function getPath(obj: unknown, ...keys: string[]): unknown {
    let cur: unknown = obj;
    for (const k of keys) {
        if (cur && typeof cur === 'object') {
            cur = (cur as Record<string, unknown>)[k];
        } else {
            return undefined;
        }
    }
    return cur;
}

export function pickEventsArray(raw: unknown): EventRemote[] {
    const candidates: unknown[] = [
        getPath(raw, 'events', 'events'),
        getPath(raw, 'events'),
        getPath(raw, 'data', 'events'),
        getPath(raw, 'data'),
        getPath(raw, 'items'),
        raw,
    ];
    const arr = (candidates.find((c) => Array.isArray(c)) as EventRemote[]) ??
        (findFirstArray(raw) as EventRemote[] | undefined) ??
        [];
    return arr;
}

export function mapRemoteToMapped(ev: EventRemote): EventMapped {
    const dateStr = String(ev?.when?.date ?? '').trim();
    const parts = dateStr ? dateStr.split(/\s+/) : [];
    const day = parts[0] ?? '';
    const month = parts.slice(1).join(' ') ?? '';
    const time = ev?.when ? `${ev.when.from ?? ''} - ${ev.when.to ?? ''}`.trim() : '';
    const price = typeof ev?.price === 'number'
        ? (ev.price > 0 ? `${ev.price} sek` : 'Free')
        : (ev?.price ? String(ev.price) : '');
    return {
        ...ev,
        day,
        month,
        title: ev?.name ?? 'Untitled',
        subtitle: ev?.where ?? '',
        time,
        price,
    } as EventMapped;
}