
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import productModel from '../models/productModel.js';

const buildIdQuery = (id) => {
  if (!id) return { _id: null };
  return mongoose.Types.ObjectId.isValid(id) && typeof id === 'string' && id.length === 24
    ? { $or: [{ _id: id }, { _id: new mongoose.Types.ObjectId(id) }] }
    : { _id: id };
};

// Function for adding a product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      subcategory,
      bestseller,
      sizes
    } = req.body;

    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: 'image'
        });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subcategory,
      bestseller: bestseller === 'true',
      sizes: JSON.parse(sizes),
      image: imagesUrl,
      date: Date.now()
    };

    const product = new productModel(productData);
    await product.save();

    return res.json({
      success: true,
      message: 'Product added successfully'
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Function for listing products
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    const seen = new Set();
    const uniqueProducts = [];
    for (const p of products) {
      const idStr = String(p._id).trim();
      if (!seen.has(idStr)) {
        seen.add(idStr);
        uniqueProducts.push(p);
      }
    }
    return res.json({ success: true, products: uniqueProducts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Function for removing a product
const removeProduct = async (req, res) => {
  try {
    const product = await productModel.findOneAndDelete(buildIdQuery(req.body.id));

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    return res.json({
      success: true,
      message: 'Product removed successfully'
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Function for getting single product information
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findOne(buildIdQuery(productId));

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    return res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Function for updating an existing product's price
const updateProductPrice = async (req, res) => {
  try {
    const { id, price } = req.body;

    if (
      !id ||
      price === undefined ||
      price === null ||
      String(price).trim() === '' ||
      !Number.isFinite(Number(price)) ||
      Number(price) < 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'A valid product ID and non-negative price are required'
      });
    }

    const updatedProduct = await productModel.findOneAndUpdate(
      buildIdQuery(id),
      { $set: { price: Number(price) } },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    return res.json({
      success: true,
      message: 'Product price updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export {
  listProducts,
  addProduct,
  removeProduct,
  singleProduct,
  updateProductPrice
};
