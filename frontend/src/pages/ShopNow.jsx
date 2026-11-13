import React from 'react';
import { useNavigate } from 'react-router-dom';

const ShopNow = () => {
  const navigate = useNavigate();

  const categories = [
    {
      title: 'Ethnic Wear',
      description: 'Traditional fashion for women, men and children.',
      image: '/ethnic-wear.png',
      path: '/ethnic-wear',
    },
    {
      title: 'Shoes & Footwear',
      description: 'Find the perfect footwear for every occasion.',
      image: '/shoes.png',
      path: '/shoes-footwear',
    },
    {
      title: 'Jewellery',
      description: 'Discover elegant traditional and modern jewellery.',
      image: '/jewellery.png',
      path: '/jewellery',
    },
    {
      title: 'Perfumes',
      description: 'Explore luxurious fragrances for every style.',
      image: '/perfumes.png',
      path: '/perfumes',
    },
  ];

  return (
    <div className="px-4 sm:px-10 py-12">
      {/* Page Heading */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-medium">
          Explore Our Collections
        </h1>

        <p className="text-gray-500 mt-3">
          Discover fashion, footwear, jewellery and fragrances.
        </p>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div
            key={category.title}
            className="border border-gray-200 rounded-lg overflow-hidden group bg-white hover:shadow-lg transition-shadow duration-300"
          >
            {/* Category Image */}
            <div className="h-72 overflow-hidden bg-gray-100">
              <img
                src={category.image}
                alt={category.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src =
                    'https://placehold.co/600x800/f5f0e8/414141?text=Image+Not+Available';
                }}
              />
            </div>

            {/* Category Details */}
            <div className="p-5">
              <h2 className="text-xl font-medium text-gray-800">
                {category.title}
              </h2>

              <p className="text-sm text-gray-500 mt-2 min-h-10 leading-6">
                {category.description}
              </p>

              {/* Explore Button */}
              <button
                type="button"
                onClick={() => navigate(category.path)}
                className="mt-5 border border-black px-5 py-2 text-sm hover:bg-black hover:text-white transition-colors duration-300"
              >
                Explore Now →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopNow;
