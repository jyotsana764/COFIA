import React, { useContext, useMemo, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {
  const { products = [], search } = useContext(ShopContext);

  const [showFilter, setShowFilter] = useState(false);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relavent');

  const toggleCategory = (event) => {
    const value = event.target.value;

    setCategory((previous) =>
      previous.includes(value)
        ? previous.filter((item) => item !== value)
        : [...previous, value]
    );
  };

  const toggleSubCategory = (event) => {
    const value = event.target.value;

    setSubCategory((previous) =>
      previous.includes(value)
        ? previous.filter((item) => item !== value)
        : [...previous, value]
    );
  };

  const normalize = (value) =>
    String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');

  // Extract the first image URL safely.
  const getImageKey = (product) => {
    const image = Array.isArray(product.image)
      ? product.image[0]
      : product.image;

    if (typeof image !== 'string' || !image.trim()) {
      return '';
    }

    return image.trim();
  };

  // Remove duplicate records by ID and exact image URL.
  // Different products priced at ₹599 are preserved unless
  // their IDs or image URLs identify them as duplicates.
  const uniqueProducts = useMemo(() => {
    const list = Array.isArray(products) ? products : [];

    const seenIds = new Set();
    const seenImages = new Set();
    const result = [];

    for (const product of list) {
      if (!product) continue;

      const productId = product._id || product.id;
      const imageKey = getImageKey(product);

      // Remove repeated product IDs.
      if (productId) {
        const idKey = String(productId);

        if (seenIds.has(idKey)) {
          continue;
        }

        seenIds.add(idKey);
      }

      // Remove repeated exact image URLs only when the product
      // has a usable image URL.
      if (imageKey) {
        if (seenImages.has(imageKey)) {
          // If the duplicate image belongs to a different product,
          // preserve it when it has a different name or category.
          const existingProduct = result.find(
            (item) => getImageKey(item) === imageKey
          );

          const sameProduct =
            existingProduct &&
            normalize(existingProduct.name) === normalize(product.name) &&
            normalize(existingProduct.category) === normalize(product.category);

          if (sameProduct) {
            continue;
          }
        }

        seenImages.add(imageKey);
      }

      result.push(product);
    }

    return result;
  }, [products]);

  const filterProducts = useMemo(() => {
    let result = [...uniqueProducts];

    // Search products.
    if (search?.trim()) {
      const searchWords = search
        .trim()
        .split(/\s+/)
        .map(normalize)
        .filter(Boolean);

      result = result.filter((item) => {
        const searchableText = normalize(
          [
            item.name,
            item.category,
            item.subcategory,
            item.subCategory,
            item.description,
          ]
            .filter(Boolean)
            .join(' ')
        );

        return searchWords.every((word) =>
          searchableText.includes(word)
        );
      });
    }

    // Category filter.
    if (category.length > 0) {
      result = result.filter((item) =>
        category.includes(item.category)
      );
    }

    // Subcategory filter.
    if (subCategory.length > 0) {
      result = result.filter((item) =>
        subCategory.includes(item.subcategory || item.subCategory)
      );
    }

    // Sort by actual product price.
    if (sortType === 'low-high') {
      result.sort(
        (a, b) => Number(a.price || 0) - Number(b.price || 0)
      );
    } else if (sortType === 'high-low') {
      result.sort(
        (a, b) => Number(b.price || 0) - Number(a.price || 0)
      );
    }

    return result;
  }, [uniqueProducts, search, category, subCategory, sortType]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">

      {/* Filters */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter((previous) => !previous)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS

          <img
            className={`h-3 sm:hidden ${
              showFilter ? 'rotate-90' : ''
            }`}
            src={assets.dropdown_icon}
            alt="Toggle filters"
          />
        </p>

        {/* Categories */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? '' : 'hidden'
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>

          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {['Men', 'Women', 'Kids'].map((item) => (
              <label
                key={item}
                className="flex gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="w-3"
                  value={item}
                  checked={category.includes(item)}
                  onChange={toggleCategory}
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        {/* Product Types */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${
            showFilter ? '' : 'hidden'
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPE</p>

          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {['Topwear', 'Bottomwear', 'Winterwear'].map((item) => (
              <label
                key={item}
                className="flex gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="w-3"
                  value={item}
                  checked={subCategory.includes(item)}
                  onChange={toggleSubCategory}
                />
                {item}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Collection */}
      <div className="flex-1">
        <div className="flex justify-between items-center text-base sm:text-2xl mb-4">
          <Title text1="ALL" text2="COLLECTION" />

          <select
            value={sortType}
            onChange={(event) => setSortType(event.target.value)}
            className="border-2 border-gray-300 text-sm px-2 py-2"
            aria-label="Sort products"
          >
            <option value="relavent">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Product Grid */}
        {filterProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
            {filterProducts.map((item, index) => (
              <ProductItem
                key={item._id || item.id || `product-${index}`}
                id={item._id || item.id}
                name={item.name}
                price={Number(item.price || 0)}
                image={item.image}
              />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-gray-500">
            No products found. Please try another filter.
          </p>
        )}
      </div>
    </div>
  );
};

export default Collection;