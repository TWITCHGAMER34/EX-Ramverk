// File: `src/state/swipeStore.ts`
import {create} from 'zustand';

type SwipeState = {
    routes: string[];
    index: number;
    setRoutes: (routes: string[]) => void;
    setIndex: (i: number) => void;
    nextIndex: () => number | null;
    prevIndex: () => number | null;
};

export const useSwipeStore = create<SwipeState>((set, get) => ({
    routes: ['/'],
    index: 0,
    setRoutes: (routes: string[]) => {
        const pathname = typeof window !== 'undefined' ? window.location.pathname : routes[0];
        const idx = routes.indexOf(pathname);
        const normalizedIdx = idx >= 0 ? idx : 0;

        const current = get();
        // shallow compare routes array + index to avoid unnecessary updates
        const sameRoutes =
            current.routes.length === routes.length &&
            current.routes.every((r, i) => r === routes[i]);

        if (sameRoutes && current.index === normalizedIdx) {
            // nothing changed -> avoid calling set
            return;
        }

        set({routes, index: normalizedIdx});
    },
    setIndex: (i: number) => set({index: i}),
    nextIndex: () => {
        const {routes, index} = get();
        return index < routes.length - 1 ? index + 1 : null;
    },
    prevIndex: () => {
        const {index} = get();
        return index > 0 ? index - 1 : null;
    },
}));