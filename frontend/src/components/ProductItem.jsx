
import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import p_img1 from '../assets/p_img1.png';

const ProductItem = ({ id, image, name, price }) => {
    const {
        currency,
        toggleWishlist,
        isInWishlist,
    } = useContext(ShopContext);

    // Keep the local image for the test product.
    // Use the provided image for all other products.
    const productImage =
        name === 'Classic White T-Shirt'
            ? p_img1
            : Array.isArray(image)
                ? image[0]
                : image;

    const saved = isInWishlist(id);

    return (
        <div className="text-gray-700">
            <div className="relative overflow-hidden">
                <Link
                    to={`/product/${id}`}
                    className="block cursor-pointer"
                >
                    {productImage ? (
                        <img
                            src={productImage}
                            alt={name || 'Product image'}
                            className="w-full h-auto object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                            loading="lazy"
                        />
                    ) : (
                        <div className="flex aspect-[3/4] items-center justify-center bg-gray-100 text-sm text-gray-500">
                            Image unavailable
                        </div>
                    )}
                </Link>

                {/* Wishlist button */}
                <button
                    type="button"
                    onClick={() => toggleWishlist(id)}
                    aria-label={
                        saved
                            ? 'Remove from wishlist'
                            : 'Add to wishlist'
                    }
                    aria-pressed={saved}
                    title={
                        saved
                            ? 'Remove from wishlist'
                            : 'Add to wishlist'
                    }
                    className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-transform hover:scale-110"
                >
                    <Heart
                        size={21}
                        strokeWidth={1.8}
                        fill={saved ? '#e11d48' : 'none'}
                        color={saved ? '#e11d48' : '#333333'}
                    />
                </button>
            </div>

            <Link
                to={`/product/${id}`}
                className="block cursor-pointer"
            >
                <p className="pt-3 pb-1 text-sm">
                    {name}
                </p>

                <p className="text-sm font-medium">
                    {currency}{Number(price || 0).toLocaleString('en-IN')}
                </p>
            </Link>
        </div>
    );
};

export default ProductItem;
