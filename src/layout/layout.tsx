import React, { useEffect } from 'react';
import { useSwipeStore } from '../state/swipeStore';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const setRoutes = useSwipeStore((s) => s.setRoutes);

    useEffect(() => {
        // define the app's route order here (adjust to your app)
        const routes = ['/', '/events', ];
        setRoutes(routes);
    }, [setRoutes]);

    return (
        <html lang="en">
        <body>{children}</body>
        </html>
    );
}