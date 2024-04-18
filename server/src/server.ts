import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { isValidTreatmentProgram } from './validators/validateTreatmentProgram';
import { authenticateToken } from './middlewares/authenticateToken';

dotenv.config();
const app: Express = express();
const PORT: number =  parseInt(process.env.PORT || '5000', 10); // Provide a default value in case it's not set
if (isNaN(PORT)) {
    console.error('Invalid port number provided in environment');
    process.exit(1); // Exit the process with an error code
}

// Create a rate limiter configuration
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after a while.'
});

app.use(express.json());

interface User {
    username: string;
    password: string;
  }

const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
    throw new Error('SECRET_KEY must be defined.');
}
export { SECRET_KEY };

// Hardcoded credentials for demonstration
const users: { [key: string]: User } = {
    admin: {
        username: process.env.ADMIN_USERNAME || 'admin', // Default value as 'admin' if not set
        password: process.env.ADMIN_PASSWORD || '', // No default password
    }
};

app.use(cors({
    origin: process.env.CLIENT_URL, // Client URL
    credentials: true,
    methods: ["GET", "POST"] // Allowable methods
}));

let clients: any[] = []; // Store client response objects
// Store the JSON data in memory for simplicity
let treatmentProgram: any = null;

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

app.post('/api/treatment', apiLimiter, authenticateToken, (req: Request, res: Response) => {
    const validation = isValidTreatmentProgram(req.body);

    if (!validation.isValid) {
        return res.status(400).send(validation.errorMessage);
    }

    treatmentProgram = req.body;
    console.log("Received and stored treatment program:", treatmentProgram);
    clients.forEach(client => client.res.write(`data: ${JSON.stringify(treatmentProgram)}\n\n`)); // Update all clients
    res.status(200).send("Treatment program received and stored successfully");
});

app.get('/api/treatment', apiLimiter, authenticateToken, (req: Request, res: Response) => {
    if (treatmentProgram) {
        res.json(treatmentProgram);
    } else {
        res.status(404).send("No treatment program available");
    }
});

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

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running at ${process.env.SERVER_URL}:${PORT}`);
    });
}

export default app;
