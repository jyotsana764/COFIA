
import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import { deduplicateProducts } from '../utils/productUtils';

const BestSeller = () => {
  const { products = [] } = useContext(ShopContext);
  const [bestseller, setBestSeller] = useState([]);

  useEffect(() => {
    const bestCandidates = Array.isArray(products)
      ? products.filter((item) => item.bestseller)
      : [];

    setBestSeller(deduplicateProducts(bestCandidates).slice(0, 5));
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title text1="BEST" text2="SELLERS" />

        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Ecommerce or "electronic commerce" is the trading of goods and
          services online. The internet allows individuals and businesses
          to buy and sell an increasing amount of physical goods, digital
          goods, and services electronically.
        </p>
      </div>

      {/* Best-selling products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {bestseller.map((item) => (
          <ProductItem
            key={item._id || item.id}
            id={item._id || item.id}
            name={item.name}
            image={item.image}
            price={Number(item.price || 0)}
          />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
