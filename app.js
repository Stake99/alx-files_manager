import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';  
import helmet from 'helmet';  
import cors from 'cors';      
import router from './routes/index.js';  
import { errorHandler } from './middlewares/errorHandler.js';

// Initialize the Express app
const app = express();

// Middleware setup
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Register routes
app.use('/', router);

// Custom Error Handling Middleware
app.use(errorHandler);  // Apply the error handler middleware

// Catch-all route for unknown paths
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Export the Express app
export default app;

