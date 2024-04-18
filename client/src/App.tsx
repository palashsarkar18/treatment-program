import React, { useState, useEffect } from 'react';
import { login } from './services/authService';
import Calendar from './components/Calendar';  // Assuming Calendar is a component
import './App.css';

const App: React.FC = () => {
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [isLoading, setLoading] = useState(true);  // Track loading state
    const [error, setError] = useState<string | null>(null);  // Track errors

    useEffect(() => {
        const doLogin = async () => {
            try {
                await login('admin', 'admin123');
                setAuthenticated(true);  // Update state to indicate the user is logged in
                setLoading(false);  // Set loading to false once login is successful
                console.log('Logged in successfully');
            } catch (error) {
                console.error('Login error:', error);
                setError('Login failed, please try again.');  // Set error message
                setLoading(false);  // Ensure loading state is updated even on error
            }
        };

        doLogin();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;  // Display a loading indicator
    }

    if (error) {
        return <div>Error: {error}</div>;  // Display error message if login fails
    }

    return (
        <div className="App">
            {isAuthenticated ? (
                <header className="App-header">
                  <Calendar />
                </header>
            ) : (
                <div>Please log in to access the calendar.</div>  // This should ideally never show given your logic
            )}
        </div>
    );
};

export default App;
