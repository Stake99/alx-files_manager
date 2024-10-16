import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs'; // Import bcrypt for password hashing
import dbClient from '../utils/db.js'; // Adjust the path as necessary
import redisClient from '../utils/redis.js'; // Adjust the path as necessary

class AuthController {
  // Sign-in the user and generate an authentication token
  static async getConnect(req, res) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [email, password] = credentials.split(':');

    if (!email || !password) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Hash the password using SHA1
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Check if the user exists in the database
    const user = await dbClient.collection('users').findOne({ email, password: hashedPassword });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Generate a random token and store it in Redis
    const token = uuidv4();
    await redisClient.set(`auth_${token}`, user._id.toString(), 'EX', 86400); // Set expiration to 24 hours

    return res.status(200).json({ token });
  }

  // Sign-out the user by deleting the token from Redis
  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await redisClient.del(`auth_${token}`);
    return res.status(204).send();
  }
}

export default AuthController;