
import express from 'express';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

import {
  createBlog,
  listBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
} from '../controllers/blogController.js';

const blogRouter = express.Router();

// Public routes
// Visitors can see published articles only.
blogRouter.get('/list', listBlogs);
blogRouter.get('/:slug', getBlogBySlug);

// Admin-only routes
// Authentication runs before the upload and controller.
blogRouter.post(
  '/add',
  adminAuth,
  upload.single('coverImage'),
  createBlog
);

blogRouter.get(
  '/admin/list',
  adminAuth,
  (req, res, next) => {
    req.query.admin = 'true';
    next();
  },
  listBlogs
);

blogRouter.put(
  '/update/:id',
  adminAuth,
  upload.single('coverImage'),
  updateBlog
);

blogRouter.delete(
  '/delete/:id',
  adminAuth,
  deleteBlog
);

export default blogRouter;

