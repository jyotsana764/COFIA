
import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    excerpt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 400,
    },

    content: {
      type: String,
      required: true,
    },

    coverImage: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        'Style Tips',
        'New Arrivals',
        'Festive Fashion',
        'Trends',
        'COFIA Stories',
      ],
    },

    author: {
      type: String,
      default: 'COFIA Editorial Team',
      trim: true,
    },

    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    relatedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
      },
    ],
  },
  { timestamps: true }
);

blogSchema.index({ status: 1, publishedAt: -1 });

const blogModel =
  mongoose.models.blog || mongoose.model('blog', blogSchema);

export default blogModel;
