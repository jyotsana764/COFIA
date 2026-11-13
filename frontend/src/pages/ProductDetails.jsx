import React, { useContext, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { products } from "./EthnicWear";

export default function ProductDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { addToCart } = useContext(ShopContext);

  const product =
    location.state?.product ||
    products.find((item) => String(item.id) === String(id));

  const [selectedSize, setSelectedSize] = useState("");
  const [mainImage, setMainImage] = useState(product?.image || "");

  if (!product) {
    return (
      <main className="mx-auto min-h-screen max-w-7xl px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold">Product Not Found</h1>

        <p className="mt-3 text-gray-600">
          This product could not be found. Please select it again from the
          collection.
        </p>

        <button
          type="button"
          onClick={() => navigate("/ethnic-wear")}
          className="mt-6 bg-black px-6 py-3 text-white"
        >
          Back to Collection
        </button>
      </main>
    );
  }

  const sizes =
    product.gender?.toLowerCase() === "kids"
      ? ["2-3Y", "4-5Y", "6-7Y", "8-9Y"]
      : ["S", "M", "L", "XL"];

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size first.");
      return;
    }

    if (typeof addToCart !== "function") {
      console.error("addToCart is not available in ShopContext.");
      alert("Cart functionality is unavailable. Please try again.");
      return;
    }

    try {
      addToCart(String(product.id), selectedSize);
      navigate("/cart");
    } catch (error) {
      console.error("Unable to add product to cart:", error);
      alert("Unable to add the product to your cart.");
    }
  };

  return (
    <main className="min-h-screen bg-white px-4 py-10 text-slate-900 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-2">
        {/* Product Images */}
        <section className="flex flex-col-reverse gap-4 sm:flex-row">
          <div className="flex gap-3 sm:w-24 sm:flex-col">
            <button
              type="button"
              onClick={() => setMainImage(product.image)}
              aria-label="Show product image"
              className="h-24 w-20 shrink-0 overflow-hidden border border-gray-300 sm:w-full"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </button>
          </div>

          <div className="min-h-[350px] flex-1 overflow-hidden bg-gray-50 sm:min-h-[550px]">
            <img
              src={mainImage}
              alt={product.name}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src =
                  "https://placehold.co/600x800/f5f5f5/555555?text=Product+Image";
              }}
              className="h-full max-h-[700px] w-full object-cover"
            />
          </div>
        </section>

        {/* Product Information */}
        <section className="flex flex-col justify-center py-4">
          <p className="mb-3 text-sm uppercase tracking-widest text-gray-500">
            {product.gender} · {product.category}
          </p>

          <h1 className="text-2xl font-medium sm:text-3xl">
            {product.name}
          </h1>

          <div className="mt-4 flex items-center gap-2">
            <span className="text-xl text-orange-600">★★★★☆</span>
            <span className="text-sm text-gray-600">
              (Customer reviews)
            </span>
          </div>

          <p className="mt-6 text-3xl font-semibold">
            ₹{Number(product.price || 0).toLocaleString("en-IN")}
          </p>

          <p className="mt-5 leading-7 text-gray-600">
            Discover the elegance of {product.name}. This traditional outfit
            is designed for celebrations, festive occasions, weddings, and
            special moments.
          </p>

          <p className="mt-3 text-sm text-gray-500">
            Style: {product.subcategory}
          </p>

          {/* Size Selection */}
          <div className="mt-8">
            <p className="mb-4 font-medium">Select Size</p>

            <div className="flex flex-wrap gap-3">
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  aria-pressed={selectedSize === size}
                  className={`h-12 min-w-12 border px-4 transition ${
                    selectedSize === size
                      ? "border-black bg-black text-white"
                      : "border-gray-300 bg-white hover:border-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="mt-8 w-full max-w-xs border border-black bg-black px-8 py-4 text-sm font-medium text-white transition hover:bg-white hover:text-black"
          >
            ADD TO CART
          </button>

          {/* Delivery Information */}
          <div className="mt-10 space-y-2 border-t border-gray-300 pt-6 text-sm leading-6 text-gray-600">
            <p>✓ 100% Original product.</p>
            <p>✓ Cash on delivery is available on this product.</p>
            <p>✓ Easy return and exchange policy within 7 days.</p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/ethnic-wear")}
            className="mt-6 self-start text-sm underline hover:text-gray-500"
          >
            ← Continue Shopping
          </button>
        </section>
      </div>
    </main>
  );
}