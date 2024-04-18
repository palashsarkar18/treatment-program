import { useEffect, useState } from 'react';

/**
 * A React hook that establishes a connection to a Server-Sent Events (SSE) endpoint
 * and manages the state of the data received through this connection.
 * 
 * @param {string} url - The URL to connect to the SSE server.
 * @returns An object containing the latest data received and any error status.
 *
 * This hook automates the process of connecting to an SSE endpoint, handling messages,
 * and properly closing the connection on component unmount or URL change. It utilizes
 * the EventSource API to receive updates from the server and updates the component's state
 * accordingly.
 */
export const useSSE = <T,>(url: string): { data: T | null; error: boolean } => {
    // State hooks to store the data received from the server and any error state.
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        // Retrieve the authentication token from localStorage.
        const token = localStorage.getItem('token');

        // Initialize the EventSource connection using the URL and the token for authentication.
        const eventSource = new EventSource(`${url}?token=${token}`);

        // Handler for receiving messages.
        eventSource.onmessage = event => {
            try {
                // Attempt to parse the JSON data received from the server.
                const parsedData: T = JSON.parse(event.data);
                setData(parsedData);
            } catch (error) {
                // Log and set error state if JSON parsing fails.
                console.error("Failed to parse SSE data:", error);
                setError(true);
            }
        };

        // Error handler for the EventSource.
        eventSource.onerror = event => {
            // Log the error and set the error state.
            console.error("EventSource error:", event);
            setError(true);

            // Close the EventSource connection when an error occurs.
            eventSource.close();
        };

        // Cleanup function to close the SSE connection when the component unmounts or the URL changes.
        return () => {
            eventSource.close();
        };
    }, [url]); // Effect dependencies include the URL, so the effect reruns if the URL changes.

    // Return the latest data and error status to the component using this hook.
    return { data, error };
};
