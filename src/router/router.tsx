import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useSwipeStore } from '../state/swipeStore';

//Import pages
import HomePage from "../pages/homepage/page.tsx";
import EventsPage from "../pages/eventspage/page.tsx";

export default function router () {
    const setRoutes = useSwipeStore((s) => s.setRoutes);

    useEffect(() => {
        const routes = ['/', '/events'];
        setRoutes(routes);
    }, [setRoutes]);

    return(
        <Router>
            <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/events" element={<EventsPage/>} />
            </Routes>
        </Router>
    )

}