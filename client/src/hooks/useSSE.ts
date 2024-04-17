import { useEffect, useState } from 'react';

/**
 * A custom hook to manage a Server-Sent Events (SSE) connection.
 * @param url The URL to connect for SSE.
 * @returns The latest data received from the SSE connection and any errors.
 */
export const useSSE = <T,>(url: string): { data: T | null, error: boolean } => {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        const eventSource = new EventSource(url);
        eventSource.onmessage = event => {
            console.log("Event data received:", event.data); // Check raw data

            try {
                const parsedData: T = JSON.parse(event.data);
                console.log("parsedData", parsedData)
                setData(parsedData);
            } catch (err) {
                console.error("Failed to parse SSE data", err);
                setError(true);
            }
        };

        eventSource.onerror = event => {
            console.error("SSE error:", event);
            setError(true);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [url]);

    return { data, error };
};

export default useSSE;
