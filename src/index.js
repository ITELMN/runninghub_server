import express from 'express';
import dotenv from 'dotenv';
import imagesRouter from './routes/images.js';

// Load environment variables
dotenv.config();

// Set default encoding for Node.js
process.env.NODE_OPTIONS = '--no-warnings';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - ensure UTF-8 encoding
app.use(express.json({ charset: 'utf-8' }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'image-generation-service' });
});

// API routes
app.use('/v1/images', imagesRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: "not_found",
      message: "Endpoint not found"
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: {
      code: "internal_error",
      message: err.message
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Image Generation Service running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API endpoint: http://localhost:${PORT}/v1/images/generations`);
});
