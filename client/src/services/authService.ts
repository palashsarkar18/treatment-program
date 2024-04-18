import axios from 'axios';

/**
 * Defines the structure of the login response expected from the server.
 */
interface LoginResponse {
    token: string;
}

/**
 * Authenticates a user by their username and password.
 * 
 * This function sends a POST request to the authentication endpoint of the backend server.
 * Upon successful authentication, it stores the received JWT in localStorage to maintain
 * session state and returns the token for potential immediate use.
 * 
 * @param {string} username - The user's username.
 * @param {string} password - The user's password.
 * @returns {Promise<string>} A promise that resolves to the authentication token.
 * @throws {Error} Throws an error if the login is unsuccessful.
 */
export const login = async (username: string, password: string): Promise<string> => {
    // Construct the base URL from environment variables or use a default for development.
    const apiBaseUrl: string = process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL : 'http://localhost:5000';
    // Build the full URL for the login endpoint.
    const loginUrl = `${apiBaseUrl}${process.env.REACT_APP_LOGIN_ENDPOINT}`;
    try {
        // Attempt to authenticate with the provided username and password.
        const response = await axios.post<LoginResponse>(loginUrl, { username, password });
        const token = response.data.token;

        // Store the token in localStorage for client-side session management.
        localStorage.setItem('token', token);

        // Return the token for use in client-side routing or state management.
        return token; // Return the token for immediate use or state update
    } catch (error: any) {
        // Log and rethrow the error with a custom message if the request fails.
        console.error('Login failed:', error.response?.data || error.message);
        throw new Error('Login failed');
    }
};