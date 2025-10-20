// File: `src/router/router.tsx`
import {useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
//Provider
import { EventsProvider } from "../context/EventsContext";

//Import pages
import HomePage from "../pages/homepage/page.tsx";
import EventsPage from "../pages/eventspage/page.tsx";
import AddToCart from "../pages/AddToCart/page.tsx";

export default function AppRouter() {
    const url = 'https://santosnr6.github.io/Data/events.json';

    return (
        <EventsProvider url={url}>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/events" element={<EventsPage/>}/>
                    <Route path="/events/:id" element={<AddToCart/>}/>
                </Routes>
            </Router>
        </EventsProvider>
    );
}
