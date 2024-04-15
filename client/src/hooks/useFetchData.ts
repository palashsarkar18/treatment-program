import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchData = <T>(url: string): { data: T | null; isLoading: boolean; error: Error | null } => {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        axios.get<T>(url)
            .then(response => {
                setData(response.data);
                setIsLoading(false);
            })
            .catch(err => {
                setError(err);
                setIsLoading(false);
            });
    }, [url]); // Dependency array includes url to refetch if URL changes

    return { data, isLoading, error };
};

export default useFetchData;
