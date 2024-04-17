import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { isValidTreatmentProgram } from './validators/validateTreatmentProgram';
import { authenticateToken } from './middlewares/authenticateToken';


const app: Express = express();
const PORT: number = 5000;

app.use(express.json());

interface User {
    username: string;
    password: string;
  }

export const SECRET_KEY = '4911d0ea50cf3127b490dd1d7d065ffc846009c5168607ea64a9930c7e982e9c08f8021c1873714892b19641af35df1e200f18e78bc60aa78fedf1ba28255895'; // Move this to environment variables in production

// Hardcoded credentials for demonstration
const users: { [key: string]: User } = {
    admin: {
        username: 'admin',
        password: '$2a$10$P3rpj98OZ9ap2Grvb0yTGO4OvbBA9JR9IlgC/FY.SYADIF03EC.ee', // This should be the hash of "admin123"
    }
};

app.use(cors({
    origin: 'http://localhost:3000', // Client URL
    credentials: true,
    methods: ["GET", "POST"] // Allowable methods
}));

let clients: any[] = []; // Store client response objects
// Store the JSON data in memory for simplicity
let treatmentProgram: any = null;

app.post('/login', async (req: Request, res: Response) => {
    console.log("Received login request with body:", req.body);

    // const passwordX = 'admin123';
    // bcrypt.hash(passwordX, 10, function(err, hash) {
    //     if (err) {
    //         console.error("Error generating hash:", err);
    //         return;
    //     }
    //     console.log('Hash for', password, ':', hash);
    // });

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

app.post('/api/treatment', authenticateToken, (req: Request, res: Response) => {
    const validation = isValidTreatmentProgram(req.body);

    if (!validation.isValid) {
        return res.status(400).send(validation.errorMessage);
    }

    treatmentProgram = req.body;
    console.log("Received and stored treatment program:", treatmentProgram);
    clients.forEach(client => client.res.write(`data: ${JSON.stringify(treatmentProgram)}\n\n`)); // Update all clients
    res.status(200).send("Treatment program received and stored successfully");
});

app.get('/api/treatment', authenticateToken, (req: Request, res: Response) => {
    if (treatmentProgram) {
        res.json(treatmentProgram);
    } else {
        res.status(404).send("No treatment program available");
    }
});

app.get('/events', authenticateToken, (req: Request, res: Response) => {
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
        console.log(`Server is running at http://localhost:${PORT}`);
    });
}

export default app;
