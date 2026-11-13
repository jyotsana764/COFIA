import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';
import Title from './Title';
import { deduplicateProducts } from '../utils/productUtils';

const RelatedProducts = ({ category, subCategory, currentProductId }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      let productsCopy = products.filter((item) => {
        const itemCategory = item.category;
        const itemSubCategory = item.subcategory || item.subCategory;
        const matchesCategory = category ? itemCategory === category : true;
        const matchesSub = subCategory ? itemSubCategory === subCategory : true;
        const isNotCurrent = currentProductId
          ? String(item._id || item.id) !== String(currentProductId)
          : true;

        return matchesCategory && matchesSub && isNotCurrent;
      });

      setRelated(deduplicateProducts(productsCopy).slice(0, 5));
    }
  }, [products, category, subCategory, currentProductId]);

  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <Title text1={'RELATED'} text2={'PRODUCTS'} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {related.map((item) => (
          <ProductItem
            key={item._id || item.id}
            id={item._id || item.id}
            name={item.name}
            price={item.price}
            image={item.image}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
