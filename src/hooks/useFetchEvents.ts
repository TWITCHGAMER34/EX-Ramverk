import {useState, useEffect} from "react";
import axios from "axios";

export default function useFetchEvents(url: string) {
    const [events, setEvents] = useState<any[]>([]);
    const [Loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        axios.get(url)
            .then(response => {
                setEvents(response.data);
                setError(null);
            })
            .catch(err => {
                setError(err.message || "Error fetching events");
                setEvents([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [url]);
    return {
        events, Loading, error
    }
}