import dns from 'node:dns';

// Fix Node.js MongoDB SRV DNS resolution
dns.setServers(['1.1.1.1', '8.8.8.8']);

import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';

import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import subscribeRouter from './routes/subscribeRoute.js';
import blogRouter from './routes/blogRoute.js';

// NEW: Category route
import categoryRouter from './routes/categoryRoute.js';

// App Configuration
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

// API Endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/subscribe', subscribeRouter);
app.use('/api/blog', blogRouter);

// NEW: Category API endpoint
app.use('/api/category', categoryRouter);

// Test Endpoint
app.get('/', (req, res) => {
  res.send('COFIA API Working');
});

// Start Server After Database Connection
const startServer = async () => {
  try {
    await connectDB();
    await connectCloudinary();

    app.listen(PORT, () => {
      console.log(`COFIA server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start COFIA server:', error.message);
    process.exit(1);
  }
};

startServer();