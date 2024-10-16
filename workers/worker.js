import Queue from 'bull';
import imageThumbnail from 'image-thumbnail';
import dbClient from './utils/dbClient';
import fs from 'fs';
import path from 'path';
import { ObjectId } from 'mongodb';

// Create the Bull queue
const fileQueue = new Queue('fileQueue');

// Process the fileQueue for thumbnail generation
fileQueue.process(async (job, done) => {
    const { fileId, userId } = job.data;

    if (!fileId) {
        return done(new Error('Missing fileId'));
    }

    if (!userId) {
        return done(new Error('Missing userId'));
    }

    // Fetch the file document from DB
    const file = await dbClient.collection('files').findOne({ _id: ObjectId(fileId), userId });
    if (!file) {
        return done(new Error('File not found'));
    }

    // Check if the file is of type 'image'
    if (file.type !== 'image') {
        return done(new Error('File is not an image'));
    }

    // Define the path to the original image
    const filePath = `/path/to/files/${fileId}`;

    if (!fs.existsSync(filePath)) {
        return done(new Error('File not found locally'));
    }

    // Generate thumbnails
    try {
        const sizes = [500, 250, 100];
        for (const size of sizes) {
            const thumbnail = await imageThumbnail(filePath, { width: size });
            const thumbnailPath = `${filePath}_${size}`;
            fs.writeFileSync(thumbnailPath, thumbnail);
        }
        done();
    } catch (err) {
        done(new Error('Error generating thumbnails'));
    }
});

