import axios from 'axios';

interface LoginResponse {
    token: string;
}

export const login = async (username: string, password: string): Promise<string> => {
    const apiBaseUrl: string = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : 'http://localhost:5000';
    const loginUrl = `${apiBaseUrl}${process.env.REACT_APP_LOGIN_ENDPOINT}`;
    try {
        const response = await axios.post<LoginResponse>(loginUrl, { username, password });
        const token = response.data.token;
        localStorage.setItem('token', token);
        return token; // Return the token for immediate use or state update
    } catch (error: any) {
        console.error('Login failed:', error.response?.data || error.message);
        throw new Error('Login failed');
    }
};