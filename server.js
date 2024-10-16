import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import redisClient from './utils/redis.js';
import dbClient from './utils/db.js';
import routes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Load all routes
app.use('/api', routes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get('/status', async (req, res) => {
    const status = {
        redis: redisClient.isAlive(),
        db: dbClient.isAlive(),
    };
    res.status(200).json(status);
});

app.get('/stats', async (req, res) => {
    const usersCount = await dbClient.nbUsers();
    const filesCount = await dbClient.nbFiles();
    res.status(200).json({
        users: usersCount,
        files: filesCount,
    });
});

