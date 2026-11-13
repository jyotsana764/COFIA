import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Heart, Star } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { products as localProducts } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import RelatedProducts from '../components/RelatedProducts';

const getProductId = (product) => String(product?._id ?? product?.id ?? '');

const getProductImages = (product) => {
  const images = Array.isArray(product?.image)
    ? product.image
    : [product?.image];

  return images.filter((image) => typeof image === 'string' && image.trim());
};

const Product = () => {
  const { productId } = useParams();
  const {
    products,
    currency,
    addToCart,
    isInWishlist,
    toggleWishlist,
  } = useContext(ShopContext);

  const product = useMemo(
    () => products.find((item) => getProductId(item) === String(productId))
      || localProducts.find((item) => getProductId(item) === String(productId)),
    [products, productId]
  );
  const images = useMemo(() => getProductImages(product), [product]);
  const [activeImage, setActiveImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [imageUnavailable, setImageUnavailable] = useState(false);

  useEffect(() => {
    setActiveImage('');
    setSelectedSize('');
    setImageUnavailable(false);
  }, [productId]);

  if (!products.length && !product) {
    return (
      <main className="min-h-[45vh] border-t py-16 text-center" aria-live="polite">
        <p className="text-gray-600">Loading product…</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-[45vh] border-t py-16 text-center">
        <h1 className="text-2xl font-medium">Product not found</h1>
        <p className="mt-3 text-gray-600">This product may have been removed or the link may be incorrect.</p>
        <Link to="/collection" className="mt-6 inline-block bg-black px-6 py-3 text-sm text-white">
          Browse collection
        </Link>
      </main>
    );
  }

  const productKey = getProductId(product);
  const sizes = Array.isArray(product.sizes) && product.sizes.length
    ? product.sizes
    : ['One Size'];
  const image = activeImage || images[0];
  const saved = isInWishlist(productKey);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart(productKey, selectedSize);
  };

  return (
    <main className="border-t pt-8 sm:pt-10">
      <div className="grid gap-10 sm:grid-cols-2 sm:gap-12">
        <section className="flex flex-col-reverse gap-3 sm:flex-row" aria-label="Product images">
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto sm:w-20 sm:flex-col sm:overflow-y-auto">
              {images.map((source, index) => (
                <button
                  type="button"
                  key={`${source}-${index}`}
                  onClick={() => { setActiveImage(source); setImageUnavailable(false); }}
                  className={`w-16 shrink-0 border sm:w-full ${image === source ? 'border-black' : 'border-transparent'}`}
                  aria-label={`View product image ${index + 1}`}
                >
                  <img src={source} alt="" className="aspect-[3/4] w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}

          <div className="flex min-h-72 flex-1 items-center justify-center bg-gray-50 sm:min-h-[32rem]">
            {image && !imageUnavailable ? (
              <img
                src={image}
                alt={product.name}
                className="max-h-[38rem] w-full object-contain"
                onError={() => setImageUnavailable(true)}
              />
            ) : (
              <div className="px-6 text-center text-sm text-gray-500" role="img" aria-label="Product image unavailable">
                Product image unavailable
              </div>
            )}
          </div>
        </section>

        <section className="flex flex-col items-start">
          <div className="flex w-full items-start justify-between gap-4">
            <h1 className="text-2xl font-medium text-gray-900 sm:text-3xl">{product.name}</h1>
            <button
              type="button"
              onClick={() => toggleWishlist(productKey)}
              aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
              aria-pressed={saved}
              className="rounded-full border p-2 text-rose-600"
            >
              <Heart size={21} fill={saved ? 'currentColor' : 'none'} />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-1 text-amber-500" aria-label="Rated 4 out of 5">
            {[0, 1, 2, 3].map((star) => <Star key={star} size={15} fill="currentColor" />)}
            <Star size={15} className="text-gray-300" />
            <span className="ml-2 text-sm text-gray-500">Customer favourite</span>
          </div>

          <p className="mt-5 text-3xl font-medium text-gray-900">
            {currency}{Number(product.price || 0).toLocaleString('en-IN')}
          </p>
          <p className="mt-5 leading-7 text-gray-600">
            {product.description || 'A carefully selected COFIA style, made for comfort and memorable occasions.'}
          </p>

          <div className="my-8 w-full">
            <p className="mb-3 text-sm font-medium">Select size</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  type="button"
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  aria-pressed={selectedSize === size}
                  className={`min-w-12 border px-4 py-3 text-sm ${selectedSize === size ? 'border-black bg-gray-100' : 'border-gray-200'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className="bg-black px-8 py-3 text-sm text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
          >
            ADD TO CART
          </button>
          {!selectedSize && <p className="mt-2 text-sm text-gray-500">Choose a size to add this item to your cart.</p>}

          <hr className="my-7 w-full" />
          <ul className="space-y-2 text-sm text-gray-500">
            <li>100% carefully selected COFIA products.</li>
            <li>Cash on delivery is available.</li>
            <li>Contact us for return and exchange support.</li>
          </ul>
        </section>
      </div>

      <section className="mt-16 border p-5 sm:p-8">
        <h2 className="font-medium">Product details</h2>
        <p className="mt-3 text-sm leading-7 text-gray-600">
          {product.description || `${product.name} from the COFIA collection.`}
        </p>
      </section>

      <RelatedProducts
        category={product.category}
        subCategory={product.subcategory || product.subCategory}
        currentProductId={productKey}
      />
    </main>
  );
};

export default Product;
