import { useRef } from 'react';

const globalCache = new Map<string, any>();

export async function fetchJson<T = any>(url: string, signal?: AbortSignal, { bypassCache = false } = {}): Promise<T> {
    if (!bypassCache && globalCache.has(url)) {
        return globalCache.get(url) as T;
    }

    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    globalCache.set(url, data);
    return data as T;
}

export function clearCache(url?: string) {
    if (url) globalCache.delete(url);
    else globalCache.clear();
}