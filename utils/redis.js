import { createClient } from 'redis';

const redisClient = createClient({
    url: `redis://localhost:6379`,
});

// Handle Redis client errors
redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});

// Connect to Redis
const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis');
    } catch (err) {
        console.error('Could not connect to Redis', err);
    }
};

connectRedis();

export default redisClient;

