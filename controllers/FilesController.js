import Queue from 'bull';
import imageThumbnail from 'image-thumbnail';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import dbClient from '../utils/dbClient';
import redisClient from '../utils/redisClient';
import { ObjectId } from 'mongodb';

// Create a Bull queue for processing file jobs
const fileQueue = new Queue('fileQueue');

class FilesController {
    static async postUpload(req, res) {

        const file = {
            _id: new ObjectId(),
            userId: req.userId,
            name: req.file.name,
            type: req.file.type,
            isPublic: false,
        };
       
        await dbClient.collection('files').insertOne(file);
        
        if (file.type === 'image') {
            fileQueue.add({
                userId: file.userId.toString(),
                fileId: file._id.toString(),
            });
        }

        return res.status(201).json(file);
    }

    static async getFile(req, res) {
        const fileId = req.params.id;
        const size = req.query.size;
        const token = req.headers['x-token'];

        try {
            const file = await dbClient.collection('files').findOne({ _id: ObjectId(fileId) });
            if (!file) {
                return res.status(404).json({ error: 'Not found' });
            }

            if (file.type === 'folder') {
                return res.status(400).json({ error: "A folder doesn't have content" });
            }

            if (!file.isPublic) {
                if (!token) {
                    return res.status(404).json({ error: 'Not found' });
                }

                const userId = await redisClient.get(`auth_${token}`);
                if (!userId || userId !== file.userId.toString()) {
                    return res.status(404).json({ error: 'Not found' });
                }
            }

            let filePath = `/path/to/files/${fileId}`;

            // Check if a size query parameter is passed and append size to file path
            if (size && ['100', '250', '500'].includes(size)) {
                filePath = `${filePath}_${size}`;
            }

            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ error: 'Not found' });
            }

            const mimeType = mime.lookup(file.name);
            res.setHeader('Content-Type', mimeType);
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
        } catch (err) {
            return res.status(500).json({ error: 'Server error' });
        }
    }
}

export default FilesController;