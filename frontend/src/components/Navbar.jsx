
import React, { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  const {
    setShowSearch,
    getCartCount,
    getWishlistCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);

  const wishlistCount = getWishlistCount();

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setCartItems({});
    setVisible(false);
    navigate('/login');
  };

  return (
    <div className="relative flex items-center justify-between py-5 font-medium">
      {/* COFIA Logo */}
      <Link to="/" className="flex items-center">
        <img
          src="/cofia-logo.png"
          className="w-36 h-auto object-contain"
          alt="COFIA - Explore Your Style"
        />
      </Link>

      {/* Desktop Navigation */}
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" end className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        {/* Blog */}
        <NavLink to="/blog" className="flex flex-col items-center gap-1">
          <p>BLOG</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>

      {/* Search, Profile, Wishlist and Cart */}
      <div className="flex items-center gap-5 sm:gap-6">
        <button
          type="button"
          onClick={() => setShowSearch(true)}
          className="flex items-center justify-center"
          aria-label="Search products"
        >
          <img src={assets.search_icon} className="w-5 cursor-pointer" alt="" />
        </button>

        {/* Profile Dropdown */}
        <div className="group relative">
          <button
            type="button"
            onClick={() => {
              if (!token) navigate('/login');
            }}
            className="flex items-center"
            aria-label="Profile"
          >
            <img src={assets.profile_icon} alt="" className="w-5 cursor-pointer" />
          </button>

          {token && (
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-50">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-600 rounded">
                <Link to="/profile" className="cursor-pointer hover:text-black">
                  My Profile
                </Link>
                <Link to="/orders" className="cursor-pointer hover:text-black">
                  Orders
                </Link>
                <Link to="/wishlist" className="cursor-pointer hover:text-black">
                  My Wishlist
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="text-left cursor-pointer hover:text-black"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Wishlist */}
        <Link
          to="/wishlist"
          className="relative flex items-center justify-center"
          aria-label={`Wishlist, ${wishlistCount} items`}
          title="My Wishlist"
        >
          <Heart
            size={23}
            strokeWidth={1.7}
            className="text-gray-700 hover:text-rose-600 transition-colors"
          />
          {wishlistCount > 0 && (
            <span className="absolute -right-2 -bottom-2 min-w-4 h-4 px-1 flex items-center justify-center rounded-full bg-rose-600 text-white text-[9px]">
              {wishlistCount}
            </span>
          )}
        </Link>

        {/* Shopping Cart */}
        <Link
          to="/cart"
          className="relative flex items-center justify-center"
          aria-label={`Shopping cart, ${getCartCount()} items`}
        >
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="" />
          <span className="absolute right-[-5px] bottom-[-5px] min-w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setVisible(true)}
          className="sm:hidden"
          aria-label="Open menu"
        >
          <img src={assets.menu_icon} className="w-5 cursor-pointer" alt="" />
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 overflow-hidden bg-white transition-all duration-300 ${
          visible ? 'w-full' : 'w-0'
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img src={assets.dropdown_icon} alt="" className="h-4 rotate-180" />
            <p>Back</p>
          </div>

          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/" end>
            HOME
          </NavLink>

          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/collection">
            COLLECTION
          </NavLink>

          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/blog">
            BLOG
          </NavLink>

          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/about">
            ABOUT
          </NavLink>

          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/contact">
            CONTACT
          </NavLink>

          <Link
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border flex items-center gap-2"
            to="/wishlist"
          >
            <Heart size={18} />
            MY WISHLIST ({wishlistCount})
          </Link>

          {token && (
            <>
              <Link onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/profile">
                MY PROFILE
              </Link>
              <Link onClick={() => setVisible(false)} className="py-2 pl-6 border" to="/orders">
                ORDERS
              </Link>
              <button
                type="button"
                onClick={logout}
                className="py-2 pl-6 border text-left"
              >
                LOGOUT
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
