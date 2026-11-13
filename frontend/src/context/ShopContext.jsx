import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { products as localProducts } from "../assets/assets";
import { products as ethnicWearProducts } from "../pages/EthnicWear";
import { footwearProducts } from "../data/footwearProducts";
import { jewelleryProducts, perfumeProducts } from "../data/categoryProducts";
import { deduplicateProducts } from "../utils/productUtils";

export const ShopContext = createContext();

const CART_STORAGE_KEY = "cofia-cart";
const WISHLIST_STORAGE_KEY = "cofia-wishlist";
const TOKEN_STORAGE_KEY = "token";

const normalizeId = (id) => {
  if (id === undefined || id === null || id === "") {
    return "";
  }

  return String(id).trim();
};

// Find a product using either its local ID or MongoDB ID.
const findProductById = (catalogue, productId) => {
  const normalizedId = normalizeId(productId);

  if (!normalizedId || !Array.isArray(catalogue)) {
    return undefined;
  }

  return catalogue.find(
    (product) =>
      normalizeId(product?._id) === normalizedId ||
      normalizeId(product?.id) === normalizedId
  );
};

// Combine every local catalogue.
const getAllLocalProducts = () =>
  deduplicateProducts([
    ...localProducts,
    ...ethnicWearProducts,
    ...footwearProducts,
    ...jewelleryProducts,
    ...perfumeProducts,
  ]);

// Determine whether a product is from a local catalogue.
const isLocalOnlyProduct = (productId) => {
  return Boolean(
    findProductById(getAllLocalProducts(), productId)
  );
};

// Restore the cart from localStorage.
const readSavedCart = () => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (!savedCart) {
      return {};
    }

    const parsedCart = JSON.parse(savedCart);

    if (
      parsedCart &&
      typeof parsedCart === "object" &&
      !Array.isArray(parsedCart)
    ) {
      return parsedCart;
    }

    // Support older array-based cart formats.
    if (Array.isArray(parsedCart)) {
      const convertedCart = {};

      parsedCart.forEach((item) => {
        const itemId = normalizeId(item?._id || item?.id);
        const size = item?.selectedSize || item?.size;

        if (!itemId || !size) {
          return;
        }

        const quantity = Math.max(
          1,
          Number(item?.quantity) || 1
        );

        if (!convertedCart[itemId]) {
          convertedCart[itemId] = {};
        }

        convertedCart[itemId][size] =
          (Number(convertedCart[itemId][size]) || 0) +
          quantity;
      });

      return convertedCart;
    }

    return {};
  } catch (error) {
    console.error("Unable to load saved cart:", error);
    return {};
  }
};

// Restore the wishlist from localStorage.
const readSavedWishlist = () => {
  try {
    const savedWishlist = localStorage.getItem(
      WISHLIST_STORAGE_KEY
    );

    if (!savedWishlist) {
      return [];
    }

    const parsedWishlist = JSON.parse(savedWishlist);

    if (!Array.isArray(parsedWishlist)) {
      return [];
    }

    return [
      ...new Set(
        parsedWishlist.map(normalizeId).filter(Boolean)
      ),
    ];
  } catch (error) {
    console.error("Unable to load saved wishlist:", error);
    return [];
  }
};

const ShopContextProvider = ({ children }) => {
  const currency = "₹";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  // Render the bundled catalogue immediately, even while the API is loading.
  const [products, setProducts] = useState(getAllLocalProducts);

  const [cartItems, setCartItems] = useState(readSavedCart);

  const [token, setToken] = useState(
    () => localStorage.getItem(TOKEN_STORAGE_KEY) || ""
  );

  const [wishlistItems, setWishlistItems] = useState(
    readSavedWishlist
  );

  // Keep all local products available to every cart operation.
  const allLocalProducts = useMemo(
    () => getAllLocalProducts(),
    []
  );

  // Search database products and all local catalogues.
  const findAvailableProduct = useCallback(
    (productId) => {
      return (
        findProductById(products, productId) ||
        findProductById(allLocalProducts, productId)
      );
    },
    [products, allLocalProducts]
  );

  // Save cart changes.
  useEffect(() => {
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cartItems)
      );
    } catch (error) {
      console.error("Unable to save cart:", error);
    }
  }, [cartItems]);

  // Save wishlist changes.
  useEffect(() => {
    try {
      localStorage.setItem(
        WISHLIST_STORAGE_KEY,
        JSON.stringify(wishlistItems)
      );
    } catch (error) {
      console.error("Unable to save wishlist:", error);
    }
  }, [wishlistItems]);

  // Save the authentication token.
  useEffect(() => {
    try {
      if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    } catch (error) {
      console.error("Unable to save authentication token:", error);
    }
  }, [token]);

  // Add or remove a product from the wishlist.
  const toggleWishlist = useCallback(
    (productId) => {
      const normalizedId = normalizeId(productId);

      if (!normalizedId) {
        toast.error("Product ID is missing");
        return;
      }

      const alreadySaved = wishlistItems.some(
        (id) => normalizeId(id) === normalizedId
      );

      setWishlistItems((previousItems) => {
        const normalizedItems = [
          ...new Set(
            previousItems.map(normalizeId).filter(Boolean)
          ),
        ];

        if (normalizedItems.includes(normalizedId)) {
          return normalizedItems.filter(
            (id) => id !== normalizedId
          );
        }

        return [...normalizedItems, normalizedId];
      });

      toast.success(
        alreadySaved
          ? "Removed from wishlist"
          : "Added to wishlist"
      );
    },
    [wishlistItems]
  );

  // Check whether a product is in the wishlist.
  const isInWishlist = useCallback(
    (productId) => {
      const normalizedId = normalizeId(productId);

      return wishlistItems.some(
        (id) => normalizeId(id) === normalizedId
      );
    },
    [wishlistItems]
  );

  // Count unique wishlist products.
  const getWishlistCount = useCallback(() => {
    return new Set(
      wishlistItems.map(normalizeId).filter(Boolean)
    ).size;
  }, [wishlistItems]);

  // Add a product to the cart.
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.info("Please select a product size");
      return false;
    }

    const normalizedId = normalizeId(itemId);

    if (!normalizedId) {
      toast.error("Product ID is missing");
      return false;
    }

    const product = findAvailableProduct(normalizedId);

    if (!product) {
      console.error(
        "Product not found in catalogue:",
        normalizedId
      );

      toast.error(
        "Product not found. Please refresh the page."
      );

      return false;
    }

    // Synchronize only database-backed products.
    if (
      token &&
      backendUrl &&
      !isLocalOnlyProduct(normalizedId)
    ) {
      try {
        const response = await axios.post(
          `${backendUrl}/api/cart/add`,
          {
            itemId: normalizedId,
            size,
          },
          {
            headers: {
              token,
            },
          }
        );

        if (!response.data.success) {
          toast.error(
            response.data.message ||
              "Unable to add item to cart"
          );

          return false;
        }
      } catch (error) {
        console.error("Add to cart error:", error);

        toast.error(
          error.response?.data?.message ||
            "Unable to add product to cart"
        );

        return false;
      }
    }

    // Update the local cart for all supported products.
    setCartItems((previousCart) => {
      const currentQuantity =
        Number(previousCart[normalizedId]?.[size]) || 0;

      return {
        ...previousCart,
        [normalizedId]: {
          ...(previousCart[normalizedId] || {}),
          [size]: currentQuantity + 1,
        },
      };
    });

    toast.success("Product added to cart!");
    navigate("/cart");

    return true;
  };

  // Count the total number of items in the cart.
  const getCartCount = useCallback(() => {
    let totalCount = 0;

    Object.values(cartItems).forEach((sizes) => {
      if (!sizes || typeof sizes !== "object") {
        return;
      }

      Object.values(sizes).forEach((quantity) => {
        totalCount += Number(quantity) || 0;
      });
    });

    return totalCount;
  }, [cartItems]);

  // Update a product quantity or remove it from the cart.
  const updateQuantity = async (itemId, size, quantity) => {
    const normalizedId = normalizeId(itemId);

    if (!normalizedId || !size) {
      return;
    }

    const nextQuantity = Number(quantity);

    if (!Number.isFinite(nextQuantity)) {
      return;
    }

    const updatedCart = {
      ...cartItems,
      [normalizedId]: {
        ...(cartItems[normalizedId] || {}),
      },
    };

    if (nextQuantity <= 0) {
      delete updatedCart[normalizedId][size];

      if (
        Object.keys(updatedCart[normalizedId]).length === 0
      ) {
        delete updatedCart[normalizedId];
      }
    } else {
      updatedCart[normalizedId][size] = Math.floor(nextQuantity);
    }

    // Update the interface and localStorage immediately.
    setCartItems(updatedCart);

    // Do not send local catalogue products to the backend.
    if (
      token &&
      backendUrl &&
      !isLocalOnlyProduct(normalizedId)
    ) {
      try {
        const response = await axios.post(
          `${backendUrl}/api/cart/update`,
          {
            itemId: normalizedId,
            size,
            quantity: Math.max(0, Math.floor(nextQuantity)),
          },
          {
            headers: {
              token,
            },
          }
        );

        if (!response.data.success) {
          toast.error(
            response.data.message || "Unable to update cart"
          );

          await getUserCart(token);
        }
      } catch (error) {
        console.error("Update cart error:", error);

        toast.error(
          error.response?.data?.message ||
            "Unable to update cart"
        );

        await getUserCart(token);
      }
    }
  };

  // Calculate the total price of all cart items.
  const getCartAmount = useCallback(() => {
    let totalAmount = 0;

    Object.entries(cartItems).forEach(([itemId, sizes]) => {
      const product = findAvailableProduct(itemId);

      if (!product || !sizes || typeof sizes !== "object") {
        return;
      }

      Object.values(sizes).forEach((quantity) => {
        const numericQuantity = Number(quantity) || 0;

        if (numericQuantity > 0) {
          totalAmount +=
            Number(product.price || 0) * numericQuantity;
        }
      });
    });

    return totalAmount;
  }, [cartItems, findAvailableProduct]);

  // Fetch database products and merge them with local catalogues.
  const getProductData = useCallback(async () => {
    if (!backendUrl) {
      setProducts(allLocalProducts);
      return;
    }

    try {
      const response = await axios.get(
        `${backendUrl}/api/product/list`,
        { timeout: 8000 }
      );

      if (!response.data.success) {
        setProducts(allLocalProducts);
        return;
      }

      const databaseProducts = response.data.products || [];

      const mergedProducts = [...allLocalProducts];

      databaseProducts.forEach((dbItem) => {
        const dbId = normalizeId(dbItem._id || dbItem.id);

        const existingIndex = mergedProducts.findIndex(
          (item) =>
            normalizeId(item._id || item.id) === dbId
        );

        if (existingIndex !== -1) {
          mergedProducts[existingIndex] = {
            ...mergedProducts[existingIndex],
            ...dbItem,
            price: Number(
              dbItem.price ??
                mergedProducts[existingIndex].price ??
                0
            ),
          };
        } else {
          mergedProducts.push({
            ...dbItem,
            price: Number(dbItem.price || 0),
          });
        }
      });

      setProducts(deduplicateProducts(mergedProducts));
    } catch (error) {
      console.error("Fetch products error:", error);
      setProducts(allLocalProducts);
    }
  }, [backendUrl, allLocalProducts]);

  // Fetch the logged-in user's cart from the backend.
  const getUserCart = useCallback(
    async (userToken) => {
      if (!backendUrl || !userToken) {
        return;
      }

      try {
        const response = await axios.post(
          `${backendUrl}/api/cart/get`,
          {},
          {
            headers: {
              token: userToken,
            },
          }
        );

        if (response.data.success) {
          const serverCart = response.data.cartData || {};

          // Preserve locally stored products during server cart loading.
          setCartItems((previousCart) => {
            const localOnlyCart = {};

            allLocalProducts.forEach((product) => {
              const productId = normalizeId(
                product._id || product.id
              );

              if (previousCart[productId]) {
                localOnlyCart[productId] = {
                  ...previousCart[productId],
                };
              }
            });

            return {
              ...serverCart,
              ...localOnlyCart,
            };
          });
        } else {
          toast.error(
            response.data.message || "Unable to load cart"
          );
        }
      } catch (error) {
        console.error("Fetch cart error:", error);

        toast.error(
          error.response?.data?.message ||
            "Unable to load cart"
        );
      }
    },
    [backendUrl, allLocalProducts]
  );

  // Load products when the provider mounts.
  useEffect(() => {
    getProductData();
  }, [getProductData]);

  // Load the server cart when the user has a token.
  useEffect(() => {
    if (token) {
      getUserCart(token);
    }
  }, [token, getUserCart]);

  const value = {
    products,
    currency,
    delivery_fee,

    search,
    setSearch,
    showSearch,
    setShowSearch,

    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,

    navigate,
    backendUrl,
    token,
    setToken,

    wishlistItems,
    setWishlistItems,
    toggleWishlist,
    isInWishlist,
    getWishlistCount,
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
