
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { deduplicateProducts } from '../utils/productUtils';

const Wishlist = () => {
  const {
    products = [],
    wishlistItems = [],
    toggleWishlist,
    currency,
  } = useContext(ShopContext);

  // Match saved IDs with the products available in the store and ensure uniqueness.
  const wishlistProducts = deduplicateProducts(
    products.filter((product) =>
      wishlistItems.includes(String(product._id || product.id))
    )
  );

  return (
    <div className="border-t pt-10 pb-16">
      <div className="text-2xl mb-8">
        <Title text1="MY" text2="WISHLIST" />
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Heart size={52} strokeWidth={1.3} className="mb-4 text-gray-400" />

          <h2 className="text-xl font-medium text-gray-800">
            Your wishlist is empty
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Save your favourite COFIA styles here for later.
          </p>

          <Link
            to="/collection"
            className="mt-6 bg-black px-6 py-3 text-sm text-white"
          >
            EXPLORE COLLECTION
          </Link>
        </div>
      ) : (
        <div className="flex flex-col">
          {wishlistProducts.map((product) => {
            const productId = String(product._id || product.id);
            const image = Array.isArray(product.image)
              ? product.image[0]
              : product.image;

            return (
              <div
                key={productId}
                className="flex items-center gap-4 border-b py-5"
              >
                <Link
                  to={`/product/${productId}`}
                  className="w-24 shrink-0 sm:w-28"
                >
                  {image ? (
                    <img
                      src={image}
                      alt={product.name}
                      className="w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-[3/4] items-center justify-center bg-gray-100 text-xs text-gray-500">
                      Image unavailable
                    </div>
                  )}
                </Link>

                <div className="min-w-0 flex-1">
                  <Link
                    to={`/product/${productId}`}
                    className="font-medium text-gray-800 hover:text-gray-500"
                  >
                    {product.name}
                  </Link>

                  <p className="mt-2 text-sm text-gray-700">
                    {currency}{Number(product.price || 0).toLocaleString('en-IN')}
                  </p>

                  {product.category && (
                    <p className="mt-1 text-sm text-gray-500">
                      {product.category}
                    </p>
                  )}

                  <Link
                    to={`/product/${productId}`}
                    className="mt-3 inline-flex items-center gap-2 text-sm underline"
                  >
                    <ShoppingBag size={15} />
                    View product
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={() => toggleWishlist(productId)}
                  className="flex items-center gap-2 text-sm text-rose-600 hover:text-rose-800"
                  aria-label={`Remove ${product.name} from wishlist`}
                  title="Remove from wishlist"
                >
                  <Trash2 size={18} />
                  <span className="hidden sm:inline">Remove</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
