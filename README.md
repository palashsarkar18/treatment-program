# Real-Time Calendar Application
This project implements a real-time calendar application using Server-Sent Events (SSE) for real-time data updates and React for the frontend. The application displays a 3-week treatment program, dynamically updating the display as data changes on the server.

TODO:
1. Unit test cases for components.
2. Future activity of input should always be false.

## Project Structure
The project is divided into two main directories to separate the frontend and backend code, ensuring clear modularity and easier dependency management.

```
/meru-health-app
|-- /client                    # Contains all frontend code (React)
|   |-- /src
|   |   |-- /components
|   |   |-- /hooks
|   |   |-- App.js
|   |   |-- index.js
|   |-- /public
|   |-- package.json
|-- /server                    # Contains all backend code (Node.js/Express)
|   |-- server.js
|   |-- package.json
|-- package.json               # Root package.json (optional, only if sharing dependencies)
```

### Client (Frontend)
**/src**: Contains all React components, custom hooks, and the entry point (index.js).

**/public**: Stores static files like index.html, images, and other assets.

**package.json**: Manages frontend dependencies and scripts.

### Server (Backend)
**server.js**: The main server file that configures and runs the Express server.

**package.json**: Manages backend-specific dependencies and scripts.

## Server Setup
The server is built with Node.js and Express. It handles incoming API requests and pushes updates to the client using SSE.

### Key Dependencies
**express**: Framework for handling HTTP requests.

**cors**: Middleware to enable CORS (Cross-Origin Resource Sharing).

## Setup and Installation
Clone the repository:

```
git clone https://github.com/your-repo/my-app.git
cd my-app
// TODO: Checkout to the correct branch, fix the project name
```

### Install dependencies:

For the frontend:
bash
Copy code
cd client
npm install
For the backend:
bash
Copy code
cd ../server
npm install
Running the application:

Start the frontend:
bash
Copy code
cd client
npm start
Start the backend:
bash
Copy code
cd ../server
npm start
Running the Server
The server can be started with the following command from the /server directory:

bash
Copy code
npm start
It handles incoming API requests and pushes updates to the client using SSE.

Running the Client
The client can be started with the following command from the /client directory:

bash
Copy code
npm start
It uses React to render the UI based on the data received from the server through SSE.

### Running the Server
```
cd server
npm install
npm start
```

### API Endpoints
**POST /api/treatment**: Receives and stores treatment programs.

**GET /api/treatment**: Serves the current treatment program.

**GET /events**: SSE endpoint that streams updates to the client.

## Client Setup
The client is a React application that uses the SSE hook to receive real-time updates and renders the treatment program accordingly.

### Key Dependencies
**react**

**axios**: For making HTTP requests.

**date-fns**: For date handling.

### Running the Client
```
cd client
npm install
npm start
```
## Custom Hooks
**useSSE**: This hook manages the SSE connection, listens for messages, and updates the component state.

```
const useSSE = <T,>(url: string): { data: T | null, error: boolean } => {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        const eventSource = new EventSource(url);

        eventSource.onmessage = event => {
            try {
                const parsedData: T = JSON.parse(event.data);
                setData(parsedData);
            } catch (err) {
                console.error("Failed to parse SSE data", err);
                setError(true);
            }
        };

        eventSource.onerror = event => {
            console.error("SSE connection error:", event);
            setError(true);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [url]);

    return { data, error };
};
```

## Troubleshooting
**Common Issues**

1. **Elements Not Visible**: Ensure no CSS rules hide elements, and check for JavaScript errors that may affect rendering.

2. **SSE Connection Issues**: Verify server headers, ensure CORS settings are correct, and check network activity for continuous connections.

3.**Data Parsing Errors**: Handle errors gracefully in both server and client code to manage malformed data or connection issues.

## Useful Commands
Inspect network activity in the browser to diagnose connection issues:

* Open Developer Tools (F12)
* Go to the "Network" tab
* Look for the /events request and check the response stream.


## Conclusion
This project demonstrates the use of SSE in a full-stack JavaScript application to enable real-time data updates in a web application. Adjust configurations and troubleshoot with the provided guidelines to ensure robust operation.

## Additional text

Why TypeScript 4.9.5?
The project uses react-scripts@5.0.1, which has specific peer dependency requirements for TypeScript. Using TypeScript version 4.9.5 ensures that there are no compatibility issues with the build and tooling provided by react-scripts. Higher versions of TypeScript have led to conflicts during project setup and build processes, as identified during initial development attempts.


# Assuming $token holds your JWT
$token = 'your_jwt_token_here'
$token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzEzMzk2Mzk5LCJleHAiOjE3MTMzOTk5OTl9.5ELykszfWI9v42QNgoLpgF-cQJBBDwSKk_jT7BIIDiU'

# Setting up the header with the Authorization including the token
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Making the POST request
$response = Invoke-WebRequest -Uri "http://localhost:5000/login" -Method Post -ContentType "application/json" -Body '{"username":"admin", "password":"admin123"}'

$response.Content

# Assuming $token holds your JWT
$token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzEzNDQ3MzY4LCJleHAiOjE3MTM0NTA5Njh9.ki8Yr4WfEwCWgWp5eNWt5ZmBS9z8Z--xGHzWHUel7pc'

# Setting up the header with the Authorization including the token
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Making the POST request
$response = Invoke-WebRequest -Uri "http://localhost:5000/api/treatment" -Method Post -Headers $headers -InFile ".\program_january.json"
Write-Output $response.Content




# Setting up the header with the Authorization including the token
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Making the POST request
$response = Invoke-WebRequest -Uri "http://localhost:5000/api/treatment" -Method Post -Headers $headers -InFile ".\program_january.json"
Write-Output $response.Content


