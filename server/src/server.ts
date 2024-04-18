import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { isValidTreatmentProgram } from './validators/validateTreatmentProgram';
import { authenticateToken } from './middlewares/authenticateToken';

// Load environment variables from .env file
dotenv.config();

const app: Express = express(); // Create an Express application
const PORT: number = parseInt(process.env.PORT || '5000', 10); // Set the server port with fallback to 5000

// Validate the parsed port number to ensure it's a valid number
if (isNaN(PORT)) {
    console.error('Invalid port number provided in environment');
    process.exit(1); // Exit with an error code if port number is not valid
}

// Configure and apply rate limiting to API requests
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Define the time frame for rate limiting (15 minutes)
    max: 100, // Set the maximum number of requests per IP address within the window
    message: 'Too many requests from this IP, please try again after a while.' // Message returned on rate limit exceed
});

app.use(express.json()); // Use middleware to parse JSON bodies

// Define user credentials interface
interface User {
    username: string;
    password: string;
}

// Retrieve the secret key from environment variables
const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
    throw new Error('SECRET_KEY must be defined.');
}
export { SECRET_KEY };

// Define credentials for demonstration purposes
const users: { [key: string]: User } = {
    admin: {
        username: process.env.ADMIN_USERNAME || 'admin', // Use environment variable or fallback to 'admin'
        password: process.env.ADMIN_PASSWORD || '', // No default password for security reasons
    }
};

// Setup CORS middleware with dynamic origin support
app.use(cors({
    origin: process.env.CLIENT_URL, // Allow cross-origin requests from the client URL specified in the environment variable
    credentials: true,
    methods: ["GET", "POST"] // Specify allowed methods for CORS
}));

// Array to store client response objects for SSE
let clients: any[] = [];

// Variable to store treatment program data in memory
let treatmentProgram: any = null;

// Route to handle login requests
app.post('/login', async (req: Request, res: Response) => {
    console.log("Received login request with body:", req.body);

    const { username, password } = req.body;
    const user = users[username];

    if (!user) {
        return res.status(401).send('Authentication failed: user does not exist.');
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (passwordIsValid) {
        const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).send('Invalid password');
    }
});

// Route to submit treatment programs
app.post('/api/treatment', apiLimiter, authenticateToken, (req: Request, res: Response) => {
    const validation = isValidTreatmentProgram(req.body);

    if (!validation.isValid) {
        return res.status(400).send(validation.errorMessage);
    }

    treatmentProgram = req.body;
    console.log("Received and stored treatment program:", treatmentProgram);
    clients.forEach(client => client.res.write(`data: ${JSON.stringify(treatmentProgram)}\n\n`));
    res.status(200).send("Treatment program received and stored successfully");
});

// Route to retrieve the current treatment program
app.get('/api/treatment', apiLimiter, authenticateToken, (req: Request, res: Response) => {
    if (treatmentProgram) {
        res.json(treatmentProgram);
    } else {
        res.status(404).send("No treatment program available");
    }
});

// SSE endpoint to stream updates to clients
app.get('/events', apiLimiter, authenticateToken, (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const id = Date.now();
    clients.push({ id, res });

    if (treatmentProgram) {
        res.write(`data: ${JSON.stringify(treatmentProgram)}\n\n`);
    }

    const sendKeepAlive = setInterval(() => res.write(':keep-alive\n\n'), 20000);

    req.on('close', () => {
        console.log('Client closed connection');
        clients = clients.filter(client => client.id !== id);
        clearInterval(sendKeepAlive);
        res.end();
    });
});

// Start the server if this file is run directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running at ${process.env.SERVER_URL}:${PORT}`);
    });
}

export default app;
