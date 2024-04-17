import { useEffect, useState } from 'react';

export const useSSE = <T,>(url: string): { data: T | null; error: boolean } => {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem('token'); // Retrieve the stored token
        console.log("token: ", token);
        const eventSource = new EventSource(`${url}?token=${token}`);

        eventSource.onmessage = event => {
            try {
                const parsedData: T = JSON.parse(event.data);
                setData(parsedData);
            } catch (error) {
                console.error("Failed to parse SSE data:", error);
                setError(true);
            }
        };

        eventSource.onerror = event => {
            console.error("EventSource error:", event);
            setError(true);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [url]);

    return { data, error };
};
