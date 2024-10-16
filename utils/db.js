import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

class DBClient {
    constructor() {
        const uri = process.env.DB_URI || 'mongodb://localhost:27017';
        this.client = new MongoClient(uri);
        this.database = process.env.DB_DATABASE || 'files_manager';
        this.client.connect().catch(err => console.error('DB Connection Error:', err));
    }

    isAlive() {
        return this.client.isConnected();
    }

    async nbUsers() {
        const db = this.client.db(this.database);
        const count = await db.collection('users').countDocuments();
        return count;
    }

    async nbFiles() {
        const db = this.client.db(this.database);
        const count = await db.collection('files').countDocuments();
        return count;
    }
}

const dbClient = new DBClient();
export default dbClient;
