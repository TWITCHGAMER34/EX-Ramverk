import { useMemo } from 'react';
import { useSwipeStore } from '../state/swipeStore';

export function useSwipe() {
    const routes = useSwipeStore((s) => s.routes);
    const index = useSwipeStore((s) => s.index);
    const setIndex = useSwipeStore((s) => s.setIndex);
    const nextIndex = useSwipeStore((s) => s.nextIndex);
    const prevIndex = useSwipeStore((s) => s.prevIndex);

    return useMemo(
        () => ({ routes, index, setIndex, nextIndex, prevIndex }),
        [routes, index, setIndex, nextIndex, prevIndex],
    );
}