
import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const {
    search,
    setSearch,
    showSearch,
    setShowSearch,
  } = useContext(ShopContext);

  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
    setShowSearch(false);
    navigate('/collection');
  };

  if (!showSearch) return null;

  return (
    <div className="border-t border-b bg-gray-50 text-center">
      <form
        onSubmit={handleSearch}
        className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2"
      >
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="flex-1 outline-none bg-inherit text-sm"
          type="search"
          placeholder="Search products..."
          aria-label="Search products"
          autoFocus
        />

        <button
          type="submit"
          className="flex items-center justify-center"
          aria-label="Submit search"
        >
          <img
            className="w-4 cursor-pointer"
            src={assets.search_icon}
            alt=""
          />
        </button>
      </form>

      <button
        type="button"
        onClick={() => setShowSearch(false)}
        className="inline-block ml-1 text-gray-600 hover:text-black"
        aria-label="Close search"
      >
        <img
          className="inline w-3"
          src={assets.cross_icon}
          alt=""
        />
      </button>
    </div>
  );
};

export default SearchBar;
