import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const Hero = () => {
  return (
    <div className="flex flex-col sm:flex-row border border-gray-400">

      {/* Hero Left Side */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0 sm:min-h-[450px]">
        <div className="text-[#414141]">

          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#414141]"></p>

            <p className="font-medium text-sm md:text-base">
              YOUR STYLE, YOUR CHOICE
            </p>
          </div>

          <h1 className="prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed">
            Discover Your Style
          </h1>

          <p className="text-sm text-gray-600 mb-5">
            Ethnic wear, footwear, jewellery and fragrances.
          </p>

          {/* Navigate to the Shop Now Page */}
          <Link
            to="/shop-now"
            className="inline-flex items-center gap-3 group"
          >
            <span className="font-semibold text-sm md:text-base">
              SHOP NOW
            </span>

            <span className="w-8 md:w-11 h-[1px] bg-[#414141] transition-all duration-300 group-hover:w-16"></span>
          </Link>

        </div>
      </div>

      {/* Hero Right Side */}
      <div className="w-full sm:w-1/2 h-[300px] sm:h-[450px] overflow-hidden">
        <img
          className="w-full h-full object-cover object-center"
          src={assets.hero_img}
          alt="Discover the latest fashion collection"
        />
      </div>

    </div>
  );
};

export default Hero;