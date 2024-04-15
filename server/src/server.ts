import express, { Express, Request, Response } from 'express';
import cors from 'cors';

const app: Express = express();
const PORT: number = 5000;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',  // Client URL
    credentials: true, // if you need cookies or authentication headers
    methods: ["GET", "POST"] // Allowable methods
}));

let clients: any[] = []; // Store client response objects

// Store the JSON data in memory for simplicity
let treatmentProgram: any = null;

app.post('/api/treatment', (req: Request, res: Response) => {
    treatmentProgram = req.body; 
    console.log("Received and stored treatment program:", treatmentProgram);
    clients.forEach(client => client.res.write(`data: ${JSON.stringify(treatmentProgram)}\n\n`)); // Update all clients
    res.status(200).send("Treatment program received and stored successfully");
});

app.get('/api/treatment', (req: Request, res: Response) => {
    // res.json(treatmentProgram || {});
    if (treatmentProgram) {
        res.json(treatmentProgram);
    } else {
        res.status(404).send("No treatment program available");
    }
});

// SSE Endpoint to send real-time updates
app.get('/events', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // Ensure headers are sent

    clients.push({ id: Date.now(), res }); // Store client for broadcasting updates

    console.log("clients,", clients)

    // Send existing data to client immediately on connection
    if (treatmentProgram) {
        res.write(`data: ${JSON.stringify(treatmentProgram)}\n\n`);
    }

    const sendKeepAlive = setInterval(() => res.write(':keep-alive\n\n'), 20000);

    req.on('close', () => {
        console.log('Client closed connection');
        clearInterval(sendKeepAlive);
        res.end();
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});