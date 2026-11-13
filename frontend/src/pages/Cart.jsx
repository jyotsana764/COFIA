import React, { useContext, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import { footwearProducts } from "../data/footwearProducts";

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    updateQuantity,
    navigate,
  } = useContext(ShopContext);

  // 1. Convert the cart object into an array.
  const cartData = useMemo(() => {
    const tempData = [];

    if (!cartItems || typeof cartItems !== "object") {
      return tempData;
    }

    Object.entries(cartItems).forEach(([itemId, sizes]) => {
      if (!sizes || typeof sizes !== "object") return;

      Object.entries(sizes).forEach(([size, quantityValue]) => {
        const quantity = Number(quantityValue) || 0;

        if (quantity > 0) {
          tempData.push({
            _id: String(itemId),
            size,
            quantity,
          });
        }
      });
    });

    return tempData;
  }, [cartItems]);

  // 2. Combine the main catalogue and local footwear catalogue.
  const allProducts = useMemo(() => {
    const productMap = new Map();

    const addProduct = (product) => {
      if (!product) return;

      const productId = product._id ?? product.id;

      if (productId === undefined || productId === null) {
        return;
      }

      productMap.set(String(productId), {
        ...product,
        _id: String(productId),
      });
    };

    // Main products loaded through ShopContext.
    (Array.isArray(products) ? products : []).forEach(addProduct);

    // Add local footwear products without replacing main products.
    footwearProducts.forEach((product) => {
      const productId = String(product._id ?? product.id);

      if (!productMap.has(productId)) {
        addProduct(product);
      }
    });

    return Array.from(productMap.values());
  }, [products]);

  // 3. Find a product using its MongoDB ID or local ID.
  const findProduct = (itemId) => {
    return allProducts.find(
      (product) =>
        String(product._id ?? "") === String(itemId) ||
        String(product.id ?? "") === String(itemId)
    );
  };

  // 4. Get the product image.
  const getProductImage = (product) => {
    if (!product?.image) return "";

    if (Array.isArray(product.image)) {
      return product.image.find(Boolean) || "";
    }

    return product.image;
  };

  // 5. Format prices.
  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-IN");
  };

  // 6. Render the cart.
  return (
    <main className="min-h-screen border-t border-gray-300 pb-16 pt-10 sm:pt-14">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page heading */}
        <div className="mb-8 text-2xl">
          <Title text1="YOUR" text2="CART" />
        </div>

        {/* Empty cart */}
        {cartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h2 className="text-xl font-medium text-gray-800">
              Your cart is empty
            </h2>

            <p className="mt-3 text-gray-500">
              Explore our collection and find something you love.
            </p>

            <button
              type="button"
              onClick={() => navigate("/ethnic-wear")}
              className="mt-6 bg-black px-8 py-3 text-sm text-white transition hover:bg-gray-800"
            >
              CONTINUE SHOPPING
            </button>
          </div>
        ) : (
          <>
            {/* Cart products */}
            <div className="w-full">
              {cartData.map((item) => {
                const productData = findProduct(item._id);

                // Product not found.
                if (!productData) {
                  return (
                    <div
                      key={`${item._id}_${item.size}`}
                      className="flex flex-col gap-3 border-t border-gray-300 py-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          Product unavailable
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          This item could not be found in the current
                          product catalogue.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item._id, item.size, 0)
                        }
                        className="self-start text-sm text-red-600 underline"
                      >
                        Remove item
                      </button>
                    </div>
                  );
                }

                const productImage = getProductImage(productData);
                const price = Number(productData.price) || 0;
                const lineTotal = price * item.quantity;

                return (
                  <div
                    key={`${item._id}_${item.size}`}
                    className="grid grid-cols-[1fr_auto] items-center gap-4 border-t border-gray-300 py-5 text-gray-700 sm:grid-cols-[minmax(0,1fr)_110px_35px] sm:gap-6"
                  >
                    {/* Product details */}
                    <div className="flex min-w-0 items-start gap-4 sm:gap-7">
                      <img
                        src={productImage}
                        alt={productData.name || "Product"}
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src =
                            "https://placehold.co/160x200/f5f5f5/555555?text=Product";
                        }}
                        className="h-24 w-20 shrink-0 object-cover sm:h-32 sm:w-24"
                      />

                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 sm:text-lg">
                          {productData.name || "Unnamed product"}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {productData.category || "Clothing"}
                        </p>

                        {/* Price and size */}
                        <div className="mt-3 flex flex-wrap items-center gap-3 sm:gap-5">
                          <p className="text-sm sm:text-base">
                            {currency}
                            {formatPrice(price)}
                          </p>

                          <span className="border border-gray-300 px-3 py-2 text-sm">
                            Size: {item.size}
                          </span>
                        </div>

                        {/* Item subtotal */}
                        <p className="mt-2 text-sm font-medium text-gray-800">
                          Subtotal: {currency}
                          {formatPrice(lineTotal)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity */}
                    <input
                      aria-label={`Quantity of ${productData.name}`}
                      type="number"
                      min="1"
                      step="1"
                      value={item.quantity}
                      onChange={(event) => {
                        const value = event.target.value;

                        if (value === "") return;

                        const quantity = Number(value);

                        if (
                          Number.isInteger(quantity) &&
                          quantity >= 1
                        ) {
                          updateQuantity(
                            item._id,
                            item.size,
                            quantity
                          );
                        }
                      }}
                      className="w-16 justify-self-end border border-gray-300 px-2 py-2 text-center text-sm sm:w-20 sm:justify-self-center"
                    />

                    {/* Remove item */}
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item._id, item.size, 0)
                      }
                      aria-label={`Remove ${productData.name} from cart`}
                      className="justify-self-end"
                    >
                      <img
                        src={assets.bin_icon}
                        alt=""
                        className="w-4 cursor-pointer sm:w-5"
                      />
                    </button>
                  </div>
                );
              })}

              <div className="border-t border-gray-300" />
            </div>

            {/* Cart totals and checkout */}
            <section className="mt-12 flex w-full justify-end sm:mt-16">
              <div className="w-full max-w-lg">
                <CartTotal />

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => navigate("/place-order")}
                    className="w-full bg-black px-8 py-4 text-sm font-medium text-white transition hover:bg-gray-800 sm:w-auto"
                  >
                    PROCEED TO CHECKOUT
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
};

export default Cart;