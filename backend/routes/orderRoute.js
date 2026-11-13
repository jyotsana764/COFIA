
import express from 'express';

import {
  placeOrder,
  allOrders,
  userOrders,
  trackOrder,
  updateStatus,
} from '../controllers/orderController.js';

import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const orderRouter = express.Router();

// Admin features
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

// Place an order
orderRouter.post('/place', authUser, placeOrder);

// Get the logged-in user's orders
orderRouter.post('/userorders', authUser, userOrders);

// Track a specific order
orderRouter.get('/track/:orderId', authUser, trackOrder);

export default orderRouter;
