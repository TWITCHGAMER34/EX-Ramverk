import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';

type RemoteEvent = Record<string, any>;
type EventsContextValue = {
    events: RemoteEvent[] | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
};

const EventsContext = createContext<EventsContextValue | undefined>(undefined);

async function fetchEvents(): Promise<RemoteEvent[]> {
    const res = await fetch('/api/events'); // adjust to your API
    if (!res.ok) throw new Error('Failed to load events');
    return res.json();
}

const queryClient = new QueryClient();

export function EventsProviderRoot({ children }: { children: ReactNode }) {
    // Wrap app in QueryClientProvider once (e.g. in index.tsx or App)
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export function EventsProvider({ children }: { children: ReactNode }) {
    const { data, isLoading, error, refetch } = useQuery<RemoteEvent[], Error>(
        ['events'],
        fetchEvents,
        { staleTime: 1000 * 60 * 2 } // example: 2 minutes
    );

    const value: EventsContextValue = {
        events: data ?? null,
        loading: isLoading,
        error: error ? String(error.message) : null,
        refetch: () => void refetch(),
    };

    return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}

export function useEvents(): EventsContextValue {
    const ctx = useContext(EventsContext);
    if (!ctx) {
        throw new Error('useEvents must be used within EventsProvider');
    }
    return ctx;
}

