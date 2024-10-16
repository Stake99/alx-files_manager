import dbClient from '../utils/db.js'; // Ensure the correct path
import { redisClient } from '../utils/redis.js'; // Example import for Redis client

class AppController {
    static async getStatus(req, res) {
        const redisAlive = await redisClient.isAlive(); // Example method for checking Redis
        const dbAlive = await dbClient.isAlive(); // Check MongoDB connection
        res.status(200).json({ redis: redisAlive, db: dbAlive });
    }

    static async getStats(req, res) {
        const users = await dbClient.nbUsers(); // Get number of users
        const files = await dbClient.nbFiles(); // Get number of files
        res.status(200).json({ users, files });
    }
}

export default AppController;