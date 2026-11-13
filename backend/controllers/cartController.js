import userModel from "../models/userModel.js";

// Get the authenticated user's ID.
const getAuthenticatedUserId = (req) => {
  return req.userId || req.body?.userId || null;
};

// Add a product to the user's cart.
const addToCart = async (req, res) => {
  try {
    const { itemId, size } = req.body || {};
    const userId = getAuthenticatedUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    if (!itemId || !size) {
      return res.status(400).json({
        success: false,
        message: "Product ID and size are required",
      });
    }

    const userData = await userModel.findById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const cartData = userData.cartData
      ? JSON.parse(JSON.stringify(userData.cartData))
      : {};

    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }

    cartData[itemId][size] =
      (Number(cartData[itemId][size]) || 0) + 1;

    userData.cartData = cartData;
    userData.markModified("cartData");

    await userData.save();

    return res.status(200).json({
      success: true,
      message: "Added to cart",
      cartData,
    });
  } catch (error) {
    console.error("Add to cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to add product to cart",
    });
  }
};

// Update a product's quantity in the user's cart.
const updateCart = async (req, res) => {
  try {
    const { itemId, size, quantity } = req.body || {};
    const userId = getAuthenticatedUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    if (!itemId || !size || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Product ID, size, and quantity are required",
      });
    }

    const parsedQuantity = Number(quantity);

    if (
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a non-negative integer",
      });
    }

    const userData = await userModel.findById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const cartData = userData.cartData
      ? JSON.parse(JSON.stringify(userData.cartData))
      : {};

    if (
      !cartData[itemId] ||
      cartData[itemId][size] === undefined
    ) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    if (parsedQuantity === 0) {
      delete cartData[itemId][size];

      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    } else {
      cartData[itemId][size] = parsedQuantity;
    }

    userData.cartData = cartData;
    userData.markModified("cartData");

    await userData.save();

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      cartData,
    });
  } catch (error) {
    console.error("Update cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update cart",
    });
  }
};

// Get the authenticated user's cart.
const getUserCart = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    const userData = await userModel.findById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      cartData: userData.cartData || {},
    });
  } catch (error) {
    console.error("Get cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve cart",
    });
  }
};

export { addToCart, updateCart, getUserCart };