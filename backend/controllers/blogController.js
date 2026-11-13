
import { v2 as cloudinary } from 'cloudinary';
import blogModel from '../models/blogModel.js';

// Create a URL-friendly slug from the article title.
const createSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// CREATE BLOG ARTICLE — Admin only
const createBlog = async (req, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      category,
      author,
      status,
      relatedProducts,
    } = req.body;

    if (!title || !excerpt || !content || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, excerpt, content and category are required.',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a cover image.',
      });
    }

    const coverUpload = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'image',
      folder: 'cofia/journal',
    });

    const slug = createSlug(title);

    const existingBlog = await blogModel.findOne({ slug });

    if (existingBlog) {
      return res.status(409).json({
        success: false,
        message: 'An article with this title already exists. Please use a different title.',
      });
    }

    const validStatus = status === 'published' ? 'published' : 'draft';

    let parsedProducts = [];

    if (relatedProducts) {
      try {
        parsedProducts = JSON.parse(relatedProducts);

        if (!Array.isArray(parsedProducts)) {
          return res.status(400).json({
            success: false,
            message: 'Related products must be an array.',
          });
        }
      } catch {
        return res.status(400).json({
          success: false,
          message: 'Invalid related products format.',
        });
      }
    }

    const blog = await blogModel.create({
      title: title.trim(),
      slug,
      excerpt: excerpt.trim(),
      content,
      category,
      author: author?.trim() || 'COFIA Editorial Team',
      coverImage: coverUpload.secure_url,
      status: validStatus,
      publishedAt: validStatus === 'published' ? new Date() : null,
      relatedProducts: parsedProducts,
    });

    return res.status(201).json({
      success: true,
      message: 'Journal article created successfully.',
      blog,
    });
  } catch (error) {
    console.error('Create blog error:', error);

    return res.status(500).json({
      success: false,
      message: error.code === 11000
        ? 'An article with this URL already exists.'
        : 'Unable to create the article.',
    });
  }
};

// LIST BLOG ARTICLES — Public users see published articles only.
const listBlogs = async (req, res) => {
  try {
    const isAdmin = req.query.admin === 'true';

    const filter = isAdmin ? {} : { status: 'published' };

    const blogs = await blogModel
      .find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.error('List blogs error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to load journal articles.',
    });
  }
};

// GET A SINGLE ARTICLE BY SLUG — Drafts remain private.
const getBlogBySlug = async (req, res) => {
  try {
    const blog = await blogModel.findOne({
      slug: req.params.slug,
      status: 'published',
    }).lean();

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Journal article not found.',
      });
    }

    return res.json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error('Get blog error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to load the journal article.',
    });
  }
};

// UPDATE BLOG ARTICLE — Admin only
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      excerpt,
      content,
      category,
      author,
      status,
      relatedProducts,
    } = req.body;

    const blog = await blogModel.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Journal article not found.',
      });
    }

    if (title !== undefined) {
      const cleanedTitle = title.trim();
      const newSlug = createSlug(cleanedTitle);

      const duplicate = await blogModel.findOne({
        slug: newSlug,
        _id: { $ne: id },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: 'Another article already uses this title.',
        });
      }

      blog.title = cleanedTitle;
      blog.slug = newSlug;
    }

    if (excerpt !== undefined) blog.excerpt = excerpt.trim();
    if (content !== undefined) blog.content = content;
    if (category !== undefined) blog.category = category;
    if (author !== undefined) blog.author = author.trim();

    if (relatedProducts !== undefined) {
      try {
        const parsedProducts = JSON.parse(relatedProducts);

        if (!Array.isArray(parsedProducts)) {
          return res.status(400).json({
            success: false,
            message: 'Related products must be an array.',
          });
        }

        blog.relatedProducts = parsedProducts;
      } catch {
        return res.status(400).json({
          success: false,
          message: 'Invalid related products format.',
        });
      }
    }

    if (status !== undefined) {
      if (!['draft', 'published'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status must be draft or published.',
        });
      }

      if (status === 'published' && blog.status !== 'published') {
        blog.publishedAt = new Date();
      }

      if (status === 'draft') {
        blog.publishedAt = null;
      }

      blog.status = status;
    }

    if (req.file) {
      const coverUpload = await cloudinary.uploader.upload(req.file.path, {
        resource_type: 'image',
        folder: 'cofia/journal',
      });

      blog.coverImage = coverUpload.secure_url;
    }

    await blog.save();

    return res.json({
      success: true,
      message: 'Journal article updated successfully.',
      blog,
    });
  } catch (error) {
    console.error('Update blog error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to update the article.',
    });
  }
};

// DELETE BLOG ARTICLE — Admin only
const deleteBlog = async (req, res) => {
  try {
    const blog = await blogModel.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Journal article not found.',
      });
    }

    return res.json({
      success: true,
      message: 'Journal article deleted successfully.',
    });
  } catch (error) {
    console.error('Delete blog error:', error);

    return res.status(500).json({
      success: false,
      message: 'Unable to delete the article.',
    });
  }
};

export {
  createBlog,
  listBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
};

