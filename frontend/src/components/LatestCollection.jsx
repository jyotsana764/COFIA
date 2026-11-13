
import React, { useEffect, useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import { deduplicateProducts } from '../utils/productUtils';

const LatestCollection = () => {
  const { products = [] } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    const unique = deduplicateProducts(products);
    setLatestProducts(unique.slice(0, 10));
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1="LATEST" text2="COLLECTION" />

        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Ecommerce or "electronic commerce" is the trading of goods and
          services online. The internet allows individuals and businesses
          to buy and sell an increasing amount of physical goods, digital
          goods, and services electronically.
        </p>
      </div>

      {/* Rendering latest products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 gap-y-6">
        {latestProducts.map((item) => (
          <ProductItem
            key={item._id || item.id}
            id={item._id || item.id}
            image={item.image}
            name={item.name}
            price={Number(item.price || 0)}
          />
        ))}
      </div>
    </div>
  );
};

export default LatestCollection;
