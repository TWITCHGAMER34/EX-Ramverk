import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useSwipeStore} from '../../state/swipeStore';

type SwipeableProps = {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    thresholdPx?: number;
    thresholdPercent?: number;
    onNavigate?: (targetRoute: string, targetIndex: number) => void;
};

export default function Swipeable({
                                      children,
                                      className,
                                      style,
                                      thresholdPx = 80,
                                      thresholdPercent = 0.25,
                                      onNavigate,
                                  }: SwipeableProps) {
    const routes = useSwipeStore((s) => s.routes);
    const setIndex = useSwipeStore((s) => s.setIndex);
    const navigate = useNavigate();

    const containerRef = useRef<HTMLDivElement | null>(null);
    const startX = useRef<number | null>(null);
    const startY = useRef<number | null>(null);
    const deltaX = useRef(0);
    const redirectTarget = useRef<number | null>(null);

    const [translateX, setTranslateX] = useState(0);
    const [animating, setAnimating] = useState(false);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const onTouchStart = (e: TouchEvent) => {
            const t = e.touches[0];
            startX.current = t.clientX;
            startY.current = t.clientY;
            deltaX.current = 0;
            redirectTarget.current = null;
            setAnimating(false);
        };

        const onTouchMove = (e: TouchEvent) => {
            if (startX.current === null || startY.current === null) return;
            const t = e.touches[0];
            const dx = t.clientX - startX.current;
            const dy = t.clientY - startY.current;
            // If vertical gesture, allow scrolling (do not call preventDefault)
            if (Math.abs(dy) > Math.abs(dx)) return;
            deltaX.current = dx;
            setTranslateX(dx);
            // We attached the listener with passive: false, so preventDefault is allowed here
            e.preventDefault();
        };

        const onTouchEnd = () => {
            const dx = deltaX.current;
            const winW = typeof window !== 'undefined' ? window.innerWidth || 1 : 1;
            const leftTrigger = dx < -Math.max(thresholdPx, winW * thresholdPercent);
            const rightTrigger = dx > Math.max(thresholdPx, winW * thresholdPercent);

            const nextIdx = useSwipeStore.getState().nextIndex();
            const prevIdx = useSwipeStore.getState().prevIndex();

            if (leftTrigger && nextIdx !== null) {
                redirectTarget.current = nextIdx;
                setAnimating(true);
                setTranslateX(-winW);
            } else if (rightTrigger && prevIdx !== null) {
                redirectTarget.current = prevIdx;
                setAnimating(true);
                setTranslateX(winW);
            } else {
                setAnimating(true);
                setTranslateX(0);
            }

            startX.current = null;
            startY.current = null;
            deltaX.current = 0;
        };

        el.addEventListener('touchstart', onTouchStart, {passive: true});
        // touchmove needs passive: false to allow preventDefault
        el.addEventListener('touchmove', onTouchMove, {passive: false});
        el.addEventListener('touchend', onTouchEnd, {passive: true});

        return () => {
            el.removeEventListener('touchstart', onTouchStart);
            el.removeEventListener('touchmove', onTouchMove);
            el.removeEventListener('touchend', onTouchEnd);
        };
    }, [thresholdPx, thresholdPercent]);

    const onTransitionEnd = () => {
        if (redirectTarget.current === null) {
            setAnimating(false);
            return;
        }

        const target = redirectTarget.current;
        const targetRoute = routes[target] ?? '/';

        setIndex(target);
        if (onNavigate) {
            onNavigate(targetRoute, target);
        } else {
            navigate(targetRoute);
        }

        redirectTarget.current = null;
        setAnimating(false);
        setTranslateX(0);
    };

    const combinedStyle: React.CSSProperties = {
        transform: `translateX(${translateX}px)`,
        transition: animating ? 'transform 320ms ease' : 'none',
        willChange: 'transform',
        // keep pan-y so vertical scrolling is allowed; horizontal moves are handled and prevented when needed
        touchAction: 'pan-y',
        ...style,
    };

    return (
        <div
            ref={containerRef}
            className={className}
            onTransitionEnd={onTransitionEnd}
            style={combinedStyle}
        >
            {children}
        </div>
    );
}
