import React, { useState, useEffect } from 'react';
import { login } from './services/authService';
import Calendar from './components/Calendar/Calendar';  // Assuming Calendar is a component

const App: React.FC = () => {
    const [isAuthenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const doLogin = async () => {
            try {
                await login('admin', 'admin123');
                setAuthenticated(true);  // Update state to indicate the user is logged in
                console.log('Logged in successfully');
            } catch (error) {
                console.log('Login error:', error);
            }
        };

        doLogin();
    }, []);

    return (
        <div className="App">
            {isAuthenticated ? <Calendar /> : <div>Loading or Not authenticated</div>}
        </div>
    );
};

export default App;
